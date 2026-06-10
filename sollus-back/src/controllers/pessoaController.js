const pool = require("../config/database")

// Listar todos
const getAll = async (req, res) => {
  try { 
    const result = await pool.query("SELECT * FROM pessoa ORDER BY pessoa_codigo")
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  } 
}

// Buscar por código
const getById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM pessoa WHERE pessoa_codigo = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Criar
const create = async (req, res) => {
  try {
    const {pessoa_codigo, pessoa_nome, pessoa_cidade, pessoa_contato_nome, pessoa_contato_fone } = req.body
    const result = await pool.query(
      "INSERT INTO pessoa (pessoa_codigo, pessoa_nome, pessoa_cidade, pessoa_contato_nome, pessoa_contato_fone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [pessoa_codigo, pessoa_nome, pessoa_cidade, pessoa_contato_nome, pessoa_contato_fone]
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
    const {pessoa_codigo, pessoa_nome, pessoa_cidade, pessoa_contato_nome, pessoa_contato_fone } = req.body
    const result = await pool.query(
      "UPDATE pessoa SET pessoa_codigo = $1, pessoa_nome = $2, pessoa_cidade = $3, pessoa_contato_nome = $4, pessoa_contato_fone = $5 WHERE pessoa_codigo = $6 RETURNING *",
      [pessoa_codigo, pessoa_nome, pessoa_cidade, pessoa_contato_nome, pessoa_contato_fone, id]
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
    const result = await pool.query("DELETE FROM pessoa WHERE pessoa_codigo = $1 RETURNING *", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }