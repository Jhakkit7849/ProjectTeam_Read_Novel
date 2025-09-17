import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth.jsx'

export default function SignIn(){
  const nav = useNavigate()
  const { login } = useAuth()
  const [form,setForm] = useState({ email:'', password:'' })
  
  const submit = async (e)=>{
    e.preventDefault()
    await login(form.email, form.password)
    nav('/')
  }

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">Sign In</h2>
        <form className="form-grid" onSubmit={submit}>
          <input 
            className="input" 
            placeholder="Email" 
            type="email"
            value={form.email} 
            onChange={e=>setForm({...form, email:e.target.value})} 
          />
          <input 
            className="input" 
            placeholder="Password" 
            type="password" 
            value={form.password} 
            onChange={e=>setForm({...form, password:e.target.value})} 
          />
          <button className="btn">Sign In</button>
          <div className="signup-text">
            ไม่มีบัญชี? <Link to="/signup">สมัคร</Link>
          </div>
        </form>
      </div>

      {/* ✅ CSS อยู่ในไฟล์เดียว */}
      <style>{`
        :root {
          --color-bg: #ffdfd6;
          --color-primary: #e3a5c7;
          --color-secondary: #b692c2;
          --color-text: #694f8e;
        }

        .signin-container {
          background: var(--color-bg);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }

        .signin-card {
          background: #fff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          width: 100%;
          max-width: 400px;
        }

        .signin-title {
          text-align: center;
          margin-bottom: 1.5rem;
          color: var(--color-text);
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
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
          padding: 0.8rem 1rem;
          background: var(--color-primary);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn:hover {
          background: var(--color-secondary);
        }

        .signup-text {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
        }

        .signup-text a {
          color: var(--color-text);
          font-weight: bold;
          text-decoration: none;
        }

        .signup-text a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
