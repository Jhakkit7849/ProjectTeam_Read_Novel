import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { q } from '../db.js'


const router = Router()


router.post('/register', async (req, res) => {
  try {
    const { email, password, display_name } = req.body || {}
    if (!display_name || !display_name.trim()) return res.status(400).json({ message: 'display_name is required' })
    if (!email || !/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ message: 'invalid email' })
    if (!password || password.length < 8) return res.status(400).json({ message: 'password too short (min 8)' })

    const hash = await bcrypt.hash(password, 10)
    const r = await q(
      `INSERT INTO users(email, password_hash, display_name)
       VALUES ($1,$2,$3)
       RETURNING id, email, display_name, role`,
      [email.trim().toLowerCase(), hash, display_name.trim()]
    )
    const user = r.rows[0]
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user })
  } catch (e) {
    // handle unique violation (email ซ้ำ)
    if (e.code === '23505') {
      return res.status(409).json({ message: 'อีเมลนี้ถูกใช้แล้ว' })
    }
    console.error('register error', e)
    res.status(500).json({ message: 'signup failed' })
  }
})


router.post('/login', async (req, res) => {
const { email, password } = req.body
const userRes = await q('SELECT * FROM users WHERE email=$1', [email])
const user = userRes.rows[0]
if (!user) return res.status(401).json({ message: 'Invalid credentials' })
const ok = await bcrypt.compare(password, user.password_hash)
if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
const payload = { id: user.id, email: user.email, display_name: user.display_name, role: user.role }
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
res.json({ token, user: payload })
})


router.get('/me', async (req, res) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.json({ user: null })
  try {
    const t = jwt.verify(token, process.env.JWT_SECRET)
    const r = await q('SELECT id, email, display_name, role FROM users WHERE id=$1', [t.id])
    return res.json({ user: r.rows[0] || null })
  } catch {
    return res.json({ user: null })
  }
})


export default router