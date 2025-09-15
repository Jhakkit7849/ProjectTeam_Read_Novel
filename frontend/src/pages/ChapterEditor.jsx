import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import API from '../lib/api'
import TiptapEditor from '../components/TiptapEditor'


export default function ChapterEditor(){
const [params] = useSearchParams()
const novelId = Number(params.get('novel'))
const [form,setForm] = useState({ novel_id: novelId, number: 1, title:'', content_html:'', is_published:false })
const nav = useNavigate()
const submit = async (e)=>{ e.preventDefault(); const r = await API.post('/chapters', form); nav(`/read/${r.data.id}`) }
return (
<div className="container" style={{maxWidth:900}}>
<h2>เพิ่มตอนใหม่</h2>
<form className="form-grid" onSubmit={submit}>
<div className="form-2">
<div>
<label>บทที่ (number)</label>
<input className="input" type="number" value={form.number} onChange={e=>setForm({...form, number:Number(e.target.value)})} />
</div>
<div>
<label>ชื่อตอน</label>
<input className="input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
</div>
</div>
<label>เนื้อหา</label>
<TiptapEditor value={form.content_html} onChange={v=>setForm({...form, content_html:v})} />
<label style={{display:'flex', alignItems:'center', gap:8}}>
<input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form, is_published:e.target.checked})} /> เผยแพร่ตอนนี้
</label>
<button className="btn">บันทึก</button>
</form>
</div>
)
}