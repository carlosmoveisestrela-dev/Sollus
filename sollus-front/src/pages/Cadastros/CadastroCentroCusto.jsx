import React, { useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroCentroCusto() {

    const [form, setForm] = useState({
        idcentrocusto: "",
        nomeCentroCusto: ""
    })

    function handleChange(e) {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    function salvarCentroCusto(e) {
        e.preventDefault()
        console.log("Dados cadastrados:", form)
    }

    return (
        <form className="formulario" onSubmit={salvarCentroCusto}>

            <h1>Cadastro Centro de Custo</h1>

            {/* Centro de Custo */}
            <h2>Centro de Custo</h2>
            <div className="grupo">
                <div className="campo">
                    <label>ID Centro Custo</label>
                    <input type="text" name="idcentrocusto" value={form.idcentrocusto} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>Nome Centro Custo</label>
                    <input type="text" name="nomeCentroCusto" value={form.nomeCentroCusto} onChange={handleChange} />
                </div>
                <div className="botoes">
                    <button type="submit" className="salvar">Salvar</button>
                    <button type="button" className="cancelar">Cancelar</button>
                </div>
            </div>
        </form>
    )
}