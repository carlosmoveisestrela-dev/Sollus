import React, { useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroEventoLancamento() {

    const [form, setForm] = useState({
        ideventolancamento: "",
        nomeEventoLancamento: ""
    })

    function handleChange(e) {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    function salvarEventoLancamento(e) {
        e.preventDefault()
        console.log("Dados cadastrados:", form)
    }

    return (
        <form className="formulario" onSubmit={salvarEventoLancamento}>

            <h1>Cadastro Evento Lançamento</h1>

            {/* Evento Lançamento */}
            <h2>Evento Lançamento</h2>
            <div className="grupo">
                <div className="campo">
                    <label>ID Evento Lançamento</label>
                    <input type="text" name="ideventolancamento" value={form.ideventolancamento} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>Nome Evento Lançamento</label>
                    <input type="text" name="nomeEventoLancamento" value={form.nomeEventoLancamento} onChange={handleChange} />
                </div>
                <div className="botoes">
                    <button type="submit" className="salvar">Salvar</button>
                    <button type="button" className="cancelar">Cancelar</button>
                </div>
            </div>
        </form>
    )
}