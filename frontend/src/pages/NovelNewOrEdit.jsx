import { useState, useEffect } from "react";
import API, { setToken } from '../lib/api'
import TagInput from "../components/TagInput";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function NovelNewOrEdit() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    cover_url: "",
    pen_name: "",
    category_id: 1,
    type: "original",
    rating: "ALL",
    tags: [],
  });
  const [categories, setCategories] = useState([]);
  const [params] = useSearchParams();
  const id = params.get("id");
  const nav = useNavigate();
  useEffect(() => {
    API.get("/novels?q=").then(() => {});
    API.get("/search?q=");
  }, []);
  const create = async (e) => {
  e.preventDefault();
  try {
    const r = await API.post("/novels", form);
    if (r.data.token) setToken(r.data.token);         
    nav(`/novels/${r.data.novel.slug}`);               
  } catch (err) {
    if (err.response?.status === 401) return nav('/signin'); 
    alert(err.response?.data?.message || 'สร้างนิยายไม่สำเร็จ');
  }
};
  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h2>สร้างเรื่องนิยาย</h2>
      <form className="form-grid" onSubmit={create}>
        <div className="form-2">
          <div>
            <label>ชื่อเรื่อง</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label>นามปากกา</label>
            <input
              className="input"
              value={form.pen_name}
              onChange={(e) => setForm({ ...form, pen_name: e.target.value })}
            />
          </div>
        </div>
        <label>คำโปรย / เรื่องย่อ</label>
        <textarea
          className="input"
          rows="4"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="form-2">
          <div>
            <label>ลิงก์รูปปก</label>
            <input
              className="input"
              value={form.cover_url}
              onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
            />
          </div>
          <div>
            <label>ประเภท</label>
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="original">นิยายออริจินอล</option>
              <option value="fanfic">แฟนฟิคชั่น</option>
            </select>
          </div>
        </div>
        <div className="form-2">
          <div>
            <label>หมวดหมู่</label>
            <select
              className="input"
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: Number(e.target.value) })
              }
            >
              <option value={1}>โรแมนติก</option>
              <option value={2}>แฟนตาซี</option>
              <option value={3}>ดราม่า</option>
            </select>
          </div>
          <div>
            <label>ระดับของเนื้อหา (Rating)</label>
            <select
              className="input"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            >
              <option value="ALL">ทุกวัย</option>
              <option value="PRESCHOOL">ปฐมวัย 3-5 ปี</option>
              <option value="KID_6_12">เด็ก 6-12 ปี</option>
              <option value="TEEN_13">น.13 อายุ 13 ปีขึ้นไป</option>
              <option value="TEEN_18">น.18 อายุ 18 ปีขึ้นไป</option>
              <option value="ADULT_20">ฉ.20 เฉพาะผู้ใหญ่ 20 ปีขึ้นไป</option>
            </select>
          </div>
        </div>
        <label>แท็ก</label>
        <TagInput
          value={form.tags}
          onChange={(tags) => setForm({ ...form, tags })}
        />
        <button className="btn">บันทึกและไปหน้ารายละเอียด</button>
      </form>
    </div>
  );
}
