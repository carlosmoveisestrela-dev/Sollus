const pool = require("../config/database")

// Listar todos
const getAll = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tipo_custo ORDER BY und_neg_codigo")
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Buscar por código
const getById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM tipo_custo WHERE tipo_custo_codigo = $1 AND tipo_custo_nome = $2", [id, req.body.tipo_custo_nome])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Criar
const create = async (req, res) => {
  try {
    const { tipo_custo_codigo, tipo_custo_nome, centro_custo_codigo, carteira_codigo } = req.body
    const result = await pool.query(
      "INSERT INTO tipo_custo (tipo_custo_codigo, tipo_custo_nome, centro_custo_codigo, carteira_codigo) VALUES ($1, $2, $3, $4) RETURNING *",
      [tipo_custo_codigo, tipo_custo_nome, centro_custo_codigo, carteira_codigo]
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
    const { tipo_custo_codigo, tipo_custo_nome, centro_custo_codigo, carteira_codigo } = req.body
    const result = await pool.query(
      "UPDATE tipo_custo SET tipo_custo_codigo = $1, tipo_custo_nome = $2, centro_custo_codigo = $3, carteira_codigo = $4 WHERE tipo_custo_codigo = $5 RETURNING *",
      [tipo_custo_codigo, tipo_custo_nome, centro_custo_codigo, carteira_codigo, id]
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
    const result = await pool.query("DELETE FROM tipo_custo WHERE tipo_custo_codigo = $1 RETURNING *", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }