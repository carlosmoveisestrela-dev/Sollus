const pool = require("../../config/database")

// Listar todos (paginado, com nome do centro de custo e da carteira via JOIN)
const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const busca = req.query.busca || ""

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM tipo_custo WHERE tipo_custo_nome ILIKE $1",
      [`%${busca}%`]
    )
    const total = parseInt(totalResult.rows[0].count)

    const result = await pool.query(
      `SELECT tc.tipo_custo_codigo, tc.tipo_custo_nome, tc.saida_real, tc.comissao_admin,
              cc.centro_custo_codigo, cc.centro_custo_nome,
              c.carteira_codigo, c.carteira_nome
       FROM tipo_custo tc
       JOIN centro_custo cc ON cc.centro_custo_codigo = tc.centro_custo_codigo
       LEFT JOIN carteira c ON c.carteira_codigo = tc.carteira_codigo
       WHERE tc.tipo_custo_nome ILIKE $1
       ORDER BY tc.tipo_custo_codigo
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
    const result = await pool.query(
      `SELECT tc.tipo_custo_codigo, tc.tipo_custo_nome, tc.saida_real, tc.comissao_admin,
              cc.centro_custo_codigo, cc.centro_custo_nome,
              c.carteira_codigo, c.carteira_nome
       FROM tipo_custo tc
       JOIN centro_custo cc ON cc.centro_custo_codigo = tc.centro_custo_codigo
       LEFT JOIN carteira c ON c.carteira_codigo = tc.carteira_codigo
       WHERE tc.tipo_custo_codigo = $1`,
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Criar
const create = async (req, res) => {
  try {
    const { tipo_custo_nome, centro_custo_codigo, carteira_codigo, saida_real, comissao_admin } = req.body

    if (!tipo_custo_nome || tipo_custo_nome.trim() === '') {
      return res.status(400).json({ error: 'Nome do tipo de custo é obrigatório.' })
    }
    if (!centro_custo_codigo) {
      return res.status(400).json({ error: 'Centro de custo é obrigatório.' })
    }

    const nomeFormatado = tipo_custo_nome.trim().toUpperCase()
    const saidaRealFormatado = saida_real === "S" ? "S" : "N"
    const comissaoAdminFormatado = comissao_admin === "S" ? "S" : "N"

    const result = await pool.query(
      `INSERT INTO tipo_custo (tipo_custo_nome, centro_custo_codigo, carteira_codigo, saida_real, comissao_admin)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nomeFormatado, centro_custo_codigo, carteira_codigo || null, saidaRealFormatado, comissaoAdminFormatado]
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
    const { tipo_custo_nome, centro_custo_codigo, carteira_codigo, saida_real, comissao_admin } = req.body

    if (!tipo_custo_nome || tipo_custo_nome.trim() === '') {
      return res.status(400).json({ error: 'Nome do tipo de custo é obrigatório.' })
    }
    if (!centro_custo_codigo) {
      return res.status(400).json({ error: 'Centro de custo é obrigatório.' })
    }

    const nomeFormatado = tipo_custo_nome.trim().toUpperCase()
    const saidaRealFormatado = saida_real === "S" ? "S" : "N"
    const comissaoAdminFormatado = comissao_admin === "S" ? "S" : "N"

    const result = await pool.query(
      `UPDATE tipo_custo
       SET tipo_custo_nome = $1, centro_custo_codigo = $2, carteira_codigo = $3,
           saida_real = $4, comissao_admin = $5
       WHERE tipo_custo_codigo = $6 RETURNING *`,
      [nomeFormatado, centro_custo_codigo, carteira_codigo || null, saidaRealFormatado, comissaoAdminFormatado, id]
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
      "DELETE FROM tipo_custo WHERE tipo_custo_codigo = $1 RETURNING *",
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }