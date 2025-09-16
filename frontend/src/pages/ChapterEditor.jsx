import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import API from '../lib/api'
import TiptapEditor from '../components/TiptapEditor'

export default function ChapterEditor(){
  const [params] = useSearchParams()
  const novelId = Number(params.get('novel'))
  const chapterId = params.get('id')      // 👈 ถ้ามี = โหมดแก้ไข
  const [loading, setLoading] = useState(true)
  const [form,setForm] = useState({ novel_id: novelId, number: 1, title:'', content_html:'', is_published:false })
  const nav = useNavigate()

  useEffect(()=>{
    async function init(){
      try{
        if (chapterId) {
          const r = await API.get(`/chapters/manage/${chapterId}`)
          setForm({
            novel_id: r.data.novel_id,
            number: r.data.number,
            title: r.data.title,
            content_html: r.data.content_html,
            is_published: r.data.is_published
          })
        } else {
          // สร้างใหม่: ดึงลิสต์ตอนเพื่อหาเลขถัดไป
          if (novelId) {
            const r = await API.get(`/chapters/by-novel/${novelId}`)
            const maxNum = r.data.reduce((m,c)=> Math.max(m, c.number), 0)
            setForm(f=>({ ...f, novel_id: novelId, number: maxNum+1 }))
          }
        }
      } finally {
        setLoading(false)
      }
    }
    init()
  },[chapterId, novelId])

  const submit = async (e)=>{
    e.preventDefault()
    if (chapterId) {
      const r = await API.put(`/chapters/${chapterId}`, form)
      nav(`/read/${r.data.id}`)
    } else {
      const r = await API.post('/chapters', form)
      nav(`/read/${r.data.id}`)
    }
  }

  if (loading) return <div className="container">กำลังโหลด...</div>

  return (
    <div className="container" style={{maxWidth:900}}>
      <h2>{chapterId ? 'แก้ไขตอน' : 'เพิ่มตอนใหม่'}</h2>
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
