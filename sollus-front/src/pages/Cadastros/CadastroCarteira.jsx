import React, { useEffect, useState } from "react";
import Layout from "../../layouts/layout";
import "../../styles/cadastroEmpresa.css";
import { message, Select, Modal, Input, Form } from "antd"

export default function CadastroTipoLancamento() {

  const [form, setForm] = useState({
    carteira_nome: ""
  })

  const [busca, setBusca] = useState("")
  const [carteiras, setCarteiras] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanhoPagina, setTamanhoPagina] = useState(12)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [carteiraEdicao, setCarteriraEdicao] = useState(null)
  const [nomeEditando, setNomeEditando] = useState("")
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  
    function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function buscarCarteira() {
    setCarregando(true)
    try {
      const response = await fetch(
        `http://localhost:3001/carteira?page=${pagina}&limit=${tamanhoPagina}&busca=${encodeURIComponent(busca)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar tipo lancamento")
      }

      setCarteiras(data.dados ?? [])
      setTotalPaginas(data.totalPaginas ?? 1)
    } catch (error) {
      console.error("Erro ao buscar carteira:", error)
      setCarteiras([])
      message.error("Não foi possível conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarCarteira()
  }, [pagina, tamanhoPagina])

  useEffect(() => {
    setPagina(1)
    buscarCarteira()
  }, [busca])

  function handleTamanhoPaginaChange(valor) {
    setTamanhoPagina(valor)
    setPagina(1)
  }

  function abrirModalCadastro() {
    setModoEdicao(false)
    setCarteriraEdicao(null)
    setNomeEditando("")
    setModalAberto(true)
  }

  function abrirModalEdicao(carteira) {
    setModoEdicao(true)
    setCarteriraEdicao(carteira)
    setNomeEditando(carteira.carteira_nome)
    setModalAberto(true)
  }

  function handleInserirClick(e) {
    e.preventDefault()
    abrirModalCadastro()
  }

  function fecharModalEdicao() {
    setModalAberto(false)
    setModoEdicao(false)
    setCarteriraEdicao(null)
    setNomeEditando("")
  }

  async function salvarEdicao() {
    if (!nomeEditando || nomeEditando.trim() === "") {
      message.warning("O nome do Carteira não pode estar vazio.")
      return
    }

    setSalvandoEdicao(true)
    try {
      const url = modoEdicao
        ? `http://localhost:3001/carteira/${carteiraEdicao.carteira_codigo}`
        : "http://localhost:3001/carteira"
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ carteira_nome: nomeEditando.trim().toUpperCase() })
      })

      const data = await response.json()

      if (response.ok) {
        message.success(modoEdicao ? "Carteira atualizado com sucesso!" : "Carteira cadastrado com sucesso!")
        fecharModalEdicao()
        buscarCarteira()
      } else {
        message.error((modoEdicao ? "Erro ao atualizar Carteira: " : "Erro ao cadastrar Carteira: ") + data.error)
      }
    } catch (error) {
      console.error("Erro ao salvar Carteira:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  function abrirModalExcluirDoEdicao() {
    if (!CarteriraEdicao) return
    setModalExcluirAberto(true)
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false)
  }

  async function confirmarExclusao() {
    if (!CarteriraEdicao) return
    setExcluindo(true)
    try {
      const response = await fetch(`http://localhost:3001/tipo-lancamento/${CarteriraEdicao.carteira_codigo}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "Erro ao excluir Carteira")
      }

      message.success("Tipo lançamento excluído com sucesso!")
      fecharModalExcluir()
      fecharModalEdicao()
      buscarCarteira()
    } catch (error) {
      console.error("Erro ao excluir Tipo lançamento:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div className="formulario">

      {/* Tipo Lancamento */}
      <h2>Cadastro Carteira</h2>
      <form className="grupo" onSubmit={handleInserirClick}>
        <div className="campo">
          <label>Buscar Carteira</label>
          <div className="search-wrapper">
            <span className="search-icon"></span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar Carteira"
            />
            <button type="submit" className="inserir">Inserir</button>
          </div>
        </div>
      </form>

      {/* Listagem Tipos Lançamentos */}
      <div className="lista-header-controle">
        <h2>Lista de Carteiras</h2>
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

      {/* lista de Tipos Lançamentos */}
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
            ) : carteiras.length === 0 ? (
              <tr>
                <td colSpan={2} className="vazio">Nenhum Carteira cadastrado</td>
              </tr>
            ) : (
              carteiras.map((carteira) => (
                <tr
                  onDoubleClick={() => abrirModalEdicao(carteira)}
                  className="empresa-row"
                  key={String(carteira.carteira_codigo)}
                >
                  <td className="codigo">{carteira.carteira_codigo}</td>
                  <td>{carteira.carteira_nome}</td>
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
            Próximo
          </button>
        </div>
      </div>

      {/* Modal de cadastro/edição */}
      <Modal
        title={modoEdicao ? "Editar Carteira" : "Cadastrar Carteira"}
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
          Nome do Carteira
        </label>
        <Input
          value={nomeEditando}
          onChange={(e) => setNomeEditando(e.target.value)}
          placeholder="Nome do Carteira"
          onPressEnter={salvarEdicao}
        />
      </Modal>

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
        <p>Tem certeza que deseja excluir esta Carteira?</p>
      </Modal>
    </div>
  )
}