import React, { useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroEmpresa() {

  const [form, setForm] = useState({
    idempresa: "",
    empresa: "",
    saidaReal: ""
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  function salvarEmpresa(e) {
    e.preventDefault()
    console.log("Dados cadastrados:", form)
  }

  return (
    <form className="formulario" onSubmit={salvarEmpresa}>

      <h1>Cadastro Empresa</h1>

      {/* Empresa */}
      <h2>Empresa</h2>
      <div className="grupo">
        <div className="campo">
          <label>ID Empresa</label>
          <input type="text" name="idempresa" value={form.idempresa} onChange={handleChange} />
        </div>
        <div className="campo">
          <label>Nome Empresa</label>
          <input type="text" name="empresa" value={form.empresa} onChange={handleChange} />
        </div>
      </div>
      <div className="botoes">
        <button type="submit" className="salvar">Salvar</button>
        <button type="button" className="cancelar">Cancelar</button>
      </div>

    </form>
  
  )
}
