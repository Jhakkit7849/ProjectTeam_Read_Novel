import { Router } from 'express'
import { q } from '../db.js'
import { requireAuth } from '../middleware/auth.js'


const router = Router()


router.get('/', requireAuth, async (req, res) => {
const r = await q(
`SELECT n.id, n.slug, n.title, n.cover_url, n.pen_name
FROM library l JOIN novels n ON n.id=l.novel_id
WHERE l.user_id=$1 ORDER BY l.created_at DESC`,
[req.user.id]
)
res.json(r.rows)
})


router.post('/:novelId', requireAuth, async (req, res) => {
await q(`INSERT INTO library(user_id, novel_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [req.user.id, req.params.novelId])
await q(`UPDATE novels SET fav_count = COALESCE(fav_count,0)+1 WHERE id=$1`, [req.params.novelId])
res.json({ ok: true })
})


router.delete('/:novelId', requireAuth, async (req, res) => {
await q(`DELETE FROM library WHERE user_id=$1 AND novel_id=$2`, [req.user.id, req.params.novelId])
res.json({ ok: true })
})


router.get('/history', requireAuth, async (req, res) => {
const r = await q(
`SELECT n.id, n.slug, n.title, n.cover_url, h.chapter_id, h.last_read_at
FROM reading_history h JOIN novels n ON n.id=h.novel_id WHERE h.user_id=$1 ORDER BY h.last_read_at DESC LIMIT 50`,
[req.user.id]
)
res.json(r.rows)
})


export default router