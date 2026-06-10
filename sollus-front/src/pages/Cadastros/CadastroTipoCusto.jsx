import React, { useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroTipoCusto() {

    const [form, setForm] = useState({
        idtipocusto: "",
        nomeTipoCusto: ""
    })

    function handleChange(e) {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    function salvarTipoCusto(e) {
        e.preventDefault()
        console.log("Dados cadastrados:", form)
    }

    return (
        <form className="formulario" onSubmit={salvarTipoCusto}>

            <h1>Cadastro Tipo Custo</h1>

            {/* Tipo Custo */}
            <h2>Tipo Custo</h2>
            <div className="grupo">
                <div className="campo">
                    <label>ID Tipo Custo</label>
                    <input type="text" name="idtipocusto" value={form.idtipocusto} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>ID Carteira</label>
                    <input type="text" name="idcarteira" value={form.idcarteira} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>Nome Tipo Custo</label>
                    <input type="text" name="nomeTipoCusto" value={form.nomeTipoCusto} onChange={handleChange} />
                </div>
                <div className="campo">
                    <label>Nome Centro Custo</label>
                    <input type="text" name="nomeCentroCusto" value={form.nomeCentroCusto} onChange={handleChange} />
                </div>
            </div>

            {/* Saída Real */}
            <h2>Saída Real</h2>
            <div className="campo-radio">
                <label>
                    <input type="radio" name="saidaReal" value="sim" checked={form.saidaReal === "sim"} onChange={handleChange} />
                    Sim
                </label>
                <label>
                    <input type="radio" name="saidaReal" value="nao" checked={form.saidaReal === "nao"} onChange={handleChange} />
                    Não
                </label>
            </div>

            <div className="botoes">
                <button type="submit" className="salvar">Salvar</button>
                <button type="button" className="cancelar">Cancelar</button>
            </div>

        </form>
    )
}