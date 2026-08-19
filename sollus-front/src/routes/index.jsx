import React, { Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "../layouts/Layout"

const Dashboard = React.lazy(() => import("../pages/Dashboard"))
const Agenda = React.lazy(() => import("../pages/Agenda"))
const LancamentoItem = React.lazy(() => import("../pages/LancamentoItem"))
const MovimentoFinanceiro = React.lazy(() => import("../pages/MovimentoFinanceiro"))
const CadastroCarteira = React.lazy(() => import("../pages/Cadastros/CadastroCarteira"))
const CadastroCategoria = React.lazy(() => import("../pages/Cadastros/CadastroCategoria"))
const CadastroCentroCusto = React.lazy(() => import("../pages/Cadastros/CadastroCentroCusto"))
const CadastroEmpresa = React.lazy(() => import("../pages/Cadastros/CadastroEmpresa"))
const CadastroEventoLancamento = React.lazy(() => import("../pages/Cadastros/CadastroEventoLancamento"))
const CadastroItem = React.lazy(() => import("../pages/Cadastros/CadastroItem"))
const CadastroOrigemLancamento = React.lazy(() => import("../pages/Cadastros/CadastroOrigemLancamento"))
const CadastroPessoa = React.lazy(() => import("../pages/Cadastros/CadastroPessoa"))
const CadastroTipoCusto = React.lazy(() => import("../pages/Cadastros/CadastroTipoCusto"))
const CadastroTipoLancamento = React.lazy(() => import("../pages/Cadastros/CadastroTipoLancamento"))
const CadastroUniNegocio = React.lazy(() => import("../pages/Cadastros/CadastroUniNegocio"))

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div style={{ padding: 24 }}>Carregando...</div>}>
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
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}