const pool = require("../config/database")

// Listar todos
const getAll = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categoria ORDER BY categoria_codigo")
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Buscar por código
const getById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM categoria WHERE categoria_codigo = $1 AND categoria_nome = $2", [id, req.body.categoria_nome])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Criar
const create = async (req, res) => {
  try {
    const { categoria_codigo, categoria_nome } = req.body
    const empresa_codigo = Math.floor(100 + Math.random() * 900)  // Gerar código aleatório de 3 dígitos
    const result = await pool.query(
      "INSERT INTO categoria (categoria_codigo, categoria_nome) VALUES ($1, $2) RETURNING *",
      [categoria_codigo, categoria_nome]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Atualizar
const update = async (req, res) => {
  try {
    const { id } = req.params
    const { categoria_codigo, categoria_nome } = req.body
    const result = await pool.query(
      "UPDATE categoria SET categoria_codigo = $1, categoria_nome = $2 WHERE categoria_codigo = $3 RETURNING *",
      [categoria_codigo, categoria_nome, id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Deletar
const remove = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("DELETE FROM categoria WHERE categoria_codigo = $1 RETURNING *", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }