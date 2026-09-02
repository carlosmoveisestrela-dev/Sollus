import React, { useState, useEffect, useRef, useCallback } from "react"
import { Select, Modal, Input, DatePicker, message } from "antd"
import { InputMascaraDigitos } from "../components/InputMascaraDigitos"
import dayjs from "dayjs"
import Layout from "../layouts/Layout";
import "../styles/movimentoFin.css"

const API_URL = import.meta.env.VITE_API_URL

// Debounce simples para não disparar uma requisição a cada tecla digitada
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null)
  return useCallback((...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => callback(...args), delay)
  }, [callback, delay])
}

// Select genérico com busca remota, usado para Empresa/Pessoa/Tipo/Origem
function SelectBuscaRemota({ endpoint, valueKey, labelKey, value, onChange, placeholder, disabled }) {
  const [opcoes, setOpcoes] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null)

  async function buscar(texto) {
    setBuscando(true)
    try {
      const response = await fetch(
        `${API_URL}/${endpoint}?page=1&limit=20&busca=${encodeURIComponent(texto)}`
      )
      const data = await response.json()
      setOpcoes(data.dados ?? [])
    } catch (error) {
      console.error(`Erro ao buscar ${endpoint}:`, error)
      setOpcoes([])
    } finally {
      setBuscando(false)
    }
  }

  const buscarComDebounce = useDebounce(buscar, 400)

  useEffect(() => {
    if (value === null || value === undefined) {
      setOpcaoSelecionada(null)
      return
    }
    fetch(`${API_URL}/${endpoint}/${value}`)
      .then((res) => res.json())
      .then((data) => setOpcaoSelecionada(data))
      .catch(() => setOpcaoSelecionada(null))
  }, [value, endpoint])

  useEffect(() => {
    buscar("")
  }, [])

  const options = opcoes.map((item) => ({
    value: item[valueKey],
    label: item[labelKey],
  }))

  if (opcaoSelecionada && !options.some((o) => o.value === opcaoSelecionada[valueKey])) {
    options.unshift({ value: opcaoSelecionada[valueKey], label: opcaoSelecionada[labelKey] })
  }

  return (
    <Select
      style={{ width: "100%" }}
      value={value ?? undefined}
      onChange={onChange}
      onSearch={buscarComDebounce}
      placeholder={placeholder}
      disabled={disabled}
      showSearch
      filterOption={false}
      loading={buscando}
      notFoundContent={buscando ? "Buscando..." : "Nenhum resultado"}
      options={options}
    />
  )
}

export default function MovimentoFinanceiro() {

  const [buscar, setBuscar] = useState("")
  const [movimentos, setMovimentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanhoPagina, setTamanhoPagina] = useState(12)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [movimentoEdicao, setMovimentoEdicao] = useState(null)
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null)
  const [pessoaSelecionada, setPessoaSelecionada] = useState(null)
  const [tipoLancamentoSelecionado, setTipoLancamentoSelecionado] = useState(null)
  const [origemLancamentoSelecionada, setOrigemLancamentoSelecionada] = useState(null)
  const [titulo, setTitulo] = useState("")
  const [duplicata, setDuplicata] = useState("")
  const [vlrDuplicata, setVlrDuplicata] = useState(0)
  const [dtEmissao, setDtEmissao] = useState(null)
  const [dtVencimento, setDtVencimento] = useState(null)
  const [dtPagamento, setDtPagamento] = useState(null)

  async function buscarMovimentos() {
    setCarregando(true)
    try {
      const response = await fetch(
        `${API_URL}/movimentofin?page=${pagina}&limit=${tamanhoPagina}&busca=${encodeURIComponent(buscar)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar movimentos")
      }

      setMovimentos(data.dados ?? [])
      setTotalPaginas(data.totalPaginas ?? 1)
    } catch (error) {
      console.error("Erro ao buscar movimentos:", error)
      setMovimentos([])
      message.error("Não foi possível conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarMovimentos()
  }, [pagina, tamanhoPagina, buscar])

  function handleTamanhoPaginaChange(valor) {
    setTamanhoPagina(valor)
    setPagina(1)
  }

  function limparFormulario() {
    setEmpresaSelecionada(null)
    setPessoaSelecionada(null)
    setTipoLancamentoSelecionado(null)
    setOrigemLancamentoSelecionada(null)
    setTitulo("")
    setDuplicata("")
    setVlrDuplicata(0)
    setDtEmissao(null)
    setDtVencimento(null)
    setDtPagamento(null)
  }

  function abrirModalCadastro() {
    setModoEdicao(false)
    setMovimentoEdicao(null)
    limparFormulario()
    setModalAberto(true)
  }

  function abrirModalEdicao(movimento) {
    setModoEdicao(true)
    setMovimentoEdicao(movimento)
    setEmpresaSelecionada(movimento.empresa_codigo)
    setPessoaSelecionada(movimento.pessoa_codigo)
    setTipoLancamentoSelecionado(movimento.tipo_lancamento_codigo)
    setOrigemLancamentoSelecionada(movimento.origem_lancamento_codigo)
    setTitulo(movimento.titulo ?? "")
    setDuplicata(movimento.duplicata ?? "")
    setVlrDuplicata(Number(movimento.vlr_duplicata) || 0)
    setDtEmissao(movimento.dt_emissao ? dayjs(movimento.dt_emissao) : null)
    setDtVencimento(movimento.dt_vencimento ? dayjs(movimento.dt_vencimento) : null)
    setDtPagamento(movimento.dt_pagamento ? dayjs(movimento.dt_pagamento) : null)
    setModalAberto(true)
  }

  function fecharModalEdicao() {
    setModalAberto(false)
    setModoEdicao(false)
    setMovimentoEdicao(null)
    limparFormulario()
  }

  function handleInserirClick(e) {
    e.preventDefault()
    abrirModalCadastro()
  }

  function formatarNumeroBR(valor, casas) {
    if (valor === undefined || valor === null || valor === "") return ""
    return Number(valor).toLocaleString("pt-BR", {
      minimumFractionDigits: casas,
      maximumFractionDigits: casas,
    })
  }

  function criarFormatter(casas) {
    return (value) => {
      if (value === undefined || value === null || value === "") return ""
      return formatarNumeroBR(value, casas)
    }
  }

  async function salvarEdicao() {
    if (!empresaSelecionada || !pessoaSelecionada || !tipoLancamentoSelecionado || !origemLancamentoSelecionada) {
      message.error("Empresa, Pessoa, Tipo e Origem de Lançamento são obrigatórios")
      return
    }
    if (!titulo || titulo.trim() === "") {
      message.error("O Título é obrigatório")
      return
    }
    if (!duplicata || duplicata.trim() === "") {
      message.error("A Duplicata é obrigatória")
      return
    }
    if (!dtEmissao || !dtVencimento) {
      message.error("As datas de Emissão e Vencimento são obrigatórias")
      return
    }

    setSalvandoEdicao(true)
    try {
      const url = modoEdicao
        ? `${API_URL}/movimentofin/${movimentoEdicao.movimento_fin_codigo}`
        : `${API_URL}/movimentofin`
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa_codigo: empresaSelecionada,
          pessoa_codigo: pessoaSelecionada,
          tipo_lancamento_codigo: tipoLancamentoSelecionado,
          origem_lancamento_codigo: origemLancamentoSelecionada,
          titulo,
          duplicata,
          dt_emissao: dtEmissao.format("YYYY-MM-DD"),
          dt_vencimento: dtVencimento.format("YYYY-MM-DD"),
          dt_pagamento: dtPagamento ? dtPagamento.format("YYYY-MM-DD") : null,
          vlr_duplicata: vlrDuplicata,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar movimento")
      }

      message.success("Movimento salvo com sucesso")
      fecharModalEdicao()
      buscarMovimentos()
    } catch (error) {
      console.error("Erro ao salvar movimento:", error)
      message.error(error.message || "Não foi possível salvar o movimento")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  function abrirModalExcluirDoEdicao() {
    if (!movimentoEdicao) return
    setModalExcluirAberto(true)
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false)
  }

  async function confirmarExclusao() {
    if (!movimentoEdicao) return
    setExcluindo(true)
    try {
      await fetch(`${API_URL}/movimentofin/${movimentoEdicao.movimento_fin_codigo}`, {
        method: "DELETE",
      })
      message.success("Movimento excluído com sucesso")
      fecharModalExcluir()
      fecharModalEdicao()
      buscarMovimentos()
    } catch (error) {
      console.error("Erro ao excluir movimento:", error)
      message.error("Não foi possível excluir o movimento")
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <form className="formulario" onSubmit={handleInserirClick}>

      {/* Movimento Financeiro */}
      <h2>Movimento Financeiro</h2>
      <div className="grupo">
        <div className="campo">
          <label>Buscar Movimento Financeiro</label>
          <div className="search-wrapper">
            <span className="search-icon"></span>
            <input
              type="text"
              placeholder="Digite o título..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
            />
            <button type="submit" className="inserir">Inserir</button>
          </div>
        </div>
      </div>

      <div className="lista-header-controle">
        <h2>Movimentos Realizados</h2>
        <div className="seletor-tamanho">
          <label>Itens por página:</label>
          <Select
            value={tamanhoPagina}
            onChange={handleTamanhoPaginaChange}
            options={[
              { value: 12, label: "12" },
              { value: 20, label: "20" },
              { value: 50, label: "50" },
              { value: 100, label: "100" },
            ]}
            style={{ width: 80 }}
          />
        </div>
      </div>

      <div className="lista-empresas">
        <table>
          <thead>
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Empresa</th>
              <th scope="col">Pessoa</th>
              <th scope="col">Tipo Lançamento</th>
              <th scope="col">Origem Lançamento</th>
              <th scope="col">Dt.Lançamento</th>
              <th scope="col">Título</th>
              <th scope="col">Duplicata</th>
              <th scope="col">Valor Duplicata</th>
              <th scope="col">Dt.Emissão</th>
              <th scope="col">Dt.Vencimento</th>
              <th scope="col">Dt.Pagamento</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={11} className="vazio">Carregando...</td>
              </tr>
            ) : movimentos.length === 0 ? (
              <tr>
                <td colSpan={11} className="vazio">Nenhum Movimento Cadastrado</td>
              </tr>
            ) : (
              movimentos.map((mov) => (
                <tr
                  onDoubleClick={() => abrirModalEdicao(mov)}
                  className="empresa-row"
                  key={String(mov.movimento_fin_codigo)}
                >
                  <td className="codigo">{mov.movimento_fin_codigo}</td>
                  <td>{mov.empresa_nome}</td>
                  <td>{mov.pessoa_nome}</td>
                  <td>{mov.tipo_lancamento_nome}</td>
                  <td>{mov.origem_lancamento_nome}</td>
                  <td>{mov.dt_lancamento ? dayjs(mov.dt_lancamento).format("DD/MM/YYYY HH:mm") : ""}</td>
                  <td>{mov.titulo}</td>
                  <td>{mov.duplicata}</td>
                  <td>{mov.vlr_duplicata? Number(mov.vlr_duplicata).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : ""}</td>
                  <td>{mov.dt_emissao ? dayjs(mov.dt_emissao).format("DD/MM/YYYY") : ""}</td>
                  <td>{mov.dt_vencimento ? dayjs(mov.dt_vencimento).format("DD/MM/YYYY") : ""}</td>
                  <td>{mov.dt_pagamento ? dayjs(mov.dt_pagamento).format("DD/MM/YYYY") : ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="paginacao">
          <button
            type="button"
            disabled={pagina === 1}
            onClick={() => setPagina(p => p - 1)}
          >
            Anterior
          </button>

          <span>Página {pagina} de {totalPaginas}</span>

          <button
            type="button"
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(p => p + 1)}
          >
            Próxima
          </button>
        </div>
      </div>

      {/* Modal de cadastro/edição */}
      <Modal
        title={modoEdicao ? "Editar Movimento Financeiro" : "Cadastrar Movimento Financeiro"}
        open={modalAberto}
        onCancel={fecharModalEdicao}
        onOk={salvarEdicao}
        okText={salvandoEdicao ? "Salvando..." : "Salvar"}
        cancelText="Cancelar"
        confirmLoading={salvandoEdicao}
        width={640}
        footer={(_, { CancelBtn, OkBtn }) => (
          <div style={{ display: "flex", justifyContent: modoEdicao ? "space-between" : "flex-end", alignItems: "center" }}>
            {modoEdicao && (
              <button
                type="button"
                className="excluir"
                onClick={abrirModalExcluirDoEdicao}
              >
                Excluir
              </button>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <CancelBtn />
              <OkBtn />
            </div>
          </div>
        )}
      >
        <div className="linha-modal">
          <div className="campo-modal">
            <label>Empresa</label>
            <SelectBuscaRemota
              endpoint="empresa"
              valueKey="empresa_codigo"
              labelKey="empresa_nome"
              value={empresaSelecionada}
              onChange={setEmpresaSelecionada}
              placeholder="Selecione a empresa"
            />
          </div>

          <div className="campo-modal">
            <label>Pessoa</label>
            <SelectBuscaRemota
              endpoint="pessoa"
              valueKey="pessoa_codigo"
              labelKey="pessoa_nome"
              value={pessoaSelecionada}
              onChange={setPessoaSelecionada}
              placeholder="Selecione a pessoa"
            />
          </div>
        </div>

        <div className="linha-modal">
          <div className="campo-modal">
            <label>Tipo de Lançamento</label>
            <SelectBuscaRemota
              endpoint="tipo-lancamento"
              valueKey="tipo_lancamento_codigo"
              labelKey="tipo_lancamento_nome"
              value={tipoLancamentoSelecionado}
              onChange={setTipoLancamentoSelecionado}
              placeholder="Selecione o tipo"
            />
          </div>

          <div className="campo-modal">
            <label>Origem de Lançamento</label>
            <SelectBuscaRemota
              endpoint="origem-lancamento"
              valueKey="origem_lancamento_codigo"
              labelKey="origem_lancamento_nome"
              value={origemLancamentoSelecionada}
              onChange={setOrigemLancamentoSelecionada}
              placeholder="Selecione a origem"
            />
          </div>
        </div>

        <div className="linha-modal">
          <div className="campo-modal">
            <label>Título</label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título"
            />
          </div>

          <div className="campo-modal">
            <label>Duplicata</label>
            <Input
              value={duplicata}
              onChange={(e) => setDuplicata(e.target.value)}
              placeholder="Duplicata"
            />
          </div>

          <div className="campo-modal">
            <label>Valor Duplicata</label>
            <InputMascaraDigitos
              style={{ width: "100%" }}
              value={vlrDuplicata}
              onChange={(valor) => setVlrDuplicata(valor ?? 0)}
              casas={2}
              placeholder="0,00"
            />
          </div>
        </div>

        <div className="linha-modal linha-modal--3col">
          <div className="campo-modal">
            <label>Dt. Emissão</label>
            <DatePicker
              style={{ width: "100%" }}
              value={dtEmissao}
              onChange={setDtEmissao}
              format="DD/MM/YYYY"
              placeholder="Emissão"
            />
          </div>

          <div className="campo-modal">
            <label>Dt. Vencimento</label>
            <DatePicker
              style={{ width: "100%" }}
              value={dtVencimento}
              onChange={setDtVencimento}
              format="DD/MM/YYYY"
              placeholder="Vencimento"
            />
          </div>

          <div className="campo-modal">
            <label>Dt. Pagamento</label>
            <DatePicker
              style={{ width: "100%" }}
              value={dtPagamento}
              onChange={setDtPagamento}
              format="DD/MM/YYYY"
              placeholder="Pagamento"
            />
          </div>
        </div>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        title="Confirmação"
        open={modalExcluirAberto}
        onCancel={fecharModalExcluir}
        onOk={confirmarExclusao}
        okText="Excluir"
        cancelText="Cancelar"
        confirmLoading={excluindo}
        okButtonProps={{ danger: true }}
      >
        <p>Tem certeza que deseja excluir este movimento financeiro?</p>
      </Modal>

    </form>
  )
}