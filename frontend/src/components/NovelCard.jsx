import { Link, useNavigate } from 'react-router-dom'

export default function NovelCard({ item, rank = null }) {
  const nav = useNavigate()
  const onRead = () => {
    // ถ้ามี id ตอนแรก ให้ไปอ่านตรงนั้นเลย ไม่มีก็ไปหน้ารายละเอียด
    if (item.first_chapter_id) nav(`/read/${item.first_chapter_id}`)
    else nav(`/novels/${item.slug}`)
  }

  return (
    <div className="card" style={{ position: 'relative' }}>
      {/* แถบลำดับ (ถ้ามี) */}
      {rank != null && (
        <span
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            padding: '2px 8px',
            fontSize: 12,
            fontWeight: 700,
            background: '#ffffff',
            color: '#6b21a8',
            border: '1px solid #e5e7eb',
            borderRadius: 9999,
            boxShadow: '0 1px 2px rgba(0,0,0,.06)',
          }}
          aria-label={`อันดับที่ ${rank}`}
        >
          #{rank}
        </span>
      )}

      <img
        src={item.cover_url || 'https://placehold.co/300x400?text=Cover'}
        alt={item.title}
      />

      <div className="p">
        <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.title}</div>

        {/* description (ตัด 2 บรรทัด) */}
        <div
          style={{
            fontSize: 12,
            color: '#5b5164',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 34,
          }}
          title={item.description || ''}
        >
          {item.description || '—'}
        </div>

        {/* ปุ่ม */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 10,
            justifyContent: 'space-between',
          }}
        >
          <button className="btn" style={{ flex: 1 }} onClick={onRead}>
            Read
          </button>
        </div>
      </div>
    </div>
  )
}
