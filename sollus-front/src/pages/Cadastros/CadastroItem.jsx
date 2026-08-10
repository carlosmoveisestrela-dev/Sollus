import React, { useState, useEffect } from "react"
import { Select, Modal, Input, message } from "antd"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroItem() {

  const [form, setForm] = useState({
    item_nome: ""
  })

  const [busca, setBusca] = useState("")
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanhoPagina, setTamanhoPagina] = useState(12)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [itemEdicao, setItemEdicao] = useState(null)
  const [nomeEditando, setNomeEditando] = useState("")
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function buscarItens() {
    setCarregando(true)
    try {
      const response = await fetch(
        `http://localhost:3001/item?page=${pagina}&limit=${tamanhoPagina}&busca=${encodeURIComponent(busca)}`
      )
      const data = await response.json()
      setItens(data.dados)
      setTotalPaginas(data.totalPaginas)
    } catch (error) {
      console.error("Erro ao buscar itens:", error)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarItens()
  }, [pagina, tamanhoPagina])

  useEffect(() => {
    setPagina(1)
    buscarItens()
  }, [busca])

  function handleTamanhoPaginaChange(valor) {
    setTamanhoPagina(valor)
    setPagina(1)
  }

  const selecionadas = itens.filter(e => e.selecionada)

  function abrirModalCadastro() {
    setModoEdicao(false)
    setItemEdicao(null)
    setNomeEditando("")
    setModalAberto(true)
  }

  function abrirModalEdicao(item) {
    setModoEdicao(true)
    setItemEdicao(item)
    setNomeEditando(item.item_nome)
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
    setCategoriaEdicao(null)
    setNomeEditando("")
    setForm({ categoria_nome: "" })
  }

  async function salvarEdicao() {
    if (!nomeEditando || nomeEditando.trim() === "") {
      message.warning("O nome da categoria não pode estar vazio.")
      return
    }

    setSalvandoEdicao(true)
    try {
      const url = modoEdicao
        ? `http://localhost:3001/categoria/${categoriaEdicao.categoria_codigo}`
        : "http://localhost:3001/categoria"
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ categoria_nome: nomeEditando })
      })

      const data = await response.json()

      if (response.ok) {
        message.success(modoEdicao ? "Categoria atualizada com sucesso!" : "Categoria cadastrada com sucesso!")
        fecharModalEdicao()
        buscarCategorias()
      } else {
        message.error((modoEdicao ? "Erro ao atualizar categoria: " : "Erro ao cadastrar categoria: ") + data.error)
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  const [categoriasParaExcluir, setCategoriasParaExcluir] = useState([])

  function abrirModalExcluirDoEdicao() {
    if (!categoriaEdicao) return
    setCategoriasParaExcluir([categoriaEdicao])
    setModalExcluirAberto(true)
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false)
  }

  async function confirmarExclusaoLote() {
    setExcluindo(true)
    try {
      await Promise.all(
        itensParaExcluir.map(item =>
          fetch(`http://localhost:3001/item/${item.item_codigo}`, {
            method: "DELETE"
          })
        )
      )
      message.success("Item(s) excluído(s) com sucesso!")
      fecharModalExcluir()
      fecharModalEdicao()
      buscarItens()
    } catch (error) {
      console.error("Erro ao excluir itens:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <form className="formulario" onSubmit={handleInserirClick}>

      {/* Item */}
      <h2>Cadastro Item</h2>

      <div className="grupo">
        <div className="campo">
          <label>Buscar Item</label>
          <div className="search-wrapper">
            <span className="search-icon"></span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar Item..."
            />
            <button type="submit" className="inserir">Inserir</button>
          </div>
        </div>
      </div>

      {/* Listagem de itens */}
      <div className="lista-header-controle">
        <h2>Itens Cadastrados</h2>
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

      {/* Lista de itens */}
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
            ) : itens.length === 0 ? (
              <tr>
                <td colSpan={2} className="vazio">Nenhum item cadastrado</td>
              </tr>
            ) : (
              itens.map((item) => (
                <tr
                  onClick={() => toggleSelecao(item.item_codigo)}
                  onDoubleClick={() => abrirModalEdicao(item)}
                  className={`empresa-row${item.selecionado ? " selecionado" : ""}`}
                  key={String(item.item_codigo)}
                >
                  <td className="codigo">{item.item_codigo}</td>
                  <td>{item.item_nome}</td>
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
        title={modoEdicao ? "Editar Categoria" : "Cadastrar Categoria"}
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
          Nome Categoria
        </label>
        <Input
          value={nomeEditando}
          onChange={(e) => setNomeEditando(e.target.value)}
          placeholder="Nome da Categoria"
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
        <p>Tem certeza que deseja excluir esta categoria?</p>
      </Modal>

    </form>
  )
}