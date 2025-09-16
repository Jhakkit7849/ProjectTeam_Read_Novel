// backend/src/routes/donations.js
import { Router } from 'express'
import Stripe from 'stripe'
import { q } from '../db.js'
import { optionalAuth, requireAuth } from '../middleware/auth.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET)

// ใช้ Origin จาก header เป็นหลัก ถ้าไม่มีค่อย fallback ไป APP_URL
function resolveOrigin(req) {
  const h = req.headers.origin
  const envUrl = process.env.APP_URL
  const origin = (/^https?:\/\//.test(h) ? h : envUrl) || ''
  if (!/^https?:\/\//.test(origin)) {
    throw new Error('APP_URL invalid: ต้องกำหนด URL เต็มที่ขึ้นต้นด้วย http(s)://')
  }
  return origin.replace(/\/+$/,'') // ตัด / ท้าย
}

// สร้าง Checkout Session (ผู้ใช้กด "โดเนท")
router.post('/checkout', optionalAuth, async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET) throw new Error('Missing STRIPE_SECRET')
    const origin = resolveOrigin(req)

    const { author_id, novel_id = null, amount, message = '' } = req.body
    const amt = Number(amount)
    if (!author_id || !amt || amt < 10) {
      return res.status(400).json({ message: 'จำนวนเงินขั้นต่ำ 10 บาท' })
    }

    // ตรวจผู้เขียน
    const author = await q('SELECT id, display_name FROM users WHERE id=$1', [author_id])
    if (!author.rowCount) return res.status(404).json({ message: 'ไม่พบผู้เขียน' })

    // 1) บันทึก donation = pending
    const d = await q(
      `INSERT INTO donations(donor_user_id, author_id, novel_id, amount, message, status, provider)
       VALUES ($1,$2,$3,$4,$5,'pending','stripe') RETURNING id`,
      [req.user?.id || null, author_id, novel_id, amt, String(message).slice(0, 1000)]
    )

    // 2) สร้าง Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'thb',
          product_data: { name: `Donation to ${author.rows[0].display_name || 'Author'}` },
          unit_amount: Math.round(amt * 100),
        },
        quantity: 1,
      }],
      metadata: { donation_id: String(d.rows[0].id) },
      success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate/cancel`,
    })

    // ผูก session id ไว้
    await q(`UPDATE donations SET provider_session_id=$1 WHERE id=$2`, [session.id, d.rows[0].id])

    res.json({ url: session.url })
  } catch (err) {
    console.error('stripe checkout error', err)
    res.status(400).json({ message: err?.raw?.message || err.message || 'Stripe error' })
  }
})

// ประวัติโดเนทของฉัน
router.get('/me', requireAuth, async (req, res) => {
  const r = await q(
    `SELECT d.id, d.amount, d.currency, d.status, d.message, d.created_at, d.paid_at,
            d.novel_id, n.slug AS novel_slug, n.title AS novel_title,
            d.author_id, u.display_name AS author_name
     FROM donations d
     LEFT JOIN novels n ON n.id=d.novel_id
     LEFT JOIN users  u ON u.id=d.author_id
     WHERE d.donor_user_id=$1
     ORDER BY d.created_at DESC`,
    [req.user.id]
  )
  res.json(r.rows)
})

export default router
