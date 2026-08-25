const pool = require("../config/database")

const camposObrigatorios = [
  "und_neg_codigo",
  "pessoa_codigo",
  "titulo",
  "item_codigo",
  "centro_custo_codigo",
  "tipo_custo_codigo",
  "evento_lancamento_codigo",
  "quant",
  "vlr_unit",
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

// Busca o movimento_fin_codigo correspondente a pessoa_codigo + titulo.
// Lança erro com mensagem amigável se não encontrar.
async function resolverMovimentoFinCodigo(pessoa_codigo, titulo) {
  const result = await pool.query(
    "SELECT movimento_fin_codigo FROM movimento_financeiro WHERE pessoa_codigo = $1 AND titulo = $2",
    [pessoa_codigo, titulo]
  )
  if (result.rows.length === 0) {
    const erro = new Error("Nenhum movimento encontrado para essa Pessoa/Título")
    erro.status = 400
    throw erro
  }
  return result.rows[0].movimento_fin_codigo
}

// Listar todos
const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const busca = req.query.busca || ""

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM lancamento_item WHERE titulo ILIKE $1",
      [`%${busca}%`]
    )
    const total = parseInt(totalResult.rows[0].count)

    const result = await pool.query(
      `SELECT li.*,
              un.und_neg_nome,
              p.pessoa_nome,
              i.item_nome,
              cc.centro_custo_nome,
              tc.tipo_custo_nome,
              el.evento_lancamento_nome
       FROM lancamento_item li
       JOIN uni_negocio un ON un.und_neg_codigo = li.und_neg_codigo
       JOIN pessoa p ON p.pessoa_codigo = li.pessoa_codigo
       JOIN item i ON i.item_codigo = li.item_codigo
       JOIN centro_custo cc ON cc.centro_custo_codigo = li.centro_custo_codigo
       JOIN tipo_custo tc ON tc.tipo_custo_codigo = li.tipo_custo_codigo
       JOIN evento_lancamento el ON el.evento_lancamento_codigo = li.evento_lancamento_codigo
       WHERE li.titulo ILIKE $1
       ORDER BY li.lancamento_item_codigo
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
      "SELECT * FROM lancamento_item WHERE lancamento_item_codigo = $1",
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
      und_neg_codigo,
      pessoa_codigo,
      titulo,
      item_codigo,
      centro_custo_codigo,
      tipo_custo_codigo,
      evento_lancamento_codigo,
      observacao_lancamento,
      quant,
      vlr_unit,
      vlr_frete_unitario,
    } = req.body

    const movimento_fin_codigo = await resolverMovimentoFinCodigo(pessoa_codigo, titulo)

    const frete = vlr_frete_unitario || 0
    const vlr_total = Number(quant) * (Number(vlr_unit) + Number(frete))

    const result = await pool.query(
      `INSERT INTO lancamento_item
         (movimento_fin_codigo, und_neg_codigo, pessoa_codigo, titulo, item_codigo,
          centro_custo_codigo, tipo_custo_codigo, evento_lancamento_codigo,
          observacao_lancamento, quant, vlr_unit, vlr_frete_unitario, vlr_total)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        movimento_fin_codigo,
        und_neg_codigo,
        pessoa_codigo,
        titulo,
        item_codigo,
        centro_custo_codigo,
        tipo_custo_codigo,
        evento_lancamento_codigo,
        observacao_lancamento || null,
        quant,
        vlr_unit,
        frete,
        vlr_total,
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

// Atualizar
const update = async (req, res) => {
  try {
    const { id } = req.params
    const erro = validarCampos(req.body)
    if (erro) return res.status(400).json({ error: erro })

    const {
      und_neg_codigo,
      pessoa_codigo,
      titulo,
      item_codigo,
      centro_custo_codigo,
      tipo_custo_codigo,
      evento_lancamento_codigo,
      observacao_lancamento,
      quant,
      vlr_unit,
      vlr_frete_unitario,
    } = req.body

    const movimento_fin_codigo = await resolverMovimentoFinCodigo(pessoa_codigo, titulo)

    const frete = vlr_frete_unitario || 0
    const vlr_total = Number(quant) * (Number(vlr_unit) + Number(frete))

    const result = await pool.query(
      `UPDATE lancamento_item
       SET movimento_fin_codigo = $1,
           und_neg_codigo = $2,
           pessoa_codigo = $3,
           titulo = $4,
           item_codigo = $5,
           centro_custo_codigo = $6,
           tipo_custo_codigo = $7,
           evento_lancamento_codigo = $8,
           observacao_lancamento = $9,
           quant = $10,
           vlr_unit = $11,
           vlr_frete_unitario = $12,
           vlr_total = $13
       WHERE lancamento_item_codigo = $14
       RETURNING *`,
      [
        movimento_fin_codigo,
        und_neg_codigo,
        pessoa_codigo,
        titulo,
        item_codigo,
        centro_custo_codigo,
        tipo_custo_codigo,
        evento_lancamento_codigo,
        observacao_lancamento || null,
        quant,
        vlr_unit,
        frete,
        vlr_total,
        id,
      ]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

// Deletar
const remove = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      "DELETE FROM lancamento_item WHERE lancamento_item_codigo = $1 RETURNING *",
      [id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" })
    res.json({ message: "Deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }