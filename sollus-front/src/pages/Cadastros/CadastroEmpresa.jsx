import React, { useState, useEffect } from "react"
import { Select, Modal, Input } from "antd"
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
  const [tamanhoPagina, setTamanhoPagina] = useState(4)
  const [modalAberto, setModalAberto] = useState(false)
  const [empresaEdicao, setEmpresaEdicao] = useState(null)
  const [nomeEditando, setNomeEditando] = useState("")
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)


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

  async function deletarEmpresa(id) {
    Modal.confirm({
      title: "Confirmação",
      content: "Tem certeza que deseja excluir esta empresa?",
      okText: "Excluir",
      cancelText: "Cancelar",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const response = await fetch(`http://localhost:3001/empresa/${id}`, {
            method: "DELETE"
          })
          if (response.ok) {
            alert("Empresa excluída com sucesso!")
            buscarEmpresas()
          } else {
            alert("Erro ao excluir empresa")
          }
        } catch (error) {
          console.error("Erro ao excluir empresa:", error)
          alert("Não foi possível conectar à API")
        }
      }
    })
  }

  async function salvarEmpresa(e) {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:3001/empresa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (response.ok) {
        alert("Empresa salva com sucesso!")
        setForm({ empresa_nome: "" })
        buscarEmpresas()
      } else {
        alert("Erro ao salvar empresa: " + data.error)
      }
    } catch (error) {
      console.error("Erro ao salvar empresa:", error)
      alert("Não foi possível conectar à API")
    }
  }

  function abrirModalEdicao(empresa) {
    setEmpresaEdicao(empresa)
    setNomeEditando(empresa.empresa_nome)
    setModalAberto(true)
  }

  function fecharModalEdicao() {
    setModalAberto(false)
    setEmpresaEdicao(null)
    setNomeEditando("")
  }

  async function salvarEdicao() {
    if (!nomeEditando || nomeEditando.trim() === "") {
      alert("O nome da empresa não pode estar vazio.")
      return
    }

    setSalvandoEdicao(true)
    try {
      const response = await fetch(`http://localhost:3001/empresa/${empresaEdicao.empresa_codigo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ empresa_nome: nomeEditando })
      })

      const data = await response.json()

      if (response.ok) {
        alert("Empresa atualizada com sucesso!")
        fecharModalEdicao()
        buscarEmpresas()
      } else {
        alert("Erro ao atualizar empresa: " + data.error)
      }
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error)
      alert("Não foi possível conectar à API")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  return (
    <form className="formulario" onSubmit={salvarEmpresa}>

      <h1>Cadastro Empresa</h1>

      {/* Empresa */}
      <h2>Empresa</h2>
      <div className="grupo">
        <div className="campo">
          <label>Nome Empresa</label>
          <input
            type="text"
            name="empresa_nome"
            value={form.empresa_nome}
            onChange={handleChange}
            placeholder="Nome da Empresa"
          />
        </div>
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
          </div>
        </div>
      </div>

      <div className="botoes">
        <button type="submit" className="salvar">Salvar</button>
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
              { value: 4, label: "4" },
              { value: 10, label: "10" },
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
              <th>Código</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr>
                <td colSpan="3" className="vazio">Carregando...</td>
              </tr>
            )}

            {!carregando && empresas.length === 0 && (
              <tr>
                <td colSpan="3" className="vazio">Nenhuma empresa cadastrada</td>
              </tr>
            )}

            {!carregando && empresas.map((empresa) => (
              <tr className="empresa-row" key={empresa.empresa_codigo}>
                <td className="codigo">{empresa.empresa_codigo}</td>
                <td>{empresa.empresa_nome}</td>
                <td>
                  <div className="acoes">
                    <button type="button" className="btn-primary" onClick={() => abrirModalEdicao(empresa)}>
                      Editar
                    </button>
                    <button type="button" className="btn-danger" onClick={() => deletarEmpresa(empresa.empresa_codigo)}>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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

      {/* Modal de edição */}
      <Modal
        title="Editar Empresa"
        open={modalAberto}
        onCancel={fecharModalEdicao}
        onOk={salvarEdicao}
        okText="Salvar"
        cancelText="Cancelar"
        confirmLoading={salvandoEdicao}
      >
        <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 5 }}>
          Nome Empresa
        </label>
        <Input
          value={nomeEditando}
          onChange={(e) => setNomeEditando(e.target.value)}
          placeholder="Nome da Empresa"
        />
      </Modal>

    </form>
  )
}