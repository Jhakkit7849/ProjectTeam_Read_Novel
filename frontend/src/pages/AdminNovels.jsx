import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../lib/api'
import useAuth from '../hooks/useAuth'

export default function AdminNovels(){
  const { user, loading } = useAuth()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [items, setItems] = useState([])
  const [expanded, setExpanded] = useState(null) // novel id
  const [chapters, setChapters] = useState([])
  const [busy, setBusy] = useState(false)

  useEffect(()=>{
    if (!loading && (!user || user.role !== 'admin')) nav('/')
  }, [user, loading, nav])

  const load = async ()=>{
    const r = await API.get('/admin/novels', { params: { q, status } })
    setItems(r.data || [])
  }
  useEffect(()=>{ load() }, [])

  const openChapters = async (novelId)=>{
    setExpanded(expanded === novelId ? null : novelId)
    if (expanded !== novelId) {
      const r = await API.get(`/admin/novels/${novelId}/chapters`)
      setChapters(r.data || [])
    }
  }

  const delNovel = async (id)=>{
    if (!confirm('ยืนยันลบนิยายทั้งเรื่อง?')) return
    setBusy(true)
    await API.delete(`/admin/novels/${id}`)
    await load()
    setBusy(false)
  }

  const delChapter = async (cid)=>{
    if (!confirm('ยืนยันลบตอนนี้?')) return
    setBusy(true)
    // จะเรียก admin route หรือ route ปกติที่ admin ก็มีสิทธิ์ได้ทั้งคู่
    await API.delete(`/admin/chapters/${cid}`)
    // รีโหลดชื่อตอน
    if (expanded) {
      const r = await API.get(`/admin/novels/${expanded}/chapters`)
      setChapters(r.data || [])
    }
    setBusy(false)
  }

  return (
    <div className="container" style={{maxWidth:1100}}>
      <h2>ผู้ดูแลระบบ • จัดการนิยาย</h2>

      <div className="form-2" style={{marginBottom:12}}>
        <input className="input" placeholder="ค้นหาชื่อเรื่อง/อีเมล/ชื่อผู้แต่ง" value={q} onChange={e=>setQ(e.target.value)} />
        <div style={{display:'flex', gap:8}}>
          <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">ทุกสถานะ</option>
            <option value="ongoing">ยังไม่จบ</option>
            <option value="completed">จบแล้ว</option>
          </select>
          <button className="btn" onClick={load}>ค้นหา</button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr><th>ID</th><th>ชื่อเรื่อง</th><th>ผู้เขียน</th><th>สถานะ</th><th>ตอน</th><th>จัดการ</th></tr>
        </thead>
        <tbody>
          {items.map(n=>(
            <>
              <tr key={n.id}>
                <td>{n.id}</td>
                <td><Link to={`/novels/${n.slug}`}>{n.title}</Link></td>
                <td>{n.author_name} ({n.author_email})</td>
                <td>{n.status === 'completed' ? 'จบแล้ว' : 'ยังไม่จบ'}</td>
                <td>{n.chapter_count ?? 0}</td>
                <td style={{display:'flex', gap:6}}>
                  <button className="btn secondary" onClick={()=>openChapters(n.id)}>
                    {expanded === n.id ? 'ซ่อนตอน' : 'ดูตอน'}
                  </button>
                  <button className="btn danger" disabled={busy} onClick={()=>delNovel(n.id)}>ลบนิยาย</button>
                </td>
              </tr>
              {expanded === n.id && (
                <tr>
                  <td colSpan="6">
                    <div style={{padding:12, background:'#fafafa', borderRadius:8, border:'1px solid #eee'}}>
                      <div style={{fontWeight:700, marginBottom:8}}>ตอนทั้งหมด</div>
                      <table className="table">
                        <thead><tr><th>#</th><th>ชื่อตอน</th><th>สถานะ</th><th>จัดการ</th></tr></thead>
                        <tbody>
                          {(chapters||[]).map(c=>(
                            <tr key={c.id}>
                              <td>{c.number}</td>
                              <td>{c.title}</td>
                              <td>{c.is_published ? 'เผยแพร่' : 'ฉบับร่าง'}</td>
                              <td>
                                <button className="btn danger" disabled={busy} onClick={()=>delChapter(c.id)}>ลบตอน</button>
                              </td>
                            </tr>
                          ))}
                          {(!chapters || chapters.length===0) && (
                            <tr><td colSpan="4" style={{textAlign:'center', color:'#777'}}>ยังไม่มีตอน</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
          {items.length===0 && (
            <tr><td colSpan="6" style={{textAlign:'center', color:'#777'}}>ไม่พบนิยาย</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
