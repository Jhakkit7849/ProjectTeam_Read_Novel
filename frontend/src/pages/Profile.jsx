import { useEffect, useState } from 'react'
import API from '../lib/api'


export default function Profile(){
const [u,setU] = useState(null)
const [form,setForm] = useState({ display_name:'', pen_name:'', avatar_url:'', bio:'' })
useEffect(()=>{ API.get('/users/me').then(r=>{ setU(r.data); setForm(r.data || {}) }) },[])
const save = async (e)=>{ e.preventDefault(); const r = await API.put('/users/me', form); setU(r.data) }
if(!u) return null
return (
<div className="container" style={{maxWidth:720}}>
<h2>โปรไฟล์</h2>
<form className="form-grid" onSubmit={save}>
<input className="input" value={form.display_name||''} onChange={e=>setForm({...form, display_name:e.target.value})} placeholder="ชื่อที่แสดง" />
<input className="input" value={form.pen_name||''} onChange={e=>setForm({...form, pen_name:e.target.value})} placeholder="นามปากกา" />
<input className="input" value={form.avatar_url||''} onChange={e=>setForm({...form, avatar_url:e.target.value})} placeholder="ลิงก์รูปโปรไฟล์" />
<textarea className="input" rows="4" value={form.bio||''} onChange={e=>setForm({...form, bio:e.target.value})} placeholder="bio" />
<button className="btn">บันทึก</button>
</form>
</div>
)
}