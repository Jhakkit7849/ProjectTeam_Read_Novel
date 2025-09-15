import NovelCard from './NovelCard'
export default function NovelGrid({ items=[] }){
return <div className="grid">{items.map(n=> <NovelCard key={n.id} item={n} />)}</div>
}