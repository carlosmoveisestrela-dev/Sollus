import React, { useEffect, useState } from "react"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroEmpresa.css"
import { message, Select, Modal, Input } from "antd"

export default function CadastroCentroCusto() {

  const [form, setForm] = useState({
    centro_custo_nome: ""
  })


  const [busca, setBusca] = useState("")
  const [centroCustos, setCentroCustos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanhoPagina, setTamanhoPagina] = useState(12)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [centroCustoEdicao, setCentroCustoEdicao] = useState(null)
  const [nomeEditando, setNomeEditando] = useState("")
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function buscarCentroCusto() {
    setCarregando(true)
    try {
      const response = await fetch(
        `http://localhost:3001/centro-custo?page=${pagina}&limit=${tamanhoPagina}&busca=${encodeURIComponent(busca)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar centro de custo")
      }

      setCentroCustos(data.dados ?? [])
      setTotalPaginas(data.totalPaginas ?? 1)
    } catch (error) {
      console.error("Erro ao buscar centro de custo:", error)
      setCentroCustos([])
      message.error("Não foi possível conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarCentroCusto()
  }, [pagina, tamanhoPagina])

  useEffect(() => {
    setPagina(1)
    buscarCentroCusto()
  }, [busca])

  function handleTamanhoPaginaChange(valor) {
    setTamanhoPagina(valor)
    setPagina(1)
  }

  function abrirModalCadastro() {
    setModoEdicao(false)
    setCentroCustoEdicao(null)
    setNomeEditando("")
    setModalAberto(true)
  }

  function abrirModalEdicao(centroCusto) {
    setModoEdicao(true)
    setCentroCustoEdicao(centroCusto)
    setNomeEditando(centroCusto.centro_custo_nome)
    setModalAberto(true)
  }

  function handleInserirClick(e) {
    e.preventDefault()
    abrirModalCadastro()
  }

  function fecharModalEdicao() {
    setModalAberto(false)
    setModoEdicao(false)
    setCentroCustoEdicao(null)
    setForm({ centro_custo_nome: "" })
    setNomeEditando("")
  }

  async function salvarEdicao() {
    if (!nomeEditando || nomeEditando.trim() === "") {
      message.warning("O nome do Centro de Custo não pode estar vazio.")
      return
    }

    setSalvandoEdicao(true)
    try {
      const url = modoEdicao
        ? `http://localhost:3001/centro-custo/${centroCustoEdicao.centro_custo_codigo}`
        : "http://localhost:3001/centro-custo"
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ centro_custo_nome: nomeEditando })
      })

      const data = await response.json()

      if (response.ok) {
        message.success(modoEdicao ? "Centro de Custo atualizado com sucesso!" : "Centro de Custo cadastrado com sucesso!")
        fecharModalEdicao()
        buscarCentroCusto()
      } else {
        message.error((modoEdicao ? "Erro ao atualizar Centro de Custo: " : "Erro ao cadastrar Centro de Custo: ") + data.error)
      }
    } catch (error) {
      console.error("Erro ao salvar Centro de Custo:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  function abrirModalExcluirDoEdicao() {
    if (!centroCustoEdicao) return
    setModalExcluirAberto(true)
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false)
  }

  async function confirmarExclusao() {
    if (!centroCustoEdicao) return
    setExcluindo(true)
    try {
      await fetch(`http://localhost:3001/centro-custo/${centroCustoEdicao.centro_custo_codigo}`, {
        method: "DELETE"
      })
      message.success("Centro de Custo excluído com sucesso!")
      fecharModalExcluir()
      fecharModalEdicao()
      buscarCentroCusto()
    } catch (error) {
      console.error("Erro ao excluir Centro de Custo:", error)
      message.error("Não foi possível conectar à API")
    } finally {
      setExcluindo(false)
    }
  }


  return (
    <form className="formulario" onSubmit={handleInserirClick}>

      {/* Centro de Custo */}
      <h2>Cadastro Centro de Custo</h2>
      <div className="grupo">
        <div className="campo">
          <label>Buscar Centro de Custo</label>
          <div className="search-wrapper">
            <span className="search-icon"></span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar Cen.Custo..."
            />
            <button type="submit" className="inserir">Inserir</button>
          </div>
        </div>
      </div>

      {/* Listagem de centro de custo */}
      <div className="lista-header-controle">
        <h2>Centros de Custo Cadastradas</h2>
        <div className="seletor-tamanho">
          <label>Itens por página:</label>
          <Select
            value={tamanhoPagina}
            onChange={handleTamanhoPaginaChange}
            options={[
              { value: 12, label: "12" },
              { value: 20, label: "20" },
              { value: 50, label: "50" },
              { value: 100, label: "100" },
            ]}
            style={{ width: 80 }}
          />
        </div>
      </div>

      {/* Lista de Centro de Custo */}
      <div className="lista-empresas">
        <table>
          <thead>
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Nome</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={2} className="vazio">Carregando...</td>
              </tr>
            ) : centroCustos.length === 0 ? (
              <tr>
                <td colSpan={2} className="vazio">Nenhum Centro de Custo Cadastrado</td>
              </tr>
            ) : (
              centroCustos.map((centroCusto) => (
                <tr
                  onDoubleClick={() => abrirModalEdicao(centroCusto)}
                  className="empresa-row"
                  key={String(centroCusto.centro_custo_codigo)}
                >
                  <td className="codigo">{centroCusto.centro_custo_codigo}</td>
                  <td>{centroCusto.centro_custo_nome}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="paginacao">
          <button
            type="button"
            disabled={pagina === 1}
            onClick={() => setPagina(p => p - 1)}
          >
            Anterior
          </button>

          <span>Página {pagina} de {totalPaginas}</span>

          <button
            type="button"
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(p => p + 1)}
          >
            Próximo
          </button>
        </div>
      </div>

      {/* Modal de cadastro/edição */}
      <Modal
        title={modoEdicao ? "Editar Centro de Custo" : "Cadastrar Centro de Custo"}
        open={modalAberto}
        onCancel={fecharModalEdicao}
        onOk={salvarEdicao}
        okText={salvandoEdicao ? "Salvando..." : "Salvar"}
        cancelText="Cancelar"
        confirmLoading={salvandoEdicao}
        footer={(_, { CancelBtn, OkBtn }) => (
          <div style={{ display: "flex", justifyContent: modoEdicao ? "space-between" : "flex-end", alignItems: "center" }}>
            {modoEdicao && (
              <button
                type="button"
                className="excluir"
                onClick={abrirModalExcluirDoEdicao}
              >
                Excluir
              </button>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <CancelBtn />
              <OkBtn />
            </div>
          </div>
        )}
      >
        <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 5 }}>
          Nome do Centro de Custo
        </label>
        <Input
          value={nomeEditando}
          onChange={(e) => setNomeEditando(e.target.value)}
          placeholder="Nome do Centro de Custo"
          onPressEnter={salvarEdicao}
        />
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        title="Confirmação"
        open={modalExcluirAberto}
        onCancel={fecharModalExcluir}
        onOk={confirmarExclusao}
        okText="Excluir"
        cancelText="Cancelar"
        confirmLoading={excluindo}
        okButtonProps={{ danger: true }}
      >
        <p>Tem certeza que deseja excluir este centro de custo?</p>
      </Modal>
    </form>
  )
}