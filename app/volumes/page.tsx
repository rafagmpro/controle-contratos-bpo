"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cliente = { id: number; nome_empresa: string };

type Contrato = {
  id: number;
  cliente_id: number;
  plano_id: number;
  data_inicio: string;
  valor_contratado: number;
  quantidade_bancos: number;
  quantidade_cartoes: number;
  volume_financeiro_contratado: number;
  volume_nf_contratado: number;
  volume_pagamentos_contratado: number;
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
  desconto_valor: number;
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

type ContratoAdicional = {
  id: number;
  contrato_id: number;
  adicional_id: number;
  ativo: boolean;
};

type Volume = {
  id: number;
  cliente_id: number;
  contrato_id: number;
  mes_referencia: string;
  quantidade_financeiro: number;
  quantidade_nf: number;
  quantidade_pagamentos: number;
  quantidade_bancos: number;
  quantidade_cartoes: number;
  realizou_agendamentos: boolean;
  realizou_notas: boolean;
  realizou_contabilidade: boolean;
  rotina_realizada_1_descricao: string;
  rotina_realizada_1_valor: number;
  rotina_realizada_2_descricao: string;
  rotina_realizada_2_valor: number;
  rotina_realizada_3_descricao: string;
  rotina_realizada_3_valor: number;
  rotina_realizada_4_descricao: string;
  rotina_realizada_4_valor: number;
  rotina_realizada_5_descricao: string;
  rotina_realizada_5_valor: number;
  desconto_realizado: number;
  valor_calculado: number;
  diferenca_valor: number;
  percentual_uso: number;
  status_uso: string;
  contratos: {
    plano_id: number;
    valor_contratado: number;
    quantidade_bancos: number;
    quantidade_cartoes: number;
    volume_financeiro_contratado: number;
    volume_nf_contratado: number;
    volume_pagamentos_contratado: number;
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
    desconto_valor: number;
    clientes: { nome_empresa: string };
    planos: { nome: string };
  };
};

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function VolumesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [faixasPlano, setFaixasPlano] = useState<FaixaPlano[]>([]);
  const [faixasAdicionais, setFaixasAdicionais] = useState<FaixaAdicional[]>([]);
  const [contratoAdicionais, setContratoAdicionais] = useState<ContratoAdicional[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [contratoId, setContratoId] = useState("");
  const [mesReferencia, setMesReferencia] = useState("");

  const [qtdFinanceiro, setQtdFinanceiro] = useState("");
  const [qtdNotas, setQtdNotas] = useState("");
  const [qtdPagamentos, setQtdPagamentos] = useState("");
  const [qtdBancos, setQtdBancos] = useState("");
  const [qtdCartoes, setQtdCartoes] = useState("");

  const [realizouNotas, setRealizouNotas] = useState(false);
  const [realizouAgendamentos, setRealizouAgendamentos] = useState(false);
  const [realizouContabilidade, setRealizouContabilidade] = useState(false);

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

  const [descontoRealizado, setDescontoRealizado] = useState("");

  const [anoAberto, setAnoAberto] = useState<number | null>(null);
  const [mesAberto, setMesAberto] = useState<string | null>(null);

  async function carregarClientes() {
    const { data } = await supabase
      .from("clientes")
      .select("id, nome_empresa")
      .order("nome_empresa", { ascending: true });

    setClientes(data || []);
  }

  async function carregarContratos() {
    const { data, error }: any = await supabase
      .from("contratos")
      .select(`
        id,
        cliente_id,
        plano_id,
        data_inicio,
        valor_contratado,
        quantidade_bancos,
        quantidade_cartoes,
        volume_financeiro_contratado,
        volume_nf_contratado,
        volume_pagamentos_contratado,
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
        desconto_valor,
        clientes(nome_empresa),
        planos(nome)
      `)
      .eq("status", "ativo")
      .order("id", { ascending: false });

    if (error) {
      alert(`Erro ao carregar contratos: ${error.message}`);
      return;
    }

    setContratos(data || []);
  }

  async function carregarFaixasPlano() {
    const { data } = await supabase
      .from("plano_faixas")
      .select("*")
      .order("min_lancamentos", { ascending: true });

    setFaixasPlano(data || []);
  }

  async function carregarFaixasAdicionais() {
    const { data } = await supabase
      .from("adicional_faixas")
      .select("*")
      .order("adicional_id", { ascending: true })
      .order("min_quantidade", { ascending: true });

    setFaixasAdicionais(data || []);
  }

  async function carregarContratoAdicionais() {
    const { data } = await supabase.from("contrato_adicionais").select("*");
    setContratoAdicionais(data || []);
  }

  async function carregarVolumes() {
    const { data, error }: any = await supabase
      .from("volumes_mensais")
      .select(`
        id,
        cliente_id,
        contrato_id,
        mes_referencia,
        quantidade_financeiro,
        quantidade_nf,
        quantidade_pagamentos,
        quantidade_bancos,
        quantidade_cartoes,
        realizou_agendamentos,
        realizou_notas,
        realizou_contabilidade,
        rotina_realizada_1_descricao,
        rotina_realizada_1_valor,
        rotina_realizada_2_descricao,
        rotina_realizada_2_valor,
        rotina_realizada_3_descricao,
        rotina_realizada_3_valor,
        rotina_realizada_4_descricao,
        rotina_realizada_4_valor,
        rotina_realizada_5_descricao,
        rotina_realizada_5_valor,
        desconto_realizado,
        valor_calculado,
        diferenca_valor,
        percentual_uso,
        status_uso,
        contratos(
          plano_id,
          valor_contratado,
          quantidade_bancos,
          quantidade_cartoes,
          volume_financeiro_contratado,
          volume_nf_contratado,
          volume_pagamentos_contratado,
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
          desconto_valor,
          clientes(nome_empresa),
          planos(nome)
        )
      `)
      .order("mes_referencia", { ascending: false });

    if (error) {
      alert(`Erro ao carregar volumes: ${error.message}`);
      return;
    }

    setVolumes(data || []);
  }

  useEffect(() => {
    carregarClientes();
    carregarContratos();
    carregarFaixasPlano();
    carregarFaixasAdicionais();
    carregarContratoAdicionais();
    carregarVolumes();
  }, []);

  const contratosDoCliente = useMemo(() => {
    return contratos.filter(
      (contrato) => Number(contrato.cliente_id) === Number(clienteId)
    );
  }, [contratos, clienteId]);

  const contratoSelecionado = useMemo(() => {
    return contratos.find(
      (contrato) => Number(contrato.id) === Number(contratoId)
    );
  }, [contratos, contratoId]);

  const volumesDoCliente = useMemo(() => {
    if (!clienteId) return [];
    return volumes.filter((volume) => Number(volume.cliente_id) === Number(clienteId));
  }, [volumes, clienteId]);

  const anosDoCliente = useMemo(() => {
    const contrato = contratoSelecionado || contratosDoCliente[0];

    const anoInicio = contrato?.data_inicio
      ? new Date(`${contrato.data_inicio}T00:00:00`).getFullYear()
      : new Date().getFullYear();

    const anoAtual = new Date().getFullYear();
    const anos: number[] = [];

    for (let ano = anoInicio; ano <= anoAtual; ano++) {
      anos.push(ano);
    }

    return anos.reverse();
  }, [contratoSelecionado, contratosDoCliente]);

  function contratoTemAdicional(contratoIdAtual: number, adicionalId: number) {
    return contratoAdicionais.some(
      (item) =>
        Number(item.contrato_id) === Number(contratoIdAtual) &&
        Number(item.adicional_id) === Number(adicionalId) &&
        item.ativo
    );
  }

  function encontrarFaixaPlano(planoId: number, quantidade: number) {
    return faixasPlano.find(
      (faixa) =>
        Number(faixa.plano_id) === Number(planoId) &&
        quantidade >= Number(faixa.min_lancamentos) &&
        quantidade <= Number(faixa.max_lancamentos)
    );
  }

  function encontrarFaixaAdicional(adicionalId: number, quantidade: number) {
    if (quantidade <= 0) return null;

    return faixasAdicionais.find(
      (faixa) =>
        Number(faixa.adicional_id) === Number(adicionalId) &&
        quantidade >= Number(faixa.min_quantidade) &&
        quantidade <= Number(faixa.max_quantidade)
    );
  }

  function calcularVolumeAtual() {
    if (!contratoSelecionado) return null;

    const financeiro = Number(qtdFinanceiro || 0);
    const notas = realizouNotas ? Number(qtdNotas || 0) : 0;
    const pagamentos = realizouAgendamentos ? Number(qtdPagamentos || 0) : 0;
    const bancos = Number(qtdBancos || 0);
    const cartoes = Number(qtdCartoes || 0);

    const faixaPlano = encontrarFaixaPlano(contratoSelecionado.plano_id, financeiro);
    const faixaNotas = realizouNotas ? encontrarFaixaAdicional(2, notas) : null;
    const faixaPagamentos = realizouAgendamentos
      ? encontrarFaixaAdicional(1, pagamentos)
      : null;

    const valorPlano = faixaPlano ? Number(faixaPlano.valor) : 0;
    const valorNotas = faixaNotas ? Number(faixaNotas.valor) : 0;
    const valorPagamentos = faixaPagamentos ? Number(faixaPagamentos.valor) : 0;
    const valorContabilidade = realizouContabilidade ? 100 : 0;

    const bancosContratados = Number(contratoSelecionado.quantidade_bancos || 0);
    const cartoesContratados = Number(contratoSelecionado.quantidade_cartoes || 0);

    const valorBancosExtras = Math.max(0, bancos - bancosContratados) * 50;
    const valorCartoesExtras = Math.max(0, cartoes - cartoesContratados) * 50;

    const valorRotinas =
      Number(rotina1Valor || 0) +
      Number(rotina2Valor || 0) +
      Number(rotina3Valor || 0) +
      Number(rotina4Valor || 0) +
      Number(rotina5Valor || 0);

    const desconto = Number(descontoRealizado || 0);

    const valorCalculado = Math.max(
      0,
      valorPlano +
        valorNotas +
        valorPagamentos +
        valorContabilidade +
        valorBancosExtras +
        valorCartoesExtras +
        valorRotinas -
        desconto
    );

    const valorContratado = Number(contratoSelecionado.valor_contratado || 0);
    const diferenca = valorCalculado - valorContratado;

    const contratoTemNotas = contratoTemAdicional(contratoSelecionado.id, 2);
    const contratoTemPagamentos = contratoTemAdicional(contratoSelecionado.id, 1);
    const contratoTemContabilidade = contratoTemAdicional(contratoSelecionado.id, 3);

    let status = "dentro do contratado";

    if (
      financeiro > Number(contratoSelecionado.volume_financeiro_contratado || 0) ||
      (contratoTemNotas && notas > Number(contratoSelecionado.volume_nf_contratado || 0)) ||
      (contratoTemPagamentos &&
        pagamentos > Number(contratoSelecionado.volume_pagamentos_contratado || 0)) ||
      bancos > bancosContratados ||
      cartoes > cartoesContratados ||
      diferenca > 0 ||
      (realizouNotas && !contratoTemNotas) ||
      (realizouAgendamentos && !contratoTemPagamentos) ||
      (realizouContabilidade && !contratoTemContabilidade)
    ) {
      status = "ultrapassou contratado";
    }

    let erro = "";

    if (!faixaPlano) {
      erro = "Não existe faixa de preço para o volume financeiro informado.";
    }

    if (realizouNotas && notas > 0 && !faixaNotas) {
      erro = "Não existe faixa de preço para as notas fiscais informadas.";
    }

    if (realizouAgendamentos && pagamentos > 0 && !faixaPagamentos) {
      erro = "Não existe faixa de preço para os agendamentos informados.";
    }

    return {
      contrato: contratoSelecionado,
      financeiro,
      notas,
      pagamentos,
      bancos,
      cartoes,
      valorCalculado,
      valorContratado,
      diferenca,
      status,
      erro,
    };
  }

  async function salvarVolume(e: React.FormEvent) {
    e.preventDefault();

    const calculo = calcularVolumeAtual();

    if (!calculo) {
      alert("Selecione cliente e contrato.");
      return;
    }

    if (calculo.erro) {
      alert(calculo.erro);
      return;
    }

    const { error } = await supabase.from("volumes_mensais").insert({
      cliente_id: calculo.contrato.cliente_id,
      contrato_id: calculo.contrato.id,
      mes_referencia: `${mesReferencia}-01`,

      quantidade_lancamentos: calculo.financeiro,
      limite_plano: calculo.contrato.volume_financeiro_contratado,
      percentual_uso: 0,
      status_uso: calculo.status,

      quantidade_financeiro: calculo.financeiro,
      quantidade_nf: calculo.notas,
      quantidade_pagamentos: calculo.pagamentos,
      quantidade_bancos: calculo.bancos,
      quantidade_cartoes: calculo.cartoes,

      realizou_agendamentos: realizouAgendamentos,
      realizou_notas: realizouNotas,
      realizou_contabilidade: realizouContabilidade,

      rotina_realizada_1_descricao: rotina1Descricao,
      rotina_realizada_1_valor: Number(rotina1Valor || 0),
      rotina_realizada_2_descricao: rotina2Descricao,
      rotina_realizada_2_valor: Number(rotina2Valor || 0),
      rotina_realizada_3_descricao: rotina3Descricao,
      rotina_realizada_3_valor: Number(rotina3Valor || 0),
      rotina_realizada_4_descricao: rotina4Descricao,
      rotina_realizada_4_valor: Number(rotina4Valor || 0),
      rotina_realizada_5_descricao: rotina5Descricao,
      rotina_realizada_5_valor: Number(rotina5Valor || 0),

      desconto_realizado: Number(descontoRealizado || 0),
      valor_calculado: calculo.valorCalculado,
      diferenca_valor: calculo.diferenca,
    });

    if (error) {
      alert(`Erro ao salvar volume: ${error.message}`);
      return;
    }

    setMesReferencia("");
    setQtdFinanceiro("");
    setQtdNotas("");
    setQtdPagamentos("");
    setQtdBancos("");
    setQtdCartoes("");
    setRealizouNotas(false);
    setRealizouAgendamentos(false);
    setRealizouContabilidade(false);
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
    setDescontoRealizado("");

    carregarVolumes();
  }

  function volumeDoMes(ano: number, mesIndex: number) {
    const mes = String(mesIndex + 1).padStart(2, "0");
    const prefixo = `${ano}-${mes}`;

    return volumesDoCliente.find((volume) =>
      volume.mes_referencia.startsWith(prefixo)
    );
  }

  function formatarMoeda(valor: number) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function corStatus(status: string) {
    if (status === "ultrapassou contratado") return "border-red-600 bg-red-50";
    return "border-green-600 bg-green-50";
  }

  function iconeMes(volume?: Volume) {
    if (!volume) return "⚠️";
    if (volume.status_uso === "ultrapassou contratado") return "❗";
    return "✅";
  }

  function faixaFinanceiraContratada(volume: Volume) {
    const faixa = faixasPlano.find(
      (item) =>
        Number(item.plano_id) === Number(volume.contratos.plano_id) &&
        Number(item.max_lancamentos) ===
          Number(volume.contratos.volume_financeiro_contratado)
    );

    if (!faixa) return `Até ${volume.contratos.volume_financeiro_contratado}`;

    return `De ${faixa.min_lancamentos} até ${faixa.max_lancamentos}`;
  }

  function contratoTemContabilidade(volume: Volume) {
    return contratoTemAdicional(volume.contrato_id, 3);
  }

  function contratoTemNotas(volume: Volume) {
    return contratoTemAdicional(volume.contrato_id, 2);
  }

  function contratoTemPagamentos(volume: Volume) {
    return contratoTemAdicional(volume.contrato_id, 1);
  }

  function faixaNotasContratada(volume: Volume) {
    if (!contratoTemNotas(volume)) return "Não possui";

    const faixa = faixasAdicionais.find(
      (item) =>
        Number(item.adicional_id) === 2 &&
        Number(item.max_quantidade) ===
          Number(volume.contratos.volume_nf_contratado)
    );

    if (!faixa) return `Até ${volume.contratos.volume_nf_contratado}`;

    return `De ${faixa.min_quantidade} até ${faixa.max_quantidade}`;
  }

  function faixaAgendamentosContratada(volume: Volume) {
    if (!contratoTemPagamentos(volume)) return "Não possui";

    const faixa = faixasAdicionais.find(
      (item) =>
        Number(item.adicional_id) === 1 &&
        Number(item.max_quantidade) ===
          Number(volume.contratos.volume_pagamentos_contratado)
    );

    if (!faixa) return `Até ${volume.contratos.volume_pagamentos_contratado}`;

    return `De ${faixa.min_quantidade} até ${faixa.max_quantidade}`;
  }

  function rotinasContrato(volume: Volume) {
    return [
      [volume.contratos.rotina_adicional_1_descricao, volume.contratos.rotina_adicional_1_valor],
      [volume.contratos.rotina_adicional_2_descricao, volume.contratos.rotina_adicional_2_valor],
      [volume.contratos.rotina_adicional_3_descricao, volume.contratos.rotina_adicional_3_valor],
      [volume.contratos.rotina_adicional_4_descricao, volume.contratos.rotina_adicional_4_valor],
      [volume.contratos.rotina_adicional_5_descricao, volume.contratos.rotina_adicional_5_valor],
    ].filter(([descricao, valor]) => descricao || Number(valor) > 0);
  }

  function rotinasRealizadas(volume: Volume) {
    return [
      [volume.rotina_realizada_1_descricao, volume.rotina_realizada_1_valor],
      [volume.rotina_realizada_2_descricao, volume.rotina_realizada_2_valor],
      [volume.rotina_realizada_3_descricao, volume.rotina_realizada_3_valor],
      [volume.rotina_realizada_4_descricao, volume.rotina_realizada_4_valor],
      [volume.rotina_realizada_5_descricao, volume.rotina_realizada_5_valor],
    ].filter(([descricao, valor]) => descricao || Number(valor) > 0);
  }

  const calculoAtual = calcularVolumeAtual();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold">
          Volumes Mensais por Cliente
        </h1>

        <form onSubmit={salvarVolume} className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Registrar fechamento mensal</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <select
              className="rounded border p-3"
              value={clienteId}
              onChange={(e) => {
                setClienteId(e.target.value);
                setContratoId("");
                setAnoAberto(null);
                setMesAberto(null);
              }}
              required
            >
              <option value="">Selecione o cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome_empresa}
                </option>
              ))}
            </select>

            <select
              className="rounded border p-3"
              value={contratoId}
              onChange={(e) => setContratoId(e.target.value)}
              required
              disabled={!clienteId}
            >
              <option value="">Selecione o contrato</option>
              {contratosDoCliente.map((contrato) => (
                <option key={contrato.id} value={contrato.id}>
                  {contrato.planos.nome} — {formatarMoeda(contrato.valor_contratado)}
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
              placeholder="Lançamentos financeiros realizados"
              value={qtdFinanceiro}
              onChange={(e) => setQtdFinanceiro(e.target.value)}
              required
            />

            <input
              type="number"
              className="rounded border p-3"
              placeholder="Quantidade de bancos usados"
              value={qtdBancos}
              onChange={(e) => setQtdBancos(e.target.value)}
            />

            <input
              type="number"
              className="rounded border p-3"
              placeholder="Quantidade de cartões usados"
              value={qtdCartoes}
              onChange={(e) => setQtdCartoes(e.target.value)}
            />
          </div>

          <div className="mt-4 rounded border p-4">
            <h3 className="mb-3 font-semibold">Serviços realizados no mês</h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <label className="flex items-center gap-2 rounded border p-3">
                <input
                  type="checkbox"
                  checked={realizouAgendamentos}
                  onChange={(e) => setRealizouAgendamentos(e.target.checked)}
                />
                Agendamentos de pagamentos
              </label>

              <label className="flex items-center gap-2 rounded border p-3">
                <input
                  type="checkbox"
                  checked={realizouNotas}
                  onChange={(e) => setRealizouNotas(e.target.checked)}
                />
                Emissão de notas fiscais / boletos
              </label>

              <label className="flex items-center gap-2 rounded border p-3">
                <input
                  type="checkbox"
                  checked={realizouContabilidade}
                  onChange={(e) => setRealizouContabilidade(e.target.checked)}
                />
                Envio para contabilidade
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {realizouAgendamentos && (
                <input
                  type="number"
                  className="rounded border p-3"
                  placeholder="Agendamentos realizados"
                  value={qtdPagamentos}
                  onChange={(e) => setQtdPagamentos(e.target.value)}
                />
              )}

              {realizouNotas && (
                <input
                  type="number"
                  className="rounded border p-3"
                  placeholder="Notas fiscais / boletos realizados"
                  value={qtdNotas}
                  onChange={(e) => setQtdNotas(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="mt-4 rounded border p-4">
            <h3 className="mb-3 font-semibold">Rotinas extras realizadas</h3>

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
                    placeholder={`Descrição da rotina extra realizada ${numero}`}
                    value={descricoes[numero - 1]}
                    onChange={(e) => setDescricoes[numero - 1](e.target.value)}
                  />

                  <input
                    type="number"
                    step="0.01"
                    className="rounded border p-3"
                    placeholder={`Valor da rotina extra realizada ${numero}`}
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
            placeholder="Desconto aplicado no mês"
            value={descontoRealizado}
            onChange={(e) => setDescontoRealizado(e.target.value)}
          />

          {calculoAtual && (
            <div className="mt-6 rounded-xl border bg-gray-50 p-4">
              <h3 className="mb-3 text-lg font-semibold">Comparativo do mês</h3>
              <p>Valor contratado: {formatarMoeda(calculoAtual.valorContratado)}</p>
              <p>Valor realizado: {formatarMoeda(calculoAtual.valorCalculado)}</p>
              <p>Diferença: <strong>{formatarMoeda(calculoAtual.diferenca)}</strong></p>
              <p>Status: <strong>{calculoAtual.status}</strong></p>

              {calculoAtual.erro && (
                <p className="mt-2 font-semibold text-red-600">
                  {calculoAtual.erro}
                </p>
              )}
            </div>
          )}

          <button type="submit" className="mt-4 rounded bg-black px-5 py-3 text-white">
            Salvar fechamento mensal
          </button>
        </form>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Histórico por ano e mês</h2>

          {!clienteId && (
            <p className="text-gray-500">
              Selecione um cliente acima para visualizar o histórico.
            </p>
          )}

          <div className="space-y-4">
            {clienteId &&
              anosDoCliente.map((ano) => (
                <div key={ano} className="rounded border bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setAnoAberto(anoAberto === ano ? null : ano)}
                    className="w-full p-4 text-left text-lg font-bold"
                  >
                    {ano}
                  </button>

                  {anoAberto === ano && (
                    <div className="space-y-3 p-4">
                      {meses.map((nomeMes, index) => {
                        const chaveMes = `${ano}-${String(index + 1).padStart(2, "0")}`;
                        const volume = volumeDoMes(ano, index);
                        const aberto = mesAberto === chaveMes;

                        return (
                          <div key={chaveMes} className="rounded border bg-white">
                            <button
                              type="button"
                              onClick={() => setMesAberto(aberto ? null : chaveMes)}
                              className="flex w-full items-center justify-between p-4 text-left font-semibold"
                            >
                              <span>{nomeMes}</span>
                              <span
                                className={
                                  volume?.status_uso === "ultrapassou contratado"
                                    ? "font-bold text-red-600"
                                    : ""
                                }
                              >
                                {iconeMes(volume)}
                              </span>
                            </button>

                            {aberto && (
                              <div className="border-t p-4">
                                {!volume && (
                                  <p className="text-sm text-gray-600">
                                    Ainda não houve registro de histórico este mês.
                                  </p>
                                )}

                                {volume && (
                                  <div className={`rounded border-l-8 p-4 ${corStatus(volume.status_uso)}`}>
                                    <p className="font-bold">
                                      {volume.contratos.clientes.nome_empresa}
                                    </p>

                                    <p>Plano: {volume.contratos.planos.nome}</p>
                                    <p>Mês: {volume.mes_referencia}</p>

                                    <div className="mt-4 overflow-hidden rounded border bg-white">
                                      <div className="grid grid-cols-4 bg-gray-100 p-3 font-semibold">
                                        <div>Item</div>
                                        <div>Contrato atual</div>
                                        <div>Realizado no mês</div>
                                        <div>Situação</div>
                                      </div>

                                      <div className="grid grid-cols-4 border-t p-3">
                                        <div>Financeiro</div>
                                        <div>{faixaFinanceiraContratada(volume)} lançamentos</div>
                                        <div>{volume.quantidade_financeiro} lançamentos</div>
                                        <div>
                                          {volume.quantidade_financeiro > volume.contratos.volume_financeiro_contratado
                                            ? "Ultrapassou"
                                            : "Dentro"}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-4 border-t p-3">
                                        <div>Notas fiscais / boletos</div>
                                        <div>{faixaNotasContratada(volume)}</div>
                                        <div>{volume.realizou_notas ? volume.quantidade_nf : "Não realizado"}</div>
                                        <div>
                                          {!contratoTemNotas(volume) && volume.realizou_notas
                                            ? "Extra"
                                            : volume.quantidade_nf > volume.contratos.volume_nf_contratado &&
                                              contratoTemNotas(volume)
                                            ? "Ultrapassou"
                                            : "Dentro"}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-4 border-t p-3">
                                        <div>Agendamentos</div>
                                        <div>{faixaAgendamentosContratada(volume)}</div>
                                        <div>
                                          {volume.realizou_agendamentos
                                            ? volume.quantidade_pagamentos
                                            : "Não realizado"}
                                        </div>
                                        <div>
                                          {!contratoTemPagamentos(volume) && volume.realizou_agendamentos
                                            ? "Extra"
                                            : volume.quantidade_pagamentos >
                                                volume.contratos.volume_pagamentos_contratado &&
                                              contratoTemPagamentos(volume)
                                            ? "Ultrapassou"
                                            : "Dentro"}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-4 border-t p-3">
                                        <div>Envio para contabilidade</div>
                                        <div>{contratoTemContabilidade(volume) ? "Sim" : "Não possui"}</div>
                                        <div>{volume.realizou_contabilidade ? "Sim" : "Não realizado"}</div>
                                        <div>
                                          {!contratoTemContabilidade(volume) && volume.realizou_contabilidade
                                            ? "Extra"
                                            : "Dentro"}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-4 border-t p-3">
                                        <div>Bancos</div>
                                        <div>{volume.contratos.quantidade_bancos}</div>
                                        <div>{volume.quantidade_bancos}</div>
                                        <div>
                                          {volume.quantidade_bancos > volume.contratos.quantidade_bancos
                                            ? "Ultrapassou"
                                            : "Dentro"}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-4 border-t p-3">
                                        <div>Cartões</div>
                                        <div>{volume.contratos.quantidade_cartoes}</div>
                                        <div>{volume.quantidade_cartoes}</div>
                                        <div>
                                          {volume.quantidade_cartoes > volume.contratos.quantidade_cartoes
                                            ? "Ultrapassou"
                                            : "Dentro"}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-4 border-t p-3">
                                        <div>Rotinas extras</div>
                                        <div>
                                          {rotinasContrato(volume).length === 0
                                            ? "Não possui"
                                            : rotinasContrato(volume)
                                                .map(
                                                  ([descricao, valor]) =>
                                                    `${descricao || "Rotina"} - ${formatarMoeda(Number(valor))}`
                                                )
                                                .join(" | ")}
                                        </div>
                                        <div>
                                          {rotinasRealizadas(volume).length === 0
                                            ? "Não realizado"
                                            : rotinasRealizadas(volume)
                                                .map(
                                                  ([descricao, valor]) =>
                                                    `${descricao || "Rotina"} - ${formatarMoeda(Number(valor))}`
                                                )
                                                .join(" | ")}
                                        </div>
                                        <div>
                                          {rotinasRealizadas(volume).length > rotinasContrato(volume).length
                                            ? "Extra"
                                            : "Dentro"}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-4 border-t p-3">
                                        <div>Desconto</div>
                                        <div>{formatarMoeda(volume.contratos.desconto_valor)}</div>
                                        <div>{formatarMoeda(volume.desconto_realizado)}</div>
                                        <div>Informativo</div>
                                      </div>

                                      <div className="grid grid-cols-4 border-t p-3 font-semibold">
                                        <div>Valor</div>
                                        <div>{formatarMoeda(volume.contratos.valor_contratado)}</div>
                                        <div>{formatarMoeda(volume.valor_calculado)}</div>
                                        <div>
                                          {volume.diferenca_valor > 0 ? "Ultrapassou" : "Dentro"}
                                        </div>
                                      </div>
                                    </div>

                                    <p className="mt-3">
                                      Diferença:{" "}
                                      <strong>{formatarMoeda(volume.diferenca_valor)}</strong>
                                    </p>

                                    <p>
                                      Status: <strong>{volume.status_uso}</strong>
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}