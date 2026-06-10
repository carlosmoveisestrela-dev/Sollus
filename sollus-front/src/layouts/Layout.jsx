import React from "react"
import { Layout as AntLayout } from "antd"
import Sidebar from "../components/Sidebar.jsx"

const { Content } = AntLayout

export default function Layout({ children }) {
  return (
    <AntLayout style={{ marginLeft: 220 }}>
      <Sidebar />
      <AntLayout>
        <Content style={{ padding: '24px' }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  )
}