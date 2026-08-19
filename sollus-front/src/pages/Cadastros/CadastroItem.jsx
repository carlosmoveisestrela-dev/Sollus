import React, { useState, useEffect } from "react"
import { Select, Modal, Input, message } from "antd"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroItem.css"

export default function CadastroItem() {

  const [busca, setBusca] = useState("")
  const [itens, setItens] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanhoPagina, setTamanhoPagina] = useState(12)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [itemEdicao, setItemEdicao] = useState(null)
  const [nomeEditando, setNomeEditando] = useState("")
  const [undEditando, setUndEditando] = useState("")
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  async function buscarItens() {
    setCarregando(true)
    try {
      const response = await fetch(
        `http://localhost:3001/item?page=${pagina}&limit=${tamanhoPagina}&busca=${encodeURIComponent(busca)}`
      )
      const data = await response.json()
      setItens(data.dados ?? [])
      setTotalPaginas(data.totalPaginas ?? 1)
    } catch (error) {
      console.error("Erro ao buscar itens:", error)
      setItens([])
      message.error("Não foi possível conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  // Busca a lista de categorias só quando o modal abre, para popular o select
  useEffect(() => {
    if (modalAberto) {
      fetch("http://localhost:3001/categoria?limit=1000")
        .then((res) => res.json())
        .then((data) => setCategorias(data.dados ?? []))
        .catch((error) => {
          console.error("Erro ao buscar categorias:", error)
          setCategorias([])
          message.error("Não foi possível carregar as categorias")
        })
    }
  }, [modalAberto])

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

  function abrirModalCadastro() {
    setModoEdicao(false)
    setItemEdicao(null)
    setNomeEditando("")
    setUndEditando("")
    setCategoriaSelecionada(null)
    setModalAberto(true)
  }

  function abrirModalEdicao(item) {
    setModoEdicao(true)
    setItemEdicao(item)
    setNomeEditando(item.item_nome)
    setUndEditando(item.item_und ?? "")
    setCategoriaSelecionada(item.categoria_codigo ?? null)
    setModalAberto(true)
  }

  function handleInserirClick(e) {
    e.preventDefault()
    abrirModalCadastro()
  }

  function fecharModalEdicao() {
    setModalAberto(false)
    setModoEdicao(false)
    setItemEdicao(null)
    setNomeEditando("")
    setUndEditando("")
    setCategoriaSelecionada(null)
  }

  async function salvarEdicao() {
    if (!nomeEditando || nomeEditando.trim() === "") {
      message.warning("O nome do item não pode estar vazio.")
      return
    }

    if (!undEditando || undEditando.trim() === "") {
      message.warning("A unidade do item não pode estar vazia.")
      return
    }

    if (!categoriaSelecionada) {
      message.warning("Selecione uma categoria.")
      return
    }

    setSalvandoEdicao(true)
    try {
      const url = modoEdicao
        ? `http://localhost:3001/item/${itemEdicao.item_codigo}`
        : "http://localhost:3001/item"
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          item_nome: nomeEditando,
          item_und: undEditando,
          categoria_codigo: categoriaSelecionada
        })
      })

      const data = await response.json()

      if (response.ok) {
        message.success(modoEdicao ? "Item atualizado com sucesso!" : "Item cadastrado com sucesso!")
        fecharModalEdicao()
        buscarItens()
      } else {
        message.error((modoEdicao ? "Erro ao atualizar item: " : "Erro ao cadastrar item: ") + data.error)
      }
    } catch (error) {
      console.error("Erro ao salvar item:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  function abrirModalExcluirDoEdicao() {
    if (!itemEdicao) return
    setModalExcluirAberto(true)
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false)
  }

  async function confirmarExclusao() {
    if (!itemEdicao) return
    setExcluindo(true)
    try {
      await fetch(`http://localhost:3001/item/${itemEdicao.item_codigo}`, {
        method: "DELETE"
      })
      message.success("Item excluído com sucesso!")
      fecharModalExcluir()
      fecharModalEdicao()
      buscarItens()
    } catch (error) {
      console.error("Erro ao excluir item:", error)
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
              <th scope="col">Unidade</th>
              <th scope="col">Categoria</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={4} className="vazio">Carregando...</td>
              </tr>
            ) : itens.length === 0 ? (
              <tr>
                <td colSpan={4} className="vazio">Nenhum item cadastrado</td>
              </tr>
            ) : (
              itens.map((item) => (
                <tr
                  onDoubleClick={() => abrirModalEdicao(item)}
                  className="empresa-row"
                  key={String(item.item_codigo)}
                >
                  <td className="codigo">{item.item_codigo}</td>
                  <td>{item.item_nome}</td>
                  <td>{item.item_und}</td>
                  <td>{item.categoria_nome}</td>
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
        title={modoEdicao ? "Editar Item" : "Cadastrar Item"}
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
          Nome Item
        </label>
        <Input
          value={nomeEditando}
          onChange={(e) => setNomeEditando(e.target.value)}
          placeholder="Nome do Item"
          onPressEnter={salvarEdicao}
        />

        <label style={{ fontSize: 12, color: "#555", display: "block", marginTop: 12, marginBottom: 5 }}>
          Unidade
        </label>
        <Input
          value={undEditando}
          onChange={(e) => setUndEditando(e.target.value)}
          placeholder="Ex: UN, KG, L, CX"
          onPressEnter={salvarEdicao}
        />

        <label style={{ fontSize: 12, color: "#555", display: "block", marginTop: 12, marginBottom: 5 }}>
          Categoria
        </label>
        <Select
          style={{ width: "100%" }}
          value={categoriaSelecionada}
          onChange={setCategoriaSelecionada}
          placeholder="Selecione a categoria"
          options={categorias.map((c) => ({
            value: c.categoria_codigo,
            label: c.categoria_nome,
          }))}
        />
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
        <p>Tem certeza que deseja excluir este item?</p>
      </Modal>

    </form>
  )
}