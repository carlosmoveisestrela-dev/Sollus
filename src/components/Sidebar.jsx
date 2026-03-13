import React from "react"
import "../styles/sidebar.css"

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">SysGestor</h2>

      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Empresas</li>
          <li>Usuários</li>
          <li>Financeiro</li>
          <li>Relatórios</li>
          <li>Configurações</li>
        </ul>
      </nav>
    </aside>
  )
}