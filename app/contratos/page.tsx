"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cliente = { id: number; nome_empresa: string };
type Plano = { id: number; nome: string };
type Adicional = { id: number; nome: string; tipo: string };

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

type Contrato = {
  id: number;
  cliente_id: number;
  plano_id: number;
  data_inicio: string;
  dia_vencimento: number;
  status: string;
  observacoes: string;
  quantidade_bancos: number;
  quantidade_cartoes: number;
  volume_financeiro_contratado: number;
  volume_nf_contratado: number;
  volume_pagamentos_contratado: number;
  valor_contratado: number;
  desconto_valor: number;
  rotina_adicional_1_descricao: string;
  rotina_adicional_1_valor: number;
  rotina_adicional_2_descricao: string;
  rotina_adicional_2_valor: number;
  rotina_adicional_3_descricao: string;
  rotina_adicional_3_valor: number;
  rotina_adicional_4_descricao: string;
  rotina_adicional_4_valor: number;
  rotina_adicional_5_descricao: string;
  rotina_adicional_5_valor: number;
  clientes: { nome_empresa: string };
  planos: { nome: string };
};

type ContratoAdicional = {
  id: number;
  contrato_id: number;
  adicional_id: number;
  ativo: boolean;
};

export default function ContratosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [adicionais, setAdicionais] = useState<Adicional[]>([]);
  const [faixasPlano, setFaixasPlano] = useState<FaixaPlano[]>([]);
  const [faixasAdicionais, setFaixasAdicionais] = useState<FaixaAdicional[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [contratoAdicionais, setContratoAdicionais] = useState<ContratoAdicional[]>([]);

  const [contratoEditando, setContratoEditando] = useState<number | null>(null);

  const [clienteId, setClienteId] = useState("");
  const [planoId, setPlanoId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");
  const [status, setStatus] = useState("ativo");
  const [observacoes, setObservacoes] = useState("");

  const [faixaFinanceiroId, setFaixaFinanceiroId] = useState("");
  const [faixaNfId, setFaixaNfId] = useState("");
  const [faixaPagamentosId, setFaixaPagamentosId] = useState("");

  const [qtdBancos, setQtdBancos] = useState("");
  const [qtdCartoes, setQtdCartoes] = useState("");

  const [rotina1Descricao, setRotina1Descricao] = useState("");
  const [rotina1Valor, setRotina1Valor] = useState("");
  const [rotina2Descricao, setRotina2Descricao] = useState("");
  const [rotina2Valor, setRotina2Valor] = useState("");
  const [rotina3Descricao, setRotina3Descricao] = useState("");
  const [rotina3Valor, setRotina3Valor] = useState("");
  const [rotina4Descricao, setRotina4Descricao] = useState("");
  const [rotina4Valor, setRotina4Valor] = useState("");
  const [rotina5Descricao, setRotina5Descricao] = useState("");
  const [rotina5Valor, setRotina5Valor] = useState("");

  const [descontoValor, setDescontoValor] = useState("");
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<number[]>([]);

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

  async function carregarPlanos() {
    const { data, error } = await supabase
      .from("planos")
      .select("id, nome")
      .order("nome", { ascending: true });

    if (error) {
      alert(`Erro ao carregar planos: ${error.message}`);
      return;
    }

    setPlanos(data || []);
  }

  async function carregarAdicionais() {
    const { data, error } = await supabase
      .from("adicionais")
      .select("id, nome, tipo")
      .order("id", { ascending: true });

    if (error) {
      alert(`Erro ao carregar adicionais: ${error.message}`);
      return;
    }

    setAdicionais(data || []);
  }

  async function carregarFaixasPlano() {
    const { data, error } = await supabase
      .from("plano_faixas")
      .select("*")
      .order("plano_id", { ascending: true })
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
      .order("adicional_id", { ascending: true })
      .order("min_quantidade", { ascending: true });

    if (error) {
      alert(`Erro ao carregar faixas adicionais: ${error.message}`);
      return;
    }

    setFaixasAdicionais(data || []);
  }

  async function carregarContratos() {
    const { data, error }: any = await supabase
      .from("contratos")
      .select(`
        id,
        cliente_id,
        plano_id,
        data_inicio,
        dia_vencimento,
        status,
        observacoes,
        quantidade_bancos,
        quantidade_cartoes,
        volume_financeiro_contratado,
        volume_nf_contratado,
        volume_pagamentos_contratado,
        valor_contratado,
        desconto_valor,
        rotina_adicional_1_descricao,
        rotina_adicional_1_valor,
        rotina_adicional_2_descricao,
        rotina_adicional_2_valor,
        rotina_adicional_3_descricao,
        rotina_adicional_3_valor,
        rotina_adicional_4_descricao,
        rotina_adicional_4_valor,
        rotina_adicional_5_descricao,
        rotina_adicional_5_valor,
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

  async function carregarContratoAdicionais() {
    const { data, error } = await supabase.from("contrato_adicionais").select("*");

    if (error) {
      alert(`Erro ao carregar adicionais dos contratos: ${error.message}`);
      return;
    }

    setContratoAdicionais(data || []);
  }

  function limparFormulario() {
    setContratoEditando(null);
    setClienteId("");
    setPlanoId("");
    setDataInicio("");
    setDiaVencimento("");
    setStatus("ativo");
    setObservacoes("");
    setFaixaFinanceiroId("");
    setFaixaNfId("");
    setFaixaPagamentosId("");
    setQtdBancos("");
    setQtdCartoes("");
    setRotina1Descricao("");
    setRotina1Valor("");
    setRotina2Descricao("");
    setRotina2Valor("");
    setRotina3Descricao("");
    setRotina3Valor("");
    setRotina4Descricao("");
    setRotina4Valor("");
    setRotina5Descricao("");
    setRotina5Valor("");
    setDescontoValor("");
    setAdicionaisSelecionados([]);
  }

  function alternarAdicional(adicionalId: number) {
    setAdicionaisSelecionados((atuais) =>
      atuais.includes(adicionalId)
        ? atuais.filter((id) => id !== adicionalId)
        : [...atuais, adicionalId]
    );
  }

  function obterAdicionalPorNome(texto: string) {
    return adicionais.find((adicional) =>
      adicional.nome.toLowerCase().includes(texto.toLowerCase())
    );
  }

  const adicionalPagamentos = obterAdicionalPorNome("Agendamento");
  const adicionalNf = obterAdicionalPorNome("notas fiscais");
  const adicionalContabilidade = obterAdicionalPorNome("contabilidade");

  const temPagamentos =
    adicionalPagamentos && adicionaisSelecionados.includes(adicionalPagamentos.id);

  const temNf =
    adicionalNf && adicionaisSelecionados.includes(adicionalNf.id);

  const temContabilidade =
    adicionalContabilidade && adicionaisSelecionados.includes(adicionalContabilidade.id);

  const faixasFinanceirasDoPlano = faixasPlano.filter(
    (faixa) => Number(faixa.plano_id) === Number(planoId)
  );

  const faixasNf = adicionalNf
    ? faixasAdicionais.filter(
        (faixa) => Number(faixa.adicional_id) === Number(adicionalNf.id)
      )
    : [];

  const faixasPagamentos = adicionalPagamentos
    ? faixasAdicionais.filter(
        (faixa) => Number(faixa.adicional_id) === Number(adicionalPagamentos.id)
      )
    : [];

  function buscarFaixaPlanoPorId(id: string) {
    return faixasPlano.find((faixa) => Number(faixa.id) === Number(id));
  }

  function buscarFaixaAdicionalPorId(id: string) {
    return faixasAdicionais.find((faixa) => Number(faixa.id) === Number(id));
  }

  function calcularValorContrato() {
    const faixaFinanceira = buscarFaixaPlanoPorId(faixaFinanceiroId);
    const faixaNfSelecionada = buscarFaixaAdicionalPorId(faixaNfId);
    const faixaPagamentosSelecionada = buscarFaixaAdicionalPorId(faixaPagamentosId);

    const bancos = Number(qtdBancos || 0);
    const cartoes = Number(qtdCartoes || 0);

    const valorRotinas =
      Number(rotina1Valor || 0) +
      Number(rotina2Valor || 0) +
      Number(rotina3Valor || 0) +
      Number(rotina4Valor || 0) +
      Number(rotina5Valor || 0);

    const valorDesconto = Number(descontoValor || 0);

    const valorPlano = faixaFinanceira ? Number(faixaFinanceira.valor) : 0;

    const valorPagamentos =
      temPagamentos && faixaPagamentosSelecionada
        ? Number(faixaPagamentosSelecionada.valor)
        : 0;

    const valorNf =
      temNf && faixaNfSelecionada
        ? Number(faixaNfSelecionada.valor)
        : 0;

    const valorBancosExtras = Math.max(0, bancos - 3) * 50;
    const valorCartoesExtras = Math.max(0, cartoes - 2) * 50;
    const valorContabilidade = temContabilidade ? 100 : 0;

    const totalBruto =
      valorPlano +
      valorPagamentos +
      valorNf +
      valorBancosExtras +
      valorCartoesExtras +
      valorContabilidade +
      valorRotinas;

    const total = Math.max(0, totalBruto - valorDesconto);

    let erro = "";

    if (planoId && !faixaFinanceira) {
      erro = "Selecione uma faixa de volume financeiro.";
    }

    if (temPagamentos && !faixaPagamentosSelecionada) {
      erro = "Selecione uma faixa de agendamentos.";
    }

    if (temNf && !faixaNfSelecionada) {
      erro = "Selecione uma faixa de notas fiscais.";
    }

    return {
      faixaFinanceira,
      faixaNfSelecionada,
      faixaPagamentosSelecionada,
      valorPlano,
      valorPagamentos,
      valorNf,
      valorBancosExtras,
      valorCartoesExtras,
      valorContabilidade,
      valorRotinas,
      valorDesconto,
      totalBruto,
      total,
      erro,
    };
  }

  async function salvarContrato(e: React.FormEvent) {
    e.preventDefault();

    const calculo = calcularValorContrato();

    if (calculo.erro) {
      alert(calculo.erro);
      return;
    }

    const dadosContrato = {
      cliente_id: Number(clienteId),
      plano_id: Number(planoId),
      data_inicio: dataInicio,
      dia_vencimento: Number(diaVencimento),
      status,
      observacoes,

      quantidade_bancos: Number(qtdBancos || 0),
      quantidade_cartoes: Number(qtdCartoes || 0),

      volume_financeiro_contratado: calculo.faixaFinanceira?.max_lancamentos || 0,
      volume_nf_contratado:
        temNf && calculo.faixaNfSelecionada
          ? calculo.faixaNfSelecionada.max_quantidade
          : 0,
      volume_pagamentos_contratado:
        temPagamentos && calculo.faixaPagamentosSelecionada
          ? calculo.faixaPagamentosSelecionada.max_quantidade
          : 0,

      rotina_adicional_1_descricao: rotina1Descricao,
      rotina_adicional_1_valor: Number(rotina1Valor || 0),
      rotina_adicional_2_descricao: rotina2Descricao,
      rotina_adicional_2_valor: Number(rotina2Valor || 0),
      rotina_adicional_3_descricao: rotina3Descricao,
      rotina_adicional_3_valor: Number(rotina3Valor || 0),
      rotina_adicional_4_descricao: rotina4Descricao,
      rotina_adicional_4_valor: Number(rotina4Valor || 0),
      rotina_adicional_5_descricao: rotina5Descricao,
      rotina_adicional_5_valor: Number(rotina5Valor || 0),

      desconto_valor: calculo.valorDesconto,
      valor_contratado: calculo.total,
      valor_mensal: calculo.total,
    };

    let contratoIdFinal = contratoEditando;

    if (contratoEditando) {
      const { error } = await supabase
        .from("contratos")
        .update(dadosContrato)
        .eq("id", contratoEditando);

      if (error) {
        alert(`Erro ao atualizar contrato: ${error.message}`);
        return;
      }
    } else {
      const { data, error }: any = await supabase
        .from("contratos")
        .insert(dadosContrato)
        .select("id")
        .single();

      if (error) {
        alert(`Erro ao salvar contrato: ${error.message}`);
        return;
      }

      contratoIdFinal = data.id;
    }

    if (!contratoIdFinal) {
      alert("Erro ao identificar contrato salvo.");
      return;
    }

    await supabase
      .from("contrato_adicionais")
      .delete()
      .eq("contrato_id", contratoIdFinal);

    if (adicionaisSelecionados.length > 0) {
      const adicionaisParaInserir = adicionaisSelecionados.map((adicionalId) => ({
        contrato_id: contratoIdFinal,
        adicional_id: adicionalId,
        ativo: true,
      }));

      const { error } = await supabase
        .from("contrato_adicionais")
        .insert(adicionaisParaInserir);

      if (error) {
        alert(`Erro ao salvar adicionais do contrato: ${error.message}`);
        return;
      }
    }

    alert(contratoEditando ? "Contrato atualizado com sucesso" : "Contrato cadastrado com sucesso");

    limparFormulario();
    carregarContratos();
    carregarContratoAdicionais();
  }

  function editarContrato(contrato: Contrato) {
    setContratoEditando(contrato.id);
    setClienteId(String(contrato.cliente_id));
    setPlanoId(String(contrato.plano_id));
    setDataInicio(contrato.data_inicio || "");
    setDiaVencimento(String(contrato.dia_vencimento || ""));
    setStatus(contrato.status || "ativo");
    setObservacoes(contrato.observacoes || "");

    setQtdBancos(String(contrato.quantidade_bancos || ""));
    setQtdCartoes(String(contrato.quantidade_cartoes || ""));

    setRotina1Descricao(contrato.rotina_adicional_1_descricao || "");
    setRotina1Valor(String(contrato.rotina_adicional_1_valor || ""));
    setRotina2Descricao(contrato.rotina_adicional_2_descricao || "");
    setRotina2Valor(String(contrato.rotina_adicional_2_valor || ""));
    setRotina3Descricao(contrato.rotina_adicional_3_descricao || "");
    setRotina3Valor(String(contrato.rotina_adicional_3_valor || ""));
    setRotina4Descricao(contrato.rotina_adicional_4_descricao || "");
    setRotina4Valor(String(contrato.rotina_adicional_4_valor || ""));
    setRotina5Descricao(contrato.rotina_adicional_5_descricao || "");
    setRotina5Valor(String(contrato.rotina_adicional_5_valor || ""));
    setDescontoValor(String(contrato.desconto_valor || ""));

    const faixaFinanceira = faixasPlano.find(
      (faixa) =>
        Number(faixa.plano_id) === Number(contrato.plano_id) &&
        Number(faixa.max_lancamentos) === Number(contrato.volume_financeiro_contratado)
    );

    setFaixaFinanceiroId(faixaFinanceira ? String(faixaFinanceira.id) : "");

    const adicionaisDoContrato = contratoAdicionais
      .filter((item) => item.contrato_id === contrato.id && item.ativo)
      .map((item) => item.adicional_id);

    setAdicionaisSelecionados(adicionaisDoContrato);

    const adicionalPagamentosLocal = adicionais.find((adicional) =>
      adicional.nome.toLowerCase().includes("agendamento")
    );

    const adicionalNfLocal = adicionais.find((adicional) =>
      adicional.nome.toLowerCase().includes("notas fiscais")
    );

    if (adicionalPagamentosLocal) {
      const faixaPagamento = faixasAdicionais.find(
        (faixa) =>
          Number(faixa.adicional_id) === Number(adicionalPagamentosLocal.id) &&
          Number(faixa.max_quantidade) === Number(contrato.volume_pagamentos_contratado)
      );

      setFaixaPagamentosId(faixaPagamento ? String(faixaPagamento.id) : "");
    }

    if (adicionalNfLocal) {
      const faixaNota = faixasAdicionais.find(
        (faixa) =>
          Number(faixa.adicional_id) === Number(adicionalNfLocal.id) &&
          Number(faixa.max_quantidade) === Number(contrato.volume_nf_contratado)
      );

      setFaixaNfId(faixaNota ? String(faixaNota.id) : "");
    }
  }

  async function excluirContrato(id: number) {
    const confirmar = confirm("Deseja realmente excluir este contrato?");
    if (!confirmar) return;

    await supabase.from("contrato_adicionais").delete().eq("contrato_id", id);

    const { error } = await supabase.from("contratos").delete().eq("id", id);

    if (error) {
      alert(`Erro ao excluir contrato: ${error.message}`);
      return;
    }

    carregarContratos();
    carregarContratoAdicionais();
  }

  function adicionaisDoContrato(contratoId: number) {
    const ids = contratoAdicionais
      .filter((item) => item.contrato_id === contratoId && item.ativo)
      .map((item) => item.adicional_id);

    return adicionais.filter((adicional) => ids.includes(adicional.id));
  }

  function formatarMoeda(valor: number) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  useEffect(() => {
    carregarClientes();
    carregarPlanos();
    carregarAdicionais();
    carregarFaixasPlano();
    carregarFaixasAdicionais();
    carregarContratos();
    carregarContratoAdicionais();
  }, []);

  const calculoAtual = calcularValorContrato();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold">Contratos</h1>

        <form onSubmit={salvarContrato} className="mb-8 rounded-xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {contratoEditando ? "Editar contrato" : "Novo contrato"}
            </h2>

            {contratoEditando && (
              <button type="button" onClick={limparFormulario} className="rounded bg-gray-300 px-4 py-2">
                Cancelar edição
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select className="rounded border p-3" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
              <option value="">Selecione o cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome_empresa}
                </option>
              ))}
            </select>

            <select
              className="rounded border p-3"
              value={planoId}
              onChange={(e) => {
                setPlanoId(e.target.value);
                setFaixaFinanceiroId("");
              }}
              required
            >
              <option value="">Selecione o plano</option>
              {planos.map((plano) => (
                <option key={plano.id} value={plano.id}>
                  {plano.nome}
                </option>
              ))}
            </select>

            <input type="date" className="rounded border p-3" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />

            <input type="number" min="1" max="31" className="rounded border p-3" placeholder="Dia de vencimento do pagamento" value={diaVencimento} onChange={(e) => setDiaVencimento(e.target.value)} required />

            <select className="rounded border p-3" value={faixaFinanceiroId} onChange={(e) => setFaixaFinanceiroId(e.target.value)} required>
              <option value="">Volume financeiro contratado</option>
              {faixasFinanceirasDoPlano.map((faixa) => (
                <option key={faixa.id} value={faixa.id}>
                  De {faixa.min_lancamentos} até {faixa.max_lancamentos} lançamentos — {formatarMoeda(Number(faixa.valor))}
                </option>
              ))}
            </select>

            <select className="rounded border p-3" value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="ativo">Ativo</option>
              <option value="pausado">Pausado</option>
              <option value="cancelado">Cancelado</option>
            </select>

            <input type="number" className="rounded border p-3" placeholder="Quantidade de bancos contratados" value={qtdBancos} onChange={(e) => setQtdBancos(e.target.value)} />

            <input type="number" className="rounded border p-3" placeholder="Quantidade de cartões contratados" value={qtdCartoes} onChange={(e) => setQtdCartoes(e.target.value)} />
          </div>

          <div className="mt-4 rounded border p-4">
            <h3 className="mb-3 font-semibold">Serviços adicionais contratados</h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {adicionais.map((adicional) => (
                <label key={adicional.id} className="flex items-center gap-2 rounded border p-3">
                  <input
                    type="checkbox"
                    checked={adicionaisSelecionados.includes(adicional.id)}
                    onChange={() => {
                      alternarAdicional(adicional.id);

                      if (adicional.nome.toLowerCase().includes("agendamento")) {
                        setFaixaPagamentosId("");
                      }

                      if (adicional.nome.toLowerCase().includes("notas fiscais")) {
                        setFaixaNfId("");
                      }
                    }}
                  />
                  {adicional.nome}
                </label>
              ))}
            </div>
          </div>

          {(temPagamentos || temNf) && (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {temPagamentos && (
                <select className="rounded border p-3" value={faixaPagamentosId} onChange={(e) => setFaixaPagamentosId(e.target.value)} required>
                  <option value="">Faixa de agendamentos contratada</option>
                  {faixasPagamentos.map((faixa) => (
                    <option key={faixa.id} value={faixa.id}>
                      Até {faixa.max_quantidade} agendamentos — {formatarMoeda(Number(faixa.valor))}
                    </option>
                  ))}
                </select>
              )}

              {temNf && (
                <select className="rounded border p-3" value={faixaNfId} onChange={(e) => setFaixaNfId(e.target.value)} required>
                  <option value="">Faixa de notas fiscais contratada</option>
                  {faixasNf.map((faixa) => (
                    <option key={faixa.id} value={faixa.id}>
                      Até {faixa.max_quantidade} notas fiscais — {formatarMoeda(Number(faixa.valor))}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="mt-4 rounded border p-4">
            <h3 className="mb-3 font-semibold">Rotinas adicionais</h3>

            {[1, 2, 3, 4, 5].map((numero) => {
              const descricoes = [
                rotina1Descricao,
                rotina2Descricao,
                rotina3Descricao,
                rotina4Descricao,
                rotina5Descricao,
              ];

              const valores = [
                rotina1Valor,
                rotina2Valor,
                rotina3Valor,
                rotina4Valor,
                rotina5Valor,
              ];

              const setDescricoes = [
                setRotina1Descricao,
                setRotina2Descricao,
                setRotina3Descricao,
                setRotina4Descricao,
                setRotina5Descricao,
              ];

              const setValores = [
                setRotina1Valor,
                setRotina2Valor,
                setRotina3Valor,
                setRotina4Valor,
                setRotina5Valor,
              ];

              return (
                <div key={numero} className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    className="rounded border p-3"
                    placeholder={`Descrição da rotina adicional ${numero}`}
                    value={descricoes[numero - 1]}
                    onChange={(e) => setDescricoes[numero - 1](e.target.value)}
                  />

                  <input
                    type="number"
                    step="0.01"
                    className="rounded border p-3"
                    placeholder={`Valor da rotina adicional ${numero}`}
                    value={valores[numero - 1]}
                    onChange={(e) => setValores[numero - 1](e.target.value)}
                  />
                </div>
              );
            })}
          </div>

          <input
            type="number"
            step="0.01"
            className="mt-4 w-full rounded border p-3"
            placeholder="Desconto concedido"
            value={descontoValor}
            onChange={(e) => setDescontoValor(e.target.value)}
          />

          <textarea className="mt-4 w-full rounded border p-3" placeholder="Observações do contrato" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />

          <div className="mt-6 rounded-xl border bg-gray-50 p-4">
            <h3 className="mb-3 text-lg font-semibold">Valor calculado do contrato</h3>

            <p>Plano base: {formatarMoeda(calculoAtual.valorPlano)}</p>
            <p>Agendamentos: {formatarMoeda(calculoAtual.valorPagamentos)}</p>
            <p>Notas fiscais / boletos: {formatarMoeda(calculoAtual.valorNf)}</p>
            <p>Bancos extras: {formatarMoeda(calculoAtual.valorBancosExtras)}</p>
            <p>Cartões extras: {formatarMoeda(calculoAtual.valorCartoesExtras)}</p>
            <p>Contabilidade: {formatarMoeda(calculoAtual.valorContabilidade)}</p>
            <p>Rotinas adicionais: {formatarMoeda(calculoAtual.valorRotinas)}</p>
            <p>Desconto: -{formatarMoeda(calculoAtual.valorDesconto)}</p>

            <p className="mt-3 text-xl font-bold">
              Total mensal contratado: {formatarMoeda(calculoAtual.total)}
            </p>

            {calculoAtual.erro && (
              <p className="mt-2 font-semibold text-red-600">{calculoAtual.erro}</p>
            )}
          </div>

          <button type="submit" className="mt-4 rounded bg-black px-5 py-3 text-white">
            {contratoEditando ? "Atualizar contrato" : "Salvar contrato"}
          </button>
        </form>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Contratos cadastrados</h2>

          <div className="space-y-3">
            {contratos.map((contrato) => {
              const adicionaisContrato = adicionaisDoContrato(contrato.id);

              const rotinas = [
                [contrato.rotina_adicional_1_descricao, contrato.rotina_adicional_1_valor],
                [contrato.rotina_adicional_2_descricao, contrato.rotina_adicional_2_valor],
                [contrato.rotina_adicional_3_descricao, contrato.rotina_adicional_3_valor],
                [contrato.rotina_adicional_4_descricao, contrato.rotina_adicional_4_valor],
                [contrato.rotina_adicional_5_descricao, contrato.rotina_adicional_5_valor],
              ].filter(([descricao, valor]) => descricao || Number(valor) > 0);

              return (
                <div key={contrato.id} className="rounded border p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <strong>{contrato.clientes?.nome_empresa}</strong>
                      <p>Plano: {contrato.planos?.nome}</p>
                      <p>Início: {contrato.data_inicio}</p>
                      <p>Vencimento: dia {contrato.dia_vencimento}</p>
                      <p>Status: {contrato.status}</p>
                      <p>Volume financeiro contratado: {contrato.volume_financeiro_contratado}</p>
                      <p>Notas fiscais contratadas: {contrato.volume_nf_contratado}</p>
                      <p>Agendamentos contratados: {contrato.volume_pagamentos_contratado}</p>
                      <p>Bancos contratados: {contrato.quantidade_bancos}</p>
                      <p>Cartões contratados: {contrato.quantidade_cartoes}</p>

                      {rotinas.length > 0 && (
                        <div className="mt-3">
                          <strong>Rotinas adicionais:</strong>
                          <ul className="list-inside list-disc">
                            {rotinas.map(([descricao, valor], index) => (
                              <li key={index}>
                                {descricao || "Rotina adicional"} — {formatarMoeda(Number(valor || 0))}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {Number(contrato.desconto_valor || 0) > 0 && (
                        <p>Desconto: -{formatarMoeda(contrato.desconto_valor)}</p>
                      )}

                      <p className="mt-2 text-lg font-bold">
                        Valor contratado: {formatarMoeda(contrato.valor_contratado)}
                      </p>

                      <div className="mt-3">
                        <strong>Adicionais:</strong>
                        {adicionaisContrato.length === 0 ? (
                          <p>Nenhum adicional contratado.</p>
                        ) : (
                          <ul className="list-inside list-disc">
                            {adicionaisContrato.map((adicional) => (
                              <li key={adicional.id}>{adicional.nome}</li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {contrato.observacoes && (
                        <p className="mt-3">Observações: {contrato.observacoes}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => editarContrato(contrato)} className="rounded bg-yellow-500 px-4 py-2 text-white">
                        Editar
                      </button>

                      <button onClick={() => excluirContrato(contrato.id)} className="rounded bg-red-600 px-4 py-2 text-white">
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {contratos.length === 0 && (
              <p className="text-gray-500">Nenhum contrato cadastrado ainda.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}