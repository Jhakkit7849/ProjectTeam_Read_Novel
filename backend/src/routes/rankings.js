import { Router } from 'express'
import { q } from '../db.js'
const router = Router()


router.get('/', async (req, res) => {
// simple trending = chapter_reads in last 30 days
const r = await q(
`SELECT n.id, n.slug, n.title, n.cover_url, n.pen_name, COUNT(cr.*) as reads
FROM chapter_reads cr JOIN chapters c ON c.id=cr.chapter_id JOIN novels n ON n.id=c.novel_id
WHERE cr.created_at > now() - interval '30 days'
GROUP BY n.id ORDER BY reads DESC LIMIT 20`
)
res.json(r.rows)
})


export default router