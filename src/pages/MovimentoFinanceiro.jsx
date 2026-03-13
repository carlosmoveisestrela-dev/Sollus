import React, { useState } from "react"
import Layout from "../layouts/layout.jsx"
import "../styles/movimentoFinanceiro.css"

export default function MovimentoFinanceiro() {

    const [empresaCodigo, setEmpresaCodigo] = useState("")
    const [pessoaCodigo, setPessoaCodigo] = useState("")
    const [titulo, setTitulo] = useState("")
    const [duplicata, setDuplicata] = useState("")
    const [dtEmissao, setDtEmissao] = useState("")
    const [dtVencimento, setDtVencimento] = useState("")
    const [dtPagamento, setDtPagamento] = useState("")
    const [tipoLancamentoCodigo, setTipoLancamentoCodigo] = useState("")
    const [origemLancamentoCodigo, setOrigemLancamentoCodigo] = useState("")

    const dtLancamento = new Date().toISOString().split("T")[0]

    const salvarMovimento = () => {

        const movimentoFinanceiro = {
            Empresa_Codigo: empresaCodigo,
            Pessoa_Codigo: pessoaCodigo,
            Titulo: titulo,
            Duplicata: duplicata,
            Dt_Emissao: dtEmissao,
            Dt_Vencimento: dtVencimento,
            Dt_Pagamento: dtPagamento,
            Dt_Lancamento: dtLancamento,
            Tipo_lancamento_codigo: tipoLancamentoCodigo,
            Origem_lancamento_codigo: origemLancamentoCodigo
        }

        console.log("Movimento Financeiro:", movimentoFinanceiro)
    }

    return (
        <Layout>

            <div className="pagina">

                <h2>Movimento Financeiro</h2>

                <div className="form-grid">

                    <div className="campo">
                        <label>Empresa</label>
                        <input
                            type="number"
                            value={empresaCodigo}
                            onChange={(e) => setEmpresaCodigo(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Pessoa</label>
                        <input
                            type="number"
                            value={pessoaCodigo}
                            onChange={(e) => setPessoaCodigo(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Título</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Duplicata</label>
                        <input
                            type="text"
                            value={duplicata}
                            onChange={(e) => setDuplicata(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Data Emissão</label>
                        <input
                            type="date"
                            value={dtEmissao}
                            onChange={(e) => setDtEmissao(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Data Vencimento</label>
                        <input
                            type="date"
                            value={dtVencimento}
                            onChange={(e) => setDtVencimento(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Data Pagamento</label>
                        <input
                            type="date"
                            value={dtPagamento}
                            onChange={(e) => setDtPagamento(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Data Lançamento</label>
                        <input
                            type="date"
                            value={dtLancamento}
                            disabled
                        />
                    </div>

                    <div className="campo">
                        <label>Tipo Lançamento</label>
                        <input
                            type="number"
                            value={tipoLancamentoCodigo}
                            onChange={(e) => setTipoLancamentoCodigo(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Origem Lançamento</label>
                        <input
                            type="number"
                            value={origemLancamentoCodigo}
                            onChange={(e) => setOrigemLancamentoCodigo(e.target.value)}
                        />
                    </div>

                </div>

                <button className="btn-salvar" onClick={salvarMovimento}>
                    Salvar Movimento
                </button>

            </div>

        </Layout>
    )
}