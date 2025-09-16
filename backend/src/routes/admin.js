import { Router } from 'express'
import { q } from '../db.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/admin/users? q=&role=&status=&limit=&offset=
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  const { q:search, role, status, limit=50, offset=0 } = req.query
  const p = []
  const w = []
  if (search) {
    p.push(`%${search}%`)
    w.push(`(email ILIKE $${p.length} OR display_name ILIKE $${p.length} OR pen_name ILIKE $${p.length})`)
  }
  if (role) { p.push(role); w.push(`role=$${p.length}`) }
  if (status) { p.push(status); w.push(`status=$${p.length}`) }

  const sql = `
    SELECT id, email, display_name, pen_name, role, status,
           suspended_until, banned_at, created_at
    FROM users
    ${w.length ? 'WHERE '+w.join(' AND ') : ''}
    ORDER BY created_at DESC
    LIMIT ${Number(limit)||50} OFFSET ${Number(offset)||0}
  `
  const r = await q(sql, p)
  res.json(r.rows)
})

// ระงับบัญชีชั่วคราว
// body: { until: '2025-12-31T23:59:59Z' }
router.patch('/users/:id/suspend', requireAuth, requireAdmin, async (req, res) => {
  const { until } = req.body
  if (!until) return res.status(400).json({ message: 'until is required (ISO date)' })

  const r = await q(
    `UPDATE users SET status='suspended', suspended_until=$1 WHERE id=$2 RETURNING id, status, suspended_until`,
    [until, req.params.id]
  )
  if (!r.rowCount) return res.status(404).json({ message: 'User not found' })
  res.json(r.rows[0])
})

// ยกเลิกระงับ
router.patch('/users/:id/unsuspend', requireAuth, requireAdmin, async (req, res) => {
  const r = await q(
    `UPDATE users SET status='active', suspended_until=NULL WHERE id=$1 RETURNING id, status`,
    [req.params.id]
  )
  if (!r.rowCount) return res.status(404).json({ message: 'User not found' })
  res.json(r.rows[0])
})

// แบนถาวร
// body: { reason?: string }
router.patch('/users/:id/ban', requireAuth, requireAdmin, async (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ message: 'Cannot ban yourself' })
  }
  const { reason=null } = req.body || {}
  const r = await q(
    `UPDATE users SET status='banned', banned_at=now(), ban_reason=$1 WHERE id=$2 RETURNING id, status, banned_at, ban_reason`,
    [reason, req.params.id]
  )
  if (!r.rowCount) return res.status(404).json({ message: 'User not found' })
  res.json(r.rows[0])
})

// ยกเลิกแบน
router.patch('/users/:id/unban', requireAuth, requireAdmin, async (req, res) => {
  const r = await q(
    `UPDATE users SET status='active', banned_at=NULL, ban_reason=NULL WHERE id=$1 RETURNING id, status`,
    [req.params.id]
  )
  if (!r.rowCount) return res.status(404).json({ message: 'User not found' })
  res.json(r.rows[0])
})

// ลิสต์นิยาย (ค้นหา)
router.get('/novels', requireAuth, requireAdmin, async (req, res) => {
  const { q:search, status, limit=50, offset=0 } = req.query
  const p = [], w=[]
  if (search) { p.push(`%${search}%`); w.push(`(n.title ILIKE $${p.length} OR u.email ILIKE $${p.length} OR u.display_name ILIKE $${p.length})`) }
  if (status) { p.push(status); w.push(`n.status=$${p.length}`) }
  const r = await q(
    `SELECT n.id, n.slug, n.title, n.status, n.chapter_count, n.created_at,
            u.id AS author_id, u.display_name AS author_name, u.email AS author_email
     FROM novels n JOIN users u ON u.id=n.author_id
     ${w.length? 'WHERE '+w.join(' AND '):''}
     ORDER BY n.created_at DESC LIMIT ${Number(limit)||50} OFFSET ${Number(offset)||0}`, p)
  res.json(r.rows)
})

router.get('/novels/:id/chapters', requireAuth, requireAdmin, async (req, res) => {
  const r = await q(
    `SELECT id, number, title, is_published, published_at
     FROM chapters WHERE novel_id=$1 ORDER BY number ASC`, [req.params.id])
  res.json(r.rows)
})

// ลบนิยายและลบตอน (admin)
router.delete('/novels/:id', requireAuth, requireAdmin, async (req, res) => {
  const r = await q(`DELETE FROM novels WHERE id=$1 RETURNING id`, [req.params.id])
  if (!r.rowCount) return res.status(404).json({ message:'Not found' })
  res.json({ ok:true })
})
router.delete('/chapters/:id', requireAuth, requireAdmin, async (req, res) => {
  const r = await q(`DELETE FROM chapters WHERE id=$1 RETURNING id`, [req.params.id])
  if (!r.rowCount) return res.status(404).json({ message:'Not found' })
  res.json({ ok:true })
})

// รายการอันดับปัจจุบัน
router.get('/rankings', requireAuth, requireAdmin, async (_req, res) => {
  const r = await q(`
    SELECT id, slug, title, cover_url, pen_name, status, featured_rank
    FROM novels
    WHERE featured_rank IS NOT NULL
    ORDER BY featured_rank ASC
  `)
  res.json(r.rows)
})

// เพิ่มนิยายเข้ารายการ (จะถูกต่อท้าย)
router.post('/rankings/add', requireAuth, requireAdmin, async (req, res) => {
  const { novel_id } = req.body
  if (!novel_id) return res.status(400).json({ message: 'novel_id required' })
  const next = await q(`SELECT COALESCE(MAX(featured_rank), 0) + 1 AS next FROM novels`)
  const r = await q(
    `UPDATE novels SET featured_rank=$1 WHERE id=$2 AND featured_rank IS NULL RETURNING id, featured_rank`,
    [next.rows[0].next, novel_id]
  )
  if (!r.rowCount) return res.status(400).json({ message: 'Already in ranking or not found' })
  res.json(r.rows[0])
})

// เอาออกจากอันดับ
router.delete('/rankings/:novelId', requireAuth, requireAdmin, async (req, res) => {
  const r = await q(`UPDATE novels SET featured_rank=NULL WHERE id=$1 RETURNING id`, [req.params.novelId])
  if (!r.rowCount) return res.status(404).json({ message: 'Not found' })
  res.json({ ok:true })
})

// จัดเรียงใหม่: body = { order: [novel_id1, novel_id2, ...] } (ลิสต์เต็ม)
router.patch('/rankings/reorder', requireAuth, requireAdmin, async (req, res) => {
  const { order } = req.body
  if (!Array.isArray(order) || order.length === 0) {
    return res.status(400).json({ message: 'order must be a non-empty array of novel ids' })
  }
  // อัปเดตลำดับ
  for (let i = 0; i < order.length; i++) {
    await q(`UPDATE novels SET featured_rank=$1 WHERE id=$2`, [i+1, order[i]])
  }
  // เอาเรื่องอื่นที่เคยมี rank ออก (ถ้าไม่อยู่ในลิสต์)
  await q(`UPDATE novels SET featured_rank=NULL WHERE featured_rank IS NOT NULL AND id <> ALL($1::int[])`, [order])
  res.json({ ok:true })
})

export default router
