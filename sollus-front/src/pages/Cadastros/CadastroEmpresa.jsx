import React, { useState, useEffect } from "react"
import { Select, Modal, Input, message } from "antd"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroEmpresa() {

  const [form, setForm] = useState({
    empresa_nome: ""
  })

  const [busca, setBusca] = useState("")
  const [empresas, setEmpresas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanhoPagina, setTamanhoPagina] = useState(12)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [empresaEdicao, setEmpresaEdicao] = useState(null)
  const [nomeEditando, setNomeEditando] = useState("")
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function buscarEmpresas() {
    setCarregando(true)
    try {
      const response = await fetch(
        `http://localhost:3001/empresa?page=${pagina}&limit=${tamanhoPagina}&busca=${encodeURIComponent(busca)}`
      )
      const data = await response.json()
      setEmpresas(data.dados)
      setTotalPaginas(data.totalPaginas)
    } catch (error) {
      console.error("Erro ao buscar empresas:", error)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarEmpresas()
  }, [pagina, tamanhoPagina])

  useEffect(() => {
    setPagina(1)
    buscarEmpresas()
  }, [busca])

  function handleTamanhoPaginaChange(valor) {
    setTamanhoPagina(valor)
    setPagina(1)
  }

  const selecionadas = empresas.filter(e => e.selecionada)

  function abrirModalCadastro() {
    setModoEdicao(false)
    setEmpresaEdicao(null)
    setNomeEditando("")
    setModalAberto(true)
  }

  function abrirModalEdicao(empresa) {
    setModoEdicao(true)
    setEmpresaEdicao(empresa)
    setNomeEditando(empresa.empresa_nome)
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
    setEmpresaEdicao(null)
    setNomeEditando("")
    setForm({ empresa_nome: "" })
  }

  async function salvarEdicao() {
    if (!nomeEditando || nomeEditando.trim() === "") {
      message.warning("O nome da empresa não pode estar vazio.")
      return
    }

    setSalvandoEdicao(true)
    try {
      const url = modoEdicao
        ? `http://localhost:3001/empresa/${empresaEdicao.empresa_codigo}`
        : "http://localhost:3001/empresa"
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ empresa_nome: nomeEditando })
      })

      const data = await response.json()

      if (response.ok) {
        message.success(modoEdicao ? "Empresa atualizada com sucesso!" : "Empresa cadastrada com sucesso!")
        fecharModalEdicao()
        buscarEmpresas()
      } else {
        message.error((modoEdicao ? "Erro ao atualizar empresa: " : "Erro ao cadastrar empresa: ") + data.error)
      }
    } catch (error) {
      console.error("Erro ao salvar empresa:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  const [empresasParaExcluir, setEmpresasParaExcluir] = useState([])

  function abrirModalExcluirDoEdicao() {
    if (!empresaEdicao) return
    setEmpresasParaExcluir([empresaEdicao])
    setModalExcluirAberto(true)
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false)
  }

  async function confirmarExclusaoLote() {
    setExcluindo(true)
    try {
      await Promise.all(
        empresasParaExcluir.map(empresa =>
          fetch(`http://localhost:3001/empresa/${empresa.empresa_codigo}`, {
            method: "DELETE"
          })
        )
      )
      message.success("Empresa(s) excluída(s) com sucesso!")
      fecharModalExcluir()
      fecharModalEdicao()
      buscarEmpresas()
    } catch (error) {
      console.error("Erro ao excluir empresas:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <form className="formulario" onSubmit={handleInserirClick}>

      {/* Empresa */}
      <h2>Cadastro Empresa</h2>

      <div className="grupo">
        <div className="campo">
          <label>Buscar Empresa</label>
          <div className="search-wrapper">
            <span className="search-icon"></span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar Empresa..."
            />
            <button type="submit" className="inserir">Inserir</button>
          </div>
        </div>
      </div>

      {/* Listagem de empresas */}
      <div className="lista-header-controle">
        <h2>Empresas Cadastradas</h2>
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
            ) : empresas.length === 0 ? (
              <tr>
                <td colSpan={2} className="vazio">Nenhuma empresa cadastrada</td>
              </tr>
            ) : (
              empresas.map((empresa) => (
                <tr
                  onClick={() => toggleSelecao(empresa.empresa_codigo)}
                  onDoubleClick={() => abrirModalEdicao(empresa)}
                  className={`empresa-row${empresa.selecionada ? " selecionada" : ""}`}
                  key={String(empresa.empresa_codigo)}
                >
                  <td className="codigo">{empresa.empresa_codigo}</td>
                  <td>{empresa.empresa_nome}</td>
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
        title={modoEdicao ? "Editar Empresa" : "Cadastrar Empresa"}
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
          Nome Empresa
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
        <p>Tem certeza que deseja excluir esta empresa?</p>
      </Modal>

    </form>
  )
}