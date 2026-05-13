"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Contrato = {
  id: number;
  cliente_id: number;
  plano_id: number;
  clientes: { nome_empresa: string };
  planos: { nome: string };
};

type FaixaPlano = {
  id: number;
  plano_id: number;
  min_lancamentos: number;
  max_lancamentos: number;
  valor: number;
};

type FaixaAdicional = {
  id: number;
  adicional_id: number;
  min_quantidade: number;
  max_quantidade: number;
  valor: number;
};

type Volume = {
  id: number;
  mes_referencia: string;
  quantidade_financeiro: number;
  quantidade_nf: number;
  quantidade_pagamentos: number;
  quantidade_bancos: number;
  quantidade_cartoes: number;
  valor_calculado: number;
  status_uso: string;
  contratos: {
    clientes: { nome_empresa: string };
    planos: { nome: string };
  };
};

export default function VolumesPage() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [faixasPlano, setFaixasPlano] = useState<FaixaPlano[]>([]);
  const [faixasAdicionais, setFaixasAdicionais] = useState<FaixaAdicional[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);

  const [contratoId, setContratoId] = useState("");
  const [mesReferencia, setMesReferencia] = useState("");
  const [qtdFinanceiro, setQtdFinanceiro] = useState("");
  const [qtdNotas, setQtdNotas] = useState("");
  const [qtdPagamentos, setQtdPagamentos] = useState("");
  const [qtdBancos, setQtdBancos] = useState("");
  const [qtdCartoes, setQtdCartoes] = useState("");
  const [enviaContabilidade, setEnviaContabilidade] = useState(false);

  async function carregarContratos() {
    const { data, error }: any = await supabase
      .from("contratos")
      .select(`
        id,
        cliente_id,
        plano_id,
        clientes(nome_empresa),
        planos(nome)
      `)
      .order("id", { ascending: false });

    if (error) {
      alert(`Erro ao carregar contratos: ${error.message}`);
      return;
    }

    setContratos(data || []);
  }

  async function carregarFaixasPlano() {
    const { data, error } = await supabase
      .from("plano_faixas")
      .select("*")
      .order("min_lancamentos", { ascending: true });

    if (error) {
      alert(`Erro ao carregar faixas dos planos: ${error.message}`);
      return;
    }

    setFaixasPlano(data || []);
  }

  async function carregarFaixasAdicionais() {
    const { data, error } = await supabase
      .from("adicional_faixas")
      .select("*")
      .order("min_quantidade", { ascending: true });

    if (error) {
      alert(`Erro ao carregar faixas adicionais: ${error.message}`);
      return;
    }

    setFaixasAdicionais(data || []);
  }

  async function carregarVolumes() {
    const { data, error }: any = await supabase
      .from("volumes_mensais")
      .select(`
        id,
        mes_referencia,
        quantidade_financeiro,
        quantidade_nf,
        quantidade_pagamentos,
        quantidade_bancos,
        quantidade_cartoes,
        valor_calculado,
        status_uso,
        contratos(
          clientes(nome_empresa),
          planos(nome)
        )
      `)
      .order("id", { ascending: false });

    if (error) {
      alert(`Erro ao carregar volumes: ${error.message}`);
      return;
    }

    setVolumes(data || []);
  }

  function encontrarFaixaPlano(planoId: number, quantidade: number) {
    return faixasPlano.find(
      (faixa) =>
        Number(faixa.plano_id) === Number(planoId) &&
        Number(quantidade) >= Number(faixa.min_lancamentos) &&
        Number(quantidade) <= Number(faixa.max_lancamentos)
    );
  }

  function encontrarFaixaAdicional(adicionalId: number, quantidade: number) {
    if (Number(quantidade) <= 0) return null;

    return faixasAdicionais.find(
      (faixa) =>
        Number(faixa.adicional_id) === Number(adicionalId) &&
        Number(quantidade) >= Number(faixa.min_quantidade) &&
        Number(quantidade) <= Number(faixa.max_quantidade)
    );
  }

  function calcularValores() {
    const contratoSelecionado = contratos.find(
      (contrato) => Number(contrato.id) === Number(contratoId)
    );

    console.log("CONTRATOS:", contratos);
console.log("CONTRATO SELECIONADO:", contratoSelecionado);

    if (!contratoSelecionado) {
      return null;
    }

    const financeiro = Number(qtdFinanceiro || 0);
    const notas = Number(qtdNotas || 0);
    const pagamentos = Number(qtdPagamentos || 0);
    const bancos = Number(qtdBancos || 0);
    const cartoes = Number(qtdCartoes || 0);

    const faixaPlano = encontrarFaixaPlano(
      Number(contratoSelecionado.plano_id),
      financeiro
    );
    console.log("CONTRATO ID:", contratoId);
console.log("PLANO ID DO CONTRATO:", contratoSelecionado.plano_id);
console.log("FINANCEIRO:", financeiro);
console.log("FAIXAS PLANO:", faixasPlano);
console.log("FAIXA ENCONTRADA:", faixaPlano);

    const faixaPagamentos = encontrarFaixaAdicional(1, pagamentos);
    const faixaNotas = encontrarFaixaAdicional(2, notas);

    const valorPlano = faixaPlano ? Number(faixaPlano.valor) : 0;
    const valorPagamentos = faixaPagamentos ? Number(faixaPagamentos.valor) : 0;
    const valorNotas = faixaNotas ? Number(faixaNotas.valor) : 0;

    const bancosExtras = Math.max(0, bancos - 3);
    const cartoesExtras = Math.max(0, cartoes - 2);

    const valorBancosExtras = bancosExtras * 50;
    const valorCartoesExtras = cartoesExtras * 50;
    const valorContabilidade = enviaContabilidade ? 100 : 0;

    const total =
      valorPlano +
      valorPagamentos +
      valorNotas +
      valorBancosExtras +
      valorCartoesExtras +
      valorContabilidade;

    let status = "calculado";

    if (!faixaPlano) {
      status = "fora da faixa";
    }

    if (pagamentos > 0 && !faixaPagamentos) {
      status = "fora da faixa";
    }

    if (notas > 0 && !faixaNotas) {
      status = "fora da faixa";
    }

    return {
      contratoSelecionado,
      financeiro,
      notas,
      pagamentos,
      bancos,
      cartoes,
      faixaPlano,
      valorPlano,
      valorPagamentos,
      valorNotas,
      valorBancosExtras,
      valorCartoesExtras,
      valorContabilidade,
      total,
      status,
    };
  }

  async function salvarVolume(e: React.FormEvent) {
    e.preventDefault();

    const calculo = calcularValores();

    if (!calculo) {
      alert("Contrato não encontrado");
      return;
    }

    if (!calculo.faixaPlano) {
      alert("Não existe faixa de preço para esse volume financeiro");
      return;
    }

    const percentualUso =
      (calculo.financeiro / Number(calculo.faixaPlano.max_lancamentos)) * 100;

    const { error } = await supabase.from("volumes_mensais").insert({
      cliente_id: calculo.contratoSelecionado.cliente_id,
      contrato_id: calculo.contratoSelecionado.id,
      mes_referencia: `${mesReferencia}-01`,

      quantidade_lancamentos: calculo.financeiro,
      limite_plano: calculo.faixaPlano.max_lancamentos,
      percentual_uso: percentualUso,
      status_uso: calculo.status,

      quantidade_financeiro: calculo.financeiro,
      quantidade_nf: calculo.notas,
      quantidade_pagamentos: calculo.pagamentos,
      quantidade_bancos: calculo.bancos,
      quantidade_cartoes: calculo.cartoes,
      valor_calculado: calculo.total,
    });

    if (error) {
      alert(`Erro ao salvar volume: ${error.message}`);
      return;
    }

    setContratoId("");
    setMesReferencia("");
    setQtdFinanceiro("");
    setQtdNotas("");
    setQtdPagamentos("");
    setQtdBancos("");
    setQtdCartoes("");
    setEnviaContabilidade(false);

    carregarVolumes();
  }

  useEffect(() => {
    carregarContratos();
    carregarFaixasPlano();
    carregarFaixasAdicionais();
    carregarVolumes();
  }, []);

  const calculoAtual = calcularValores();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold">
          Controle de Volumes e Precificação
        </h1>

        <form
          onSubmit={salvarVolume}
          className="mb-8 rounded-xl bg-white p-6 shadow"
        >
          <h2 className="mb-4 text-xl font-semibold">
            Registrar volume mensal
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <select
              className="rounded border p-3"
              value={contratoId}
              onChange={(e) => setContratoId(e.target.value)}
              required
            >
              <option value="">Selecione o contrato</option>

              {contratos.map((contrato) => (
                <option key={contrato.id} value={contrato.id}>
                  {contrato.clientes.nome_empresa} - {contrato.planos.nome}
                </option>
              ))}
            </select>

            <input
              type="month"
              className="rounded border p-3"
              value={mesReferencia}
              onChange={(e) => setMesReferencia(e.target.value)}
              required
            />

            <input
              type="number"
              className="rounded border p-3"
              placeholder="Lançamentos financeiros"
              value={qtdFinanceiro}
              onChange={(e) => setQtdFinanceiro(e.target.value)}
              required
            />

            <input
              type="number"
              className="rounded border p-3"
              placeholder="Notas fiscais / boletos"
              value={qtdNotas}
              onChange={(e) => setQtdNotas(e.target.value)}
            />

            <input
              type="number"
              className="rounded border p-3"
              placeholder="Agendamentos de pagamento"
              value={qtdPagamentos}
              onChange={(e) => setQtdPagamentos(e.target.value)}
            />

            <input
              type="number"
              className="rounded border p-3"
              placeholder="Quantidade de bancos"
              value={qtdBancos}
              onChange={(e) => setQtdBancos(e.target.value)}
            />

            <input
              type="number"
              className="rounded border p-3"
              placeholder="Quantidade de cartões"
              value={qtdCartoes}
              onChange={(e) => setQtdCartoes(e.target.value)}
            />

            <label className="flex items-center gap-2 rounded border bg-white p-3">
              <input
                type="checkbox"
                checked={enviaContabilidade}
                onChange={(e) => setEnviaContabilidade(e.target.checked)}
              />
              Envio para contabilidade
            </label>
          </div>

          {calculoAtual && (
            <div className="mt-6 rounded-xl border bg-gray-50 p-4">
              <h3 className="mb-3 text-lg font-semibold">
                Prévia de cálculo
              </h3>

              <p>Plano base: R$ {calculoAtual.valorPlano.toFixed(2)}</p>
              <p>Agendamentos: R$ {calculoAtual.valorPagamentos.toFixed(2)}</p>
              <p>Notas fiscais: R$ {calculoAtual.valorNotas.toFixed(2)}</p>
              <p>Bancos extras: R$ {calculoAtual.valorBancosExtras.toFixed(2)}</p>
              <p>Cartões extras: R$ {calculoAtual.valorCartoesExtras.toFixed(2)}</p>
              <p>Contabilidade: R$ {calculoAtual.valorContabilidade.toFixed(2)}</p>

              <p className="mt-3 text-xl font-bold">
                Total calculado: R$ {calculoAtual.total.toFixed(2)}
              </p>

              {calculoAtual.status === "fora da faixa" && (
                <p className="mt-2 font-semibold text-red-600">
                  Existe algum volume fora das faixas cadastradas.
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="mt-4 rounded bg-black px-5 py-3 text-white"
          >
            Salvar volume
          </button>
        </form>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Volumes registrados
          </h2>

          <div className="space-y-3">
            {volumes.length === 0 && (
              <p className="text-gray-500">
                Nenhum volume registrado ainda.
              </p>
            )}

            {volumes.map((volume) => (
              <div key={volume.id} className="rounded border p-4">
                <strong>{volume.contratos.clientes.nome_empresa}</strong>

                <p>Plano: {volume.contratos.planos.nome}</p>
                <p>Mês: {volume.mes_referencia}</p>
                <p>Lançamentos financeiros: {volume.quantidade_financeiro}</p>
                <p>Notas fiscais / boletos: {volume.quantidade_nf}</p>
                <p>Agendamentos: {volume.quantidade_pagamentos}</p>
                <p>Bancos: {volume.quantidade_bancos}</p>
                <p>Cartões: {volume.quantidade_cartoes}</p>

                <p className="mt-2 text-lg font-bold">
                  Valor calculado: R$ {Number(volume.valor_calculado).toFixed(2)}
                </p>

                <p>Status: {volume.status_uso}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}