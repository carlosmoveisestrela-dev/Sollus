import React, { useState } from "react"
import Layout from "../layouts/layout.jsx"
import "../styles/lancamentoItem.css"

export default function LancamentoItem() {

    const [undNegCodigo, setUndNegCodigo] = useState("")
    const [pessoaCodigo, setPessoaCodigo] = useState("")
    const [titulo, setTitulo] = useState("")
    const [itemCodigo, setItemCodigo] = useState("")
    const [centroCustoCodigo, setCentroCustoCodigo] = useState("")
    const [tipoCustoCodigo, setTipoCustoCodigo] = useState("")
    const [eventoLancamentoCodigo, setEventoLancamentoCodigo] = useState("")
    const [observacao, setObservacao] = useState("")
    const [quant, setQuant] = useState(0)
    const [vlrUnit, setVlrUnit] = useState(0)
    const [vlrFrete, setVlrFrete] = useState(0)

    const vlrTotal = quant * (Number(vlrUnit) + Number(vlrFrete))

    const salvar = () => {

        const lancamentoItem = {
            Und_Neg_Codigo: undNegCodigo,
            Pessoa_Codigo: pessoaCodigo,
            Titulo: titulo,
            Item_codigo: itemCodigo,
            Centro_custo_codigo: centroCustoCodigo,
            Tipo_custo_codigo: tipoCustoCodigo,
            Evento_lancamento_codigo: eventoLancamentoCodigo,
            Observacao_lancamento: observacao,
            Quant: quant,
            Vlr_Unit: vlrUnit,
            Vlr_Frete_unitario: vlrFrete,
            Vlr_Total: vlrTotal
        }

        console.log(lancamentoItem)
    }

    return (
        <Layout>

            <div className="pagina">

                <h2>Lançamento Item</h2>

                <div className="form-grid">

                    <div className="campo">
                        <label>Und Neg Código</label>
                        <input type="text" />
                    </div>

                    <div className="campo">
                        <label>Pessoa Código</label>
                        <input type="text" />
                    </div>

                    <div className="campo">
                        <label>Título</label>
                        <input type="text" />
                    </div>

                    <div className="campo">
                        <label>Item Código</label>
                        <input type="text" />
                    </div>

                    <div className="campo">
                        <label>Centro Custo</label>
                        <input type="text" />
                    </div>

                    <div className="campo">
                        <label>Tipo Custo</label>
                        <input type="text" />
                    </div>

                    <div className="campo">
                        <label>Evento Lançamento</label>
                        <input type="text" />
                    </div>

                    <div className="campo">
                        <label>Observação</label>
                        <input type="text" />
                    </div>

                    <div className="campo">
                        <label>Quantidade</label>
                        <input type="number" />
                    </div>

                    <div className="campo">
                        <label>Valor Unitário</label>
                        <input type="number" />
                    </div>

                    <div className="campo">
                        <label>Frete Unitário</label>
                        <input type="number" />
                    </div>

                    <div className="campo">
                        <label>Valor Total</label>
                        <input type="number" disabled />
                    </div>

                </div>

                <button className="btn-salvar" onClick={salvar}>
                    Salvar Item
                </button>

            </div>

        </Layout >
    )
}