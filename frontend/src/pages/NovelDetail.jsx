import { useEffect, useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import API from '../lib/api'
import ChapterList from '../components/ChapterList'
import useAuth from '../hooks/useAuth'

export default function NovelDetail(){
  const { slug } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()

  const [novel,setNovel] = useState(null)
  const [chapters,setChapters] = useState([])
  const [inLibrary, setInLibrary] = useState(false)
  const [libBusy, setLibBusy] = useState(false)

  useEffect(()=> {
    let mounted = true
    async function load() {
      try {
        // โหลดรายละเอียดนิยาย
        const r1 = await API.get(`/novels/${slug}`)
        if (!mounted) return
        setNovel(r1.data)

        // โหลดรายการตอนของนิยายนี้
        const r2 = await API.get(`/chapters/by-novel/${r1.data.id}`)
        if (!mounted) return
        setChapters(r2.data)

        // ถ้าล็อกอินแล้ว ตรวจว่าอยู่ในคลังของฉันหรือยัง
        if (user) {
          try {
            const r3 = await API.get('/library')
            if (!mounted) return
            setInLibrary(!!r3.data.find(n => n.id === r1.data.id))
          } catch {
            // เงียบไว้ ไม่กระทบหน้า
          }
        } else {
          setInLibrary(false)
        }
      } catch (err) {
        alert(err.response?.data?.message || 'ไม่พบข้อมูลนิยาย')
      }
    }
    load()
    return () => { mounted = false }
  }, [slug, user])

  const isOwner = useMemo(() => {
    return !!(user && novel && user.id === novel.author_id)
  }, [user, novel])

  const toggleLibrary = async () => {
    if (!user) return nav('/signin')
    if (!novel) return
    setLibBusy(true)
    try {
      if (inLibrary) {
        await API.delete(`/library/${novel.id}`)
        setInLibrary(false)
      } else {
        await API.post(`/library/${novel.id}`)
        setInLibrary(true)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'ทำรายการไม่สำเร็จ')
    } finally {
      setLibBusy(false)
    }
  }

  if(!novel) return null

  return (
    <div className="container">
      <div className="hero">
        <img src={novel.cover_url || 'https://placehold.co/300x400?text=Cover'} />
        <div>
          <h1>{novel.title}</h1>
          <p>{novel.description}</p>
          <div className="tags">
            {(novel.tags||[]).map(t=> <span className="tag" key={t.slug}>#{t.name}</span>)}
          </div>

          <div style={{display:'flex', gap:8, marginTop:12}}>
            {chapters[0] && (
              <button className="btn" onClick={()=> { 
                // เริ่มอ่านที่ตอนแรก
                return nav(`/read/${chapters[0].id}`)
              }}>
                เริ่มอ่าน
              </button>
            )}

            <button
              className="btn secondary"
              disabled={libBusy}
              onClick={toggleLibrary}
              title={inLibrary ? 'เอาเรื่องนี้ออกจากคลังของฉัน' : 'เพิ่มเรื่องนี้ลงคลังของฉัน'}
            >
              {inLibrary ? 'เอาออกจากคลัง' : 'เพิ่มลงคลัง'}
            </button>

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
      <ChapterList chapters={chapters} novelSlug={slug} isOwner={isOwner} />
    </div>
  )
}
