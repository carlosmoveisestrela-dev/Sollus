const pool = require("../../config/database")

const LOCK_NS_TIPO_CUSTO = 1001

function toIntOrNull(valor) {
  const n = parseInt(valor, 10)
  return Number.isInteger(n) ? n : null
}

async function proximoCodigo(client, centroCustoCodigo) {
  const r = await client.query(
    `SELECT COALESCE(MAX(tipo_custo_codigo), 0) + 1 AS codigo
       FROM tipo_custo
      WHERE centro_custo_codigo = $1`,
    [centroCustoCodigo]
  )
  return r.rows[0].codigo
}

// Listar todos as paginnas, com busca, filtros e ordenação
// Filtros opcionais: ?centro_custo_codigo=18&tipo_custo_codigo=99
const getAll = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.max(parseInt(req.query.limit) || 5, 1)
    const offset = (page - 1) * limit
    const busca = req.query.busca || ""

    const ordenacoes = {
      codigo: `tc.centro_custo_codigo, tc.tipo_custo_codigo, tc.id`,
      nome: `tc.tipo_custo_nome, tc.id`,
      centro: `cc.centro_custo_nome, tc.tipo_custo_codigo, tc.id`
    }
    const orderBy = ordenacoes[req.query.ordenar] || ordenacoes.codigo

    const condicoes = ["tc.tipo_custo_nome ILIKE $1"]
    const params = [`%${busca}%`]

    const filtroCentro = toIntOrNull(req.query.centro_custo_codigo)
    if (filtroCentro !== null) {
      params.push(filtroCentro)
      condicoes.push(`tc.centro_custo_codigo = $${params.length}`)
    }

    const filtroCodigo = toIntOrNull(req.query.tipo_custo_codigo)
    if (filtroCodigo !== null) {
      params.push(filtroCodigo)
      condicoes.push(`tc.tipo_custo_codigo = $${params.length}`)
    }

    const where = condicoes.join(" AND ")

    const totalResult = await pool.query(
      `SELECT COUNT(*)
         FROM tipo_custo tc
         JOIN centro_custo cc ON cc.centro_custo_codigo = tc.centro_custo_codigo
         LEFT JOIN carteira c ON c.carteira_codigo = tc.carteira_codigo
        WHERE ${where}`,
      params
    )
    const total = parseInt(totalResult.rows[0].count)

    const result = await pool.query(
      `SELECT tc.id, tc.tipo_custo_codigo, tc.tipo_custo_nome, tc.saida_real, tc.comissao_admin,
              cc.centro_custo_codigo, cc.centro_custo_nome,
              c.carteira_codigo, c.carteira_nome
         FROM tipo_custo tc
         JOIN centro_custo cc ON cc.centro_custo_codigo = tc.centro_custo_codigo
         LEFT JOIN carteira c ON c.carteira_codigo = tc.carteira_codigo
        WHERE ${where}
        ORDER BY ${orderBy}
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
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

// Buscar por id
const getById = async (req, res) => {
  try {
    const id = toIntOrNull(req.params.id)
    if (id === null) return res.status(400).json({ error: "Id inválido." })

    const result = await pool.query(
      `SELECT tc.id, tc.tipo_custo_codigo, tc.tipo_custo_nome, tc.saida_real, tc.comissao_admin,
              cc.centro_custo_codigo, cc.centro_custo_nome,
              c.carteira_codigo, c.carteira_nome
         FROM tipo_custo tc
         JOIN centro_custo cc ON cc.centro_custo_codigo = tc.centro_custo_codigo
         LEFT JOIN carteira c ON c.carteira_codigo = tc.carteira_codigo
        WHERE tc.id = $1`,
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
  const { tipo_custo_nome, carteira_codigo, saida_real, comissao_admin } = req.body
  const centro_custo_codigo = toIntOrNull(req.body.centro_custo_codigo)

  if (!tipo_custo_nome || tipo_custo_nome.trim() === '') {
    return res.status(400).json({ error: 'Nome do tipo de custo é obrigatório.' })
  }
  if (centro_custo_codigo === null) {
    return res.status(400).json({ error: 'Centro de custo é obrigatório.' })
  }
  if (!carteira_codigo) {
    return res.status(400).json({ error: 'Carteira é obrigatória.' })
  }

  const nomeFormatado = tipo_custo_nome.trim().toUpperCase()
  const saidaRealFormatado = saida_real === "S" ? "S" : "N"
  const comissaoAdminFormatado = comissao_admin === "S" ? "S" : "N"

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    await client.query("SELECT pg_advisory_xact_lock($1::int, $2::int)", [LOCK_NS_TIPO_CUSTO, centro_custo_codigo])
    const codigo = await proximoCodigo(client, centro_custo_codigo)

    if (codigo > 9999) {
      await client.query("ROLLBACK")
      return res.status(400).json({ error: "Este centro de custo atingiu o limite de 9999 tipos de custo." })
    }
    const id = centro_custo_codigo * 10000 + codigo

    const result = await client.query(
      `INSERT INTO tipo_custo
         (id, tipo_custo_codigo, tipo_custo_nome, centro_custo_codigo, carteira_codigo, saida_real, comissao_admin)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, codigo, nomeFormatado, centro_custo_codigo, carteira_codigo, saidaRealFormatado, comissaoAdminFormatado]
    )

    await client.query("COMMIT")
    res.status(201).json(result.rows[0])
  } catch (error) {
    await client.query("ROLLBACK")
    res.status(500).json({ error: error.message })
  } finally {
    client.release()
  }
}

// Atualizar
const update = async (req, res) => {
  const id = toIntOrNull(req.params.id)
  if (id === null) return res.status(400).json({ error: "Id inválido." })

  const { tipo_custo_nome, carteira_codigo, saida_real, comissao_admin } = req.body
  const centro_custo_codigo = toIntOrNull(req.body.centro_custo_codigo)

  if (!tipo_custo_nome || tipo_custo_nome.trim() === '') {
    return res.status(400).json({ error: 'Nome do tipo de custo é obrigatório.' })
  }
  if (centro_custo_codigo === null) {
    return res.status(400).json({ error: 'Centro de custo é obrigatório.' })
  }
  if (!carteira_codigo) {
    return res.status(400).json({ error: 'Carteira é obrigatória.' })
  }

  const nomeFormatado = tipo_custo_nome.trim().toUpperCase()
  const saidaRealFormatado = saida_real === "S" ? "S" : "N"
  const comissaoAdminFormatado = comissao_admin === "S" ? "S" : "N"

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const atual = await client.query(
      "SELECT centro_custo_codigo, tipo_custo_codigo FROM tipo_custo WHERE id = $1 FOR UPDATE",
      [id]
    )
    if (atual.rows.length === 0) {
      await client.query("ROLLBACK")
      return res.status(404).json({ error: "Não encontrado" })
    }

    if (atual.rows[0].centro_custo_codigo !== centro_custo_codigo) {
      await client.query("ROLLBACK")
      return res.status(400).json({ error: "Não é possível alterar o centro de custo de um tipo de custo já cadastrado." })
    }

    const result = await client.query(
      `UPDATE tipo_custo
          SET tipo_custo_nome = $1,
              carteira_codigo = $2,
              saida_real = $3,
              comissao_admin = $4
        WHERE id = $5
        RETURNING *`,
      [nomeFormatado, carteira_codigo, saidaRealFormatado, comissaoAdminFormatado, id]
    )

    await client.query("COMMIT")
    res.json(result.rows[0])
  } catch (error) {
    await client.query("ROLLBACK")
    res.status(500).json({ error: error.message })
  } finally {
    client.release()
  }
}

// Deletar
const remove = async (req, res) => {
  try {
    const id = toIntOrNull(req.params.id)
    if (id === null) return res.status(400).json({ error: "Id inválido." })

    const result = await pool.query(
      "DELETE FROM tipo_custo WHERE id = $1 RETURNING id",
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }