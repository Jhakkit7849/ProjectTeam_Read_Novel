import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import auth from './routes/auth.js'
import users from './routes/users.js'
import novels from './routes/novels.js'
import chapters from './routes/chapters.js'
import library from './routes/library.js'
import donations from './routes/donations.js'
import search from './routes/search.js'
import rankings from './routes/rankings.js'
import categories from './routes/categories.js'

const app = express()

const allowed = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean)
const corsOption = allowed.length
  ? { origin: allowed, credentials: true }
  : { origin: true, credentials: true } 

app.use(cors(corsOption))
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())
app.use(morgan('dev'))


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

const port = process.env.PORT || 5000
app.listen(port, ()=> console.log('API on :' + port))