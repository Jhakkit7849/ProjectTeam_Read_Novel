import { useEffect, useState } from 'react'
import API from '../lib/api'
import NovelGrid from '../components/NovelGrid'

export default function MyWorks(){
  const [items,setItems] = useState([])
  useEffect(()=>{
    API.get('/novels/mine').then(r=>setItems(r.data))
  },[])
  return (
    <div className="container">
      <h2>ผลงานของฉัน</h2>
      <NovelGrid items={items} />
    </div>
  )
}