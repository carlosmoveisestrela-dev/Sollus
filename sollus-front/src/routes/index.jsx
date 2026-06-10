import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "../layouts/Layout"
import Dashboard from "../pages/Dashboard"
import Agenda from "../pages/Agenda"
import LancamentoItem from "../pages/LancamentoItem"
import MovimentoFinanceiro from "../pages/MovimentoFinanceiro"
import CadastroCarteira from "../pages/Cadastros/CadastroCarteira"
import CadastroCategoria from "../pages/Cadastros/CadastroCategoria"
import CadastroCentroCusto from "../pages/Cadastros/CadastroCentroCusto"
import CadastroEmpresa from "../pages/Cadastros/CadastroEmpresa"
import CadastroEventoLancamento from "../pages/Cadastros/CadastroEventoLancamento"
import CadastroItem from "../pages/Cadastros/CadastroItem"
import CadastroOrigemLancamento from "../pages/Cadastros/CadastroOrigemLancamento"
import CadastroPessoa from "../pages/Cadastros/CadastroPessoa"
import CadastroTipoCusto from "../pages/Cadastros/CadastroTipoCusto"
import CadastroTipoLancamento from "../pages/Cadastros/CadastroTipoLancamento"
import CadastroUniNegocio from "../pages/Cadastros/CadastroUniNegocio"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cadastro/empresa" element={<CadastroEmpresa />} />
          <Route path="/cadastro/carteira" element={<CadastroCarteira />} />
          <Route path="/cadastro/categoria" element={<CadastroCategoria />} />
          <Route path="/cadastro/centro-custo" element={<CadastroCentroCusto />} />
          <Route path="/cadastro/evento-lancamento" element={<CadastroEventoLancamento />} />
          <Route path="/cadastro/item" element={<CadastroItem />} />
          <Route path="/cadastro/origem-lancamento" element={<CadastroOrigemLancamento />} />
          <Route path="/cadastro/pessoa" element={<CadastroPessoa />} />
          <Route path="/cadastro/tipo-custo" element={<CadastroTipoCusto />} />
          <Route path="/cadastro/tipo-lancamento" element={<CadastroTipoLancamento />} />
          <Route path="/cadastro/uni-negocio" element={<CadastroUniNegocio />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/lancamento" element={<LancamentoItem />} />
          <Route path="/movimento" element={<MovimentoFinanceiro />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}