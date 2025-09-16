// frontend/src/pages/Profile.jsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../lib/api'
import useAuth from '../hooks/useAuth'

export default function Profile(){
  const { user, loading } = useAuth()
  const nav = useNavigate()

  const [u,setU] = useState(null)
  const [form,setForm] = useState({ display_name:'', pen_name:'', avatar_url:'', bio:'' })
  const [editing,setEditing] = useState(false)

  const [mode,setMode] = useState('history') // 'history' | 'donations'
  const [history,setHistory] = useState([])
  const [donations,setDonations] = useState([])
  const [busy,setBusy] = useState(false)

  useEffect(()=>{
    if (!loading && !user) nav('/signin')
  },[user, loading, nav])

  useEffect(()=>{
    async function load(){
      if (!user) return
      const r = await API.get('/users/me')
      setU(r.data)
      setForm(r.data || {})
      // load lists
      API.get('/library/history').then(r=> setHistory(r.data || []))
      API.get('/donations/me').then(r=> setDonations(r.data || []))
    }
    load()
  },[user])

  const save = async ()=>{
    setBusy(true)
    try{
      const r = await API.put('/users/me', form)
      setU(r.data)
      setEditing(false)
    } finally { setBusy(false) }
  }

  const avatar = useMemo(()=> u?.avatar_url || 'https://placehold.co/120x120?text=+' , [u])

  if (loading || !user) return null

  return (
    <div className="container" style={{maxWidth:980}}>
      {/* Header card */}
      <div style={{
        background:'#f6cfc6', padding:'24px 16px', borderRadius:16, display:'grid',
        gridTemplateColumns:'120px 1fr auto', alignItems:'center', gap:16, border:'1px solid #f0d8e9'
      }}>
        <div style={{width:120, height:120, borderRadius:'50%', overflow:'hidden', background:'#eee'}}>
          <img src={avatar} alt="avatar" style={{width:'100%', height:'100%', objectFit:'cover'}} />
        </div>

        <div>
          {editing ? (
            <>
              <input className="input" style={{marginBottom:8}}
                value={form.display_name||''} onChange={e=>setForm({...form, display_name:e.target.value})}
                placeholder="ชื่อที่แสดง" />
              <input className="input" style={{marginBottom:8}}
                value={form.pen_name||''} onChange={e=>setForm({...form, pen_name:e.target.value})}
                placeholder="นามปากกา (ถ้ามี)" />
              <input className="input" style={{marginBottom:8}}
                value={form.avatar_url||''} onChange={e=>setForm({...form, avatar_url:e.target.value})}
                placeholder="ลิงก์รูปโปรไฟล์" />
              <textarea className="input" rows="3"
                value={form.bio||''} onChange={e=>setForm({...form, bio:e.target.value})}
                placeholder="Bio..." />
            </>
          ) : (
            <>
              <h2 style={{margin:'0 0 6px'}}>{u?.display_name || 'ตั้งชื่อเล่น...'}</h2>
              <div style={{color:'#6a6072', marginBottom:4}}>นามปากกา: {u?.pen_name || '-'}</div>
              <div style={{whiteSpace:'pre-wrap'}}>{u?.bio || 'Bio...'}</div>
            </>
          )}
        </div>

        <div style={{display:'grid', gap:8}}>
          {!editing ? (
            <button className="btn" onClick={()=>setEditing(true)}>แก้ไขโปรไฟล์</button>
          ) : (
            <>
              <button className="btn" onClick={save} disabled={busy}>{busy? 'กำลังบันทึก…':'บันทึก'}</button>
              <button className="btn secondary" onClick={()=>{setEditing(false); setForm(u||{})}} disabled={busy}>ยกเลิก</button>
            </>
          )}
        </div>
      </div>

      {/* Switcher */}
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:16}}>
        <div style={{fontWeight:600}}>ประวัติ</div>
        <select className="input" style={{maxWidth:220}}
          value={mode} onChange={e=>setMode(e.target.value)}>
          <option value="history">ประวัติการอ่าน</option>
          <option value="donations">ประวัติการโดเนท</option>
        </select>
      </div>

      {/* Lists */}
      {mode === 'history' ? (
        <div style={{marginTop:16}} className="grid">
          {(history||[]).map(item=> (
            <div key={item.id} className="card">
              <img src={item.cover_url || 'https://placehold.co/300x400?text=Cover'} />
              <div className="p">
                <div style={{fontWeight:700}}>{item.title}</div>
                <div style={{fontSize:12, color:'#5b5164'}}>อัปเดตล่าสุด: {new Date(item.last_read_at).toLocaleString()}</div>
                <div style={{marginTop:8}}>
                  <button className="btn secondary" onClick={()=> nav(item.chapter_id ? `/read/${item.chapter_id}` : `/novels/${item.slug}`)}>
                    Start reading
                  </button>
                </div>
              </div>
            </div>
          ))}
          {(!history || history.length===0) && (
            <div style={{padding:24, color:'#6a6072'}}>ยังไม่มีประวัติการอ่าน</div>
          )}
        </div>
      ) : (
        <div style={{marginTop:16}}>
          {(!donations || donations.length===0) && (
            <div style={{padding:24, color:'#6a6072'}}>ยังไม่มีประวัติการโดเนท</div>
          )}
          {(donations||[]).map(d=> (
            <div key={d.id} className="card" style={{padding:16}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:700}}>โดเนท {Number(d.amount).toLocaleString()} บาท</div>
                  <div style={{fontSize:12, color:'#6a6072'}}>{new Date(d.created_at).toLocaleString()}</div>
                  {d.message && <div style={{marginTop:6}}>{d.message}</div>}
                </div>
                {d.novel_id && (
                  <button className="btn secondary" onClick={()=> nav(`/novels/${d.novel_slug || ''}`)}>
                    ไปหน้านิยาย
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
