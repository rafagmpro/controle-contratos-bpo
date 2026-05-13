"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Plano = {
  id: number;
  nome: string;
  limite_lancamentos: number;
  valor_base: number;
  descricao: string;
};

export default function PlanosPage() {
  const [planos, setPlanos] = useState<Plano[]>([]);

  const [nome, setNome] = useState("");
  const [limite, setLimite] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");

  async function carregarPlanos() {
    const { data, error } = await supabase
      .from("planos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert(`Erro ao carregar planos: ${error.message}`);
      console.error(error);
      return;
    }

    setPlanos(data || []);
  }

  async function salvarPlano(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("planos").insert({
      nome,
      limite_lancamentos: Number(limite),
      valor_base: Number(valor),
      descricao,
    });

    if (error) {
      alert(`Erro ao salvar plano: ${error.message}`);
      console.error(error);
      return;
    }

    setNome("");
    setLimite("");
    setValor("");
    setDescricao("");

    carregarPlanos();
  }

  useEffect(() => {
    carregarPlanos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Planos
        </h1>

        <form
          onSubmit={salvarPlano}
          className="mb-8 rounded-xl bg-white p-6 shadow"
        >
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Cadastrar plano
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              className="rounded border p-3"
              placeholder="Nome do plano"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <input
              type="number"
              className="rounded border p-3"
              placeholder="Limite de lançamentos"
              value={limite}
              onChange={(e) => setLimite(e.target.value)}
              required
            />

            <input
              type="number"
              step="0.01"
              className="rounded border p-3"
              placeholder="Valor base"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />

            <input
              className="rounded border p-3"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded bg-black px-5 py-3 text-white"
          >
            Salvar plano
          </button>
        </form>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Planos cadastrados
          </h2>

          <div className="space-y-3">
            {planos.length === 0 && (
              <p className="text-gray-500">
                Nenhum plano cadastrado ainda.
              </p>
            )}

            {planos.map((plano) => (
              <div
                key={plano.id}
                className="rounded border p-4"
              >
                <strong>{plano.nome}</strong>

                <p>
                  Limite: {plano.limite_lancamentos} lançamentos
                </p>

                <p>
                  Valor: R$ {plano.valor_base}
                </p>

                <p>
                  Descrição: {plano.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}