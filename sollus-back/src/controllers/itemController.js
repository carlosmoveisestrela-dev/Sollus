const pool = require("../config/database")

// Listar todos
const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const busca = req.query.busca || ""

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM item WHERE item_nome ILIKE $1",
      [`%${busca}%`]
    )
    const total = parseInt(totalResult.rows[0].count)

    const result = await pool.query(
      `SELECT i.*, c.categoria_nome
       FROM item i
       LEFT JOIN categoria c ON c.categoria_codigo = i.categoria_codigo
       WHERE i.item_nome ILIKE $1
       ORDER BY i.item_codigo
       LIMIT $2 OFFSET $3`,
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
    const result = await pool.query("SELECT * FROM item WHERE item_codigo = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (req, res) => {
  try {
    const { item_nome, item_und, categoria_codigo } = req.body

    if (!item_nome || item_nome.trim() === '') {
      return res.status(400).json({ error: 'Nome do item é obrigatório.' })
    }
    if (!item_und || item_und.trim() === '') {
      return res.status(400).json({ error: 'Unidade do item é obrigatória.' })
    }
    if (!categoria_codigo) {
      return res.status(400).json({ error: 'Categoria é obrigatória.' })
    }

    const nomeFormatado = item_nome.trim().toUpperCase()
    const undFormatada = item_und.trim().toUpperCase()

    const result = await pool.query(
      "INSERT INTO item (item_nome, item_und, categoria_codigo) VALUES ($1, $2, $3) RETURNING *",
      [nomeFormatado, undFormatada, categoria_codigo]
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
    const { item_nome, item_und, categoria_codigo } = req.body

    if (!item_nome || item_nome.trim() === '') {
      return res.status(400).json({ error: 'Nome do item é obrigatório.' })
    }
    if (!item_und || item_und.trim() === '') {
      return res.status(400).json({ error: 'Unidade do item é obrigatória.' })
    }
    if (!categoria_codigo) {
      return res.status(400).json({ error: 'Categoria é obrigatória.' })
    }

    const nomeFormatado = item_nome.trim().toUpperCase()
    const undFormatada = item_und.trim().toUpperCase()

    const result = await pool.query(
      "UPDATE item SET item_nome = $1, item_und = $2, categoria_codigo = $3 WHERE item_codigo = $4 RETURNING *",
      [nomeFormatado, undFormatada, categoria_codigo, id]
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
      "DELETE FROM item WHERE item_codigo = $1 RETURNING *",
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }