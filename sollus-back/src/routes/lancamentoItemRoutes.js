const express = require("express")

const router = express.Router()

const {
  getAll,
  getById,
  getTiposCustoPorCentro,
  getTitulosPorPessoa,
  getDuplicatasPorTitulo,
  create,
  update,
  remove
} = require("../controllers/lancamentoItemController")

router.get("/", getAll)
router.get("/tipos-custo", getTiposCustoPorCentro)
router.get("/titulos", getTitulosPorPessoa)
router.get("/duplicatas", getDuplicatasPorTitulo)
router.get("/:id", getById)
router.post("/", create)
router.put("/:id", update)
router.delete("/:id", remove)

module.exports = router