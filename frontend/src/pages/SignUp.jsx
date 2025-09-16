// frontend/src/pages/SignUp.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API, { setToken } from '../lib/api'

export default function SignUp(){
  const nav = useNavigate()
  const [form, setForm] = useState({ display_name:'', email:'', password:'', confirm:'' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e)=>{
    e.preventDefault()
    setErr('')
    if (!form.display_name.trim()) return setErr('กรุณากรอกชื่อที่แสดง')
    if (!/\S+@\S+\.\S+/.test(form.email)) return setErr('อีเมลไม่ถูกต้อง')
    if ((form.password||'').length < 8) return setErr('รหัสผ่านอย่างน้อย 8 ตัวอักษร')
    if (form.password !== form.confirm) return setErr('รหัสผ่านยืนยันไม่ตรงกัน')

    setBusy(true)
    try{
      const r = await API.post('/auth/register', {
        display_name: form.display_name.trim(),
        email: form.email.trim(),
        password: form.password
      })
      if (r.data?.token) setToken(r.data.token)
      nav('/')
    }catch(e){
      const msg = e.response?.data?.message || 'สมัครไม่สำเร็จ'
      setErr(msg)
    }finally{
      setBusy(false)
    }
  }

  return (
    <div className="container" style={{maxWidth:460}}>
      <h2>Sign Up</h2>
      {err && <div className="alert error">{err}</div>}
      <form onSubmit={submit} className="form-grid">
        <label>ชื่อที่แสดง</label>
        <input className="input" value={form.display_name}
               onChange={e=>setForm({...form, display_name:e.target.value})}/>
        <label>Email</label>
        <input className="input" type="email" value={form.email}
               onChange={e=>setForm({...form, email:e.target.value})}/>
        <label>Password</label>
        <input className="input" type="password" value={form.password}
               onChange={e=>setForm({...form, password:e.target.value})}/>
        <label>Confirm Password</label>
        <input className="input" type="password" value={form.confirm}
               onChange={e=>setForm({...form, confirm:e.target.value})}/>
        <button className="btn" disabled={busy}>{busy? 'กำลังสมัคร…':'Sign Up'}</button>
      </form>
      <div style={{marginTop:8, fontSize:14}}>
        มีบัญชีแล้ว? <Link to="/signin">Sign in</Link>
      </div>
    </div>
  )
}
