import { Link } from 'react-router-dom'
export default function NovelCard({ item }){
return (
<Link className="card" to={`/novels/${item.slug}`}>
<img src={item.cover_url || 'https://placehold.co/300x400?text=Cover'} />
<div className="p">
<div style={{fontWeight:700}}>{item.title}</div>
<div style={{fontSize:12, color:'#5b5164'}}>{item.pen_name}</div>
</div>
</Link>
)
}