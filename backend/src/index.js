// backend/src/index.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { q } from './db.js' // 👈 ใช้ใน webhook

import auth from './routes/auth.js'
import users from './routes/users.js'
import novels from './routes/novels.js'
import chapters from './routes/chapters.js'
import library from './routes/library.js'
import donations from './routes/donations.js'
import search from './routes/search.js'
import rankings from './routes/rankings.js'
import categories from './routes/categories.js'
import admin from './routes/admin.js'
import chatbot from './routes/chatbot.js'

const app = express()

const allowed = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean)
const corsOption = allowed.length
  ? { origin: allowed, credentials: true }
  : { origin: true, credentials: true }

app.use(cors(corsOption))
app.use(cookieParser())
app.use(morgan('dev'))

// 🔔 Stripe Webhook ต้องมาก่อน express.json()
app.post('/api/webhooks/stripe', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // ถ้าไม่ใช้ลายเซ็น ให้ parse แบบนี้ (req.body เป็น Buffer จาก raw)
    const event = JSON.parse(req.body.toString('utf8'))

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const donationId = Number(session?.metadata?.donation_id)
      if (donationId) {
        await q(`UPDATE donations SET status='paid', paid_at=NOW() WHERE id=$1`, [donationId])
      }
    }
    return res.json({ received: true })
  } catch (e) {
    console.error('stripe webhook error', e)
    return res.status(400).end()
  }
})

// ✅ หลังจากนั้นค่อย parse JSON ปกติ
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req,res)=>res.json({ ok:true }))
app.use('/api/auth', auth)
app.use('/api/users', users)
app.use('/api/novels', novels)
app.use('/api/chapters', chapters)
app.use('/api/library', library)
app.use('/api/donations', donations)
app.use('/api/search', search)
app.use('/api/rankings', rankings)
app.use('/api/categories', categories)
app.use('/api/admin', admin)
app.use('/api/chatbot', chatbot)
const port = process.env.PORT || 5000
app.listen(port, ()=> console.log('API on :' + port))
