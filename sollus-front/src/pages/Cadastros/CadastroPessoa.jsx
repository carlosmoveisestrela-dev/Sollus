import React, { useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroPessoa() {

    const [form, setForm] = useState({
        idpessoa: "",
        nomePessoa: "",
        cidade: "",
        telefone: ""
    })

    function handleChange(e) {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    function salvarPessoa(e) {
        e.preventDefault()
        console.log("Dados cadastrados:", form)
    }

    return (
        <form className="formulario" onSubmit={salvarPessoa}>

            <h1>Cadastro Pessoa</h1>

            {/* Pessoa */}
            <h2>Pessoa</h2>
            <div className="grupo">
                <div className="campo">
                    <label>ID Pessoa</label>
                    <input type="text" name="idpessoa" value={form.idpessoa} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>Nome Pessoa</label>
                    <input type="text" name="nomePessoa" value={form.nomePessoa} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>Cidade</label>
                    <input type="text" name="cidade" value={form.cidade} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>Telefone</label>
                    <input type="text" name="telefone" value={form.telefone} onChange={handleChange} />
                </div>
                <div className="botoes">
                    <button type="submit" className="salvar">Salvar</button>
                    <button type="button" className="cancelar">Cancelar</button>
                </div>
            </div>
        </form>
    )
}