import React, { useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"

export default function CadastroEmpresa() {

  const [form, setForm] = useState({
    idnegocio: "",
    nomeNegocio: "",
    idempresa: "",
    empresa: "",
    idpessoa: "",
    nomePessoa: "",
    telefone: "",
    cidade: "",
    idcentrocusto: "",
    nomeCentroCusto: "",
    idtipocusto: "",
    nomeTipoCusto: "",
    idcarteira: "",
    nomeCarteira: "",
    idtipolancamento: "",
    nomeTipoLancamento: "",
    idorigemlancamento: "",
    nomeOrigemLancamento: "",
    ideventolancamento: "",
    nomeEventoLancamento: "",
    idcategoria: "",
    nomeCategoria: "",
    iditem: "",
    nomeItem: "",
    unidadeItem: "",
    saidaReal: ""
  })

  function handleChange(e){
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value
    })
  }

  function salvarEmpresa(e){
    e.preventDefault()

    console.log("Dados cadastrados:", form)
  }

  return (
    <Layout>

      <div className="pagina">

        <h1>Cadastro Empresa</h1>

        <form className="formulario" onSubmit={salvarEmpresa}>

          <h2>Unidade de Negócio</h2>

          <div className="campo">
            <label>ID Unidade Negócio</label>
            <input type="text" name="idnegocio" value={form.idnegocio} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Nome Unidade Negócio</label>
            <input type="text" name="nomeNegocio" value={form.nomeNegocio} onChange={handleChange}/>
          </div>

          <h2>Empresa</h2>

          <div className="campo">
            <label>ID Empresa</label>
            <input type="text" name="idempresa" value={form.idempresa} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Nome Empresa</label>
            <input type="text" name="empresa" value={form.empresa} onChange={handleChange}/>
          </div>

          <h2>Pessoa</h2>

          <div className="campo">
            <label>ID Pessoa</label>
            <input type="text" name="idpessoa" value={form.idpessoa} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Nome Pessoa</label>
            <input type="text" name="nomePessoa" value={form.nomePessoa} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Cidade</label>
            <input type="text" name="cidade" value={form.cidade} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Telefone</label>
            <input type="text" name="telefone" value={form.telefone} onChange={handleChange}/>
          </div>

          <h2>Centro de Custo</h2>

          <div className="campo">
            <label>ID Centro Custo</label>
            <input type="text" name="idcentrocusto" value={form.idcentrocusto} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Nome Centro Custo</label>
            <input type="text" name="nomeCentroCusto" value={form.nomeCentroCusto} onChange={handleChange}/>
          </div>

          <h2>Tipo Custo</h2>

          <div className="campo">
            <label>ID Tipo Custo</label>
            <input type="text" name="idtipocusto" value={form.idtipocusto} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Nome Tipo Custo</label>
            <input type="text" name="nomeTipoCusto" value={form.nomeTipoCusto} onChange={handleChange}/>
          </div>

          <h2>Tipo Lançamento</h2>

          <div className="campo">
            <label>ID Tipo Lançamento</label>
            <input type="text" name="idtipolancamento" value={form.idtipolancamento} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Nome Tipo Lançamento</label>
            <input type="text" name="nomeTipoLancamento" value={form.nomeTipoLancamento} onChange={handleChange}/>
          </div>

          <h2>Origem Lançamento</h2>

          <div className="campo">
            <label>ID Origem Lançamento</label>
            <input type="text" name="idorigemlancamento" value={form.idorigemlancamento} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Nome Origem Lançamento</label>
            <input type="text" name="nomeOrigemLancamento" value={form.nomeOrigemLancamento} onChange={handleChange}/>
          </div>

          <h2>Evento Lançamento</h2>

          <div className="campo">
            <label>ID Evento</label>
            <input type="text" name="ideventolancamento" value={form.ideventolancamento} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Nome Evento</label>
            <input type="text" name="nomeEventoLancamento" value={form.nomeEventoLancamento} onChange={handleChange}/>
          </div>

          <h2>Categoria</h2>

          <div className="campo">
            <label>ID Categoria</label>
            <input type="text" name="idcategoria" value={form.idcategoria} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Nome Categoria</label>
            <input type="text" name="nomeCategoria" value={form.nomeCategoria} onChange={handleChange}/>
          </div>

          <h2>Item</h2>

          <div className="campo">
            <label>ID Item</label>
            <input type="text" name="iditem" value={form.iditem} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Nome Item</label>
            <input type="text" name="nomeItem" value={form.nomeItem} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Unidade</label>
            <input type="text" name="unidadeItem" value={form.unidadeItem} onChange={handleChange}/>
          </div>

          <h2>Carteira</h2>

          <div className="campo">
            <label>ID Carteira</label>
            <input type="text" name="idcarteira" value={form.idcarteira} onChange={handleChange}/>
          </div>

          <div className="campo">
            <label>Nome Carteira</label>
            <input type="text" name="nomeCarteira" value={form.nomeCarteira} onChange={handleChange}/>
          </div>

          <h2>Saída Real</h2>

          <div className="campo">
            <input type="radio" name="saidaReal" value="sim" onChange={handleChange}/>
            <label>Sim</label>

            <input type="radio" name="saidaReal" value="nao" onChange={handleChange}/>
            <label>Não</label>
          </div>

          <div className="botoes">

            <button type="submit" className="salvar">
              Salvar
            </button>

            <button type="button" className="cancelar">
              Cancelar
            </button>

          </div>

        </form>

      </div>

    </Layout>
  )
}

