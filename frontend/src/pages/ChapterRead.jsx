import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../lib/api'


export default function ChapterRead(){
const { id } = useParams()
const [ch,setCh] = useState(null)
useEffect(()=>{ API.get(`/chapters/${id}`).then(r=>setCh(r.data)) },[id])
if(!ch) return null
return (
<div className="container" style={{maxWidth:900}}>
<div style={{marginBottom:8, color:'#6a6072'}}>บทที่ {ch.number}</div>
<h2>{ch.title}</h2>
<div dangerouslySetInnerHTML={{__html: ch.content_html}} />
</div>
)
}