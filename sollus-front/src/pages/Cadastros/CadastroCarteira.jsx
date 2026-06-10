import React, { useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroCarteira() {

    const [form, setForm] = useState({
        idcarteira: "",
        nomeCarteira: ""
    })

    function handleChange(e) {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    function salvarCarteira(e) {
        e.preventDefault()
        console.log("Dados cadastrados:", form)
    }

    return (
        <form className="formulario" onSubmit={salvarCarteira}>

            <h1>Cadastro Carteira</h1>

            {/* Carteira */}
            <h2>Carteira</h2>
            <div className="grupo">
                <div className="campo">
                    <label>ID Carteira</label>
                    <input type="text" name="idcarteira" value={form.idcarteira} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>Nome Carteira</label>
                    <input type="text" name="nomeCarteira" value={form.nomeCarteira} onChange={handleChange} />
                </div>
            </div>
            <div className="botoes">
                <button type="submit" className="salvar">Salvar</button>
                <button type="button" className="cancelar">Cancelar</button>
            </div>
        </form>
    )
}