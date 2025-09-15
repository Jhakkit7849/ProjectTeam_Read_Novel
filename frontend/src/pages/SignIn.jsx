import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'


export default function SignIn(){
const nav = useNavigate()
const { login } = useAuth()
const [form,setForm] = useState({ email:'', password:'' })
const submit = async (e)=>{ e.preventDefault(); await login(form.email, form.password); nav('/') }
return (
<div className="container" style={{maxWidth:480}}>
<h2>Sign In</h2>
<form className="form-grid" onSubmit={submit}>
<input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
<input className="input" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
<button className="btn">Sign In</button>
<div>ไม่มีบัญชี? <Link to="/signup">สมัคร</Link></div>
</form>
</div>
)
}