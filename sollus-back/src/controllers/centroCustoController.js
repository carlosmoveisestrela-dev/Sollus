const pool = require("../config/database")

// Listar todos
const getAll = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM centro_custo ORDER BY centro_custo_codigo")
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Buscar por código
const getById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM centro_custo WHERE centro_custo_codigo = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Criar
const create = async (req, res) => {
  try {
    const { centro_custo_codigo, centro_custo_nome } = req.body
    const result = await pool.query(
      "INSERT INTO centro_custo (centro_custo_codigo, centro_custo_nome) VALUES ($1, $2) RETURNING *",
      [centro_custo_codigo, centro_custo_nome]
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
    const { centro_custo_codigo, centro_custo_nome } = req.body
    const result = await pool.query(
      "UPDATE centro_custo SET centro_custo_codigo = $1, centro_custo_nome = $2 WHERE centro_custo_codigo = $3 RETURNING *",
      [centro_custo_codigo, centro_custo_nome, id]
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
    const result = await pool.query("DELETE FROM centro_custo WHERE centro_custo_codigo = $1 RETURNING *", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update ,remove }