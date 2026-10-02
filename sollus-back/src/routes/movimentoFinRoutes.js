const express = require("express")
const router = express.Router()
const { getAll, getById, create, update, remove, validar } = require("../controllers/movimentoFinController")

router.get("/", getAll)
router.get("/:id", getById)
router.post("/", create)
router.put("/:id", update)
router.delete("/:id", remove)
router.post("/:id/validar", validar)

module.exports = router