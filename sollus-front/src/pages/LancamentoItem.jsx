import React, { useState, useEffect, useRef, useCallback } from "react"
import { Select, Modal, Input, InputNumber, message } from "antd"
import { InputMascaraDigitos } from "../components/InputMascaraDigitos"
import Layout from "../layouts/Layout";
import "../styles/lancamentoItem.css"

const API_URL = import.meta.env.VITE_API_URL

function useDebounce(callback, delay) {
  const timeoutRef = useRef(null)
  return useCallback((...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => callback(...args), delay)
  }, [callback, delay])
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

function parserNumeroBR(value) {
  if (value === undefined || value === null || value === "") return 0
  const texto = String(value).trim()
  if (texto.includes(",")) {
    return texto.replace(/\./g, "").replace(",", ".")
  }
  return texto
}

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

export default function LancamentoItem() {

  const [buscar, setBuscar] = useState("")
  const [lancamentos, setLancamentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanhoPagina, setTamanhoPagina] = useState(12)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [lancamentoEdicao, setLancamentoEdicao] = useState(null)
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  const [undNegCodigo, setUndNegCodigo] = useState(null)
  const [pessoaCodigo, setPessoaCodigo] = useState(null)
  const [titulo, setTitulo] = useState("")
  const [itemCodigo, setItemCodigo] = useState(null)
  const [centroCustoCodigo, setCentroCustoCodigo] = useState(null)
  const [tipoCustoCodigo, setTipoCustoCodigo] = useState(null)
  const [eventoLancamentoCodigo, setEventoLancamentoCodigo] = useState(null)
  const [observacao, setObservacao] = useState("")
  const [quant, setQuant] = useState(0)
  const [vlrUnit, setVlrUnit] = useState(0)
  const [vlrFrete, setVlrFrete] = useState(0)

  const vlrTotal = Number(quant || 0) * (Number(vlrUnit || 0) + Number(vlrFrete || 0))

  async function buscarLancamentos() {
    setCarregando(true)
    try {
      const response = await fetch(
        `${API_URL}/lancamento-item?page=${pagina}&limit=${tamanhoPagina}&busca=${encodeURIComponent(buscar)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar lançamentos")
      }

      setLancamentos(data.dados ?? [])
      setTotalPaginas(data.totalPaginas ?? 1)
    } catch (error) {
      console.error("Erro ao buscar lançamentos:", error)
      setLancamentos([])
      message.error("Não foi possível conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarLancamentos()

  }, [pagina, tamanhoPagina])

  useEffect(() => {
    setPagina(1)
    buscarLancamentos()
  }, [buscar])

  function handleTamanhoPaginaChange(valor) {
    setTamanhoPagina(valor)
    setPagina(1)
  }

  function limparFormulario() {
    setUndNegCodigo(null)
    setPessoaCodigo(null)
    setTitulo("")
    setItemCodigo(null)
    setCentroCustoCodigo(null)
    setTipoCustoCodigo(null)
    setEventoLancamentoCodigo(null)
    setObservacao("")
    setQuant(0)
    setVlrUnit(0)
    setVlrFrete(0)
  }

  function abrirModalCadastro() {
    setModoEdicao(false)
    setLancamentoEdicao(null)
    limparFormulario()
    setModalAberto(true)
  }

  function abrirModalEdicao(lancamento) {
    setModoEdicao(true)
    setLancamentoEdicao(lancamento)
    setUndNegCodigo(lancamento.und_neg_codigo)
    setPessoaCodigo(lancamento.pessoa_codigo)
    setTitulo(lancamento.titulo ?? "")
    setItemCodigo(lancamento.item_codigo)
    setCentroCustoCodigo(lancamento.centro_custo_codigo)
    setTipoCustoCodigo(lancamento.tipo_custo_codigo)
    setEventoLancamentoCodigo(lancamento.evento_lancamento_codigo)
    setObservacao(lancamento.observacao_lancamento ?? "")
    setQuant(Number(lancamento.quant) || 0)
    setVlrUnit(Number(lancamento.vlr_unit) || 0)
    setVlrFrete(Number(lancamento.vlr_frete_unitario) || 0)
    setModalAberto(true)
  }

  function fecharModalEdicao() {
    setModalAberto(false)
    setModoEdicao(false)
    setLancamentoEdicao(null)
    limparFormulario()
  }

  function handleInserirClick(e) {
    e.preventDefault()
    abrirModalCadastro()
  }

  async function salvarEdicao() {
    if (!undNegCodigo || !pessoaCodigo || !itemCodigo || !centroCustoCodigo || !tipoCustoCodigo || !eventoLancamentoCodigo) {
      message.error("Und. Negócio, Pessoa, Item, Centro de Custo, Tipo de Custo e Evento de Lançamento são obrigatórios")
      return
    }
    if (!titulo || titulo.trim() === "") {
      message.error("O Título é obrigatório")
      return
    }
    if (!quant || quant <= 0) {
      message.error("A Quantidade deve ser maior que zero")
      return
    }
    if (vlrUnit === null || vlrUnit === undefined || vlrUnit < 0) {
      message.error("O Valor Unitário é obrigatório")
      return
    }

    setSalvandoEdicao(true)
    try {
      const url = modoEdicao
        ? `${API_URL}/lancamento-item/${lancamentoEdicao.lancamento_item_codigo}`
        : `${API_URL}/lancamento-item`
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          und_neg_codigo: undNegCodigo,
          pessoa_codigo: pessoaCodigo,
          titulo,
          item_codigo: itemCodigo,
          centro_custo_codigo: centroCustoCodigo,
          tipo_custo_codigo: tipoCustoCodigo,
          evento_lancamento_codigo: eventoLancamentoCodigo,
          observacao_lancamento: observacao,
          quant,
          vlr_unit: vlrUnit,
          vlr_frete_unitario: vlrFrete,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar lançamento")
      }

      message.success("Lançamento salvo com sucesso")
      fecharModalEdicao()
      buscarLancamentos()
    } catch (error) {
      console.error("Erro ao salvar lançamento:", error)
      message.error(error.message || "Não foi possível salvar o lançamento")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  function abrirModalExcluirDoEdicao() {
    if (!lancamentoEdicao) return
    setModalExcluirAberto(true)
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false)
  }

  async function confirmarExclusao() {
    if (!lancamentoEdicao) return
    setExcluindo(true)
    try {
      await fetch(`${API_URL}/lancamento-item/${lancamentoEdicao.lancamento_item_codigo}`, {
        method: "DELETE",
      })
      message.success("Lançamento excluído com sucesso")
      fecharModalExcluir()
      fecharModalEdicao()
      buscarLancamentos()
    } catch (error) {
      console.error("Erro ao excluir lançamento:", error)
      message.error("Não foi possível excluir o lançamento")
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <form className="formulario" onSubmit={handleInserirClick}>

      <h2>Lançamento Item</h2>
      <div className="grupo">
        <div className="campo">
          <label>Buscar Lançamento Item</label>
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
        <h2>Lançamentos Realizados</h2>
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
              <th scope="col">Und. Negócio</th>
              <th scope="col">Pessoa</th>
              <th scope="col">Título</th>
              <th scope="col">Item</th>
              <th scope="col">Centro Custo</th>
              <th scope="col">Tipo Custo</th>
              <th scope="col">Evento Lançamento</th>
              <th scope="col">Quant.</th>
              <th scope="col">Vlr. Unit.</th>
              <th scope="col">Vlr. Frete</th>
              <th scope="col">Vlr. Total</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={12} className="vazio">Carregando...</td>
              </tr>
            ) : lancamentos.length === 0 ? (
              <tr>
                <td colSpan={12} className="vazio">Nenhum Lançamento Cadastrado</td>
              </tr>
            ) : (
              lancamentos.map((lan) => (
                <tr
                  onDoubleClick={() => abrirModalEdicao(lan)}
                  className="empresa-row"
                  key={String(lan.lancamento_item_codigo)}
                >
                  <td className="codigo">{lan.lancamento_item_codigo}</td>
                  <td>{lan.und_neg_nome}</td>
                  <td>{lan.pessoa_nome}</td>
                  <td>{lan.titulo}</td>
                  <td>{lan.item_nome}</td>
                  <td>{lan.centro_custo_nome}</td>
                  <td>{lan.tipo_custo_nome}</td>
                  <td>{lan.evento_lancamento_nome}</td>
                  <td>{formatarNumeroBR(lan.quant, 4)}</td>
                  <td>{formatarNumeroBR(lan.vlr_unit, 4)}</td>
                  <td>{formatarNumeroBR(lan.vlr_frete_unitario, 4)}</td>
                  <td>{formatarNumeroBR(lan.vlr_total, 2)}</td>
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
        title={modoEdicao ? "Editar Lançamento Item" : "Cadastrar Lançamento Item"}
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
            <label>Unidade de Negócio</label>
            <SelectBuscaRemota
              endpoint="uni-negocio"
              valueKey="und_neg_codigo"
              labelKey="und_neg_nome"
              value={undNegCodigo}
              onChange={setUndNegCodigo}
              placeholder="Selecione a unidade de negócio"
            />
          </div>

          <div className="campo-modal">
            <label>Pessoa</label>
            <SelectBuscaRemota
              endpoint="pessoa"
              valueKey="pessoa_codigo"
              labelKey="pessoa_nome"
              value={pessoaCodigo}
              onChange={setPessoaCodigo}
              placeholder="Selecione a pessoa"
            />
          </div>
        </div>

        <div className="linha-modal">
          <div className="campo-modal">
            <label>Título</label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Deve bater com o título de um Movimento"
            />
          </div>

          <div className="campo-modal">
            <label>Item</label>
            <SelectBuscaRemota
              endpoint="item"
              valueKey="item_codigo"
              labelKey="item_nome"
              value={itemCodigo}
              onChange={setItemCodigo}
              placeholder="Selecione o item"
            />
          </div>
        </div>

        <div className="linha-modal">
          <div className="campo-modal">
            <label>Centro de Custo</label>
            <SelectBuscaRemota
              endpoint="centro-custo"
              valueKey="centro_custo_codigo"
              labelKey="centro_custo_nome"
              value={centroCustoCodigo}
              onChange={setCentroCustoCodigo}
              placeholder="Selecione o centro de custo"
            />
          </div>

          <div className="campo-modal">
            <label>Tipo de Custo</label>
            <SelectBuscaRemota
              endpoint="tipo-custo"
              valueKey="tipo_custo_codigo"
              labelKey="tipo_custo_nome"
              value={tipoCustoCodigo}
              onChange={setTipoCustoCodigo}
              placeholder="Selecione o tipo de custo"
            />
          </div>
        </div>

        <div className="linha-modal">
          <div className="campo-modal">
            <label>Evento de Lançamento</label>
            <SelectBuscaRemota
              endpoint="evento-lancamento"
              valueKey="evento_lancamento_codigo"
              labelKey="evento_lancamento_nome"
              value={eventoLancamentoCodigo}
              onChange={setEventoLancamentoCodigo}
              placeholder="Selecione o evento"
            />
          </div>

          <div className="campo-modal">
            <label>Observação</label>
            <Input
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Observação (opcional)"
            />
          </div>
        </div>

        <div className="linha-modal linha-modal--3col">
          <div className="campo-modal">
            <label>Quantidade</label>
            <InputMascaraDigitos
              style={{ width: "100%" }}
              value={quant}
              onChange={setQuant}
              casas={4}
              placeholder="0,0000"
            />
          </div>

          <div className="campo-modal">
            <label>Valor Unitário</label>
            <InputMascaraDigitos
              style={{ width: "100%" }}
              value={vlrUnit}
              onChange={setVlrUnit}
              casas={4}
              placeholder="0,0000"
            />
          </div>

          <div className="campo-modal">
            <label>Frete Unitário</label>
            <InputMascaraDigitos
              style={{ width: "100%" }}
              value={vlrFrete}
              onChange={setVlrFrete}
              casas={4}
              placeholder="0,0000"
            />
          </div>
        </div>

        <div className="linha-modal">
          <div className="campo-modal">
            <label>Valor Total (calculado)</label>
            <InputNumber
              style={{ width: "100%" }}
              value={vlrTotal}
              disabled
              precision={2}
              decimalSeparator=","
              formatter={criarFormatter(2)}
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
        <p>Tem certeza que deseja excluir este lançamento?</p>
      </Modal>

    </form>
  )
}