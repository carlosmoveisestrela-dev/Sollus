import React, { useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroTipoLancamento() {

    const [form, setForm] = useState({
        idtipolancamento: "",
        nomeTipoLancamento: ""
    })

    function handleChange(e) {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    function salvarTipoLancamento(e) {
        e.preventDefault()
        console.log("Dados cadastrados:", form)
    }

    return (
        <form className="formulario" onSubmit={salvarTipoLancamento}>

            <h1>Cadastro Tipo Lançamento</h1>

            {/* Tipo Lançamento */}
            <h2>Tipo Lançamento</h2>
            <div className="grupo">
                <div className="campo">
                    <label>ID Tipo Lançamento</label>
                    <input type="text" name="idtipolancamento" value={form.idtipolancamento} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>Nome Tipo Lançamento</label>
                    <input type="text" name="nomeTipoLancamento" value={form.nomeTipoLancamento} onChange={handleChange} />
                </div>
                <div className="botoes">
                    <button type="submit" className="salvar">Salvar</button>
                    <button type="button" className="cancelar">Cancelar</button>
                </div>
            </div>
        </form>
    )
}