"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: number;
  nome_empresa: string;
  cnpj: string;
  responsavel: string;
  email: string;
  telefone: string;
  status: string;
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  async function carregarClientes() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert("Erro ao carregar clientes");
      console.error(error);
      return;
    }

    setClientes(data || []);
  }

  async function salvarCliente(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("clientes").insert({
      nome_empresa: nomeEmpresa,
      cnpj,
      responsavel,
      email,
      telefone,
      status: "ativo",
    });

    if (error) {
      alert("Erro ao salvar cliente");
      console.error(error);
      return;
    }

    setNomeEmpresa("");
    setCnpj("");
    setResponsavel("");
    setEmail("");
    setTelefone("");

    carregarClientes();
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Clientes
        </h1>

        <form
          onSubmit={salvarCliente}
          className="mb-8 rounded-xl bg-white p-6 shadow"
        >
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Cadastrar cliente
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              className="rounded border p-3"
              placeholder="Nome da empresa"
              value={nomeEmpresa}
              onChange={(e) => setNomeEmpresa(e.target.value)}
              required
            />

            <input
              className="rounded border p-3"
              placeholder="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />

            <input
              className="rounded border p-3"
              placeholder="Responsável"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
            />

            <input
              className="rounded border p-3"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="rounded border p-3"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded bg-black px-5 py-3 text-white"
          >
            Salvar cliente
          </button>
        </form>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Clientes cadastrados
          </h2>

          <div className="space-y-3">
            {clientes.length === 0 && (
              <p className="text-gray-500">
                Nenhum cliente cadastrado ainda.
              </p>
            )}

            {clientes.map((cliente) => (
              <div
                key={cliente.id}
                className="rounded border p-4"
              >
                <strong>{cliente.nome_empresa}</strong>
                <p>CNPJ: {cliente.cnpj}</p>
                <p>Responsável: {cliente.responsavel}</p>
                <p>E-mail: {cliente.email}</p>
                <p>Telefone: {cliente.telefone}</p>
                <p>Status: {cliente.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}