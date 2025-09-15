import { Router } from 'express'
import { q } from '../db.js'
import { requireAuth } from '../middleware/auth.js'


const router = Router()


router.get('/me', requireAuth, async (req, res) => {
const r = await q('SELECT id, email, display_name, role, pen_name, avatar_url, bio FROM users WHERE id=$1', [req.user.id])
res.json(r.rows[0])
})


router.put('/me', requireAuth, async (req, res) => {
const { display_name, pen_name, avatar_url, bio } = req.body
const r = await q(
`UPDATE users SET display_name=$1, pen_name=$2, avatar_url=$3, bio=$4 WHERE id=$5
RETURNING id, email, display_name, role, pen_name, avatar_url, bio`,
[display_name, pen_name, avatar_url, bio, req.user.id]
)
res.json(r.rows[0])
})


export default router