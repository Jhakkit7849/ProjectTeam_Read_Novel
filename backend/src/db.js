import pkg from 'pg'
const { Pool } = pkg
export const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const q = (text, params=[]) => pool.query(text, params)