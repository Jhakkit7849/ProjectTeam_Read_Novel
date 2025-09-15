import { Router } from 'express'
import { q } from '../db.js'
import { requireAuth } from '../middleware/auth.js'


const router = Router()


router.post('/', requireAuth, async (req, res) => {
const { author_id, novel_id=null, amount, message } = req.body
const r = await q(`INSERT INTO donations(donor_id, author_id, novel_id, amount, message) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
[req.user.id, author_id, novel_id, amount, message])
res.status(201).json(r.rows[0])
})


router.get('/me', requireAuth, async (req, res) => {
const r = await q(`SELECT * FROM donations WHERE donor_id=$1 ORDER BY created_at DESC`, [req.user.id])
res.json(r.rows)
})


export default router