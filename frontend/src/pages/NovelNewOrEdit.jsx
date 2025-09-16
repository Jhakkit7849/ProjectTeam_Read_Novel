import { useState, useEffect } from "react";
import API, { setToken } from "../lib/api";
import TagInput from "../components/TagInput";
import { useNavigate, useSearchParams } from "react-router-dom";

const ALLOWED_TYPES = ["original", "fanfic"];
const ALLOWED_STATUS = ["ongoing", "completed"];   // 👈 ใช้แทน Rating

export default function NovelNewOrEdit() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const nav = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    cover_url: "",
    pen_name: "",
    category_id: 1,
    type: "original",
    status: "ongoing",      // 👈 ค่าเริ่มต้น: ยังไม่จบ
    tags: [],
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const c = await API.get("/categories");
        if (!ignore) setCategories(c.data || []);
        if (id) {
          setLoading(true);
          const r = await API.get(`/novels/manage/${id}`);
          if (!ignore) {
            setForm({
              title: r.data.title || "",
              description: r.data.description || "",
              cover_url: r.data.cover_url || "",
              pen_name: r.data.pen_name || "",
              category_id: r.data.category_id || (c.data?.[0]?.id ?? 1),
              type: r.data.type || "original",
              status: r.data.status || "ongoing", // 👈 รับจาก backend
              tags: Array.isArray(r.data.tags) ? r.data.tags : [],
            });
          }
        }
      } catch (err) {
        if (err.response?.status === 401) return nav("/signin");
        setErrorMsg(err.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    init();
    return () => { ignore = true; };
  }, [id, nav]);

  const validate = () => {
    if (!form.title.trim()) return "กรุณากรอกชื่อเรื่อง";
    if (!ALLOWED_TYPES.includes(form.type)) return "ประเภทไม่ถูกต้อง";
    if (!ALLOWED_STATUS.includes(form.status)) return "สถานะนิยายไม่ถูกต้อง";
    if (!categories.some((c) => c.id === Number(form.category_id))) return "หมวดหมู่ไม่ถูกต้อง";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setErrorMsg(v);
    setSubmitting(true); setErrorMsg("");

    try {
      if (id) {
        const r = await API.put(`/novels/${id}`, {
          title: form.title,
          description: form.description,
          cover_url: form.cover_url,
          pen_name: form.pen_name,
          category_id: Number(form.category_id),
          status: form.status,        // 👈 ส่ง status
          type: form.type,
          is_featured: false,
          is_published: false,
          tags: form.tags || [],
        });
        return nav(`/novels/${r.data.slug}`);
      } else {
        const r = await API.post("/novels", {
          title: form.title,
          description: form.description,
          cover_url: form.cover_url,
          pen_name: form.pen_name,
          category_id: Number(form.category_id),
          type: form.type,
          status: form.status,        // 👈 ส่ง status
          tags: form.tags || [],
        });
        if (r.data.token) setToken(r.data.token);
        return nav(`/novels/${r.data.novel.slug}`);
      }
    } catch (err) {
      if (err.response?.status === 401) return nav("/signin");
      setErrorMsg(err.response?.data?.message || "บันทึกไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container" style={{ maxWidth: 900 }}>กำลังโหลด...</div>;

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h2>{id ? "แก้ไขเรื่องนิยาย" : "สร้างเรื่องนิยาย"}</h2>
      {errorMsg && <div style={{ background:"#ffe3e3", border:"1px solid #ffb3b3", padding:12, borderRadius:10, marginBottom:12 }}>{errorMsg}</div>}

      <form className="form-grid" onSubmit={submit}>
        {/* ชื่อเรื่อง / นามปากกา */}
        <div className="form-2">
          <div>
            <label>ชื่อเรื่อง</label>
            <input className="input" value={form.title} onChange={e=>setForm({ ...form, title:e.target.value })} required />
          </div>
          <div>
            <label>นามปากกา</label>
            <input className="input" value={form.pen_name} onChange={e=>setForm({ ...form, pen_name:e.target.value })} />
          </div>
        </div>

        {/* คำโปรย */}
        <label>คำโปรย / เรื่องย่อ</label>
        <textarea className="input" rows="4" value={form.description} onChange={e=>setForm({ ...form, description:e.target.value })} />

        {/* ปก + ประเภท */}
        <div className="form-2">
          <div>
            <label>ลิงก์รูปปก</label>
            <input className="input" value={form.cover_url} onChange={e=>setForm({ ...form, cover_url:e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label>ประเภท</label>
            <select className="input" value={form.type} onChange={e=>setForm({ ...form, type:e.target.value })}>
              <option value="original">นิยายออริจินอล</option>
              <option value="fanfic">แฟนฟิคชั่น</option>
            </select>
          </div>
        </div>

        {/* หมวด + สถานะนิยาย */}
        <div className="form-2">
          <div>
            <label>หมวดหมู่</label>
            <select className="input" value={form.category_id} onChange={e=>setForm({ ...form, category_id:Number(e.target.value) })}>
              {(categories||[]).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label>สถานะของนิยาย</label>
            <select className="input" value={form.status} onChange={e=>setForm({ ...form, status:e.target.value })}>
              <option value="ongoing">ยังไม่จบ</option>
              <option value="completed">จบแล้ว</option>
            </select>
          </div>
        </div>

        {/* แท็ก */}
        <label>แท็ก</label>
        <TagInput value={form.tags} onChange={(tags)=> setForm({ ...form, tags })} />

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="btn" disabled={submitting}>{submitting ? "กำลังบันทึก…" : id ? "บันทึกการแก้ไข" : "บันทึกและไปหน้ารายละเอียด"}</button>
          <button type="button" className="btn secondary" onClick={()=> (id ? nav(-1) : nav("/"))} disabled={submitting}>ยกเลิก</button>
        </div>
      </form>
    </div>
  );
}
