import React, { useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroItem() {

    const [form, setForm] = useState({
        iditem: "",
        nomeItem: "",
        unidadeItem: ""
    })

    function handleChange(e) {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    function salvarItem(e) {
        e.preventDefault()
        console.log("Dados cadastrados:", form)
    }

    return (
        <form className="formulario" onSubmit={salvarItem}>

            <h1>Cadastro Item</h1>

            {/* Item */}
            <h2>Item</h2>
            <div className="grupo">
                <div className="campo">
                    <label>ID Item</label>
                    <input type="text" name="iditem" value={form.iditem} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>Nome Item</label>
                    <input type="text" name="nomeItem" value={form.nomeItem} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>Unidade Item</label>
                    <input type="text" name="unidadeItem" value={form.unidadeItem} onChange={handleChange} />
                </div>
            </div>
            <div className="botoes">
                <button type="submit" className="salvar">Salvar</button>
                <button type="button" className="cancelar">Cancelar</button>
            </div>
        </form>
    )
}