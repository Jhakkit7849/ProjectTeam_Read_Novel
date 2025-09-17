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
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>
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
          
          <button className="btn" disabled={busy}>
            {busy? 'กำลังสมัคร…':'Sign Up'}
          </button>
        </form>

        <div className="signin-text">
          มีบัญชีแล้ว? <Link to="/signin">Sign in</Link>
        </div>
      </div>

      {/* ✅ CSS ในไฟล์เดียว */}
      <style>{`
        :root {
          --color-bg: #ffdfd6;
          --color-primary: #e3a5c7;
          --color-secondary: #b692c2;
          --color-text: #694f8e;
        }

        .signup-container {
          background: var(--color-bg);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }

        .signup-card {
          background: #fff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          width: 100%;
          max-width: 460px;
        }

        .signup-title {
          text-align: center;
          margin-bottom: 1.5rem;
          color: var(--color-text);
        }

        .alert.error {
          background: #ffe5e5;
          color: #c00;
          padding: 0.8rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          text-align: center;
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .form-grid label {
          font-size: 0.9rem;
          color: var(--color-text);
          font-weight: bold;
        }

        .input {
          padding: 0.8rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--color-secondary);
          outline: none;
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 5px var(--color-primary);
        }

        .btn {
          margin-top: 1rem;
          padding: 0.8rem 1rem;
          background: var(--color-primary);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn:hover:not(:disabled) {
          background: var(--color-secondary);
        }

        .signin-text {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
        }

        .signin-text a {
          color: var(--color-text);
          font-weight: bold;
          text-decoration: none;
        }

        .signin-text a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
