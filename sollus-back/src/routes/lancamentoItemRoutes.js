const express = require("express")
const router = express.Router()
const { getTitulos, getDuplicatas, getAll, getById, create, update, remove } = require("../controllers/lancamentoItemController")

router.get("/titulos", getTitulos)
router.get("/duplicatas", getDuplicatas)
router.get("/", getAll)
router.get("/:id", getById)
router.post("/", create)
router.put("/:id", update)
router.delete("/:id", remove)

module.exports = router