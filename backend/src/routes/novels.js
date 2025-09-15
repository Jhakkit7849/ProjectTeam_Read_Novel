// backend/src/routes/novels.js
import { Router } from 'express'
import slugify from 'slugify'
import jwt from 'jsonwebtoken'
import { q } from '../db.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'

const router = Router()

const ratingSet = ['ALL','PRESCHOOL','KID_6_12','TEEN_13','TEEN_18','ADULT_20']

// GET /api/novels
router.get('/', optionalAuth, async (req, res) => {
  const { q: search, category_id, tag, type, rating, sort='new' } = req.query
  const params = []
  const where = []
  if (search) { params.push(`%${search}%`); where.push(`(n.title ILIKE $${params.length} OR n.description ILIKE $${params.length})`) }
  if (category_id) { params.push(category_id); where.push(`n.category_id=$${params.length}`) }
  if (type) { params.push(type); where.push(`n.type=$${params.length}`) }
  if (rating) { params.push(rating); where.push(`n.rating=$${params.length}`) }
  if (tag) {
    params.push(tag)
    where.push(`EXISTS(SELECT 1 FROM novel_tags nt JOIN tags t ON t.id=nt.tag_id WHERE nt.novel_id=n.id AND t.slug=$${params.length})`)
  }
  const order = sort==='top' ? 'n.fav_count DESC NULLS LAST' : 'n.created_at DESC'
  const sql = `SELECT n.id, n.slug, n.title, n.cover_url, n.pen_name, n.status, n.type, n.rating,
                      COALESCE(n.chapter_count,0) chapter_count
               FROM novels n ${where.length ? 'WHERE '+where.join(' AND ') : ''}
               ORDER BY ${order} LIMIT 40`
  const r = await q(sql, params)
  res.json(r.rows)
})

// GET /api/novels/featured
router.get('/featured', async (_req, res) => {
  const r = await q(`SELECT id, slug, title, cover_url, pen_name
                     FROM novels WHERE is_featured=true
                     ORDER BY created_at DESC LIMIT 12`)
  res.json(r.rows)
})

// GET /api/novels/:slug
router.get('/:slug', optionalAuth, async (req, res) => {
  const r = await q(
    `SELECT n.*, u.display_name as author_name, c.name as category_name
     FROM novels n
     JOIN users u ON u.id=n.author_id
     LEFT JOIN categories c ON c.id=n.category_id
     WHERE n.slug=$1`,
    [req.params.slug]
  )
  if (!r.rowCount) return res.status(404).json({ message: 'Not found' })
  const novel = r.rows[0]
  const tags = await q(
    `SELECT t.name, t.slug
     FROM tags t JOIN novel_tags nt ON nt.tag_id=t.id
     WHERE nt.novel_id=$1`,
    [novel.id]
  )
  res.json({ ...novel, tags: tags.rows })
})

// POST /api/novels  (สร้างนิยาย + อัปเกรด role reader -> writer อัตโนมัติ)
router.post('/', requireAuth, async (req, res) => {
  const { title, description, cover_url, pen_name, category_id, type, rating='ALL', tags=[] } = req.body
  if (!['original','fanfic'].includes(type)) return res.status(400).json({ message: 'type must be original or fanfic' })
  if (!ratingSet.includes(rating)) return res.status(400).json({ message: 'invalid rating' })

  // อัปเกรด role ครั้งแรกที่สร้างนิยาย
  let newToken = null
  if (req.user.role === 'reader') {
    await q(`UPDATE users SET role='writer' WHERE id=$1 AND role='reader'`, [req.user.id])
    const ur = await q(`SELECT id, email, display_name, role FROM users WHERE id=$1`, [req.user.id])
    const payload = ur.rows[0]
    newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
  }

  const novelSlug = slugify(title, { lower:true, strict:true }) + '-' + Math.random().toString(36).slice(2,6)
  const r = await q(
    `INSERT INTO novels(author_id, title, slug, description, cover_url, pen_name, category_id, type, rating)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [req.user.id, title, novelSlug, description, cover_url, pen_name, category_id, type, rating]
  )
  const novel = r.rows[0]

  // upsert tags (ระวังชนชื่อแปร slug -> ใช้ tslug แทน)
  for (const name of tags) {
    const tslug = slugify(name, { lower:true, strict:true })
    const t = await q(
      `INSERT INTO tags(name, slug) VALUES ($1,$2)
       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name
       RETURNING id`, [name, tslug]
    )
    await q(
      `INSERT INTO novel_tags(novel_id, tag_id) VALUES ($1,$2)
       ON CONFLICT DO NOTHING`, [novel.id, t.rows[0].id]
    )
  }

  // ส่ง token ใหม่กลับ (ถ้ามี) เพื่อให้ frontend อัปเดต role ทันที
  res.status(201).json({ novel, token: newToken })
})

// PUT /api/novels/:id
router.put('/:id', requireAuth, async (req, res) => {
  const { title, description, cover_url, pen_name, category_id, status, rating, type,
          is_featured=false, is_published=false, tags=[] } = req.body

  const r = await q(
    `UPDATE novels SET title=$1, description=$2, cover_url=$3, pen_name=$4, category_id=$5,
                       status=$6, rating=$7, type=$8, is_featured=$9, is_published=$10
     WHERE id=$11 AND author_id=$12
     RETURNING *`,
    [title, description, cover_url, pen_name, category_id, status, rating, type,
     is_featured, is_published, req.params.id, req.user.id]
  )
  if (!r.rowCount) return res.status(404).json({ message:'Not found or no permission' })
  const novel = r.rows[0]

  await q('DELETE FROM novel_tags WHERE novel_id=$1', [novel.id])
  for (const name of tags) {
    const tslug = slugify(name, { lower:true, strict:true })
    const t = await q(
      `INSERT INTO tags(name, slug) VALUES ($1,$2)
       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name
       RETURNING id`, [name, tslug]
    )
    await q(`INSERT INTO novel_tags(novel_id, tag_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [novel.id, t.rows[0].id])
  }
  res.json(novel)
})

router.get('/mine', requireAuth, async (req, res) => {
  const r = await q(
    `SELECT id, slug, title, cover_url, pen_name, status, is_published,
            COALESCE(chapter_count,0) AS chapter_count, created_at
     FROM novels
     WHERE author_id=$1
     ORDER BY created_at DESC`,
    [req.user.id]
  )
  res.json(r.rows)
})

export default router
