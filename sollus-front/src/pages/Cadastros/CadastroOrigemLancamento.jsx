import React, { useEffect, useState } from "react";
import Layout from "../../layouts/layout";
import "../../styles/cadastroEmpresa.css";
import { message, Select, Modal, Input, Form } from "antd"

export default function CadastroOrigemLancamento() {

  const [form, setForm] = useState({
    origem_lancamento_nome: ""
  })

  const [busca, setBusca] = useState("")
  const [origemLancamentos, setOrigemLancamentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanhoPagina, setTamanhoPagina] = useState(12)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [lancamentoEdicao, setLancamentoEdicao] = useState(null)
  const [nomeEditando, setNomeEditando] = useState("")
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function buscarOrigemLancamento() {
    setCarregando(true)
    try {
      const response = await fetch(
        `http://localhost:3001/origem-lancamento?page=${pagina}&limit=${tamanhoPagina}&busca=${encodeURIComponent(busca)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar origem lancamento")
      }

      setOrigemLancamentos(data.dados ?? [])
      setTotalPaginas(data.totalPaginas ?? 1)
    } catch (error) {
      console.error("Erro ao buscar origem do lancamento:", error)
      setOrigemLancamentos([])
      message.error("Não foi possível conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarOrigemLancamento()
  }, [pagina, tamanhoPagina])

  useEffect(() => {
    setPagina(1)
    buscarOrigemLancamento()
  }, [busca])

  function handleTamanhoPaginaChange(valor) {
    setTamanhoPagina(valor)
    setPagina(1)
  }

  const selecionadas = origemLancamentos.filter(e => e.selecionada)

  function abrirModalCadastro() {
    setModoEdicao(false)
    setLancamentoEdicao(null)
    setNomeEditando("")
    setModalAberto(true)
  }

  function abrirModalEdicao(origemLancamento) {
    setModoEdicao(true)
    setLancamentoEdicao(origemLancamento)
    setNomeEditando(origemLancamento.origem_lancamento_nome)
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
    setLancamentoEdicao(null)
    setNomeEditando("")
    setForm({ origem_lancamento_nome: "" })
  }

  async function salvarEdicao() {
    if (!nomeEditando || nomeEditando.trim() === "") {
      message.warning("O nome da origem do lancamento não pode estar vazio.")
      return
    }

    setSalvandoEdicao(true)
    try {
      const url = modoEdicao
        ? `http://localhost:3001/origem-lancamento/${lancamentoEdicao.origem_lancamento_codigo}`
        : "http://localhost:3001/origem-lancamento"
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ origem_lancamento_nome: nomeEditando })
      })

      const data = await response.json()

      if (response.ok) {
        message.success(modoEdicao ? "Origem Lançamento atualizada com sucesso!" : "Origem Lançamento cadastrada com sucesso!")
        fecharModalEdicao()
        buscarOrigemLancamento()
      } else {
        message.error((modoEdicao ? "Erro ao atualizar origem lançamento: " : "Erro ao cadastrar origem lançamento: ") + data.error)
      }
    } catch (error) {
      console.error("Erro ao salvar origem lançamento:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  const [empresasParaExcluir, setEmpresasParaExcluir] = useState([])

  function abrirModalExcluirDoEdicao() {
    if (!lancamentoEdicao) return
    setEmpresasParaExcluir([lancamentoEdicao])
    setModalExcluirAberto(true)
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false)
  }

  async function confirmarExclusaoLote() {
    setExcluindo(true)
    try {
      await Promise.all(
        empresasParaExcluir.map(origemLancamento =>
          fetch(`http://localhost:3001/origem-lancamento/${origemLancamento.origem_lancamento_codigo}`, {
            method: "DELETE"
          })
        )
      )
      message.success("Origem Lancamento excluída com sucesso!")
      fecharModalExcluir()
      fecharModalEdicao()
      buscarOrigemLancamento()
    } catch (error) {
      console.error("Erro ao excluir origem lancamento:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <form className="formulario" onSubmit={handleInserirClick}>

      {/* Empresa */}
      <h2>Cadastro Origem Lançamento</h2>

      <div className="grupo">
        <div className="campo">
          <label>Buscar Origem Lançamento</label>
          <div className="search-wrapper">
            <span className="search-icon"></span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar Origem Lançamento..."
            />
            <button type="submit" className="inserir">Inserir</button>
          </div>
        </div>
      </div>

      {/* Listagem de empresas */}
      <div className="lista-header-controle">
        <h2>Origem Lançamento Cadastradas</h2>
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

      {/* Lista de empresas */}
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
            ) : origemLancamentos.length === 0 ? (
              <tr>
                <td colSpan={2} className="vazio">Nenhuma origem lançamento cadastrada</td>
              </tr>
            ) : (
              origemLancamentos.map((origemLancamento) => (
                <tr
                  onClick={() => toggleSelecao(origemLancamento.origem_lancamento_codigo)}
                  onDoubleClick={() => abrirModalEdicao(origemLancamento)}
                  className={`empresa-row${origemLancamento.selecionada ? " selecionada" : ""}`}
                  key={String(origemLancamento.origem_lancamento_codigo)}
                >
                  <td className="codigo">{origemLancamento.origem_lancamento_codigo}</td>
                  <td>{origemLancamento.origem_lancamento_nome}</td>
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
        title={modoEdicao ? "Editar Origem Lançamento" : "Cadastrar Origem Lançamento"}
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
          Nome Origem Lançamento
        </label>
        <Input
          value={nomeEditando}
          onChange={(e) => setNomeEditando(e.target.value)}
          placeholder="Nome da Empresa"
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
        <p>Tem certeza que deseja excluir esta Origem Lançamento?</p>
      </Modal>

    </form>
  )
}