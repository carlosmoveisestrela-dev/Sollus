import React from "react"
import "../styles/sidebar.css"

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">SysGestor</h2>

      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Agenda</li>
          <li>Cadastros</li>
          <li>Movimento Financeiro</li>
          <li>Lançamento Item</li>
        </ul>
      </nav>
    </aside>
  )
}