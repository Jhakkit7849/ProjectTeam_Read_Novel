import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { q } from '../db.js'
import { registerRules } from '../validators/authValidators.js'
import { validationResult } from 'express-validator'


const router = Router()


router.post('/register', registerRules, async (req, res) => {
const errors = validationResult(req)
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
const { email, password, display_name } = req.body
const exists = await q('SELECT 1 FROM users WHERE email=$1', [email])
if (exists.rowCount) return res.status(409).json({ message: 'Email already registered' })
const hash = await bcrypt.hash(password, 10)
const result = await q(
`INSERT INTO users(email, password_hash, display_name)
VALUES ($1,$2,$3) RETURNING id, email, display_name, role`,
[email, hash, display_name]
)
const user = result.rows[0]
const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' })
res.json({ token, user })
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