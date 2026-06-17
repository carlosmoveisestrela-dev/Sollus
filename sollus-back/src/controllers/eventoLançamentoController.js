const pool = require("../config/database")

// Listar todos
const getAll = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM evento_lancamento ORDER BY evento_lancamento_codigo")
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Buscar por código
const getById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM evento_lancamento WHERE evento_lancamento_codigo = $1 AND evento_lancamento_nome = $2", [id, req.body.evento_lancamento_nome])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Criar
const create = async (req, res) => {
  try {
    const { evento_lancamento_codigo, evento_lancamento_nome } = req.body
    const result = await pool.query(
      "INSERT INTO evento_lancamento (evento_lancamento_codigo, evento_lancamento_nome) VALUES ($1, $2) RETURNING *",
      [evento_lancamento_codigo, evento_lancamento_nome]
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
    const { evento_lancamento_codigo, evento_lancamento_nome } = req.body
    const result = await pool.query(
      "UPDATE evento_lancamento SET evento_lancamento_codigo = $1, evento_lancamento_nome = $2 WHERE evento_lancamento_codigo = $3 RETURNING *",
      [evento_lancamento_codigo, evento_lancamento_nome, id]
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
    const result = await pool.query("DELETE FROM evento_lancamento WHERE evento_lancamento_codigo = $1 RETURNING *", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }