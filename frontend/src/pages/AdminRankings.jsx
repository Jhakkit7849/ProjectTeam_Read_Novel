import { useEffect, useState } from 'react'
import API from '../lib/api'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function AdminRankings(){
  const { user, loading } = useAuth()
  const nav = useNavigate()
  useEffect(()=>{ if (!loading && (!user || user.role!=='admin')) nav('/') }, [user, loading, nav])

  const [list, setList] = useState([])
  const [q, setQ] = useState('')
  const [searchRes, setSearchRes] = useState([])
  const [busy, setBusy] = useState(false)

  const load = async ()=> {
    const r = await API.get('/admin/rankings')
    setList(r.data || [])
  }
  useEffect(()=>{ load() }, [])

  const search = async ()=>{
    const r = await API.get('/novels', { params: { q } })
    setSearchRes(r.data || [])
  }

  const addNovel = async (id)=>{
    setBusy(true)
    await API.post('/admin/rankings/add', { novel_id: id })
    await load()
    setBusy(false)
  }
  const removeNovel = async (id)=>{
    if (!confirm('เอานิยายนี้ออกจากอันดับ?')) return
    setBusy(true)
    await API.delete(`/admin/rankings/${id}`)
    await load()
    setBusy(false)
  }

  const move = (idx, dir)=>{ // dir: -1 up, +1 down (local only, save to server when press save)
    const j = idx + dir
    if (j<0 || j>=list.length) return
    const cp = list.slice()
    ;[cp[idx], cp[j]] = [cp[j], cp[idx]]
    setList(cp)
  }

  const saveOrder = async ()=>{
    setBusy(true)
    const order = list.map(n=> n.id)
    await API.patch('/admin/rankings/reorder', { order })
    await load()
    setBusy(false)
  }

  return (
    <div className="container" style={{maxWidth:1100}}>
      <h2>ผู้ดูแลระบบ • จัดอันดับนิยายน่าอ่าน</h2>

      <div className="form-2" style={{marginBottom:12}}>
        <input className="input" placeholder="ค้นหาชื่อเรื่อง" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn" onClick={search}>ค้นหา</button>
      </div>
      {searchRes.length>0 && (
        <div className="card" style={{padding:12, marginBottom:16}}>
          <div style={{fontWeight:700, marginBottom:8}}>ผลการค้นหา</div>
          <div className="grid">
            {searchRes.map(n=>(
              <div key={n.id} className="card">
                <img src={n.cover_url || 'https://placehold.co/300x400?text=Cover'} />
                <div className="p">
                  <div style={{fontWeight:700}}>{n.title}</div>
                  <button className="btn" disabled={busy || list.some(x=>x.id===n.id)} onClick={()=>addNovel(n.id)}>
                    เพิ่มเข้าจัดอันดับ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
        <h3>รายการอันดับปัจจุบัน</h3>
        <button className="btn" disabled={busy} onClick={saveOrder}>บันทึกการเรียง</button>
      </div>

      <table className="table">
        <thead><tr><th>#</th><th>ชื่อเรื่อง</th><th>ผู้เขียน</th><th>สถานะ</th><th>จัดการ</th></tr></thead>
        <tbody>
          {list.map((n,i)=>(
            <tr key={n.id}>
              <td>#{i+1}</td>
              <td>{n.title}</td>
              <td>{n.pen_name || '-'}</td>
              <td>{n.status==='completed' ? 'จบแล้ว' : 'ยังไม่จบ'}</td>
              <td style={{display:'flex', gap:6}}>
                <button className="btn secondary" onClick={()=>move(i,-1)} disabled={i===0 || busy}>ขึ้น</button>
                <button className="btn secondary" onClick={()=>move(i,1)} disabled={i===list.length-1 || busy}>ลง</button>
                <button className="btn danger" onClick={()=>removeNovel(n.id)} disabled={busy}>เอาออก</button>
              </td>
            </tr>
          ))}
          {list.length===0 && <tr><td colSpan="5" style={{textAlign:'center', color:'#777'}}>ยังไม่มีการจัดอันดับ</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
