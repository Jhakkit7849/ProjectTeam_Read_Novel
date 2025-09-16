import { Router } from 'express'
import { q } from '../db.js'

const router = Router()

// GET /api/categories
router.get('/', async (_req, res) => {
  const r = await q('SELECT id, name, slug FROM categories ORDER BY id ASC')
  res.json(r.rows)
})

export default router
