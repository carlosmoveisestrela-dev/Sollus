import React, { useState, useEffect } from "react"
import { Select, Modal, Input, message } from "antd"
import Layout from "../../layouts/layout.jsx"
import "../../styles/cadastroTipoCusto.css"

export default function CadastroTipoCusto() {

  const [buscar, setBuscar] = useState("")
  const [tipoCustos, setTipoCustos] = useState([])
  const [centroCustos, setCentroCustos] = useState([])
  const [centroCustoSelecionado, setCentroCustoSelecionado] = useState(null)
  const [carteiraAutomatica, setCarteiraAutomatica] = useState("")
  const [saidaReal, setSaidaReal] = useState("N")
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanhoPagina, setTamanhoPagina] = useState(12)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [tipoCustoEdicao, setTipoCustoEdicao] = useState(null)
  const [nomeEditando, setNomeEditando] = useState("")
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  async function buscarTipoCusto() {
    setCarregando(true)
    try {
      const response = await fetch(
        `http://localhost:3001/tipo-custo?page=${pagina}&limit=${tamanhoPagina}&busca=${encodeURIComponent(buscar)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar tipo de custo")
      }

      setTipoCustos(data.dados ?? [])
      setTotalPaginas(data.totalPaginas ?? 1)
    } catch (error) {
      console.error("Erro ao buscar tipo de custo:", error)
      setTipoCustos([])
      message.error("Não foi possível conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    if (modalAberto) {
      fetch("http://localhost:3001/centro-custo/simples")
        .then((res) => res.json())
        .then((data) => setCentroCustos(Array.isArray(data) ? data : []))
        .catch((error) => {
          console.error("Erro ao buscar centros de custo:", error)
          setCentroCustos([])
          message.error("Não foi possível carregar os centros de custo")
        })
    }
  }, [modalAberto])

  useEffect(() => {
    buscarTipoCusto()
  }, [pagina, tamanhoPagina])

  useEffect(() => {
    setPagina(1)
    buscarTipoCusto()
  }, [buscar])

  function handleTamanhoPaginaChange(valor) {
    setTamanhoPagina(valor)
    setPagina(1)
  }

  // Preenche Carteira automaticamente a partir do Centro de Custo escolhido
  function handleSelecionarCentroCusto(centroCustoCodigo) {
    setCentroCustoSelecionado(centroCustoCodigo)
    const centro = centroCustos.find((cc) => cc.centro_custo_codigo === centroCustoCodigo)
    setCarteiraAutomatica(centro ? centro.carteira_nome : "")
  }

  function abrirModalCadastro() {
    setModoEdicao(false)
    setTipoCustoEdicao(null)
    setNomeEditando("")
    setCentroCustoSelecionado(null)
    setCarteiraAutomatica("")
    setSaidaReal("N")
    setModalAberto(true)
  }

  function abrirModalEdicao(tipoCusto) {
    setModoEdicao(true)
    setTipoCustoEdicao(tipoCusto)
    setNomeEditando(tipoCusto.tipo_custo_nome)
    setCentroCustoSelecionado(tipoCusto.centro_custo_codigo ?? null)
    setCarteiraAutomatica(tipoCusto.carteira_nome ?? "")
    setSaidaReal(tipoCusto.saida_real ?? "N")
    setModalAberto(true)
  }

  function handleInserirClick(e) {
    e.preventDefault()
    abrirModalCadastro()
  }

  function handleExcluirClick(tipoCusto) {
    setTipoCustoEdicao(tipoCusto)
    setModalExcluirAberto(true)
  }

  function fecharModalEdicao() {
    setModalAberto(false)
    setModoEdicao(false)
    setTipoCustoEdicao(null)
    setNomeEditando("")
    setCentroCustoSelecionado(null)
    setCarteiraAutomatica("")
    setSaidaReal("N")
  }

  async function salvarEdicao() {
    if (!nomeEditando || nomeEditando.trim() === "") {
      message.error("O nome do tipo de custo é obrigatório")
      return
    }

    if (!centroCustoSelecionado) {
      message.error("Selecione um centro de custo")
      return
    }

    setSalvandoEdicao(true)
    try {
      const url = modoEdicao
        ? `http://localhost:3001/tipo-custo/${tipoCustoEdicao.tipo_custo_codigo}`
        : "http://localhost:3001/tipo-custo"
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo_custo_nome: nomeEditando,
          centro_custo_codigo: centroCustoSelecionado,
          saida_real: saidaReal,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar tipo de custo")
      }

      message.success("Tipo de custo salvo com sucesso")
      fecharModalEdicao()
      buscarTipoCusto()
    } catch (error) {
      console.error("Erro ao salvar tipo de custo:", error)
      message.error("Não foi possível salvar o tipo de custo")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  function abrirModalExcluirDoEdicao() {
    if (!tipoCustoEdicao) return
    setModalExcluirAberto(true)
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false)
    setTipoCustoEdicao(null)
  }

  async function confirmarExclusao() {
    if (!tipoCustoEdicao) return
    setExcluindo(true)
    try {
      await fetch(`http://localhost:3001/tipo-custo/${tipoCustoEdicao.tipo_custo_codigo}`, {
        method: "DELETE",
      })
      message.success("Tipo de custo excluído com sucesso")
      fecharModalExcluir()
      fecharModalEdicao()
      buscarTipoCusto()
    } catch (error) {
      console.error("Erro ao excluir tipo de custo:", error)
      message.error("Não foi possível excluir o tipo de custo")
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <form className="formulario" onSubmit={handleInserirClick}>

      <h2>Cadastro Tipo de Custo</h2>
      <div className="grupo">
        <div className="campo">
          <label>Buscar Tipo de Custo</label>
          <div className="search-wrapper">
            <span className="search-icon"></span>
            <input
              type="text"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar tipo de custo"
            />
            <button type="submit" className="inserir">Inserir</button>
          </div>
        </div>
      </div>

      {/* Listagem de tipos de custo */}
      <div className="lista-header-controle">
        <h2>Tipos de Custo Cadastrados</h2>
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

      {/* Lista de Tipos de Custo */}
      <div className="lista-empresas">
        <table>
          <thead>
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Tipo de Custo</th>
              <th scope="col">Código</th>
              <th scope="col">Centro de Custo</th>
              <th scope="col">Código</th>
              <th scope="col">Carteira</th>
              <th scope="col">Saída Real</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={7} className="vazio">Carregando...</td>
              </tr>
            ) : tipoCustos.length === 0 ? (
              <tr>
                <td colSpan={7} className="vazio">Nenhum Tipo de Custo Cadastrado</td>
              </tr>
            ) : (
              tipoCustos.map((tipoCusto) => (
                <tr
                  onDoubleClick={() => abrirModalEdicao(tipoCusto)}
                  className="empresa-row"
                  key={String(tipoCusto.tipo_custo_codigo)}
                >
                  <td className="codigo">{tipoCusto.tipo_custo_codigo}</td>
                  <td>{tipoCusto.tipo_custo_nome}</td>
                  <td className="codigo">{tipoCusto.centro_custo_codigo}</td>
                  <td>{tipoCusto.centro_custo_nome}</td>
                  <td className="codigo">{tipoCusto.carteira_codigo}</td>
                  <td>{tipoCusto.carteira_nome}</td>
                  <td>{tipoCusto.saida_real === "S" ? "S" : "N"}</td>
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
            Próxima
          </button>
        </div>
      </div>

      {/* Modal de cadastro/edição */}
      <Modal
        title={modoEdicao ? "Editar Tipo de Custo" : "Cadastrar Tipo de Custo"}
        open={modalAberto}
        onCancel={fecharModalEdicao}
        onOk={salvarEdicao}
        okText={salvandoEdicao ? "Salvando..." : "Salvar"}
        cancelText="Cancelar"
        confirmLoading={salvandoEdicao}
        footer={(_, { CancelBtn, OkBtn }) => (
          <div style={{ display: "flex", justifyContent: modoEdicao ? "space-between" : "flex-end", alignItems: "center" }}>
            {modoEdicao && (
              <button type="button" className="excluir" onClick={abrirModalExcluirDoEdicao}>
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
          Nome do Tipo de Custo
        </label>
        <Input
          value={nomeEditando}
          onChange={(e) => setNomeEditando(e.target.value)}
          placeholder="Digite o nome do tipo de custo"
          onPressEnter={salvarEdicao}
        />

        <label style={{ fontSize: 12, color: "#555", display: "block", marginTop: 12, marginBottom: 5 }}>
          Centro de Custo
        </label>
        <Select
          style={{ width: "100%" }}
          value={centroCustoSelecionado}
          onChange={handleSelecionarCentroCusto}
          placeholder="Selecione o centro de custo"
          options={centroCustos.map((cc) => ({
            value: cc.centro_custo_codigo,
            label: cc.centro_custo_nome,
          }))}
        />

        <label style={{ fontSize: 12, color: "#555", display: "block", marginTop: 12, marginBottom: 5 }}>
          Carteira
        </label>
        <Input value={carteiraAutomatica} disabled placeholder="Selecione um centro de custo" />

        <label style={{ fontSize: 12, color: "#555", display: "block", marginTop: 12, marginBottom: 5 }}>
          Saída Real
        </label>
        <Select
          style={{ width: "100%" }}
          value={saidaReal}
          onChange={setSaidaReal}
          options={[
            { value: "S", label: "Sim" },
            { value: "N", label: "Não" },
          ]}
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
        <p>Tem certeza que deseja excluir este tipo de custo?</p>
      </Modal>
    </form>
  )
}