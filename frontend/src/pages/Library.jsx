import { useEffect, useState } from 'react'
import API from '../lib/api'
import NovelGrid from '../components/NovelGrid'


export default function Library(){
const [items,setItems] = useState([])
useEffect(()=>{ API.get('/library').then(r=>setItems(r.data)) },[])
return (
<div className="container">
<h2>คลังของฉัน</h2>
<NovelGrid items={items} />
</div>
)
}