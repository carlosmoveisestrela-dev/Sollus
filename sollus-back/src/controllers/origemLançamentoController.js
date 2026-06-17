const pool = require("../config/database")

// Listar todos
const getAll = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM origem_lancamento ORDER BY origem_lancamento_codigo")
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Buscar por código
const getById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM origem_lancamento WHERE origem_lancamento_codigo = $1 AND origem_lancamento_nome = $2", [id, req.body.origem_lancamento_nome])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Criar
const create = async (req, res) => {
  try {
    const { origem_lancamento_codigo, origem_lancamento_nome } = req.body
    const result = await pool.query(
      "INSERT INTO origem_lancamento (origem_lancamento_codigo, origem_lancamento_nome) VALUES ($1, $2) RETURNING *",
      [origem_lancamento_codigo, origem_lancamento_nome]
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
    const { origem_lancamento_codigo, origem_lancamento_nome } = req.body
    const result = await pool.query(
      "UPDATE origem_lancamento SET origem_lancamento_codigo = $1, origem_lancamento_nome = $2 WHERE origem_lancamento_codigo = $3 RETURNING *",
      [origem_lancamento_codigo, origem_lancamento_nome, id]
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
    const result = await pool.query("DELETE FROM origem_lancamento WHERE origem_lancamento_codigo = $1 RETURNING *", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }