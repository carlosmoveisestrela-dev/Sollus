import React, { useState } from "react"
import Layout from "../layouts/layout.jsx"
import "../styles/movimentoFinanceiro.css"

export default function MovimentoFinanceiro() {

    const [uniNegCodigo, setUniNegCodigo] = useState("")
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
            Uni_Neg_Codigo: uniNegCodigo, 
            Empresa_Codigo: empresaCodigo,
            Pessoa_Codigo: pessoaCodigo,
            Titulo: titulo,
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
            <div className="pagina">

                <h2>Movimento Financeiro</h2>

                <div className="form-grid">

                    <div className="campo">
                        <label>ID Unidade Negócio</label>
                        <input
                            type="number"
                            value={uniNegCodigo}
                            onChange={(e) => setEmpresaCodigo(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>ID Empresa</label>
                        <input
                            type="number"
                            value={pessoaCodigo}
                            onChange={(e) => setPessoaCodigo(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>ID Pessoa</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Titulo</label>
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
                        <label>Cod. Centro Custo</label>
                        <input
                            type="number"
                            value={tipoLancamentoCodigo}
                            onChange={(e) => setTipoLancamentoCodigo(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Cod. Tipo Custo</label>
                        <input
                            type="number"
                            value={origemLancamentoCodigo}
                            onChange={(e) => setOrigemLancamentoCodigo(e.target.value)}
                        />
                    </div>
                    
                    <div className="campo">
                        <label>Cod. Tipo Lançamento</label>
                        <input
                            type="number"
                            value={origemLancamentoCodigo}
                            onChange={(e) => setOrigemLancamentoCodigo(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Cod. Origem Lançamento</label>
                        <input
                            type="number"
                            value={origemLancamentoCodigo}
                            onChange={(e) => setOrigemLancamentoCodigo(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Cod. Evento Lançamento</label>
                        <input
                            type="number"
                            value={origemLancamentoCodigo}
                            onChange={(e) => setOrigemLancamentoCodigo(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Valor</label>
                        <input
                            type="number"
                            value={origemLancamentoCodigo}
                            onChange={(e) => setOrigemLancamentoCodigo(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Observação Lançamento</label>
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

    )
}