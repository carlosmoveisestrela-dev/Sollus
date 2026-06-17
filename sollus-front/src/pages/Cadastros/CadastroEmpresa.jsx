import React, { useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroEmpresa() {

  const [form, setForm] = useState({
    empresa: "",
    empresa_nome: ""
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
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
        setForm({ empresa_codigo: "", empresa_nome: "" }) 
      } else {
        alert("Erro ao salvar empresa: " + data.error)
      }
    } catch (error) {
      console.error("Erro ao salvar empresa:", error)
      alert("Não foi possível conectar à API")
    }
  }

  return (
    <form className="formulario" onSubmit={salvarEmpresa}>

      <h1>Cadastro Empresa</h1>

      {/* Empresa */}
      <h2>Empresa</h2>
      <div className="grupo">
        <div className="campo">
          <label>ID Empresa</label>
          <input
            type="text"
            name="empresa"
            value={form.empresa}
            placeholder="ID da Empresa"
            readOnly
          />
        </div>
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
      </div>
      <div className="botoes">
        <button type="submit" className="salvar">Salvar</button>
        <button type="button" className="cancelar">Cancelar</button>
      </div>

    </form>

  )
}
