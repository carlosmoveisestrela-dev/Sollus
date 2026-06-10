import React, { useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroOrigemLancamento() {

    const [form, setForm] = useState({
        idorigemlancamento: "",
        nomeOrigemLancamento: ""
    })

    function handleChange(e) {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    function salvarOrigemLancamento(e) {
        e.preventDefault()
        console.log("Dados cadastrados:", form)
    }

    return (
        <form className="formulario" onSubmit={salvarOrigemLancamento}>

            <h1>Cadastro Origem Lançamento</h1>

            {/* Origem Lançamento */}
            <h2>Origem Lançamento</h2>
            <div className="grupo">
                <div className="campo">
                    <label>ID Origem Lançamento</label>
                    <input type="text" name="idorigemlancamento" value={form.idorigemlancamento} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>Nome Origem Lançamento</label>
                    <input type="text" name="nomeOrigemLancamento" value={form.nomeOrigemLancamento} onChange={handleChange} />
                </div>
                <div className="botoes">
                    <button type="submit" className="salvar">Salvar</button>
                    <button type="button" className="cancelar">Cancelar</button>
                </div>
            </div>
        </form>
    )
}