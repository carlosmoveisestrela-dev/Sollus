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

// Criar
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
      vlr_duplicata,
      dt_emissao,
      dt_vencimento,
      dt_pagamento,
    } = req.body

    const result = await pool.query(
      `INSERT INTO movimento_financeiro
         (empresa_codigo, pessoa_codigo, tipo_lancamento_codigo, origem_lancamento_codigo,
          titulo, duplicata, vlr_duplicata, dt_emissao, dt_vencimento, dt_pagamento, dt_lancamento)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        empresa_codigo,
        pessoa_codigo,
        tipo_lancamento_codigo,
        origem_lancamento_codigo,
        titulo,
        duplicata,
        vlr_duplicata || 0,
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

const invalidarTitulo = async (client, empresa_codigo, pessoa_codigo, titulo) => {
  await client.query(
    `UPDATE movimento_financeiro
        SET validado = false
      WHERE empresa_codigo = $1
        AND pessoa_codigo = $2
        AND titulo = $3
        AND validado = true`,
    [empresa_codigo, pessoa_codigo, titulo]
  )
}

// Atualizar
const update = async (req, res) => {
  const client = await pool.connect()
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
      vlr_duplicata,
      dt_emissao,
      dt_vencimento,
      dt_pagamento,
    } = req.body

    await client.query("BEGIN")

    const antigo = await client.query(
      `SELECT empresa_codigo, pessoa_codigo, titulo, vlr_duplicata
         FROM movimento_financeiro
        WHERE movimento_fin_codigo = $1
        FOR UPDATE`,
      [id]
    )
    if (antigo.rows.length === 0) {
      await client.query("ROLLBACK")
      return res.status(404).json({ error: "Não encontrado" })
    }

    const result = await client.query(
      `UPDATE movimento_financeiro
       SET empresa_codigo = $1,
           pessoa_codigo = $2,
           tipo_lancamento_codigo = $3,
           origem_lancamento_codigo = $4,
           titulo = $5,
           duplicata = $6,
           vlr_duplicata = $7,
           dt_emissao = $8,
           dt_vencimento = $9,
           dt_pagamento = $10
       WHERE movimento_fin_codigo = $11
       RETURNING *`,
      [
        empresa_codigo,
        pessoa_codigo,
        tipo_lancamento_codigo,
        origem_lancamento_codigo,
        titulo,
        duplicata,
        vlr_duplicata || 0,
        dt_emissao,
        dt_vencimento,
        dt_pagamento || null,
        id,
      ]
    )

    // Só invalida se algo que afeta a validação realmente mudou
    const a = antigo.rows[0]

    const chaveMudou =
      Number(a.empresa_codigo) !== Number(empresa_codigo) ||
      Number(a.pessoa_codigo) !== Number(pessoa_codigo) ||
      String(a.titulo) !== String(titulo)

    const valorMudou =
      Math.round(Number(a.vlr_duplicata || 0) * 100) !==
      Math.round(Number(vlr_duplicata || 0) * 100)

    if (chaveMudou) {
      // grupo antigo perdeu uma duplicata e o novo ganhou uma
      await invalidarTitulo(client, a.empresa_codigo, a.pessoa_codigo, a.titulo)
      await invalidarTitulo(client, empresa_codigo, pessoa_codigo, titulo)
    } else if (valorMudou) {
      // mesmo grupo, mas a soma das duplicatas mudou
      await invalidarTitulo(client, empresa_codigo, pessoa_codigo, titulo)
    }

    await client.query("COMMIT")

    const atualizado = await pool.query(
      `SELECT * FROM movimento_financeiro WHERE movimento_fin_codigo = $1`,
      [id]
    )
    res.json(atualizado.rows[0])
  } catch (error) {
    await client.query("ROLLBACK")
    res.status(500).json({ error: error.message })
  } finally {
    client.release()
  }
}

// Excluir
const remove = async (req, res) => {
  const client = await pool.connect()
  try {
    const { id } = req.params

    await client.query("BEGIN")

    const existente = await client.query(
      `SELECT empresa_codigo, pessoa_codigo, titulo
         FROM movimento_financeiro
        WHERE movimento_fin_codigo = $1
        FOR UPDATE`,
      [id]
    )
    if (existente.rows.length === 0) {
      await client.query("ROLLBACK")
      return res.status(404).json({ error: "Não encontrado" })
    }

    // Bloqueia se existirem lançamentos ligados a este movimento
    const vinculados = await client.query(
      "SELECT COUNT(*) FROM lancamento_item WHERE movimento_fin_codigo = $1",
      [id]
    )
    const qtd = parseInt(vinculados.rows[0].count)
    if (qtd > 0) {
      await client.query("ROLLBACK")
      return res.status(409).json({
        error: `Este movimento possui ${qtd} lançamento(s) vinculado(s). Exclua os lançamentos primeiro.`,
      })
    }

    await client.query(
      "DELETE FROM movimento_financeiro WHERE movimento_fin_codigo = $1",
      [id]
    )

    // O total de duplicatas do grupo mudou: desfaz a validação do título
    const g = existente.rows[0]
    await invalidarTitulo(client, g.empresa_codigo, g.pessoa_codigo, g.titulo)

    await client.query("COMMIT")
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Erro ao excluir movimento:", error)

    if (error.code === "23503") {
      return res.status(409).json({
        error: "Este movimento possui registros vinculados e não pode ser excluído.",
      })
    }
    res.status(500).json({ error: error.message })
  } finally {
    client.release()
  }
}

// Validar
const validar = async (req, res) => {
  try {
    const { id } = req.params

    const mov = await pool.query(
      `SELECT empresa_codigo, pessoa_codigo, titulo
         FROM movimento_financeiro
        WHERE movimento_fin_codigo = $1`,
      [id]
    )
    if (mov.rows.length === 0) {
      return res.status(404).json({ error: "Movimento não encontrado" })
    }

    const { empresa_codigo, pessoa_codigo, titulo } = mov.rows[0]
    const params = [empresa_codigo, pessoa_codigo, titulo]

    const totais = await pool.query(
      `SELECT
         COALESCE((SELECT SUM(mf.vlr_duplicata)
                     FROM movimento_financeiro mf
                    WHERE mf.empresa_codigo = $1
                      AND mf.pessoa_codigo = $2
                      AND mf.titulo = $3), 0) AS total_duplicatas,
         COALESCE((SELECT SUM(li.vlr_total)
                     FROM lancamento_item li
                     JOIN movimento_financeiro mf
                       ON mf.movimento_fin_codigo = li.movimento_fin_codigo
                    WHERE mf.empresa_codigo = $1
                      AND mf.pessoa_codigo = $2
                      AND mf.titulo = $3), 0) AS total_itens`,
      params
    )

    const totalDuplicatas = Number(totais.rows[0].total_duplicatas)
    const totalItens = Number(totais.rows[0].total_itens)

    if (Math.round(totalDuplicatas * 100) !== Math.round(totalItens * 100)) {
      const diferenca = totalDuplicatas - totalItens
      const fmt = (v) =>
        v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      return res.status(400).json({
        error: `Os valores do título não conferem. Duplicatas: ${fmt(totalDuplicatas)} | Itens: ${fmt(totalItens)} | Diferença: ${fmt(diferenca)}`,
      })
    }

    await pool.query(
      `UPDATE movimento_financeiro
          SET validado = true
        WHERE empresa_codigo = $1
          AND pessoa_codigo = $2
          AND titulo = $3`,
      params
    )

    res.json({ message: "Título validado com sucesso", validado: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove, validar }