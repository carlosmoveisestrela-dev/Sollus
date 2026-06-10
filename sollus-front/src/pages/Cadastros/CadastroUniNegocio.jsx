import React, { useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroUnidadeNegocio() {

  const [form, setForm] = useState({
    idnegocio: "",
    nomeNegocio: ""
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  function salvarUnidadeNegocio(e) {
    e.preventDefault()
    console.log("Dados cadastrados:", form)
  }

  return (
    <form className="formulario" onSubmit={salvarUnidadeNegocio}>

      <h1>Cadastro Unidade de Negócio</h1>

      {/* Unidade de Negócio */}
      <h2>Unidade de Negócio</h2>
      <div className="grupo">
        <div className="campo">
          <label>ID Unidade Negócio</label>
          <input type="text" name="idnegocio" value={form.idnegocio} onChange={handleChange} />
        </div>
        <div className="campo">
          <label>Nome Unidade Negócio</label>
          <input type="text" name="nomeNegocio" value={form.nomeNegocio} onChange={handleChange} />
        </div>
      </div>
      <div className="botoes">
        <button type="submit" className="salvar">Salvar</button>
        <button type="button" className="cancelar">Cancelar</button>
      </div>

    </form>
  )
}
