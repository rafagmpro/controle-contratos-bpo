"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Plano = {
  id: number;
  nome: string;
  descricao: string;
};

type FaixaPlano = {
  id: number;
  plano_id: number;
  min_lancamentos: number;
  max_lancamentos: number;
  valor: number;
};

export default function PlanosPage() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [faixas, setFaixas] = useState<FaixaPlano[]>([]);

  const [planoEditando, setPlanoEditando] = useState<number | null>(null);
  const [faixaEditando, setFaixaEditando] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [planoIdFaixa, setPlanoIdFaixa] = useState("");
  const [minLancamentos, setMinLancamentos] = useState("");
  const [maxLancamentos, setMaxLancamentos] = useState("");
  const [valorFaixa, setValorFaixa] = useState("");

  async function carregarPlanos() {
    const { data, error } = await supabase
      .from("planos")
      .select("id, nome, descricao")
      .order("id", { ascending: true });

    if (error) {
      alert(`Erro ao carregar planos: ${error.message}`);
      return;
    }

    setPlanos(data || []);
  }

  async function carregarFaixas() {
    const { data, error } = await supabase
      .from("plano_faixas")
      .select("*")
      .order("plano_id", { ascending: true })
      .order("min_lancamentos", { ascending: true });

    if (error) {
      alert(`Erro ao carregar faixas: ${error.message}`);
      return;
    }

    setFaixas(data || []);
  }

  function limparPlano() {
    setPlanoEditando(null);
    setNome("");
    setDescricao("");
  }

  function limparFaixa() {
    setFaixaEditando(null);
    setPlanoIdFaixa("");
    setMinLancamentos("");
    setMaxLancamentos("");
    setValorFaixa("");
  }

  async function salvarPlano(e: React.FormEvent) {
    e.preventDefault();

    if (planoEditando) {
      const { error } = await supabase
        .from("planos")
        .update({
          nome,
          descricao,
        })
        .eq("id", planoEditando);

      if (error) {
        alert(`Erro ao atualizar plano: ${error.message}`);
        return;
      }

      alert("Plano atualizado com sucesso");
    } else {
      const { error } = await supabase.from("planos").insert({
        nome,
        descricao,
        limite_lancamentos: 0,
        valor_base: 0,
      });

      if (error) {
        alert(`Erro ao cadastrar plano: ${error.message}`);
        return;
      }

      alert("Plano cadastrado com sucesso");
    }

    limparPlano();
    carregarPlanos();
  }

  async function salvarFaixa(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      plano_id: Number(planoIdFaixa),
      min_lancamentos: Number(minLancamentos),
      max_lancamentos: Number(maxLancamentos),
      valor: Number(valorFaixa),
    };

    if (payload.min_lancamentos > payload.max_lancamentos) {
      alert("O mínimo de lançamentos não pode ser maior que o máximo.");
      return;
    }

    if (faixaEditando) {
      const { error } = await supabase
        .from("plano_faixas")
        .update(payload)
        .eq("id", faixaEditando);

      if (error) {
        alert(`Erro ao atualizar faixa: ${error.message}`);
        return;
      }

      alert("Faixa atualizada com sucesso");
    } else {
      const { error } = await supabase.from("plano_faixas").insert(payload);

      if (error) {
        alert(`Erro ao cadastrar faixa: ${error.message}`);
        return;
      }

      alert("Faixa cadastrada com sucesso");
    }

    limparFaixa();
    carregarFaixas();
  }

  function editarPlano(plano: Plano) {
    setPlanoEditando(plano.id);
    setNome(plano.nome);
    setDescricao(plano.descricao || "");
  }

  function editarFaixa(faixa: FaixaPlano) {
    setFaixaEditando(faixa.id);
    setPlanoIdFaixa(String(faixa.plano_id));
    setMinLancamentos(String(faixa.min_lancamentos));
    setMaxLancamentos(String(faixa.max_lancamentos));
    setValorFaixa(String(faixa.valor));
  }

  async function excluirPlano(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir este plano? Se ele tiver contratos ou faixas vinculadas, a exclusão pode falhar."
    );

    if (!confirmar) return;

    const { error } = await supabase.from("planos").delete().eq("id", id);

    if (error) {
      alert(
        `Erro ao excluir plano: ${error.message}. Provavelmente há contratos ou faixas vinculadas.`
      );
      return;
    }

    carregarPlanos();
  }

  async function excluirFaixa(id: number) {
    const confirmar = confirm("Deseja realmente excluir esta faixa?");

    if (!confirmar) return;

    const { error } = await supabase.from("plano_faixas").delete().eq("id", id);

    if (error) {
      alert(`Erro ao excluir faixa: ${error.message}`);
      return;
    }

    carregarFaixas();
  }

  function nomePlano(planoId: number) {
    const plano = planos.find((item) => item.id === planoId);
    return plano?.nome || "Plano não encontrado";
  }

  useEffect(() => {
    carregarPlanos();
    carregarFaixas();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Planos e Faixas de Preço
        </h1>

        <section className="mb-8 rounded-xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {planoEditando ? "Editar plano" : "Cadastrar plano"}
            </h2>

            {planoEditando && (
              <button
                type="button"
                onClick={limparPlano}
                className="rounded bg-gray-300 px-4 py-2"
              >
                Cancelar edição
              </button>
            )}
          </div>

          <form onSubmit={salvarPlano}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                className="rounded border p-3"
                placeholder="Nome do plano"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <input
                className="rounded border p-3"
                placeholder="Descrição do plano"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="mt-4 rounded bg-black px-5 py-3 text-white"
            >
              {planoEditando ? "Atualizar plano" : "Salvar plano"}
            </button>
          </form>
        </section>

        <section className="mb-8 rounded-xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {faixaEditando ? "Editar faixa de preço" : "Cadastrar faixa de preço"}
            </h2>

            {faixaEditando && (
              <button
                type="button"
                onClick={limparFaixa}
                className="rounded bg-gray-300 px-4 py-2"
              >
                Cancelar edição
              </button>
            )}
          </div>

          <form onSubmit={salvarFaixa}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <select
                className="rounded border p-3"
                value={planoIdFaixa}
                onChange={(e) => setPlanoIdFaixa(e.target.value)}
                required
              >
                <option value="">Selecione o plano</option>

                {planos.map((plano) => (
                  <option key={plano.id} value={plano.id}>
                    {plano.nome}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="rounded border p-3"
                placeholder="Mínimo de lançamentos"
                value={minLancamentos}
                onChange={(e) => setMinLancamentos(e.target.value)}
                required
              />

              <input
                type="number"
                className="rounded border p-3"
                placeholder="Máximo de lançamentos"
                value={maxLancamentos}
                onChange={(e) => setMaxLancamentos(e.target.value)}
                required
              />

              <input
                type="number"
                step="0.01"
                className="rounded border p-3"
                placeholder="Valor da faixa"
                value={valorFaixa}
                onChange={(e) => setValorFaixa(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 rounded bg-black px-5 py-3 text-white"
            >
              {faixaEditando ? "Atualizar faixa" : "Salvar faixa"}
            </button>
          </form>
        </section>

        <section className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Planos cadastrados
          </h2>

          <div className="space-y-3">
            {planos.length === 0 && (
              <p className="text-gray-500">Nenhum plano cadastrado ainda.</p>
            )}

            {planos.map((plano) => (
              <div key={plano.id} className="rounded border p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <strong>{plano.nome}</strong>
                    <p>Descrição: {plano.descricao || "-"}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editarPlano(plano)}
                      className="rounded bg-yellow-500 px-4 py-2 text-white"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => excluirPlano(plano.id)}
                      className="rounded bg-red-600 px-4 py-2 text-white"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Faixas de preço cadastradas
          </h2>

          <div className="space-y-3">
            {faixas.length === 0 && (
              <p className="text-gray-500">Nenhuma faixa cadastrada ainda.</p>
            )}

            {faixas.map((faixa) => (
              <div key={faixa.id} className="rounded border p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <strong>{nomePlano(faixa.plano_id)}</strong>

                    <p>
                      De {faixa.min_lancamentos} até {faixa.max_lancamentos} lançamentos
                    </p>

                    <p>Valor: R$ {Number(faixa.valor).toFixed(2)}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editarFaixa(faixa)}
                      className="rounded bg-yellow-500 px-4 py-2 text-white"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => excluirFaixa(faixa.id)}
                      className="rounded bg-red-600 px-4 py-2 text-white"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}