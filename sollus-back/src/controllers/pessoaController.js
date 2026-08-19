const pool = require("../config/database")

// Listar todos
const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const busca = req.query.busca || ""

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM pessoa WHERE pessoa_nome ILIKE $1",
      [`%${busca}%`]
    )
    const total = parseInt(totalResult.rows[0].count)

    const result = await pool.query(
      "SELECT * FROM pessoa WHERE pessoa_nome ILIKE $1 ORDER BY pessoa_codigo LIMIT $2 OFFSET $3",
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
    const result = await pool.query("SELECT * FROM pessoa WHERE pessoa_codigo = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (req, res) => {
  try {
    const { pessoa_nome, pessoa_contato_fone, pessoa_estado, pessoa_cidade } = req.body

    if (!pessoa_nome || pessoa_nome.trim() === '') {
      return res.status(400).json({ error: 'Nome da pessoa é obrigatório.' })
    }

    const nomeFormatado = pessoa_nome.trim().toUpperCase()

    const result = await pool.query(
      `INSERT INTO pessoa (pessoa_nome, pessoa_contato_fone, pessoa_estado, pessoa_cidade)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nomeFormatado, pessoa_contato_fone || null, pessoa_estado || null, pessoa_cidade || null]
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
    const { pessoa_nome, pessoa_contato_fone, pessoa_estado, pessoa_cidade } = req.body

    if (!pessoa_nome || pessoa_nome.trim() === '') {
      return res.status(400).json({ error: 'Nome da pessoa é obrigatório.' })
    }

    const nomeFormatado = pessoa_nome.trim().toUpperCase()

    const result = await pool.query(
      `UPDATE pessoa
       SET pessoa_nome = $1, pessoa_contato_fone = $2, pessoa_estado = $3, pessoa_cidade = $4
       WHERE pessoa_codigo = $5 RETURNING *`,
      [nomeFormatado, pessoa_contato_fone || null, pessoa_estado || null, pessoa_cidade || null, id]
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
      "DELETE FROM pessoa WHERE pessoa_codigo = $1 RETURNING *",
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }