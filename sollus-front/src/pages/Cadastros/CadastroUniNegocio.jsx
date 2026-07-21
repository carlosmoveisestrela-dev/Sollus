import React, { useState, useEffect } from "react"
import { Select, Modal, Input, message } from "antd"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroUniNegocio() {

  const [form, setForm] = useState({
    und_neg_nome: ""
  })

  const [busca, setBusca] = useState("")
  const [uniNegocios, setUniNegocios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanhoPagina, setTamanhoPagina] = useState(12)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [uniNegocioEdicao, setUniNegocioEdicao] = useState(null)
  const [nomeEditando, setNomeEditando] = useState("")
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [undnegocioParaExcluir, setUndnegocioParaExcluir] = useState([])

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function buscarUniNegocios() {
    setCarregando(true)
    try {
      const response = await fetch(
        `http://localhost:3001/uni-negocio?page=${pagina}&limit=${tamanhoPagina}&busca=${encodeURIComponent(busca)}`
      )
      const data = await response.json()
      setUniNegocios(data.dados)
      setTotalPaginas(data.totalPaginas)
    } catch (error) {
      console.error("Erro ao buscar unidades de negócio:", error)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarUniNegocios()
  }, [pagina, tamanhoPagina])

  useEffect(() => {
    setPagina(1)
    buscarUniNegocios()
  }, [busca])

  function handleTamanhoPaginaChange(valor) {
    setTamanhoPagina(valor)
    setPagina(1)
  }

  const selecionadas = uniNegocios.filter(e => e.selecionada)

  function abrirModalCadastro() {
    setModoEdicao(false)
    setUniNegocioEdicao(null)
    setNomeEditando("")
    setModalAberto(true)
  }

  function abrirModalEdicao(uniNegocio) {
    setModoEdicao(true)
    setUniNegocioEdicao(uniNegocio)
    setNomeEditando(uniNegocio.und_neg_nome)
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
    setUniNegocioEdicao(null)
    setNomeEditando("")
  }

  async function salvarEdicao() {
    if (!nomeEditando || nomeEditando.trim() === "") {
      message.error("O nome da unidade de negócio não pode estar vazio.")
      return
    }

    setSalvandoEdicao(true)
    try {
      const url = modoEdicao
        ? `http://localhost:3001/uni-negocio/${uniNegocioEdicao.und_neg_codigo}`
        : "http://localhost:3001/uni-negocio"
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ und_neg_nome: nomeEditando })
      })

      const data = await response.json()

      if (response.ok) {
        message.success(modoEdicao ? "Und. Negocio atualizada com sucesso!" : "Und. Negocio cadastrado com sucesso!")
        fecharModalEdicao()
        buscarUniNegocios()
      } else {
        message.error((modoEdicao ? "Erro ao atualizar Und. Negocio: " : "Erro ao cadastrar Und. Negocio: ") + data.error)
      }
    } catch (error) {
      console.error("Erro ao salvar unidade de negócio:", error)
      message.error("Não foi possivel conectar à API")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  function toggleSelecao(codigo) {
    setUniNegocios(prev =>
      prev.map(u =>
        u.und_neg_codigo === codigo
          ? { ...u, selecionada: !u.selecionada }
          : u
      )
    )
  }

  function abrirModalExcluirDoEdicao() {
    setUndnegocioParaExcluir([uniNegocioEdicao])
    setModalExcluirAberto(true)
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false)
  }

  async function confirmarExclusaoLote() {
    setExcluindo(true)
    try {
      await Promise.all(
        undnegocioParaExcluir.map(uniNegocio =>
          fetch(`http://localhost:3001/uni-negocio/${uniNegocio.und_neg_codigo}`, {
            method: "DELETE"
          })
        )
      )
      message.success("Unidade(s) de Negócio excluída(s) com sucesso!")
      fecharModalExcluir()
      fecharModalEdicao()
      buscarUniNegocios()
    } catch (error) {
      console.error("Erro ao excluir unidades de negócio:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <form className="formulario" onSubmit={handleInserirClick}>

      {/* Unidade de Negocios */}

      <h2>Cadastro Unidade de Negocio</h2>

      <div className="grupo">
        <div className="campo">
          <label>Buscar Unidade de Negocio</label>
          <div className="search-wrapper">
            <span className="search-icon"></span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar Uni.Negocio..."
            />
            <button type="submit" className="inserir">Inserir</button>
          </div>
        </div>
      </div>

      {/* Listagem de Uni.Negocio */}

      <div className="lista-header-controle">
        <h2>Unidades Cadastradas</h2>
        <div className="seletor-tamanho">
          <label>Intens por página:</label>
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

      {/* Lista de Uni.Negocio */}

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
            ) : uniNegocios.length === 0 ? (
              <tr>
                <td colSpan={2} className="vazio">Nenhuma Unidade de Negocio Cadastrada</td>
              </tr>
            ) : (
              uniNegocios.map((uniNegocio) => (
                <tr
                  key={uniNegocio.und_neg_codigo}
                  onClick={() => toggleSelecao(uniNegocio.und_neg_codigo)}
                  onDoubleClick={() => abrirModalEdicao(uniNegocio)}
                  className={`empresa-row${uniNegocio.selecionada ? " seleciona" : ""}`}
                >
                  <td className="codigo">{uniNegocio.und_neg_codigo}</td>
                  <td>{uniNegocio.und_neg_nome}</td>
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
        title={modoEdicao ? "Editar Unidade de Negocio" : "Cadastrar Unidade de Negocio"}
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
          Nome da Unidade de Negocio
        </label>
        <Input
          value={nomeEditando}
          onChange={(e) => setNomeEditando(e.target.value)}
          placeholder="Nome da Unidade de Negocio"
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
        <p>Tem certeza que deseja excluir esta Unidade de Negocio?</p>
      </Modal>
    </form>
  )
}