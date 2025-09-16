import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../lib/api'

export default function ChapterRead(){
  const { id } = useParams()
  const [ch,setCh] = useState(null)
  const [list,setList] = useState([]) // list ตอนทั้งหมดของนิยายนี้
  const nav = useNavigate()

  useEffect(()=>{
    let _novelId = null
    API.get(`/chapters/${id}`).then(r=>{
      setCh(r.data)
      _novelId = r.data.novel_id
      return API.get(`/chapters/by-novel/${_novelId}`)
    }).then(r=>{
      setList(r.data)
    }).catch(err=>{
      alert(err.response?.data?.message || 'ไม่สามารถโหลดตอนนี้ได้')
    })
  },[id])

  // ใช้เฉพาะตอนที่เผยแพร่เพื่อ next/prev (ผู้อ่านทั่วไป)
  const navList = useMemo(()=>{
    return list.filter(c=>c.is_published).sort((a,b)=>a.number-b.number)
  }, [list])

  const pos = useMemo(()=>{
    if (!ch) return -1
    return navList.findIndex(c=> c.id === ch.id)
  }, [navList, ch])

  const prevId = pos > 0 ? navList[pos-1]?.id : null
  const nextId = pos >= 0 && pos < navList.length-1 ? navList[pos+1]?.id : null

  if(!ch) return null
  return (
    <div className="container" style={{maxWidth:900}}>
      <div style={{marginBottom:8, color:'#6a6072'}}>บทที่ {ch.number}</div>
      <h2>{ch.title}</h2>
      <div dangerouslySetInnerHTML={{__html: ch.content_html}} />

      <div style={{display:'flex', justifyContent:'space-between', marginTop:24}}>
        <button className="btn secondary" disabled={!prevId} onClick={()=> prevId && nav(`/read/${prevId}`)}>ตอนก่อนหน้า</button>
        <button className="btn" disabled={!nextId} onClick={()=> nextId && nav(`/read/${nextId}`)}>ตอนถัดไป</button>
      </div>
    </div>
  )
}
