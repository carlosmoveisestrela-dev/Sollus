const express = require("express")
const router = express.Router()
const { getAll, getAllSimples, getById, create, update, remove } = require("../../controllers/CadastroControllers/centroCustoController")

router.get("/simples", getAllSimples)
router.get("/", getAll)
router.get("/:id", getById)
router.post("/", create)
router.put("/:id", update)
router.delete("/:id", remove)

module.exports = router