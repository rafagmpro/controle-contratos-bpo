"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type DashboardItem = {
  id: number;
  mes_referencia: string;
  quantidade_financeiro: number;
  quantidade_nf: number;
  quantidade_pagamentos: number;
  quantidade_bancos: number;
  quantidade_cartoes: number;
  percentual_uso: number;
  valor_calculado: number;
  status_uso: string;
  contratos: {
    clientes: {
      nome_empresa: string;
    };
    planos: {
      nome: string;
    };
  };
};

export default function DashboardPage() {
  const [dados, setDados] = useState<DashboardItem[]>([]);

  async function carregarDashboard() {
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
        percentual_uso,
        valor_calculado,
        status_uso,
        contratos(
          clientes(nome_empresa),
          planos(nome)
        )
      `)
      .order("mes_referencia", { ascending: false });

    if (error) {
      alert(`Erro ao carregar dashboard: ${error.message}`);
      return;
    }

    setDados(data || []);
  }

  useEffect(() => {
    carregarDashboard();
  }, []);

  const receitaTotal = useMemo(() => {
    return dados.reduce(
      (total, item) => total + Number(item.valor_calculado || 0),
      0
    );
  }, [dados]);

  const clientesAtencao = useMemo(() => {
    return dados.filter(
      (item) =>
        Number(item.percentual_uso || 0) >= 80 &&
        Number(item.percentual_uso || 0) < 100
    );
  }, [dados]);

  const clientesEstourados = useMemo(() => {
    return dados.filter(
      (item) => Number(item.percentual_uso || 0) >= 100
    );
  }, [dados]);

  const maioresVolumes = useMemo(() => {
    return [...dados]
      .sort(
        (a, b) =>
          Number(b.quantidade_financeiro || 0) -
          Number(a.quantidade_financeiro || 0)
      )
      .slice(0, 5);
  }, [dados]);

  function formatarMoeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function corStatus(percentual: number) {
    if (percentual >= 100) {
      return "border-red-600 bg-red-50";
    }

    if (percentual >= 80) {
      return "border-yellow-500 bg-yellow-50";
    }

    return "border-green-600 bg-green-50";
  }

  function textoStatus(percentual: number) {
    if (percentual >= 100) {
      return "Reajuste imediato";
    }

    if (percentual >= 80) {
      return "Atenção";
    }

    return "Dentro da faixa";
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold">
          Dashboard Gerencial
        </h1>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Receita calculada
            </p>
            <strong className="text-2xl">
              {formatarMoeda(receitaTotal)}
            </strong>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Registros mensais
            </p>
            <strong className="text-2xl">
              {dados.length}
            </strong>
          </div>

          <div className="rounded-xl bg-yellow-50 p-6 shadow">
            <p className="text-sm text-gray-600">
              Clientes em atenção
            </p>
            <strong className="text-2xl">
              {clientesAtencao.length}
            </strong>
          </div>

          <div className="rounded-xl bg-red-50 p-6 shadow">
            <p className="text-sm text-gray-600">
              Clientes para reajuste
            </p>
            <strong className="text-2xl">
              {clientesEstourados.length}
            </strong>
          </div>
        </div>

        <section className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Alertas automáticos
          </h2>

          {clientesEstourados.length === 0 &&
            clientesAtencao.length === 0 && (
              <p className="text-gray-500">
                Nenhum alerta crítico no momento.
              </p>
            )}

          <div className="space-y-3">
            {clientesEstourados.map((item) => (
              <div
                key={`estourado-${item.id}`}
                className="rounded border-l-8 border-red-600 bg-red-50 p-4"
              >
                <strong>
                  {item.contratos.clientes.nome_empresa}
                </strong>
                <p>
                  Ultrapassou a faixa contratada com{" "}
                  {Number(item.percentual_uso).toFixed(2)}% de uso.
                </p>
                <p>
                  Ação recomendada: reajustar contrato ou migrar para
                  faixa superior.
                </p>
              </div>
            ))}

            {clientesAtencao.map((item) => (
              <div
                key={`atencao-${item.id}`}
                className="rounded border-l-8 border-yellow-500 bg-yellow-50 p-4"
              >
                <strong>
                  {item.contratos.clientes.nome_empresa}
                </strong>
                <p>
                  Está próximo do limite com{" "}
                  {Number(item.percentual_uso).toFixed(2)}% de uso.
                </p>
                <p>
                  Ação recomendada: acompanhar antes do próximo fechamento.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Maiores volumes financeiros
          </h2>

          <div className="space-y-3">
            {maioresVolumes.map((item) => (
              <div
                key={`volume-${item.id}`}
                className="flex flex-col justify-between gap-2 rounded border p-4 md:flex-row md:items-center"
              >
                <div>
                  <strong>
                    {item.contratos.clientes.nome_empresa}
                  </strong>
                  <p>
                    Plano: {item.contratos.planos.nome}
                  </p>
                  <p>
                    Mês: {item.mes_referencia}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p>
                    Lançamentos:{" "}
                    <strong>{item.quantidade_financeiro}</strong>
                  </p>
                  <p>
                    Valor:{" "}
                    <strong>
                      {formatarMoeda(Number(item.valor_calculado || 0))}
                    </strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Todos os registros
          </h2>

          <div className="space-y-3">
            {dados.map((item) => {
              const percentual = Number(item.percentual_uso || 0);

              return (
                <div
                  key={item.id}
                  className={`rounded border-l-8 p-4 ${corStatus(
                    percentual
                  )}`}
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <strong>
                        {item.contratos.clientes.nome_empresa}
                      </strong>

                      <p>
                        Plano: {item.contratos.planos.nome}
                      </p>

                      <p>
                        Mês: {item.mes_referencia}
                      </p>

                      <p>
                        Financeiro: {item.quantidade_financeiro} lançamentos
                      </p>

                      <p>
                        Notas fiscais / boletos: {item.quantidade_nf}
                      </p>

                      <p>
                        Agendamentos: {item.quantidade_pagamentos}
                      </p>

                      <p>
                        Bancos: {item.quantidade_bancos} | Cartões:{" "}
                        {item.quantidade_cartoes}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p>
                        Uso:{" "}
                        <strong>
                          {percentual.toFixed(2)}%
                        </strong>
                      </p>

                      <p>
                        Status:{" "}
                        <strong>
                          {textoStatus(percentual)}
                        </strong>
                      </p>

                      <p className="mt-2 text-lg font-bold">
                        {formatarMoeda(
                          Number(item.valor_calculado || 0)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {dados.length === 0 && (
              <p className="text-gray-500">
                Nenhum volume registrado ainda.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}