import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import CadastroEmpresa from "../pages/Cadastros/CadastroEmpresa"
import Agenda from "../pages/Agenda"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/empresa" element={<CadastroEmpresa />} />
        <Route path="/agenda" element={<Agenda />} />
      </Routes>
    </BrowserRouter>
  )
}