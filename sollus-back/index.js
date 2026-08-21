const express = require("express")
const cors = require("cors")
require("dotenv").config()

const empresaRoutes = require("./src/routes/empresaRoutes")
const pessoaRoutes = require("./src/routes/pessoaRoutes")
const uniNegocioRoutes = require("./src/routes/uniNegocioRoutes")
const centroCustoRoutes = require("./src/routes/centroCustoRoutes")
const tipoLancamentoRoutes = require("./src/routes/tipoLancamentoRoutes")
const origemLancamentoRoutes = require("./src/routes/origemLancamentoRoutes")
const carteiraRoutes = require("./src/routes/carteiraRoutes")
const tipoCustoRoutes = require("./src/routes/tipoCustoRoutes")
const itemRoutes = require("./src/routes/itemRoutes")
const categoriaRoutes = require("./src/routes/categoriaRoutes")
const eventoLancamentoRoutes = require("./src/routes/eventoLancamentoRoutes")
const movimentoFinRoutes = require("./src/routes/movimentoFinRoutes")

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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})