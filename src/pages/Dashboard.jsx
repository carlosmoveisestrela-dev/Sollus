import React from "react"
import Layout from "../layouts/layout.jsx"
import "../styles/dashboard.css"

export default function Dashboard() {
  return (
    <Layout>

      <h1>Dashboard</h1>

      <div className="cards">

        <div className="card">
          <h3>Empresas</h3>
          <p>24</p>
        </div>

        <div className="card">
          <h3>Usuários</h3>
          <p>152</p>
        </div>

        <div className="card">
          <h3>Faturamento</h3>
          <p>R$ 82.000</p>
        </div>

      </div>

    </Layout>
  )
}