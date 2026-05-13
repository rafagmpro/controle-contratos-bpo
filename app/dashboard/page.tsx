"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type DashboardItem = {
  id: number;
  mes_referencia: string;
  quantidade_lancamentos: number;
  percentual_uso: number;
  status_uso: string;
  contratos: {
    clientes: {
      nome_empresa: string;
    };
    planos: {
      nome: string;
      limite_lancamentos: number;
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
        quantidade_lancamentos,
        percentual_uso,
        status_uso,
        contratos(
          clientes(nome_empresa),
          planos(nome, limite_lancamentos)
        )
      `)
      .order("percentual_uso", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      alert("Erro ao carregar dashboard");
      return;
    }

    setDados(data || []);
  }

  useEffect(() => {
    carregarDashboard();
  }, []);

  function corStatus(status: string) {
    if (status === "ultrapassou") {
      return "bg-red-100 border-red-500";
    }

    if (status === "atenção") {
      return "bg-yellow-100 border-yellow-500";
    }

    return "bg-green-100 border-green-500";
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-6 text-3xl font-bold">
          Dashboard Gerencial
        </h1>

        <div className="grid gap-4">

          {dados.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border-l-8 p-6 shadow ${corStatus(
                item.status_uso
              )}`}
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                <div>
                  <h2 className="text-xl font-bold">
                    {
                      item.contratos.clientes
                        .nome_empresa
                    }
                  </h2>

                  <p>
                    Plano:{" "}
                    {
                      item.contratos.planos
                        .nome
                    }
                  </p>

                  <p>
                    Limite:{" "}
                    {
                      item.contratos.planos
                        .limite_lancamentos
                    }{" "}
                    lançamentos
                  </p>

                  <p>
                    Utilizado:{" "}
                    {item.quantidade_lancamentos}
                  </p>

                  <p>
                    Uso:{" "}
                    {Number(
                      item.percentual_uso
                    ).toFixed(2)}
                    %
                  </p>

                  <p>
                    Mês: {item.mes_referencia}
                  </p>
                </div>

                <div>
                  <span className="rounded bg-black px-4 py-2 text-white">
                    {item.status_uso}
                  </span>
                </div>
              </div>

              {item.percentual_uso >= 100 && (
                <div className="mt-4 rounded bg-red-600 p-4 text-white">
                  Cliente precisa de reajuste de plano.
                </div>
              )}

            </div>
          ))}

        </div>
      </div>
    </main>
  );
}