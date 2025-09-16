import jwt from 'jsonwebtoken'
import { q } from '../db.js'

export const requireAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Unauthorized' })

    const t = jwt.verify(token, process.env.JWT_SECRET)
    const r = await q(
      `SELECT id, email, display_name, role, status, suspended_until, banned_at
       FROM users WHERE id=$1`, [t.id]
    )
    if (!r.rowCount) return res.status(401).json({ message: 'Unauthorized' })
    const u = r.rows[0]

    // กันผู้ใช้ถูกแบน/ระงับ
    if (u.status === 'banned') {
      return res.status(403).json({ message: 'Account is banned' })
    }
    if (u.status === 'suspended') {
      if (!u.suspended_until || new Date() < new Date(u.suspended_until)) {
        return res.status(403).json({ message: 'Account is suspended', until: u.suspended_until })
      }
      // ถ้าหมดอายุระงับแล้ว อนุญาตต่อได้ (จะกลับเป็น active เมื่อ admin เปลี่ยน)
    }

    req.user = { id: u.id, email: u.email, display_name: u.display_name, role: u.role }
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export const optionalAuth = async (req, _res, next) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (token) {
    try {
      const t = jwt.verify(token, process.env.JWT_SECRET)
      const r = await q(`SELECT id, email, display_name, role FROM users WHERE id=$1`, [t.id])
      if (r.rowCount) req.user = r.rows[0]
    } catch {}
  }
  next()
}

// ใช้กับ route แบบ admin-only
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' })
  }
  next()
}
