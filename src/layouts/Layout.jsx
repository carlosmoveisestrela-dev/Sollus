import React from "react"
import Sidebar from "../components/sidebar.jsx"
import Header from "../components/Header.jsx"
import "../styles/layout.css"

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-wrapper">
        <Header />
        <main className="content">
          {children}
        </main>
      </div>

    </div>
  )
}