import React, { useState, useEffect } from "react"
import { Select, Modal, Input, message } from "antd"
import Layout from "../../layouts/Layout"
import "../../styles/cadastroTipoCusto.css"

const API_URL = import.meta.env.VITE_API_URL

function getPercentualComissao(valor) {
  return valor === "S" ? "3%" : "0%"
}

export default function CadastroTipoCusto() {

  const [buscar, setBuscar] = useState("")
  const [buscaAplicada, setBuscaAplicada] = useState("")
  const [tipoCustos, setTipoCustos] = useState([])
  const [centroCustos, setCentroCustos] = useState([])
  const [centroCustoSelecionado, setCentroCustoSelecionado] = useState(null)
  const [carteiras, setCarteiras] = useState([])
  const [carteiraSelecionada, setCarteiraSelecionada] = useState(null)
  const [saidaReal, setSaidaReal] = useState("N")
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanhoPagina, setTamanhoPagina] = useState(12)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [tipoCustoEdicao, setTipoCustoEdicao] = useState(null)
  const [nomeEditando, setNomeEditando] = useState("")
  const [comissaoAdmin, setComissaoAdmin] = useState("N")
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  // signal é opcional: o useEffect passa um AbortController, e as chamadas
  // manuais (após salvar/excluir) podem chamar sem argumento.
  async function buscarTipoCusto(signal) {
    setCarregando(true)
    try {
      const response = await fetch(
        `${API_URL}/tipo-custo?page=${pagina}&limit=${tamanhoPagina}&busca=${encodeURIComponent(buscaAplicada)}`,
        { signal }
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar tipo de custo")
      }

      setTipoCustos(data.dados ?? [])
      setTotalPaginas(data.totalPaginas ?? 1)
    } catch (error) {
      // Requisição cancelada porque outra mais nova foi disparada: ignora
      if (error.name === "AbortError") return

      console.error("Erro ao buscar tipo de custo:", error)
      setTipoCustos([])
      message.error("Não foi possível conectar à API")
    } finally {
      if (!signal?.aborted) setCarregando(false)
    }
  }

  // Busca a lista de carteiras só quando o modal abre, para popular o select
  useEffect(() => {
    if (modalAberto) {
      fetch(`${API_URL}/carteira?limit=1000`)
        .then((res) => res.json())
        .then((data) => setCarteiras(data.dados ?? []))
        .catch((error) => {
          console.error("Erro ao buscar carteiras:", error)
          setCarteiras([])
          message.error("Não foi possível carregar as carteiras")
        })
    }
  }, [modalAberto])

  useEffect(() => {
    if (modalAberto) {
      fetch(`${API_URL}/centro-custo/simples`)
        .then((res) => res.json())
        .then((data) => setCentroCustos(Array.isArray(data) ? data : []))
        .catch((error) => {
          console.error("Erro ao buscar centros de custo:", error)
          setCentroCustos([])
          message.error("Não foi possível carregar os centros de custo")
        })
    }
  }, [modalAberto])

  // Debounce da busca: só aplica 400ms depois de parar de digitar e volta para a página 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setBuscaAplicada(buscar)
      setPagina(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [buscar])

  // Único efeito que carrega a lista. Cancela a requisição anterior quando
  // pagina, tamanhoPagina ou busca mudam, evitando respostas fora de ordem.
  useEffect(() => {
    const controller = new AbortController()
    buscarTipoCusto(controller.signal)
    return () => controller.abort()
  }, [pagina, tamanhoPagina, buscaAplicada])

  function handleTamanhoPaginaChange(valor) {
    setTamanhoPagina(valor)
    setPagina(1)
  }

  function abrirModalCadastro() {
    setModoEdicao(false)
    setTipoCustoEdicao(null)
    setNomeEditando("")
    setCentroCustoSelecionado(null)
    setCarteiraSelecionada(null)
    setSaidaReal("N")
    setComissaoAdmin("N")
    setModalAberto(true)
  }

  function abrirModalEdicao(tipoCusto) {
    setModoEdicao(true)
    setTipoCustoEdicao(tipoCusto)
    setNomeEditando(tipoCusto.tipo_custo_nome)
    setComissaoAdmin(tipoCusto.comissao_admin ?? "N")
    setCentroCustoSelecionado(tipoCusto.centro_custo_codigo ?? null)
    setCarteiraSelecionada(tipoCusto.carteira_codigo ?? null)
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
    setCarteiraSelecionada(null)
    setSaidaReal("N")
    setComissaoAdmin("N")
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

    if (!carteiraSelecionada) {
      message.error("Selecione uma carteira")
      return
    }

    setSalvandoEdicao(true)
    try {
      const url = modoEdicao
        ? `${API_URL}/tipo-custo/${tipoCustoEdicao.id}`
        : `${API_URL}/tipo-custo`
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo_custo_nome: nomeEditando,
          centro_custo_codigo: centroCustoSelecionado,
          carteira_codigo: carteiraSelecionada,
          comissao_admin: comissaoAdmin,
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
      message.error(error.message || "Não foi possível salvar o tipo de custo")
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
      const response = await fetch(
        `${API_URL}/tipo-custo/${tipoCustoEdicao.id}`,
        { method: "DELETE" }
      )

      // Antes o código mostrava "sucesso" mesmo quando a API retornava erro
      if (!response.ok) {
        let erroApi = "Erro ao excluir tipo de custo"
        try {
          const data = await response.json()
          erroApi = data.error || erroApi
        } catch {
          // resposta sem corpo JSON
        }
        throw new Error(erroApi)
      }

      message.success("Tipo de custo excluído com sucesso")
      fecharModalExcluir()
      fecharModalEdicao()
      buscarTipoCusto()
    } catch (error) {
      console.error("Erro ao excluir tipo de custo:", error)
      message.error(error.message || "Não foi possível excluir o tipo de custo")
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
              <th scope="col">Centro de Custo</th>
              <th scope="col">Código</th>
              <th scope="col">Tipo de Custo</th>
              <th scope="col">Carteira</th>
              <th scope="col">Saída Real</th>
              <th scope="col">Comissão Admin</th>
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
                  key={tipoCusto.id}
                >
                  <td className="codigo">{tipoCusto.centro_custo_codigo}</td>
                  <td>{tipoCusto.centro_custo_nome}</td>
                  <td className="codigo">{tipoCusto.tipo_custo_codigo}</td>
                  <td>{tipoCusto.tipo_custo_nome}</td>
                  <td className="codigo">{tipoCusto.carteira_codigo}</td>
                  <td>{tipoCusto.saida_real === "S" ? "S" : "N"}</td>
                  <td>{getPercentualComissao(tipoCusto.comissao_admin)}</td>
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
            disabled={pagina >= totalPaginas}
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
          onChange={setCentroCustoSelecionado}
          disabled={modoEdicao}
          placeholder="Selecione o centro de custo"
          options={centroCustos.map((cc) => ({
            value: cc.centro_custo_codigo,
            label: cc.centro_custo_nome,
          }))}
        />

        <label style={{ fontSize: 12, color: "#555", display: "block", marginTop: 12, marginBottom: 5 }}>
          Carteira
        </label>
        <Select
          style={{ width: "100%" }}
          value={carteiraSelecionada}
          onChange={setCarteiraSelecionada}
          placeholder="Selecione a carteira"
          options={carteiras.map((c) => ({
            value: c.carteira_codigo,
            label: c.carteira_nome,
          }))}
        />

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

        <label style={{ fontSize: 12, color: "#555", display: "block", marginTop: 12, marginBottom: 5 }}>
          Comissão Administração
        </label>
        <Select
          style={{ width: "100%" }}
          onChange={setComissaoAdmin}
          value={comissaoAdmin}
          options={[
            { value: "S", label: `Sim (${getPercentualComissao("S")})` },
            { value: "N", label: `Não (${getPercentualComissao("N")})` },
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