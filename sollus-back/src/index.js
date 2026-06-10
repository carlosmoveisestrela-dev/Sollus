const express = require("express")
const cors = require("cors")
require("dotenv").config()

const uniNegocioRoutes = require("./routes/uniNegocioRoutes")

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001

app.get("/", (req, res) => {
  res.json({ message: "API Sollus funcionando!" })
})

app.use("/uni-negocio", uniNegocioRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})