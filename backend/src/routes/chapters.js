import { Router } from 'express'
import { q } from '../db.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'
import { countWords } from '../utils.js'


const router = Router()


router.get('/by-novel/:novelId', optionalAuth, async (req, res) => {
const rows = await q(`SELECT id, number, title, is_published, published_at FROM chapters WHERE novel_id=$1 ORDER BY number ASC`, [req.params.novelId])
res.json(rows.rows)
})


router.get('/:id', optionalAuth, async (req, res) => {
const r = await q(`SELECT c.*, n.slug AS novel_slug FROM chapters c JOIN novels n ON n.id=c.novel_id WHERE c.id=$1`, [req.params.id])
if (!r.rowCount) return res.status(404).json({ message: 'Not found' })
const ch = r.rows[0]
if (!ch.is_published) return res.status(403).json({ message: 'Chapter not published' })
// record read
if (req.user?.id) {
await q(`INSERT INTO chapter_reads(user_id, chapter_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [req.user.id, ch.id])
await q(`INSERT INTO reading_history(user_id, novel_id, chapter_id, last_read_at)
VALUES ($1,$2,$3, now())
ON CONFLICT (user_id, novel_id) DO UPDATE SET chapter_id=EXCLUDED.chapter_id, last_read_at=now()`,
[req.user.id, ch.novel_id, ch.id])
}
res.json(ch)
})


router.post('/', requireAuth, async (req, res) => {
const { novel_id, number, title, content_html, is_published=false } = req.body
const wc = countWords(content_html)
const r = await q(
`INSERT INTO chapters(novel_id, number, title, content_html, word_count, is_published, published_at)
VALUES ($1,$2,$3,$4,$5,$6, CASE WHEN $6 THEN now() ELSE NULL END)
RETURNING *`,
[novel_id, number, title, content_html, wc, is_published]
)
if (r.rowCount) await q(`UPDATE novels SET chapter_count = COALESCE(chapter_count,0)+1 WHERE id=$1`, [novel_id])
res.status(201).json(r.rows[0])
})


router.put('/:id', requireAuth, async (req, res) => {
const { title, number, content_html, is_published } = req.body
const wc = countWords(content_html)
const r = await q(
`UPDATE chapters SET title=$1, number=$2, content_html=$3, word_count=$4, is_published=$5,
published_at = CASE WHEN $5 AND published_at IS NULL THEN now() WHEN NOT $5 THEN NULL ELSE published_at END
WHERE id=$6 RETURNING *`,
[title, number, content_html, wc, is_published, req.params.id]
)
if (!r.rowCount) return res.status(404).json({ message:'Not found' })
res.json(r.rows[0])
})


export default router