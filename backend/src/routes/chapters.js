import { Router } from 'express'
import { q } from '../db.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'
import { countWords } from '../utils.js'

const router = Router()

// รายการตอนของนิยาย (ใครก็เรียกได้)
router.get('/by-novel/:novelId', optionalAuth, async (req, res) => {
  const rows = await q(
    `SELECT id, number, title, is_published, published_at
     FROM chapters
     WHERE novel_id=$1
     ORDER BY number ASC`,
    [req.params.novelId]
  )
  res.json(rows.rows)
})

// อ่านตอน (อนุญาตเฉพาะตอนที่เผยแพร่แล้ว; ถ้าเป็นเจ้าของจะอ่าน draft ได้ด้วย)
router.get('/:id', optionalAuth, async (req, res) => {
  const r = await q(
    `SELECT c.*, n.slug AS novel_slug, n.author_id
     FROM chapters c
     JOIN novels n ON n.id=c.novel_id
     WHERE c.id=$1`,
    [req.params.id]
  )
  if (!r.rowCount) return res.status(404).json({ message: 'Not found' })
  const ch = r.rows[0]

  // ถ้ายังไม่เผยแพร่ อนุญาตเฉพาะเจ้าของเท่านั้น
  const isOwner = !!(req.user?.id && req.user.id === ch.author_id)
  if (!ch.is_published && !isOwner) {
    return res.status(403).json({ message: 'Chapter not published' })
  }

  // record read เฉพาะกรณีเผยแพร่จริง
  if (req.user?.id && ch.is_published) {
    await q(`INSERT INTO chapter_reads(user_id, chapter_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [req.user.id, ch.id])
    await q(`INSERT INTO reading_history(user_id, novel_id, chapter_id, last_read_at)
             VALUES ($1,$2,$3, now())
             ON CONFLICT (user_id, novel_id) DO UPDATE SET chapter_id=EXCLUDED.chapter_id, last_read_at=now()`,
      [req.user.id, ch.novel_id, ch.id])
  }
  res.json(ch)
})

// โหลดตอนเพื่อแก้ไข (เฉพาะเจ้าของ)
router.get('/manage/:id', requireAuth, async (req, res) => {
  const r = await q(
    `SELECT c.*
     FROM chapters c
     JOIN novels n ON n.id=c.novel_id
     WHERE c.id=$1 AND n.author_id=$2`,
    [req.params.id, req.user.id]
  )
  if (!r.rowCount) return res.status(403).json({ message:'Not found or no permission' })
  res.json(r.rows[0])
})

// เพิ่มตอน (เฉพาะเจ้าของนิยาย)
router.post('/', requireAuth, async (req, res) => {
  const { novel_id, number, title, content_html, is_published=false } = req.body

  // ✅ เช็คสิทธิ์เป็นเจ้าของนิยายก่อน
  const owned = await q('SELECT 1 FROM novels WHERE id=$1 AND author_id=$2', [novel_id, req.user.id])
  if (!owned.rowCount) return res.status(403).json({ message: 'Not your novel' })

  const wc = countWords(content_html||'')
  const r = await q(
    `INSERT INTO chapters(novel_id, number, title, content_html, word_count, is_published, published_at)
     VALUES ($1,$2,$3,$4,$5,$6, CASE WHEN $6 THEN now() ELSE NULL END)
     RETURNING *`,
    [novel_id, number, title, content_html, wc, is_published]
  )
  if (r.rowCount) await q(`UPDATE novels SET chapter_count = COALESCE(chapter_count,0)+1 WHERE id=$1`, [novel_id])
  res.status(201).json(r.rows[0])
})

// แก้ไขตอน (เฉพาะเจ้าของนิยายของตอนนั้น)
router.put('/:id', requireAuth, async (req, res) => {
  const { title, number, content_html, is_published } = req.body
  const wc = countWords(content_html||'')

  // ✅ อนุญาตเฉพาะตอนที่เป็นของนิยายที่เราเป็นเจ้าของ
  const r = await q(
    `UPDATE chapters c
     SET title=$1, number=$2, content_html=$3, word_count=$4, is_published=$5,
         published_at = CASE
           WHEN $5 AND published_at IS NULL THEN now()
           WHEN NOT $5 THEN NULL
           ELSE published_at END
     FROM novels n
     WHERE c.id=$6 AND n.id=c.novel_id AND n.author_id=$7
     RETURNING c.*`,
    [title, number, content_html, wc, is_published, req.params.id, req.user.id]
  )
  if (!r.rowCount) return res.status(403).json({ message:'Not found or no permission' })
  res.json(r.rows[0])
})

export default router
