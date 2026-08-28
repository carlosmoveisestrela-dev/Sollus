import React, { useState, useEffect } from "react"
import { Select, Modal, Input, message } from "antd"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

const API_URL = import.meta.env.VITE_API_URL

export default function CadastroEventoLancamento() {

  const [form, setForm] = useState({
    evento_lancamento_nome: ""
  })

  const [busca, setBusca] = useState("")
  const [eventosLancamento, setEventosLancamento] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanhoPagina, setTamanhoPagina] = useState(12)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [eventoEdicao, setEventoEdicao] = useState(null)
  const [nomeEditando, setNomeEditando] = useState("")
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function buscarEventosLancamento() {
    setCarregando(true)
    try {
      const response = await fetch(
        `${API_URL}/evento-lancamento?page=${pagina}&limit=${tamanhoPagina}&busca=${encodeURIComponent(busca)}`
      )
      const data = await response.json()
      setEventosLancamento(data.dados)
      setTotalPaginas(data.totalPaginas)
    } catch (error) {
      console.error("Erro ao buscar eventos de lancamento:", error)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarEventosLancamento()
  }, [pagina, tamanhoPagina])

  useEffect(() => {
    setPagina(1)
    buscarEventosLancamento()
  }, [busca])

  function handleTamanhoPaginaChange(valor) {
    setTamanhoPagina(valor)
    setPagina(1)
  }

  const selecionadas = eventosLancamento.filter(e => e.selecionada)

  function abrirModalCadastro() {
    setModoEdicao(false)
    setEventoEdicao(null)
    setNomeEditando("")
    setModalAberto(true)
  }

  function abrirModalEdicao(evento) {
    setModoEdicao(true)
    setEventoEdicao(evento)
    setNomeEditando(evento.evento_lancamento_nome)
    setModalAberto(true)
  }

  function handleInserirClick(e) {
    e.preventDefault()
    if (selecionadas.length === 1) {
      abrirModalEdicao(selecionadas[0])
    } else {
      abrirModalCadastro()
    }
  }

  function fecharModalEdicao() {
    setModalAberto(false)
    setModoEdicao(false)
    setEventoEdicao(null)
    setNomeEditando("")
    setForm({ evento_lancamento_nome: "" })
  }

  async function salvarEdicao() {
    if (!nomeEditando || nomeEditando.trim() === "") {
      message.warning("O nome do evento de lançamento não pode estar vazio.")
      return
    }

    setSalvandoEdicao(true)
    try {
      const url = modoEdicao
        ? `${API_URL}/evento-lancamento/${eventoEdicao.evento_lancamento_codigo}`
        : `${API_URL}/evento-lancamento`
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ evento_lancamento_nome: nomeEditando })
      })

      const data = await response.json()

      if (response.ok) {
        message.success(modoEdicao ? "Evento de Lançamento atualizado com sucesso!" : "Evento de Lançamento cadastrado com sucesso!")
        fecharModalEdicao()
        buscarEventosLancamento()
      } else {
        message.error((modoEdicao ? "Erro ao atualizar evento de lançamento: " : "Erro ao cadastrar evento de lançamento: ") + data.error)
      }
    } catch (error) {
      console.error("Erro ao salvar evento de lançamento:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  const [itensParaExcluir, setItensParaExcluir] = useState([])

  function abrirModalExcluirDoEdicao() {
    if (!eventoEdicao) return
    setItensParaExcluir([eventoEdicao])
    setModalExcluirAberto(true)
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false)
  }

  async function confirmarExclusaoLote() {
    setExcluindo(true)
    try {
      await Promise.all(
        itensParaExcluir.map(evento =>
          fetch(`${API_URL}/evento-lancamento/${evento.evento_lancamento_codigo}`, {
            method: "DELETE"
          })
        )
      )
      message.success("Evento(s) de Lançamento excluído(s) com sucesso!")
      fecharModalExcluir()
      fecharModalEdicao()
      buscarEventosLancamento()
    } catch (error) {
      console.error("Erro ao excluir eventos de lançamento:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <form className="formulario" onSubmit={handleInserirClick}>

      {/* Evento de Lançamento */}
      <h2>Cadastro Evento de Lançamento</h2>

      <div className="grupo">
        <div className="campo">
          <label>Buscar Evento de Lançamento</label>
          <div className="search-wrapper">
            <span className="search-icon"></span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar Evento de Lançamento..."
            />
            <button type="submit" className="inserir">Inserir</button>
          </div>
        </div>
      </div>

      {/* Listagem de eventos de lançamento */}
      <div className="lista-header-controle">
        <h2>Eventos de Lançamento Cadastrados</h2>
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

      {/* Lista de eventos de lançamento */}
      <div className="lista-empresas">
        <table>
          <thead>
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Nome</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={2} className="vazio">Carregando...</td>
              </tr>
            ) : eventosLancamento.length === 0 ? (
              <tr>
                <td colSpan={2} className="vazio">Nenhum evento de lançamento cadastrado</td>
              </tr>
            ) : (
              eventosLancamento.map((evento) => (
                <tr
                  onClick={() => toggleSelecao(evento.evento_lancamento_codigo)}
                  onDoubleClick={() => abrirModalEdicao(evento)}
                  className={`empresa-row${evento.selecionado ? " selecionado" : ""}`}
                  key={String(evento.evento_lancamento_codigo)}
                >
                  <td className="codigo">{evento.evento_lancamento_codigo}</td>
                  <td>{evento.evento_lancamento_nome}</td>
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
        title={modoEdicao ? "Editar Evento de Lançamento" : "Cadastrar Evento de Lançamento"}
        open={modalAberto}
        onCancel={fecharModalEdicao}
        onOk={salvarEdicao}
        okText={salvandoEdicao ? "Salvando..." : "Salvar"}
        cancelText="Cancelar"
        confirmLoading={salvandoEdicao}
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
        <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 5 }}>
          Nome do Evento de Lançamento
        </label>
        <Input
          value={nomeEditando}
          onChange={(e) => setNomeEditando(e.target.value)}
          placeholder="Nome do evento de lançamento"
          onPressEnter={salvarEdicao}
        />
      </Modal>

      {/* Modal de confirmação de exclusão em lote */}
      <Modal
        title="Confirmação"
        open={modalExcluirAberto}
        onCancel={fecharModalExcluir}
        onOk={confirmarExclusaoLote}
        okText="Excluir"
        cancelText="Cancelar"
        confirmLoading={excluindo}
        okButtonProps={{ danger: true }}
      >
        <p>Tem certeza que deseja excluir este evento de lançamento?</p>
      </Modal>

    </form>
  )
}