import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth.jsx'


export default function SignUp(){
const { register } = useAuth()
const nav = useNavigate()
const [form,setForm] = useState({ display_name:'', email:'', password:'' })
const submit = async (e)=>{ e.preventDefault(); await register(form); nav('/') }
return (
<div className="container" style={{maxWidth:480}}>
<h2>Sign Up</h2>
<form className="form-grid" onSubmit={submit}>
<input className="input" placeholder="ชื่อที่แสดง" value={form.display_name} onChange={e=>setForm({...form, display_name:e.target.value})} />
<input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
<input className="input" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
<button className="btn">Sign Up</button>
<div>มีบัญชีแล้ว? <Link to="/signin">Sign In</Link></div>
</form>
</div>
)
}