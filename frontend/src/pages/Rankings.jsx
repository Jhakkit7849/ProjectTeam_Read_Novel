import { useEffect, useState } from 'react'
import API from '../lib/api'
import NovelGrid from '../components/NovelGrid'

export default function Rankings(){
  const [items, setItems] = useState([])
  useEffect(()=>{
    API.get('/novels/featured').then(r=> setItems(r.data || []))
  },[])
  return (
    <div className="container">
      <h2>อันดับนิยายน่าอ่าน</h2>
      <NovelGrid items={items} showRank />
    </div>
  )
}
