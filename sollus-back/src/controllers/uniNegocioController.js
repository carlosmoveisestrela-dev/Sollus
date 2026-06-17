const pool = require("../config/database")

// Listar todos
const getAll = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM uni_negocio ORDER BY und_neg_codigo")
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Buscar por código
const getById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM uni_negocio WHERE und_neg_codigo = $1 AND und_neg_nome = $2", [id, req.body.und_neg_nome])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Criar
const create = async (req, res) => {
  try {
    const { und_neg_codigo, und_neg_nome } = req.body
    const result = await pool.query(
      "INSERT INTO uni_negocio (und_neg_codigo, und_neg_nome) VALUES ($1, $2) RETURNING *",
      [und_neg_codigo, und_neg_nome]
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
    const { und_neg_codigo, und_neg_nome } = req.body
    const result = await pool.query(
      "UPDATE uni_negocio SET und_neg_codigo = $1, und_neg_nome = $2 WHERE und_neg_codigo = $3 RETURNING *",
      [und_neg_codigo, und_neg_nome, id]
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
    const result = await pool.query("DELETE FROM uni_negocio WHERE und_neg_codigo = $1 RETURNING *", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }