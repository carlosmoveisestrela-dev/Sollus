const pool = require("../config/database")

// Listar todos
const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const busca = req.query.busca || ""

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM centro_custo WHERE centro_custo_nome ILIKE $1",
      [`%${busca}%`]
    )
    const total = parseInt(totalResult.rows[0].count)

    const result = await pool.query(
      "SELECT * FROM centro_custo WHERE centro_custo_nome ILIKE $1 ORDER BY centro_custo_codigo LIMIT $2 OFFSET $3",
      [`%${busca}%`, limit, offset]
    )

    res.json({
      dados: result.rows,
      total,
      paginaAtual: page,
      totalPaginas: Math.ceil(total / limit) || 1
    })
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

const create = async (req, res) => {
  try {
    const { centro_custo_nome } = req.body

    if (!centro_custo_nome || centro_custo_nome.trim() === '') {
      return res.status(400).json({ error: 'Nome da centro_custo é obrigatório.' })
    }

    const nomeFormatado = centro_custo_nome.trim().toUpperCase()

    const result = await pool.query(
      "INSERT INTO centro_custo (centro_custo_nome) VALUES ($1) RETURNING *",
      [nomeFormatado]
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
    const { centro_custo_nome } = req.body

    if (!centro_custo_nome || centro_custo_nome.trim() === '') {
      return res.status(400).json({ error: 'Nome do centro custo é obrigatório.' })
    }

    const nomeFormatado = centro_custo_nome.trim().toUpperCase()

    const result = await pool.query(
      "UPDATE centro_custo SET centro_custo_nome = $1 WHERE centro_custo_codigo = $2 RETURNING *",
      [nomeFormatado, id]
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
      "DELETE FROM centro_custo WHERE centro_custo_codigo = $1 RETURNING *",
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }