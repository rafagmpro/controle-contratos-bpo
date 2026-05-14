"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: number;
  nome_empresa: string;
};

type Contrato = {
  id: number;
  cliente_id: number;
  status: string;
  valor_contratado: number;
  data_inicio: string;
  clientes: {
    nome_empresa: string;
  };
  planos: {
    nome: string;
  };
};

type Volume = {
  id: number;
  cliente_id: number;
  contrato_id: number;
  mes_referencia: string;
  quantidade_financeiro: number;
  quantidade_nf: number;
  quantidade_pagamentos: number;
  quantidade_bancos: number;
  quantidade_cartoes: number;
  valor_calculado: number;
  diferenca_valor: number;
  status_uso: string;
  contratos: {
    valor_contratado: number;
    clientes: {
      nome_empresa: string;
    };
    planos: {
      nome: string;
    };
  };
};

export default function DashboardPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [mesFiltro, setMesFiltro] = useState("");

  async function carregarClientes() {
    const { data, error } = await supabase
      .from("clientes")
      .select("id, nome_empresa")
      .order("nome_empresa", { ascending: true });

    if (error) {
      alert(`Erro ao carregar clientes: ${error.message}`);
      return;
    }

    setClientes(data || []);
  }

  async function carregarContratos() {
    const { data, error }: any = await supabase
      .from("contratos")
      .select(`
        id,
        cliente_id,
        status,
        valor_contratado,
        data_inicio,
        clientes(nome_empresa),
        planos(nome)
      `)
      .eq("status", "ativo")
      .order("id", { ascending: false });

    if (error) {
      alert(`Erro ao carregar contratos: ${error.message}`);
      return;
    }

    setContratos(data || []);
  }

  async function carregarVolumes() {
    const { data, error }: any = await supabase
      .from("volumes_mensais")
      .select(`
        id,
        cliente_id,
        contrato_id,
        mes_referencia,
        quantidade_financeiro,
        quantidade_nf,
        quantidade_pagamentos,
        quantidade_bancos,
        quantidade_cartoes,
        valor_calculado,
        diferenca_valor,
        status_uso,
        contratos(
          valor_contratado,
          clientes(nome_empresa),
          planos(nome)
        )
      `)
      .order("mes_referencia", { ascending: false });

    if (error) {
      alert(`Erro ao carregar volumes: ${error.message}`);
      return;
    }

    setVolumes(data || []);
  }

  useEffect(() => {
    carregarClientes();
    carregarContratos();
    carregarVolumes();

    const hoje = new Date();
    const mesAtual = `${hoje.getFullYear()}-${String(
      hoje.getMonth() + 1
    ).padStart(2, "0")}`;

    setMesFiltro(mesAtual);
  }, []);

  const volumesDoMes = useMemo(() => {
    if (!mesFiltro) return [];

    return volumes.filter((volume) =>
      volume.mes_referencia.startsWith(mesFiltro)
    );
  }, [volumes, mesFiltro]);

  const contratosAtivos = contratos;

  const receitaContratadaTotal = useMemo(() => {
    return contratosAtivos.reduce(
      (total, contrato) => total + Number(contrato.valor_contratado || 0),
      0
    );
  }, [contratosAtivos]);

  const valorRealizadoMes = useMemo(() => {
    return volumesDoMes.reduce(
      (total, volume) => total + Number(volume.valor_calculado || 0),
      0
    );
  }, [volumesDoMes]);

  const diferencaTotalMes = valorRealizadoMes - receitaContratadaTotal;

  const clientesComVolumeNoMes = useMemo(() => {
    return new Set(volumesDoMes.map((volume) => Number(volume.cliente_id)));
  }, [volumesDoMes]);

  const clientesPendentes = useMemo(() => {
    return contratosAtivos.filter(
      (contrato) => !clientesComVolumeNoMes.has(Number(contrato.cliente_id))
    );
  }, [contratosAtivos, clientesComVolumeNoMes]);

  const clientesUltrapassaram = useMemo(() => {
    return volumesDoMes.filter(
      (volume) => volume.status_uso === "ultrapassou contratado"
    );
  }, [volumesDoMes]);

  const clientesDentro = useMemo(() => {
    return volumesDoMes.filter(
      (volume) => volume.status_uso !== "ultrapassou contratado"
    );
  }, [volumesDoMes]);

  const rankingDiferenca = useMemo(() => {
    return [...volumesDoMes]
      .sort(
        (a, b) =>
          Number(b.diferenca_valor || 0) - Number(a.diferenca_valor || 0)
      )
      .slice(0, 10);
  }, [volumesDoMes]);

  const alertasCriticos = useMemo(() => {
    const alertas: string[] = [];

    clientesUltrapassaram.forEach((volume) => {
      alertas.push(
        `${volume.contratos.clientes.nome_empresa} ultrapassou o contrato em ${formatarMoeda(
          Number(volume.diferenca_valor || 0)
        )}.`
      );
    });

    clientesPendentes.forEach((contrato) => {
      alertas.push(
        `${contrato.clientes.nome_empresa} ainda não possui fechamento registrado neste mês.`
      );
    });

    return alertas;
  }, [clientesUltrapassaram, clientesPendentes]);

  function formatarMoeda(valor: number) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarMes(mes: string) {
    if (!mes) return "";

    const [ano, numeroMes] = mes.split("-");
    const data = new Date(Number(ano), Number(numeroMes) - 1, 1);

    return data.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  }

  function corDiferenca(valor: number) {
    if (valor > 0) return "text-red-700";
    if (valor < 0) return "text-green-700";
    return "text-gray-900";
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Inteligente</h1>
            <p className="mt-1 text-gray-600">
              Visão gerencial de contratos, volumes e alertas operacionais.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Mês de análise
            </label>
            <input
              type="month"
              value={mesFiltro}
              onChange={(e) => setMesFiltro(e.target.value)}
              className="rounded border p-3"
            />
          </div>
        </div>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Receita contratada ativa</p>
            <p className="mt-2 text-2xl font-bold">
              {formatarMoeda(receitaContratadaTotal)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Valor realizado no mês</p>
            <p className="mt-2 text-2xl font-bold">
              {formatarMoeda(valorRealizadoMes)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Diferença do mês</p>
            <p className={`mt-2 text-2xl font-bold ${corDiferenca(diferencaTotalMes)}`}>
              {formatarMoeda(diferencaTotalMes)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Mês analisado</p>
            <p className="mt-2 text-2xl font-bold capitalize">
              {formatarMes(mesFiltro)}
            </p>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border-l-8 border-blue-600 bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Contratos ativos</p>
            <p className="mt-2 text-3xl font-bold">{contratosAtivos.length}</p>
          </div>

          <div className="rounded-xl border-l-8 border-green-600 bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Dentro do contratado</p>
            <p className="mt-2 text-3xl font-bold">{clientesDentro.length}</p>
          </div>

          <div className="rounded-xl border-l-8 border-red-600 bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Ultrapassaram contrato</p>
            <p className="mt-2 text-3xl font-bold">{clientesUltrapassaram.length}</p>
          </div>

          <div className="rounded-xl border-l-8 border-yellow-500 bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Pendentes de fechamento</p>
            <p className="mt-2 text-3xl font-bold">{clientesPendentes.length}</p>
          </div>
        </section>

        <section className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Alertas do mês</h2>

          {alertasCriticos.length === 0 && (
            <p className="text-gray-500">
              Nenhum alerta crítico para este mês.
            </p>
          )}

          <div className="space-y-3">
            {alertasCriticos.map((alerta, index) => (
              <div
                key={index}
                className="rounded border-l-8 border-yellow-500 bg-yellow-50 p-4"
              >
                {alerta}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold">
              Clientes que ultrapassaram contrato
            </h2>

            {clientesUltrapassaram.length === 0 && (
              <p className="text-gray-500">
                Nenhum cliente ultrapassou o contrato no mês selecionado.
              </p>
            )}

            <div className="space-y-3">
              {clientesUltrapassaram.map((volume) => (
                <div key={volume.id} className="rounded border-l-8 border-red-600 bg-red-50 p-4">
                  <p className="font-bold">
                    {volume.contratos.clientes.nome_empresa}
                  </p>
                  <p>Plano: {volume.contratos.planos.nome}</p>
                  <p>Valor contratado: {formatarMoeda(volume.contratos.valor_contratado)}</p>
                  <p>Valor realizado: {formatarMoeda(volume.valor_calculado)}</p>
                  <p>
                    Diferença:{" "}
                    <strong>{formatarMoeda(volume.diferenca_valor)}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold">
              Clientes pendentes de fechamento
            </h2>

            {clientesPendentes.length === 0 && (
              <p className="text-gray-500">
                Todos os contratos ativos possuem fechamento no mês.
              </p>
            )}

            <div className="space-y-3">
              {clientesPendentes.map((contrato) => (
                <div key={contrato.id} className="rounded border-l-8 border-yellow-500 bg-yellow-50 p-4">
                  <p className="font-bold">{contrato.clientes.nome_empresa}</p>
                  <p>Plano: {contrato.planos.nome}</p>
                  <p>Valor contratado: {formatarMoeda(contrato.valor_contratado)}</p>
                  <p className="font-semibold text-yellow-700">
                    Fechamento mensal ainda não registrado.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">
            Ranking de maior diferença no mês
          </h2>

          {rankingDiferenca.length === 0 && (
            <p className="text-gray-500">
              Nenhum volume registrado para o mês selecionado.
            </p>
          )}

          <div className="overflow-hidden rounded border">
            <div className="grid grid-cols-5 bg-gray-100 p-3 font-semibold">
              <div>Cliente</div>
              <div>Plano</div>
              <div>Contratado</div>
              <div>Realizado</div>
              <div>Diferença</div>
            </div>

            {rankingDiferenca.map((volume) => (
              <div key={volume.id} className="grid grid-cols-5 border-t p-3">
                <div>{volume.contratos.clientes.nome_empresa}</div>
                <div>{volume.contratos.planos.nome}</div>
                <div>{formatarMoeda(volume.contratos.valor_contratado)}</div>
                <div>{formatarMoeda(volume.valor_calculado)}</div>
                <div className={`font-bold ${corDiferenca(Number(volume.diferenca_valor))}`}>
                  {formatarMoeda(volume.diferenca_valor)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">
            Fechamentos registrados no mês
          </h2>

          {volumesDoMes.length === 0 && (
            <p className="text-gray-500">
              Nenhum fechamento registrado neste mês.
            </p>
          )}

          <div className="space-y-3">
            {volumesDoMes.map((volume) => (
              <div
                key={volume.id}
                className={`rounded border-l-8 p-4 ${
                  volume.status_uso === "ultrapassou contratado"
                    ? "border-red-600 bg-red-50"
                    : "border-green-600 bg-green-50"
                }`}
              >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-bold">
                      {volume.contratos.clientes.nome_empresa}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Plano</p>
                    <p>{volume.contratos.planos.nome}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Diferença</p>
                    <p className={`font-bold ${corDiferenca(Number(volume.diferenca_valor))}`}>
                      {formatarMoeda(volume.diferenca_valor)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-bold">{volume.status_uso}</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-5">
                  <p>Financeiro: {volume.quantidade_financeiro}</p>
                  <p>Notas: {volume.quantidade_nf}</p>
                  <p>Agendamentos: {volume.quantidade_pagamentos}</p>
                  <p>Bancos: {volume.quantidade_bancos}</p>
                  <p>Cartões: {volume.quantidade_cartoes}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}