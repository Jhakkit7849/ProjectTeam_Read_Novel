import { Link } from 'react-router-dom'
export default function ChapterList({ chapters=[], novelSlug, isOwner=false }){
  return (
    <table className="table">
      <thead><tr><th>#</th><th>ชื่อตอน</th><th>เผยแพร่</th><th></th></tr></thead>
      <tbody>
        {chapters.map(c=> (
          <tr key={c.id}>
            <td>{c.number}</td>
            <td>{c.title}</td>
            <td>{c.is_published ? 'เผยแพร่' : 'ฉบับร่าง'}</td>
            <td style={{display:'flex', gap:8}}>
              <Link className="btn secondary" to={`/read/${c.id}`}>อ่าน</Link>
              {isOwner && <Link className="btn secondary" to={`/write/chapter?id=${c.id}`}>แก้ไข</Link>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
