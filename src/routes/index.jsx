import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import CadastroEmpresa from "../pages/Cadastros/CadastroEmpresa"
import Agenda from "../pages/Agenda"
import LancamentoItem from "../pages/LancamentoItem"
import MovimentoFinanceiro from "../pages/MovimentoFinanceiro"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cadastro" element={<CadastroEmpresa />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/lancamento" element={<LancamentoItem />} />
        <Route path="/movimento" element={<MovimentoFinanceiro />} />
      </Routes>
    </BrowserRouter>
  )
}