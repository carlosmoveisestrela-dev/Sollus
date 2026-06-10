import React from "react"
import { Layout, Menu } from "antd"
import { useNavigate, useLocation } from "react-router-dom"
import {
  DashboardOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  DollarOutlined,
  FileAddOutlined,
  WalletOutlined,
  TagOutlined,
  BankOutlined,
  UnorderedListOutlined,
  ImportOutlined,
  UserOutlined,
  SwapOutlined,
  ShopOutlined,
  ApartmentOutlined
} from "@ant-design/icons"

const { Sider } = Layout

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/agenda", icon: <CalendarOutlined />, label: "Agenda" },
    { 
      key: "/cadastro", 
      icon: <AppstoreOutlined />, 
      label: "Cadastros",
      children: [

        { key: "/cadastro/uni-negocio", 
          icon: <ShopOutlined />,
          label: "Uni. Negócio" 
        },

        { key: "/cadastro/empresa", 
          icon: <BankOutlined />, 
          label: "Empresa" 
        },
        
        { key: "/cadastro/pessoa", 
          icon: <UserOutlined />, 
          label: "Pessoa" 
        },

        { key: "/cadastro/centro-custo", 
          icon: <ApartmentOutlined />, 
          label: "Centro de Custo" 
        },

        { key: "/cadastro/tipo-custo", 
          icon: <DollarOutlined />, 
          label: "Tipo Custo" 
        },

        { key: "/cadastro/tipo-lancamento",
          icon: <SwapOutlined />,
          label: "Tipo Lançamento"
        },

        { key: "/cadastro/origem-lancamento",
          icon: <ImportOutlined />,
          label: "Origem Lançamento"
        },

        { key: "/cadastro/evento-lancamento",
          icon: <CalendarOutlined />,
          label: "Evento Lançamento"
        },

        { key: "/cadastro/categoria",
          icon: <TagOutlined />,
          label: "Categoria"
        },

        { key: "/cadastro/item",
          icon: <UnorderedListOutlined />,
          label: "Item"
        },

        { key: "/cadastro/carteira",
          icon: <WalletOutlined />,
          label: "Carteira"
        }

      ]
    },
    { key: "/movimento", icon: <DollarOutlined />, label: "Movimento Financeiro" },
    { key: "/lancamento", icon: <FileAddOutlined />, label: "Lançamento Item" },
  ]

  return (
    <Sider width={220} style={{
      position: 'fixed',
      height: '100vh',
      left: 0,
      top: 0,
      zIndex: 100
    }}>
      <h2 style={{ color: '#fff', textAlign: 'center', padding: '16px 0' }}>Sollus</h2>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  )
}