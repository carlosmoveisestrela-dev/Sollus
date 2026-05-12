import React from "react"
import { NavLink } from "react-router-dom"
import "../styles/sidebar.css"

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">Sollus</h2>
      <nav>
        <ul>
          <li><NavLink to="/" end>Dashboard</NavLink></li>
          <li><NavLink to="/agenda">Agenda</NavLink></li>
          <li><NavLink to="/cadastro">Cadastros</NavLink></li>
          <li><NavLink to="/movimento">Movimento Financeiro</NavLink></li>
          <li><NavLink to="/lancamento">Lançamento Item</NavLink></li>
        </ul>
      </nav>
    </aside>
  )
}