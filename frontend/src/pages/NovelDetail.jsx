import { useEffect, useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import API from '../lib/api'
import ChapterList from '../components/ChapterList'
import useAuth from '../hooks/useAuth'

export default function NovelDetail(){
  const { slug } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()

  const [novel,setNovel] = useState(null)
  const [chapters,setChapters] = useState([])
  const [inLibrary, setInLibrary] = useState(false)
  const [libBusy, setLibBusy] = useState(false)

  // ลบเรื่อง
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // โดเนท
  const [showDonate, setShowDonate] = useState(false)
  const [donAmt, setDonAmt] = useState(50)
  const [donMsg, setDonMsg] = useState('')
  const [donBusy, setDonBusy] = useState(false)

  useEffect(()=> {
    let mounted = true
    async function load() {
      try {
        const r1 = await API.get(`/novels/${slug}`)
        if (!mounted) return
        setNovel(r1.data)

        const r2 = await API.get(`/chapters/by-novel/${r1.data.id}`)
        if (!mounted) return
        setChapters(r2.data)

        if (user) {
          try {
            const r3 = await API.get('/library')
            if (!mounted) return
            setInLibrary(!!r3.data.find(n => n.id === r1.data.id))
          } catch {}
        } else {
          setInLibrary(false)
        }
      } catch (err) {
        alert(err.response?.data?.message || 'ไม่พบข้อมูลนิยาย')
      }
    }
    load()
    return () => { mounted = false }
  }, [slug, user])

  const isOwner = useMemo(() => !!(user && novel && user.id === novel.author_id), [user, novel])

  const toggleLibrary = async () => {
    if (!novel) return
    setLibBusy(true)
    try {
      if (inLibrary) {
        await API.delete(`/library/${novel.id}`)
        setInLibrary(false)
      } else {
        await API.post(`/library/${novel.id}`)
        setInLibrary(true)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'ทำรายการไม่สำเร็จ')
    } finally {
      setLibBusy(false)
    }
  }

  if(!novel) return null

  // ป้ายสถานะ
  const statusLabel = novel.status === 'completed' ? 'จบแล้ว' : 'ยังไม่จบ'
  const statusBg = novel.status === 'completed' ? '#dcfce7' : '#fff7ed'
  const statusColor = novel.status === 'completed' ? '#166534' : '#9a3412'
  const statusBorder = novel.status === 'completed' ? '#86efac' : '#fed7aa'

  return (
    <div className="container">
      <div className="hero">
        <img src={novel.cover_url || 'https://placehold.co/300x400?text=Cover'} />
        <div>
          {/* ชื่อเรื่อง + ป้ายสถานะ */}
          <div style={{display:'flex', alignItems:'center', gap:10, flexWrap:'wrap'}}>
            <h1 style={{margin:0}}>{novel.title}</h1>
            <span
              title={`สถานะ: ${statusLabel}`}
              style={{
                padding:'4px 10px', fontSize:12, fontWeight:700, borderRadius:9999,
                background: statusBg, color: statusColor, border: `1px solid ${statusBorder}`
              }}
            >
              {statusLabel}
            </span>
          </div>

          <p>{novel.description}</p>
          <div className="tags">
            {(novel.tags||[]).map(t=> <span className="tag" key={t.slug}>#{t.name}</span>)}
          </div>

          <div style={{display:'flex', gap:8, marginTop:12, flexWrap:'wrap'}}>
            {chapters[0] && (
              <button className="btn" onClick={()=> nav(`/read/${chapters[0].id}`)}>
                เริ่มอ่าน
              </button>
            )}

            {/* ปุ่มโดเนท */}
            <button className="btn" onClick={()=> setShowDonate(true)}>โดเนท</button>

            {/* คลังของฉัน */}
            <button
              className="btn secondary"
              disabled={libBusy}
              onClick={toggleLibrary}
              title={inLibrary ? 'เอาเรื่องนี้ออกจากคลังของฉัน' : 'เพิ่มเรื่องนี้ลงคลังของฉัน'}
            >
              {inLibrary ? 'เอาออกจากคลัง' : 'เพิ่มลงคลัง'}
            </button>

            {/* ปุ่มเจ้าของ */}
            {isOwner && (
              <>
                <Link className="btn secondary" to={`/write/chapter?novel=${novel.id}`}>เพิ่มตอนใหม่</Link>
                <Link className="btn secondary" to={`/write/new?id=${novel.id}`}>แก้ไขเรื่อง</Link>
                <button className="btn danger" onClick={()=> setShowDelete(true)}>ลบนิยาย</button>
              </>
            )}
          </div>
        </div>
      </div>

      <h3 style={{marginTop:24}}>ตอนทั้งหมด</h3>
      <ChapterList chapters={chapters} novelSlug={slug} isOwner={isOwner} />

      {/* Modal ยืนยันการลบ */}
      {showDelete && (
        <div style={overlayStyle} role="dialog" aria-modal="true">
          <div style={modalStyle}>
            <div style={{fontWeight:700, color:'#b91c1c', marginBottom:8, fontSize:18}}>ยืนยันลบเรื่องนี้</div>
            <div style={{color:'#6b7280', marginBottom:16}}>คุณจะไม่สามารถกู้คืนได้</div>
            <div style={{display:'flex', justifyContent:'space-between', gap:8}}>
              <button className="btn secondary" onClick={()=> setShowDelete(false)} disabled={deleting}>ไม่ลบ</button>
              <button
                className="btn danger"
                onClick={async ()=>{
                  setDeleting(true)
                  try{
                    await API.delete(`/novels/${novel.id}`)
                    setShowDelete(false)
                    nav('/my-works')
                  }catch(err){
                    alert(err.response?.data?.message || 'ลบไม่สำเร็จ')
                  }finally{
                    setDeleting(false)
                  }
                }}
                disabled={deleting}
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal โดเนท */}
      {showDonate && (
        <div style={overlayStyle} role="dialog" aria-modal="true">
          <div style={modalStyle}>
            <h3 style={{marginTop:0}}>โดเนทให้นักเขียน</h3>
            <label>จำนวนเงิน (บาท)</label>
            <input
              className="input"
              type="number"
              min={10}
              value={donAmt}
              onChange={e=> setDonAmt(Number(e.target.value))}
            />
            <label style={{marginTop:8}}>ข้อความถึงนักเขียน (ไม่บังคับ)</label>
            <textarea
              className="input"
              rows={3}
              value={donMsg}
              onChange={e=> setDonMsg(e.target.value)}
            />
            <div style={{display:'flex', justifyContent:'space-between', gap:8, marginTop:12}}>
              <button className="btn secondary" onClick={()=> setShowDonate(false)} disabled={donBusy}>ยกเลิก</button>
              <button
                className="btn"
                disabled={donBusy || donAmt < 10}
                onClick={async ()=>{
                  setDonBusy(true)
                  try{
                    const r = await API.post('/donations/checkout', {
                      author_id: novel.author_id,
                      novel_id: novel.id,
                      amount: donAmt,
                      message: donMsg
                    })
                    window.location.href = r.data.url  // ไปหน้า Stripe
                  }catch(err){
                    alert(err.response?.data?.message || 'สร้างชำระเงินไม่สำเร็จ')
                  }finally{
                    setDonBusy(false)
                  }
                }}
              >
                ไปชำระเงิน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const overlayStyle = {
  position:'fixed', inset:0, background:'rgba(0,0,0,0.35)',
  display:'flex', alignItems:'center', justifyContent:'center', zIndex:50
}
const modalStyle = {
  width:360, background:'#fff', borderRadius:12, padding:16,
  boxShadow:'0 10px 25px rgba(0,0,0,.2)', display:'grid', gap:8
}
