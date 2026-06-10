import React, { useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroCategoria() {

    const [form, setForm] = useState({
        idcategoria: "",
        nomeCategoria: ""
    })

    function handleChange(e) {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    function salvarCategoria(e) {
        e.preventDefault()
        console.log("Dados cadastrados:", form)
    }

    return (
        <form className="formulario" onSubmit={salvarCategoria}>

            <h1>Cadastro Categoria</h1>
            
            {/* Categoria */}
            <h2>Categoria</h2>
            <div className="grupo">
                <div className="campo">
                    <label>ID Categoria</label>
                    <input type="text" name="idcategoria" value={form.idcategoria} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>Nome Categoria</label>
                    <input type="text" name="nomeCategoria" value={form.nomeCategoria} onChange={handleChange} />
                </div>
                <div className="botoes">
                    <button type="submit" className="salvar">Salvar</button>
                    <button type="button" className="cancelar">Cancelar</button>
                 </div>
             </div>
            </form>
    )
}