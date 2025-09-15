import { useState } from 'react'
export default function TagInput({ value=[], onChange }){
const [txt,setTxt] = useState('')
const add = ()=>{ const v = txt.trim(); if(!v) return; onChange([...(value||[]), v]); setTxt('') }
const remove = (i)=> onChange(value.filter((_,idx)=> idx!==i))
return (
<div>
<div className="tags">{value.map((t,i)=> <span className="tag" key={i}>{t} <button onClick={()=>remove(i)}>×</button></span>)}</div>
<div style={{display:'flex', gap:8, marginTop:8}}>
<input className="input" value={txt} onChange={e=>setTxt(e.target.value)} placeholder="เพิ่มแท็กแล้วกดปุ่ม"/>
<button className="btn" type="button" onClick={add}>เพิ่ม</button>
</div>
</div>
)
}