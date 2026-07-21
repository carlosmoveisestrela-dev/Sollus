const pool = require("../config/database")

// Listar todos (paginado, com busca opcional)
const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const busca = req.query.busca || ""

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM uni_negocio WHERE und_neg_nome ILIKE $1",
      [`%${busca}%`]
    )

    const total = parseInt(totalResult.rows[0].count)

    const result = await pool.query(
      "SELECT * FROM uni_negocio WHERE und_neg_nome ILIKE $1 ORDER BY und_neg_codigo LIMIT $2 OFFSET $3",
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
    const result = await pool.query("SELECT * FROM uni_negocio WHERE und_neg_codigo = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Criar
const create = async (req, res) => {
  try {
    const { und_neg_nome } = req.body

    if (!und_neg_nome || und_neg_nome.trim() === '') {
      return res.status(400).json({ error: 'Nome da empresa é obrigatório.' })
    }

    const nomeFormatado = und_neg_nome.trim().toUpperCase()

    const result = await pool.query(
      "INSERT INTO uni_negocio (und_neg_nome) VALUES ($1) RETURNING *",
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
    const { und_neg_codigo, und_neg_nome } = req.body

    if (!und_neg_nome || und_neg_nome.trim() === '') {
      return res.status(400).json({ error: 'Nome da empresa é obrigatório.' })
    }

    const nomeFormtado = und_neg_nome.trim().toUpperCase()

    const result = await pool.query(
      "UPDATE uni_negocio SET und_neg_nome = $1 WHERE und_neg_codigo = $2 RETURNING *",
      [nomeFormtado, id]
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
      "DELETE FROM uni_negocio WHERE und_neg_codigo = $1 RETURNING *",
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }