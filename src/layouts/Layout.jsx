import React from "react"
import Sidebar from "../components/sidebar.jsx"
import "../styles/layout.css"

export default function Layout({ children }) {
  return (
    <div className="layout">

      <Sidebar />

      <div className="content">
        {children}
      </div>

    </div>
  )
}