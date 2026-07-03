import React, { useState, useEffect } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroEmpresa() {

  const [form, setForm] = useState({
    empresa_nome: ""
  })

  const [busca, setBusca] = useState("")
  const [empresas, setEmpresas] = useState([])
  const [carregando, setCarregando] = useState(true)

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function buscarEmpresas() {
    setCarregando(true)
    try {
      const response = await fetch("http://localhost:3001/empresa")
      const data = await response.json()
      setEmpresas(data)
    } catch (error) {
      console.error("Erro ao buscar empresas:", error)
    } finally {
      setCarregando(false)
    }
  }

  async function deletarEmpresa(id) {
    if (!window.confirm("Tem certeza que deseja excluir esta empresa?")) {
      return
    }
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

  useEffect(() => {
    buscarEmpresas()
  }, [])

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

  function handleCancelar() {
    setForm({ empresa_nome: "" })
  }

  const empresasFiltradas = empresas.filter((empresa) =>
    empresa.empresa_nome?.toLowerCase().includes(busca.toLowerCase())
  )

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
        <button type="button" className="cancelar" onClick={handleCancelar}>Cancelar</button>
      </div>

      {/* Listagem de empresas */}
      <h2>Empresas Cadastradas</h2>

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

            {!carregando && empresasFiltradas.length === 0 && (
              <tr>
                <td colSpan="3" className="vazio">Nenhuma empresa cadastrada</td>
              </tr>
            )}

            {!carregando && empresasFiltradas.map((empresa) => (
              <tr className="empresa-row" key={empresa.empresa_codigo}>
                <td className="codigo">{empresa.empresa_codigo}</td>
                <td>{empresa.empresa_nome}</td>
                <td>
                  <div className="acoes">
                    <button type="button" className="btn-primary">Editar</button> 
                    <button type="button" className="btn-danger" onClick={() => deletarEmpresa(empresa.empresa_codigo)}>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </form>

  )
}
