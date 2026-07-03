const pool = require("../config/database")

// Listar todos
const getAll = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM empresa ORDER BY empresa_codigo")
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Buscar por código
const getById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM empresa WHERE empresa_codigo = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Criar
const create = async (req, res) => {
  try {
    const { empresa_nome } = req.body

    if (!empresa_nome || empresa_nome.trim() === '') {
      return res.status(400).json({ error: 'Nome da empresa é obrigatório.' })
    }

    const result = await pool.query(
      "INSERT INTO empresa (empresa_nome) VALUES ($1) RETURNING *",
      [empresa_nome]
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
    const { empresa_nome } = req.body
    const result = await pool.query(
      "UPDATE empresa SET empresa_nome = $1 WHERE empresa_codigo = $2 RETURNING *",
      [empresa_nome, id]
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
    const result = await pool.query(
      "DELETE FROM empresa WHERE empresa_codigo = $1 RETURNING *",
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }