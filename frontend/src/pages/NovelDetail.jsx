import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import API from '../lib/api'
import ChapterList from '../components/ChapterList'
import useAuth from '../hooks/useAuth'   // 👈 เพิ่ม

export default function NovelDetail(){
  const { slug } = useParams()
  const [novel,setNovel] = useState(null)
  const [chapters,setChapters] = useState([])
  const { user } = useAuth()             // 👈 เพิ่ม
  const nav = useNavigate()

  useEffect(()=>{
    API.get(`/novels/${slug}`)
      .then(r=>{ setNovel(r.data); return API.get(`/chapters/by-novel/${r.data.id}`) })
      .then(r=>setChapters(r.data))
  },[slug])

  if(!novel) return null
  const isOwner = !!(user && user.id === novel.author_id)  // 👈 เช็คเจ้าของ

  return (
    <div className="container">
      <div className="hero">
        <img src={novel.cover_url || 'https://placehold.co/300x400?text=Cover'} />
        <div>
          <h1>{novel.title}</h1>
          <p>{novel.description}</p>
          <div className="tags">{(novel.tags||[]).map(t=> <span className="tag" key={t.slug}>#{t.name}</span>)}</div>
          <div style={{display:'flex', gap:8, marginTop:12}}>
            {chapters[0] && <button className="btn" onClick={()=> nav(`/read/${chapters[0].id}`)}>เริ่มอ่าน</button>}
            {isOwner && (
              <>
                <Link className="btn secondary" to={`/write/chapter?novel=${novel.id}`}>เพิ่มตอนใหม่</Link>
                <Link className="btn secondary" to={`/write/new?id=${novel.id}`}>แก้ไขเรื่อง</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <h3 style={{marginTop:24}}>ตอนทั้งหมด</h3>
      <ChapterList chapters={chapters} novelSlug={slug} isOwner={isOwner} /> {/* 👈 ส่ง isOwner */}
    </div>
  )
}
