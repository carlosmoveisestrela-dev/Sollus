const pool = require("../config/database")

// Campos obrigatórios do Movimento Financeiro
const camposObrigatorios = [
  "empresa_codigo",
  "pessoa_codigo",
  "tipo_lancamento_codigo",
  "origem_lancamento_codigo",
  "titulo",
  "duplicata",
  "dt_emissao",
  "dt_vencimento",
]

function validarCampos(body) {
  for (const campo of camposObrigatorios) {
    const valor = body[campo]
    if (valor === undefined || valor === null || valor === "") {
      return `O campo "${campo}" é obrigatório.`
    }
  }
  return null
}

// Listar todos
const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const busca = req.query.busca || ""

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM movimento_financeiro WHERE titulo ILIKE $1",
      [`%${busca}%`]
    )
    const total = parseInt(totalResult.rows[0].count)

    const result = await pool.query(
      `SELECT mf.*,
              e.empresa_nome,
              p.pessoa_nome,
              tl.tipo_lancamento_nome,
              ol.origem_lancamento_nome
       FROM movimento_financeiro mf
       JOIN empresa e ON e.empresa_codigo = mf.empresa_codigo
       JOIN pessoa p ON p.pessoa_codigo = mf.pessoa_codigo
       JOIN tipo_lancamento tl ON tl.tipo_lancamento_codigo = mf.tipo_lancamento_codigo
       JOIN origem_lancamento ol ON ol.origem_lancamento_codigo = mf.origem_lancamento_codigo
       WHERE mf.titulo ILIKE $1
       ORDER BY mf.movimento_fin_codigo
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
      "SELECT * FROM movimento_financeiro WHERE movimento_fin_codigo = $1",
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (req, res) => {
  try {
    const erro = validarCampos(req.body)
    if (erro) return res.status(400).json({ error: erro })

    const {
      empresa_codigo,
      pessoa_codigo,
      tipo_lancamento_codigo,
      origem_lancamento_codigo,
      titulo,
      duplicata,
      dt_emissao,
      dt_vencimento,
      dt_pagamento,
    } = req.body

    const result = await pool.query(
      `INSERT INTO movimento_financeiro
         (empresa_codigo, pessoa_codigo, tipo_lancamento_codigo, origem_lancamento_codigo,
          titulo, duplicata, dt_emissao, dt_vencimento, dt_pagamento, dt_lancamento)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        empresa_codigo,
        pessoa_codigo,
        tipo_lancamento_codigo,
        origem_lancamento_codigo,
        titulo,
        duplicata,
        dt_emissao,
        dt_vencimento,
        dt_pagamento || null,
      ]
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
    const erro = validarCampos(req.body)
    if (erro) return res.status(400).json({ error: erro })

    const {
      empresa_codigo,
      pessoa_codigo,
      tipo_lancamento_codigo,
      origem_lancamento_codigo,
      titulo,
      duplicata,
      dt_emissao,
      dt_vencimento,
      dt_pagamento,
    } = req.body

    const result = await pool.query(
      `UPDATE movimento_financeiro
       SET empresa_codigo = $1,
           pessoa_codigo = $2,
           tipo_lancamento_codigo = $3,
           origem_lancamento_codigo = $4,
           titulo = $5,
           duplicata = $6,
           dt_emissao = $7,
           dt_vencimento = $8,
           dt_pagamento = $9
       WHERE movimento_fin_codigo = $10
       RETURNING *`,
      [
        empresa_codigo,
        pessoa_codigo,
        tipo_lancamento_codigo,
        origem_lancamento_codigo,
        titulo,
        duplicata,
        dt_emissao,
        dt_vencimento,
        dt_pagamento || null,
        id,
      ]
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
      "DELETE FROM movimento_financeiro WHERE movimento_fin_codigo = $1 RETURNING *",
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }