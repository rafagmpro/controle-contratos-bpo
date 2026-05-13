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

  const [clienteEditando, setClienteEditando] =
    useState<number | null>(null);

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
      alert(`Erro ao carregar clientes: ${error.message}`);
      return;
    }

    setClientes(data || []);
  }

  function limparFormulario() {
    setClienteEditando(null);
    setNomeEmpresa("");
    setCnpj("");
    setResponsavel("");
    setEmail("");
    setTelefone("");
  }

  async function salvarCliente(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (clienteEditando) {
      const { error } = await supabase
        .from("clientes")
        .update({
          nome_empresa: nomeEmpresa,
          cnpj,
          responsavel,
          email,
          telefone,
        })
        .eq("id", clienteEditando);

      if (error) {
        alert(
          `Erro ao atualizar cliente: ${error.message}`
        );
        return;
      }

      alert("Cliente atualizado com sucesso");
    } else {
      const { error } = await supabase
        .from("clientes")
        .insert({
          nome_empresa: nomeEmpresa,
          cnpj,
          responsavel,
          email,
          telefone,
          status: "ativo",
        });

      if (error) {
        alert(
          `Erro ao salvar cliente: ${error.message}`
        );
        return;
      }

      alert("Cliente cadastrado com sucesso");
    }

    limparFormulario();
    carregarClientes();
  }

  async function excluirCliente(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir este cliente?"
    );

    if (!confirmar) {
      return;
    }

    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id);

    if (error) {
      alert(
        `Erro ao excluir cliente: ${error.message}`
      );
      return;
    }

    carregarClientes();
  }

  function editarCliente(cliente: Cliente) {
    setClienteEditando(cliente.id);

    setNomeEmpresa(cliente.nome_empresa);
    setCnpj(cliente.cnpj);
    setResponsavel(cliente.responsavel);
    setEmail(cliente.email);
    setTelefone(cliente.telefone);
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {clienteEditando
                ? "Editar cliente"
                : "Cadastrar cliente"}
            </h2>

            {clienteEditando && (
              <button
                type="button"
                onClick={limparFormulario}
                className="rounded bg-gray-300 px-4 py-2"
              >
                Cancelar edição
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              className="rounded border p-3"
              placeholder="Nome da empresa"
              value={nomeEmpresa}
              onChange={(e) =>
                setNomeEmpresa(e.target.value)
              }
              required
            />

            <input
              className="rounded border p-3"
              placeholder="CNPJ"
              value={cnpj}
              onChange={(e) =>
                setCnpj(e.target.value)
              }
            />

            <input
              className="rounded border p-3"
              placeholder="Responsável"
              value={responsavel}
              onChange={(e) =>
                setResponsavel(e.target.value)
              }
            />

            <input
              className="rounded border p-3"
              placeholder="E-mail"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              className="rounded border p-3"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) =>
                setTelefone(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded bg-black px-5 py-3 text-white"
          >
            {clienteEditando
              ? "Atualizar cliente"
              : "Salvar cliente"}
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
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div>
                    <strong>
                      {cliente.nome_empresa}
                    </strong>

                    <p>CNPJ: {cliente.cnpj}</p>

                    <p>
                      Responsável:{" "}
                      {cliente.responsavel}
                    </p>

                    <p>E-mail: {cliente.email}</p>

                    <p>
                      Telefone: {cliente.telefone}
                    </p>

                    <p>Status: {cliente.status}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        editarCliente(cliente)
                      }
                      className="rounded bg-yellow-500 px-4 py-2 text-white"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        excluirCliente(cliente.id)
                      }
                      className="rounded bg-red-600 px-4 py-2 text-white"
                    >
                      Excluir
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}