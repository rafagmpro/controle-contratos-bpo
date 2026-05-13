"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: number;
  nome_empresa: string;
};

type Plano = {
  id: number;
  nome: string;
};

type Contrato = {
  id: number;
  data_inicio: string;
  valor_mensal: number;
  status: string;
  clientes: {
    nome_empresa: string;
  };
  planos: {
    nome: string;
  };
};

export default function ContratosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [planoId, setPlanoId] = useState("");
  const [valorMensal, setValorMensal] = useState("");
  const [dataInicio, setDataInicio] = useState("");

  async function carregarClientes() {
    const { data } = await supabase
      .from("clientes")
      .select("id, nome_empresa");

    setClientes(data || []);
  }

  async function carregarPlanos() {
    const { data } = await supabase
      .from("planos")
      .select("id, nome");

    setPlanos(data || []);
  }

  async function carregarContratos() {
    const { data, error }: any = await supabase
      .from("contratos")
      .select(`
        id,
        data_inicio,
        valor_mensal,
        status,
        clientes(nome_empresa),
        planos(nome)
      `)
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      alert("Erro ao carregar contratos");
      return;
    }

    setContratos(data || []);
  }

  async function salvarContrato(e: React.FormEvent) {
    e.preventDefault();

    const { data, error }: any = await supabase
      .from("contratos")
      .insert({
        cliente_id: Number(clienteId),
        plano_id: Number(planoId),
        valor_mensal: Number(valorMensal),
        data_inicio: dataInicio,
        status: "ativo",
      });

    if (error) {
      console.error(error);
      alert("Erro ao salvar contrato");
      return;
    }

    setClienteId("");
    setPlanoId("");
    setValorMensal("");
    setDataInicio("");

    carregarContratos();
  }

  useEffect(() => {
    carregarClientes();
    carregarPlanos();
    carregarContratos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold">
          Contratos
        </h1>

        <form
          onSubmit={salvarContrato}
          className="mb-8 rounded-xl bg-white p-6 shadow"
        >
          <h2 className="mb-4 text-xl font-semibold">
            Novo contrato
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <select
              className="rounded border p-3"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              required
            >
              <option value="">
                Selecione o cliente
              </option>

              {clientes.map((cliente) => (
                <option
                  key={cliente.id}
                  value={cliente.id}
                >
                  {cliente.nome_empresa}
                </option>
              ))}
            </select>

            <select
              className="rounded border p-3"
              value={planoId}
              onChange={(e) => setPlanoId(e.target.value)}
              required
            >
              <option value="">
                Selecione o plano
              </option>

              {planos.map((plano) => (
                <option
                  key={plano.id}
                  value={plano.id}
                >
                  {plano.nome}
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              className="rounded border p-3"
              placeholder="Valor mensal"
              value={valorMensal}
              onChange={(e) => setValorMensal(e.target.value)}
              required
            />

            <input
              type="date"
              className="rounded border p-3"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded bg-black px-5 py-3 text-white"
          >
            Salvar contrato
          </button>
        </form>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Contratos cadastrados
          </h2>

          <div className="space-y-3">
            {contratos.map((contrato) => (
              <div
                key={contrato.id}
                className="rounded border p-4"
              >
                <strong>
                  {contrato.clientes?.nome_empresa}
                </strong>

                <p>
                  Plano: {contrato.planos?.nome}
                </p>

                <p>
                  Valor mensal: R$ {contrato.valor_mensal}
                </p>

                <p>
                  Início: {contrato.data_inicio}
                </p>

                <p>
                  Status: {contrato.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}