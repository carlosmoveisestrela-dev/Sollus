import React, { useState, useEffect } from "react"
import { Select, Modal, Input, message } from "antd"
import Layout from "../layouts/Layout"
import "../../styles/cadastroPessoa.css"
import { mascararCelular, celularValido, apenasNumeros } from "../../utils/telefone"

const API_URL = import.meta.env.VITE_API_URL

export default function CadastroPessoa() {

  const [buscar, setBuscar] = useState("")
  const [pessoas, setPessoas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanhoPagina, setTamanhoPagina] = useState(12)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [pessoaEdicao, setPessoaEdicao] = useState(null)
  const [nomeEditando, setNomeEditando] = useState("")
  const [telefoneEditando, setTelefoneEditando] = useState("")
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  // Estado e Cidade (via API do IBGE)
  const [estados, setEstados] = useState([])
  const [cidades, setCidades] = useState([])
  const [estadoSelecionado, setEstadoSelecionado] = useState(null)
  const [cidadeSelecionada, setCidadeSelecionada] = useState(null)
  const [carregandoCidades, setCarregandoCidades] = useState(false)

  async function buscarPessoas() {
    setCarregando(true)
    try {
      const response = await fetch(
        `${API_URL}/pessoa?page=${pagina}&limit=${tamanhoPagina}&busca=${encodeURIComponent(buscar)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar pessoas")
      }

      setPessoas(data.dados ?? [])
      setTotalPaginas(data.totalPaginas ?? 1)
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error)
      setPessoas([])
      message.error("Não foi possível conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  // Busca a lista de estados (UFs) uma vez, quando o modal abre
  useEffect(() => {
    if (modalAberto) {
      fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
        .then((res) => res.json())
        .then((data) => setEstados(Array.isArray(data) ? data : []))
        .catch((error) => {
          console.error("Erro ao buscar estados:", error)
          setEstados([])
          message.error("Não foi possível carregar a lista de estados")
        })
    }
  }, [modalAberto])

  // Sempre que o estado selecionado mudar, busca as cidades daquele estado
  useEffect(() => {
    if (!estadoSelecionado) {
      setCidades([])
      return
    }

    setCarregandoCidades(true)
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
      .then((res) => res.json())
      .then((data) => setCidades(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error("Erro ao buscar cidades:", error)
        setCidades([])
        message.error("Não foi possível carregar as cidades")
      })
      .finally(() => setCarregandoCidades(false))
  }, [estadoSelecionado])

  useEffect(() => {
    buscarPessoas()
  }, [pagina, tamanhoPagina])

  useEffect(() => {
    setPagina(1)
    buscarPessoas()
  }, [buscar])

  function handleTamanhoPaginaChange(valor) {
    setTamanhoPagina(valor)
    setPagina(1)
  }

  // Aplica a máscara (11) 91234-5678 enquanto o usuário digita
  function handleTelefoneChange(e) {
    setTelefoneEditando(mascararCelular(e.target.value))
  }

  // Quando o usuário troca o Estado, limpa a cidade escolhida (ela pertencia ao estado anterior)
  function handleSelecionarEstado(uf) {
    setEstadoSelecionado(uf)
    setCidadeSelecionada(null)
  }

  function abrirModalCadastro() {
    setModoEdicao(false)
    setPessoaEdicao(null)
    setNomeEditando("")
    setTelefoneEditando("")
    setEstadoSelecionado(null)
    setCidadeSelecionada(null)
    setModalAberto(true)
  }

  function abrirModalEdicao(pessoa) {
    setModoEdicao(true)
    setPessoaEdicao(pessoa)
    setNomeEditando(pessoa.pessoa_nome)
    setTelefoneEditando(mascararCelular(pessoa.pessoa_contato_fone ?? ""))
    setEstadoSelecionado(pessoa.pessoa_estado ?? null)
    setCidadeSelecionada(pessoa.pessoa_cidade ?? null)
    setModalAberto(true)
  }

  function handleInserirClick(e) {
    e.preventDefault()
    abrirModalCadastro()
  }

  function fecharModalEdicao() {
    setModalAberto(false)
    setModoEdicao(false)
    setPessoaEdicao(null)
    setNomeEditando("")
    setTelefoneEditando("")
    setEstadoSelecionado(null)
    setCidadeSelecionada(null)
  }

  async function salvarEdicao() {
    if (!nomeEditando || nomeEditando.trim() === "") {
      message.error("O nome da pessoa é obrigatório")
      return
    }

    if (!telefoneEditando || !celularValido(telefoneEditando)) {
      message.error("Informe um celular válido: (DDD) 9XXXX-XXXX")
      return
    }

    setSalvandoEdicao(true)
    try {
      const url = modoEdicao
        ? `${API_URL}/pessoa/${pessoaEdicao.pessoa_codigo}`
        : `${API_URL}/pessoa`
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pessoa_nome: nomeEditando,
          pessoa_estado: estadoSelecionado,
          pessoa_cidade: cidadeSelecionada,
          pessoa_contato_fone: apenasNumeros(telefoneEditando)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar pessoa")
      }

      message.success("Pessoa salva com sucesso")
      fecharModalEdicao()
      buscarPessoas()
    } catch (error) {
      console.error("Erro ao salvar pessoa:", error)
      message.error("Não foi possível salvar a pessoa")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  function abrirModalExcluirDoEdicao() {
    if (!pessoaEdicao) return
    setModalExcluirAberto(true)
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false)
  }

  async function confirmarExclusao() {
    if (!pessoaEdicao) return
    setExcluindo(true)
    try {
      await fetch(`${API_URL}/pessoa/${pessoaEdicao.pessoa_codigo}`, {
        method: "DELETE",
      })
      message.success("Pessoa excluída com sucesso")
      fecharModalExcluir()
      fecharModalEdicao()
      buscarPessoas()
    } catch (error) {
      console.error("Erro ao excluir pessoa:", error)
      message.error("Não foi possível excluir a pessoa")
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <form className="formulario" onSubmit={handleInserirClick}>

      {/* Pessoa */}
      <h2>Cadastro Pessoa</h2>
      <div className="grupo">
        <div className="campo">
          <label>Buscar Pessoa</label>
          <div className="search-wrapper">
            <span className="search-icon"></span>
            <input
              type="text"
              placeholder="Digite o nome da pessoa..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
            />
            <button type="submit" className="inserir">Inserir</button>
          </div>
        </div>
      </div>

      {/* Listagem de pessoas */}
      <div className="lista-header-controle">
        <h2>Pessoas Cadastradas</h2>
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

      {/* Lista de Pessoas */}
      <div className="lista-empresas">
        <table>
          <thead>
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Nome</th>
              <th scope="col">Telefone</th>
              <th scope="col">Cidade</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={5} className="vazio">Carregando...</td>
              </tr>
            ) : pessoas.length === 0 ? (
              <tr>
                <td colSpan={5} className="vazio">Nenhuma Pessoa Cadastrada</td>
              </tr>
            ) : (
              pessoas.map((pessoa) => (
                <tr
                  onDoubleClick={() => abrirModalEdicao(pessoa)}
                  className="empresa-row"
                  key={String(pessoa.pessoa_codigo)}
                >
                  <td className="codigo">{pessoa.pessoa_codigo}</td>
                  <td>{pessoa.pessoa_nome}</td>
                  <td>{mascararCelular(pessoa.pessoa_contato_fone)}</td>
                  <td>{pessoa.pessoa_cidade}</td>
                  <td>{pessoa.pessoa_estado}</td>
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
        title={modoEdicao ? "Editar Pessoa" : "Cadastrar Pessoa"}
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
          Nome da Pessoa
        </label>
        <Input
          value={nomeEditando}
          onChange={(e) => setNomeEditando(e.target.value)}
          placeholder="Nome da Pessoa"
          onPressEnter={salvarEdicao}
        />

        <label style={{ fontSize: 12, color: "#555", display: "block", marginTop: 12, marginBottom: 5 }}>
          Telefone
        </label>
        <Input
          value={telefoneEditando}
          onChange={handleTelefoneChange}
          placeholder="(11) 91234-5678"
          maxLength={15}
        />

        <label style={{ fontSize: 12, color: "#555", display: "block", marginTop: 12, marginBottom: 5 }}>
          Estado
        </label>
        <Select
          style={{ width: "100%" }}
          value={estadoSelecionado}
          onChange={handleSelecionarEstado}
          placeholder="Selecione o estado"
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={estados.map((uf) => ({
            value: uf.sigla,
            label: `${uf.nome} (${uf.sigla})`,
          }))}
        />

        <label style={{ fontSize: 12, color: "#555", display: "block", marginTop: 12, marginBottom: 5 }}>
          Cidade
        </label>
        <Select
          style={{ width: "100%" }}
          value={cidadeSelecionada}
          onChange={setCidadeSelecionada}
          placeholder={estadoSelecionado ? "Selecione a cidade" : "Selecione um estado primeiro"}
          disabled={!estadoSelecionado}
          loading={carregandoCidades}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={cidades.map((c) => ({
            value: c.nome,
            label: c.nome,
          }))}
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
        <p>Tem certeza que deseja excluir esta pessoa?</p>
      </Modal>

    </form>
  )
}