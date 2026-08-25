const { Pool } = require("pg")
require("dotenv").config()

// Em produção (Render), usamos DATABASE_URL (connection string do Neon).
// Localmente, continuamos usando host/porta/usuário/senha separados.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, 
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    })

module.exports = pool