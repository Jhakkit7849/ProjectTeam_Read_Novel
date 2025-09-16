import { Router } from 'express'
import slugify from 'slugify'
import jwt from 'jsonwebtoken'
import { q } from '../db.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'

const router = Router()
const STATUS = ['ongoing','completed']

// ── ของฉัน ────────────────────────────────────────────────────────────────
router.get('/mine', requireAuth, async (req, res) => {
  const r = await q(
    `SELECT id, slug, title, cover_url, pen_name, status, is_published,
            COALESCE(chapter_count,0) AS chapter_count, created_at, author_id
     FROM novels
     WHERE author_id=$1
     ORDER BY created_at DESC`,
    [req.user.id]
  )
  res.json(r.rows)
})

// ── แนะนำ ────────────────────────────────────────────────────────────────
router.get('/featured', async (_req, res) => {
  const r = await q(`
    SELECT id, slug, title,  description, cover_url, pen_name, status
    FROM novels
    WHERE featured_rank IS NOT NULL
    ORDER BY featured_rank ASC
    LIMIT 100
  `)
  res.json(r.rows)
})

// ── สำหรับแก้ไข (เฉพาะเจ้าของ) ─────────────────────────────────────────
router.get('/manage/:id', requireAuth, async (req, res) => {
  const r = await q(`SELECT * FROM novels WHERE id=$1 AND author_id=$2`, [req.params.id, req.user.id])
  if (!r.rowCount) return res.status(403).json({ message: 'Not found or no permission' })
  const novel = r.rows[0]
  const tags = await q(
    `SELECT t.name, t.slug FROM tags t JOIN novel_tags nt ON nt.tag_id=t.id WHERE nt.novel_id=$1`, [novel.id]
  )
  res.json({ ...novel, tags: tags.rows.map(t=>t.name) })
})

// ── ค้น/ลิสต์ ────────────────────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res) => {
  const { q: search, category_id, tag, type, status, sort='new' } = req.query
  const params = []
  const where = []
  if (search)     { params.push(`%${search}%`); where.push(`(n.title ILIKE $${params.length} OR n.description ILIKE $${params.length})`) }
  if (category_id){ params.push(category_id);   where.push(`n.category_id=$${params.length}`) }
  if (type)       { params.push(type);         where.push(`n.type=$${params.length}`) }
  if (status)     { params.push(status);       where.push(`n.status=$${params.length}`) }
  if (tag) { 
    params.push(tag)
    where.push(`EXISTS(SELECT 1 FROM novel_tags nt JOIN tags t ON t.id=nt.tag_id WHERE nt.novel_id=n.id AND t.slug=$${params.length})`)
  }
  const order = sort==='top' ? 'n.fav_count DESC NULLS LAST' : 'n.created_at DESC'
  const sql = `SELECT n.id, n.slug, n.description ,n.title, n.cover_url, n.pen_name, n.status, n.type,
                      COALESCE(n.chapter_count,0) chapter_count
               FROM novels n ${where.length? 'WHERE '+where.join(' AND '):''}
               ORDER BY ${order} LIMIT 40`
  const r = await q(sql, params)
  res.json(r.rows)
})

// ── รายละเอียดตาม slug ──────────────────────────────────────────────────
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
  const tags = await q(`SELECT t.name, t.slug FROM tags t JOIN novel_tags nt ON nt.tag_id=t.id WHERE nt.novel_id=$1`, [novel.id])
  res.json({ ...novel, tags: tags.rows })
})

// ลบนิยาย: author ของเรื่อง หรือ admin เท่านั้น
router.delete('/:id', requireAuth, async (req, res) => {
  const isAdmin = req.user.role === 'admin'
  const sql = isAdmin
    ? `DELETE FROM novels WHERE id=$1 RETURNING id, slug`
    : `DELETE FROM novels WHERE id=$1 AND author_id=$2 RETURNING id, slug`
  const params = isAdmin ? [req.params.id] : [req.params.id, req.user.id]
  const r = await q(sql, params)
  if (!r.rowCount) return res.status(404).json({ message: 'Not found or no permission' })
  // chapters, novel_tags ถูกลบอัตโนมัติด้วย ON DELETE CASCADE
  res.json({ ok: true })
})

// ── สร้าง ────────────────────────────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  const { title, description, cover_url, pen_name, category_id, type, status='ongoing', tags=[] } = req.body
  if (!['original','fanfic'].includes(type)) return res.status(400).json({ message: 'type must be original or fanfic' })
  if (!STATUS.includes(status)) return res.status(400).json({ message: 'invalid status' })

  // อัปเกรด reader -> writer เมื่อสร้างเรื่องครั้งแรก
  let newToken = null
  if (req.user.role === 'reader') {
    await q(`UPDATE users SET role='writer' WHERE id=$1 AND role='reader'`, [req.user.id])
    const ur = await q(`SELECT id, email, display_name, role FROM users WHERE id=$1`, [req.user.id])
    newToken = jwt.sign(ur.rows[0], process.env.JWT_SECRET, { expiresIn: '7d' })
  }

  const novelSlug = slugify(title, { lower:true, strict:true }) + '-' + Math.random().toString(36).slice(2,6)
  const r = await q(
    `INSERT INTO novels(author_id, title, slug, description, cover_url, pen_name, category_id, type, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [req.user.id, title, novelSlug, description, cover_url, pen_name, category_id, type, status]
  )
  const novel = r.rows[0]

  for (const name of (tags||[])) {
    const tslug = slugify(name, { lower:true, strict:true })
    const t = await q(`INSERT INTO tags(name, slug) VALUES ($1,$2)
                       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name
                       RETURNING id`, [name, tslug])
    await q(`INSERT INTO novel_tags(novel_id, tag_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [novel.id, t.rows[0].id])
  }

  res.status(201).json({ novel, token: newToken })
})

// ── แก้ไข ────────────────────────────────────────────────────────────────
router.put('/:id', requireAuth, async (req, res) => {
  const { title, description, cover_url, pen_name, category_id, status, type, is_featured=false, is_published=false, tags=[] } = req.body
  if (status && !STATUS.includes(status)) return res.status(400).json({ message:'invalid status' })

  const r = await q(
    `UPDATE novels SET title=$1, description=$2, cover_url=$3, pen_name=$4, category_id=$5,
                       status=$6, type=$7, is_featured=$8, is_published=$9
     WHERE id=$10 AND author_id=$11
     RETURNING *`,
    [title, description, cover_url, pen_name, category_id, status, type, is_featured, is_published, req.params.id, req.user.id]
  )
  if (!r.rowCount) return res.status(404).json({ message:'Not found or no permission' })
  const novel = r.rows[0]

  await q('DELETE FROM novel_tags WHERE novel_id=$1', [novel.id])
  for (const name of (tags||[])) {
    const tslug = slugify(name, { lower:true, strict:true })
    const t = await q(`INSERT INTO tags(name, slug) VALUES ($1,$2)
                       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name
                       RETURNING id`, [name, tslug])
    await q(`INSERT INTO novel_tags(novel_id, tag_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [novel.id, t.rows[0].id])
  }
  res.json(novel)
})

export default router
