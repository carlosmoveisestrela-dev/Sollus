import React from "react"
import { Layout as AntLayout } from "antd"
import Sidebar from "../components/Sidebar.jsx"
import { Footer } from "antd/es/layout/layout.js"

const { Content } = AntLayout

export default function Layout({ children }) {
  return (
    <AntLayout style={{ marginLeft: 220, minHeight: "100vh" }}>
      <Sidebar />
      <AntLayout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: '24px' }}>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center', color: '#888', fontSize: '13px' }}>
          © {new Date().getFullYear()} Sollus. Todos os direitos reservados.
        </Footer>
      </AntLayout>
    </AntLayout>
  )
}