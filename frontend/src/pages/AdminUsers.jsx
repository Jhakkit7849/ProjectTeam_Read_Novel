import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../lib/api'
import useAuth from '../hooks/useAuth'

export default function AdminUsers(){
  const { user, loading } = useAuth()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [items, setItems] = useState([])
  const [busyId, setBusyId] = useState(null)

  useEffect(()=>{
    if (!loading && (!user || user.role !== 'admin')) nav('/')
  }, [user, loading, nav])

  const load = async ()=>{
    const r = await API.get('/admin/users', { params: { q, role, status } })
    setItems(r.data)
  }
  useEffect(()=>{ load() }, []) // load ครั้งแรก

  const suspend = async (id)=>{
    const until = prompt('ระบุวันสิ้นสุดระงับ (ISO เช่น 2025-12-31T23:59:59Z):')
    if (!until) return
    setBusyId(id)
    await API.patch(`/admin/users/${id}/suspend`, { until })
    await load()
    setBusyId(null)
  }
  const unsuspend = async (id)=>{
    setBusyId(id)
    await API.patch(`/admin/users/${id}/unsuspend`)
    await load()
    setBusyId(null)
  }
  const ban = async (id)=>{
    const reason = prompt('เหตุผลการแบน (ไม่บังคับ):') || null
    if (!confirm('ยืนยันการแบนถาวรผู้ใช้นี้?')) return
    setBusyId(id)
    await API.patch(`/admin/users/${id}/ban`, { reason })
    await load()
    setBusyId(null)
  }
  const unban = async (id)=>{
    setBusyId(id)
    await API.patch(`/admin/users/${id}/unban`)
    await load()
    setBusyId(null)
  }

  return (
    <div className="container" style={{maxWidth:1100}}>
      <h2>ผู้ดูแลระบบ • ผู้ใช้ทั้งหมด</h2>

      <div className="form-2" style={{marginBottom:12}}>
        <input className="input" placeholder="ค้นหาอีเมล/ชื่อเล่น/นามปากกา"
               value={q} onChange={e=>setQ(e.target.value)} />
        <div style={{display:'flex', gap:8}}>
          <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="">ทุกบทบาท</option>
            <option value="reader">reader</option>
            <option value="writer">writer</option>
            <option value="admin">admin</option>
          </select>
          <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">ทุกสถานะ</option>
            <option value="active">active</option>
            <option value="suspended">suspended</option>
            <option value="banned">banned</option>
          </select>
          <button className="btn" onClick={load}>ค้นหา</button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr><th>ID</th><th>อีเมล</th><th>ชื่อเล่น</th><th>นามปากกา</th><th>บทบาท</th><th>สถานะ</th><th>การจัดการ</th></tr>
        </thead>
        <tbody>
          {items.map(u=>(
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.display_name}</td>
              <td>{u.pen_name || '-'}</td>
              <td>{u.role}</td>
              <td>
                {u.status}
                {u.status === 'suspended' && u.suspended_until && (
                  <div style={{fontSize:12, color:'#666'}}>จนถึง {new Date(u.suspended_until).toLocaleString()}</div>
                )}
              </td>
              <td style={{display:'flex', gap:6}}>
                {u.status !== 'suspended' && u.status !== 'banned' && (
                  <button className="btn secondary" disabled={busyId===u.id} onClick={()=>suspend(u.id)}>ระงับ</button>
                )}
                {u.status === 'suspended' && (
                  <button className="btn secondary" disabled={busyId===u.id} onClick={()=>unsuspend(u.id)}>ยกเลิกระงับ</button>
                )}
                {u.status !== 'banned' ? (
                  <button className="btn danger" disabled={busyId===u.id} onClick={()=>ban(u.id)}>แบน</button>
                ) : (
                  <button className="btn" disabled={busyId===u.id} onClick={()=>unban(u.id)}>ยกเลิกแบน</button>
                )}
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan="7" style={{textAlign:'center', color:'#777'}}>ไม่พบผู้ใช้</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
