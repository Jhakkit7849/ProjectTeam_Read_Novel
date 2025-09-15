import { Router } from 'express'
import { q } from '../db.js'
const router = Router()


router.get('/', async (req, res) => {
const qstr = req.query.q || ''
const r = await q(`SELECT id, slug, title, cover_url, pen_name FROM novels WHERE title ILIKE $1 ORDER BY created_at DESC LIMIT 20`, [ `%${qstr}%` ])
res.json(r.rows)
})


export default router