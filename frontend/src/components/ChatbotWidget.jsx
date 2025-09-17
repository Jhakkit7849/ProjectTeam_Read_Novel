import { useEffect, useRef, useState } from 'react'
import API from '../lib/api'

export default function ChatbotWidget(){
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState([
    { role:'bot', text:'สวัสดีค่ะ มีอะไรให้ช่วยไหม? ตัวอย่าง: “วิธีโดเนท”, “สมัครสมาชิก”, “เติมเงินทำยังไง”' }
  ])
  const endRef = useRef(null)

  const ask = async (text)=>{
    setBusy(true)
    try{
      const r = await API.post('/chatbot/ask', { message: text })
      setMsgs(m=> [...m, { role:'bot', text: r.data.answer, suggestions: r.data.suggestions }])
    }catch(e){
      setMsgs(m=> [...m, { role:'bot', text:'ขอโทษค่ะ ระบบมีปัญหา ลองใหม่อีกครั้ง' }])
    }finally{
      setBusy(false)
    }
  }

  const send = async ()=>{
    const t = input.trim()
    if (!t) return
    setMsgs(m=> [...m, { role:'user', text:t }])
    setInput('')
    await ask(t)
  }

  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, open])

  return (
    <>
      <button
        onClick={()=> setOpen(v=>!v)}
        style={{
          position:'fixed', right:16, bottom:16, zIndex:60,
          borderRadius:'9999px', padding:'10px 14px', border:'1px solid #e5e7eb',
          background:'#6b21a8', color:'#fff', boxShadow:'0 4px 12px rgba(0,0,0,.15)'
        }}
      >
        {open ? 'ปิดแชต' : 'ช่วยเหลือ'}
      </button>

      {open && (
        <div style={{
          position:'fixed', right:16, bottom:72, width:360, maxWidth:'90vw', zIndex:60,
          background:'#fff', border:'1px solid #e5e7eb', borderRadius:16,
          overflow:'hidden', boxShadow:'0 12px 28px rgba(0,0,0,.18)'
        }}>
          <div style={{padding:'10px 12px', background:'#f5e6ff', fontWeight:700}}>ผู้ช่วย</div>
          <div style={{height:340, overflowY:'auto', padding:12}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{margin:'8px 0', display:'grid', justifyContent: m.role==='user'?'end':'start'}}>
                <div style={{
                  maxWidth:'85%', padding:'8px 10px', borderRadius:10,
                  background: m.role==='user' ? '#e9d5ff' : '#f8fafc'
                }}>{m.text}</div>
                {m.suggestions && (
                  <div style={{display:'flex', gap:6, flexWrap:'wrap', marginTop:6}}>
                    {m.suggestions.slice(0,6).map((s,idx)=>(
                      <button key={idx} className="btn secondary" onClick={()=>{ setMsgs(v=>[...v, {role:'user', text:s}]); ask(s) }}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div style={{display:'flex', gap:6, padding:10, borderTop:'1px solid #e5e7eb'}}>
            <input
              className="input"
              placeholder="พิมพ์ข้อความ…"
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=> e.key==='Enter' && !busy && send()}
            />
            <button className="btn" onClick={send} disabled={busy}>ส่ง</button>
          </div>
        </div>
      )}
    </>
  )
}
