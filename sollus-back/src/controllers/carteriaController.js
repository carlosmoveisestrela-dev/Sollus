const pool = require("../config/database")

// Listar todos (paginado, com busca opcional)
const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const busca = req.query.busca || ""

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM carteira WHERE carteira_nome ILIKE $1",
      [`%${busca}%`]
    )
    const total = parseInt(totalResult.rows[0].count)

    const result = await pool.query(
      "SELECT * FROM carteira WHERE carteira_nome ILIKE $1 ORDER BY carteira_codigo LIMIT $2 OFFSET $3",
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
    const result = await pool.query("SELECT * FROM carteira WHERE carteira_codigo = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Criar
const create = async (req, res) => {
  try {
    const { carteira_nome } = req.body

    if (!carteira_nome || carteira_nome.trim() === '') {
      return res.status(400).json({ error: 'Nome da carteira é obrigatório.' })
    }

    const nomeFormatado = carteira_nome.trim().toUpperCase()

    const result = await pool.query(
      "INSERT INTO carteira (carteira_nome) VALUES ($1) RETURNING *",
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
    const { carteira_nome } = req.body

    if (!carteira_nome || carteira_nome.trim() === '') {
      return res.status(400).json({ error: 'Nome da carteira é obrigatório.' })
    }

    const nomeFormatado = carteira_nome.trim().toUpperCase()

    const result = await pool.query(
      "UPDATE carteira SET carteira_nome = $1 WHERE carteira_codigo = $2 RETURNING *",
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
      "DELETE FROM carteira WHERE carteira_codigo = $1 RETURNING *",
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }