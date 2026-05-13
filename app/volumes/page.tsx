"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Contrato = {
  id: number;
  cliente_id: number;
  plano_id: number;
  clientes: {
    nome_empresa: string;
  };
  planos: {
    nome: string;
    limite_lancamentos: number;
  };
};

type Volume = {
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
    };
  };
};

export default function VolumesPage() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);

  const [contratoId, setContratoId] = useState("");
  const [mesReferencia, setMesReferencia] = useState("");
  const [quantidade, setQuantidade] = useState("");

  async function carregarContratos() {
    const { data }: any = await supabase
      .from("contratos")
      .select(`
        id,
        cliente_id,
        plano_id,
        clientes(nome_empresa),
        planos(nome, limite_lancamentos)
      `);

    setContratos(data || []);
  }

  async function carregarVolumes() {
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
          planos(nome)
        )
      `)
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      alert(`Erro ao carregar volumes: ${error.message}`);
      return;
    }

    setVolumes(data || []);
  }

  async function salvarVolume(e: React.FormEvent) {
    e.preventDefault();

    const contratoSelecionado = contratos.find(
      (c) => c.id === Number(contratoId)
    );

    if (!contratoSelecionado) {
      alert("Contrato não encontrado");
      return;
    }

    const limite =
      contratoSelecionado.planos.limite_lancamentos;

    const percentual =
      (Number(quantidade) / limite) * 100;

    let status = "dentro";

    if (percentual >= 80 && percentual < 100) {
      status = "atenção";
    }

    if (percentual >= 100) {
      status = "ultrapassou";
    }

    const { error } = await supabase
      .from("volumes_mensais")
      .insert({
        cliente_id: contratoSelecionado.cliente_id,
        contrato_id: contratoSelecionado.id,
        mes_referencia: `${mesReferencia}-01`,
        quantidade_lancamentos: Number(quantidade),
        limite_plano: limite,
        percentual_uso: percentual,
        status_uso: status,
      });

    if (error) {
      console.error(error);
      alert(`Erro ao salvar volume: ${error.message}`);
      return;
    }

    setContratoId("");
    setMesReferencia("");
    setQuantidade("");

    carregarVolumes();
  }

  useEffect(() => {
    carregarContratos();
    carregarVolumes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold">
          Controle de Volumes
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
              <option value="">
                Selecione o contrato
              </option>

              {contratos.map((contrato) => (
                <option
                  key={contrato.id}
                  value={contrato.id}
                >
                  {contrato.clientes.nome_empresa} -{" "}
                  {contrato.planos.nome}
                </option>
              ))}
            </select>

            <input
              type="month"
              className="rounded border p-3"
              value={mesReferencia}
              onChange={(e) =>
                setMesReferencia(e.target.value)
              }
              required
            />

            <input
              type="number"
              className="rounded border p-3"
              placeholder="Quantidade de lançamentos"
              value={quantidade}
              onChange={(e) =>
                setQuantidade(e.target.value)
              }
              required
            />
          </div>

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
              <div
                key={volume.id}
                className="rounded border p-4"
              >
                <strong>
                  {
                    volume.contratos.clientes
                      .nome_empresa
                  }
                </strong>

                <p>
                  Plano:{" "}
                  {volume.contratos.planos.nome}
                </p>

                <p>
                  Mês: {volume.mes_referencia}
                </p>

                <p>
                  Lançamentos:{" "}
                  {volume.quantidade_lancamentos}
                </p>

                <p>
                  Uso:{" "}
                  {Number(
                    volume.percentual_uso
                  ).toFixed(2)}
                  %
                </p>

                <p>
                  Status:{" "}
                  <strong>
                    {volume.status_uso}
                  </strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}