import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import API from '../lib/api'
import ChapterList from '../components/ChapterList'


export default function NovelDetail(){
const { slug } = useParams()
const [novel,setNovel] = useState(null)
const [chapters,setChapters] = useState([])
const nav = useNavigate()
useEffect(()=>{ API.get(`/novels/${slug}`).then(r=>{ setNovel(r.data); return API.get(`/chapters/by-novel/${r.data.id}`) }).then(r=>setChapters(r.data)) },[slug])
if(!novel) return null
return (
<div className="container">
<div className="hero">
<img src={novel.cover_url || 'https://placehold.co/300x400?text=Cover'} />
<div>
<h1>{novel.title}</h1>
<p>{novel.description}</p>
<div className="tags">{(novel.tags||[]).map(t=> <span className="tag" key={t.slug}>#{t.name}</span>)}</div>
<div style={{display:'flex', gap:8, marginTop:12}}>
<button className="btn" onClick={()=>{ if(chapters[0]) nav(`/read/${chapters[0].id}`) }}>เริ่มอ่าน</button>
<Link className="btn secondary" to={`/write/chapter?novel=${novel.id}`}>เพิ่มตอนใหม่</Link>
</div>
</div>
</div>
<h3 style={{marginTop:24}}>ตอนทั้งหมด</h3>
<ChapterList chapters={chapters} novelSlug={slug} />
</div>
)
}