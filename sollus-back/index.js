const express = require("express")
const cors = require("cors")
require("dotenv").config()

const empresaRoutes = require("./src/routes/CadastroRoutes/empresaRoutes")
const pessoaRoutes = require("./src/routes/CadastroRoutes/pessoaRoutes")
const uniNegocioRoutes = require("./src/routes/CadastroRoutes/uniNegocioRoutes")
const centroCustoRoutes = require("./src/routes/CadastroRoutes/centroCustoRoutes")
const tipoLancamentoRoutes = require("./src/routes/CadastroRoutes/tipoLancamentoRoutes")
const origemLancamentoRoutes = require("./src/routes/CadastroRoutes/origemLancamentoRoutes")
const carteiraRoutes = require("./src/routes/CadastroRoutes/carteiraRoutes")
const tipoCustoRoutes = require("./src/routes/CadastroRoutes/tipoCustoRoutes")
const itemRoutes = require("./src/routes/CadastroRoutes/itemRoutes")
const categoriaRoutes = require("./src/routes/CadastroRoutes/categoriaRoutes")
const eventoLancamentoRoutes = require("./src/routes/CadastroRoutes/eventoLancamentoRoutes")
const movimentoFinRoutes = require("./src/routes/movimentoFinRoutes")
const lancamentoItemRoutes = require("./src/routes/lancamentoItemRoutes")

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001

app.get("/", (req, res) => {
  res.json({ message: "API Sollus funcionando!" })
})

app.use("/empresa", empresaRoutes)
app.use("/pessoa", pessoaRoutes)
app.use("/uni-negocio", uniNegocioRoutes)
app.use("/centro-custo", centroCustoRoutes)
app.use("/tipo-lancamento", tipoLancamentoRoutes)
app.use("/origem-lancamento", origemLancamentoRoutes)
app.use("/carteira", carteiraRoutes)
app.use("/tipo-custo", tipoCustoRoutes)
app.use("/item", itemRoutes)
app.use("/categoria", categoriaRoutes)
app.use("/evento-lancamento", eventoLancamentoRoutes)
app.use("/movimentofin", movimentoFinRoutes)
app.use("/lancamento-item", lancamentoItemRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})