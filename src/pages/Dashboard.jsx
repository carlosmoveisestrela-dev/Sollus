import React from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import "../styles/dashboard.css"

const dadosFaturamento = [
  { mes: "Jan", valor: 42000 },
  { mes: "Fev", valor: 58000 },
  { mes: "Mar", valor: 51000 },
  { mes: "Abr", valor: 67000 },
  { mes: "Mai", valor: 73000 },
  { mes: "Jun", valor: 82000 },
]

const lembretes = [
  { id: 1, titulo: "Reunião com cliente ABC", data: "28/04 às 09:00", tipo: "reuniao" },
  { id: 2, titulo: "Vencimento fatura #1042", data: "29/04 às 18:00", tipo: "vencimento" },
  { id: 3, titulo: "Entrega relatório mensal", data: "30/04 às 12:00", tipo: "tarefa" },
  { id: 4, titulo: "Revisão de contratos", data: "01/05 às 14:00", tipo: "tarefa" },
  { id: 5, titulo: "Pagamento fornecedor XYZ", data: "02/05 às 10:00", tipo: "vencimento" },
]

export default function Dashboard() {
  return (
    <div className="dashboard-page">

      <h1>Dashboard</h1>

      {/* Cards */}
      <div className="cards">
        <div className="card">
          <h3>Empresas</h3>
        </div>
        <div className="card">
          <h3>Usuários</h3>
        </div>
        <div className="card">
          <h3>Faturamento</h3>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="dashboard-grid">

        {/* Gráfico */}
        <div className="dashboard-box">
          <div className="box-header">
            <span className="box-title">Faturamento Mensal</span>
            <span className="box-badge">2026</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dadosFaturamento} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, "Faturamento"]}
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}
              />
              <Bar dataKey="valor" fill="#2d6a2d" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lembretes */}
        <div className="dashboard-box">
          <div className="box-header">
            <span className="box-title">Próximos Lembretes</span>
            <span className="box-badge">{lembretes.length}</span>
          </div>
          <ul className="lembretes">
            {lembretes.map(l => (
              <li key={l.id} className={`lembrete lembrete-${l.tipo}`}>
                <div className="lembrete-dot" />
                <div className="lembrete-info">
                  <span className="lembrete-titulo">{l.titulo}</span>
                  <span className="lembrete-data">{l.data}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
