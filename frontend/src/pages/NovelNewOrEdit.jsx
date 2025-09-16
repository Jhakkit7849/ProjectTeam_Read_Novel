import { useState, useEffect } from "react";
import API, { setToken } from "../lib/api";
import TagInput from "../components/TagInput";
import { useNavigate, useSearchParams } from "react-router-dom";

const ALLOWED_TYPES = ["original", "fanfic"];
const ALLOWED_RATINGS = ["ALL", "PRESCHOOL", "KID_6_12", "TEEN_13", "TEEN_18", "ADULT_20"];
const CATEGORIES = [
  { id: 1, name: "โรแมนติก" },
  { id: 2, name: "แฟนตาซี" },
  { id: 3, name: "ดราม่า" },
  { id: 4, name: "ลึกลับ" },
  { id: 5, name: "สยองขวัญ" },
  { id: 6, name: "คอมมาดี้" },
];

export default function NovelNewOrEdit() {
  const [params] = useSearchParams();
  const id = params.get("id"); // ถ้ามี = โหมดแก้ไข
  const nav = useNavigate();

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
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // โหลดข้อมูลนิยายเพื่อแก้ไข
  useEffect(() => {
    let ignore = false;
    async function init() {
      if (!id) return; // โหมดสร้างใหม่ ไม่ต้องโหลด
      setLoading(true);
      setErrorMsg("");
      try {
        const r = await API.get(`/novels/manage/${id}`);
        if (ignore) return;
        setForm({
          title: r.data.title || "",
          description: r.data.description || "",
          cover_url: r.data.cover_url || "",
          pen_name: r.data.pen_name || "",
          category_id: r.data.category_id || 1,
          type: r.data.type || "original",
          rating: r.data.rating || "ALL",
          tags: Array.isArray(r.data.tags) ? r.data.tags : [],
        });
      } catch (err) {
        if (err.response?.status === 401) return nav("/signin");
        setErrorMsg(err.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    init();
    return () => (ignore = true);
  }, [id, nav]);

  const validate = () => {
    if (!form.title.trim()) return "กรุณากรอกชื่อเรื่อง";
    if (!ALLOWED_TYPES.includes(form.type)) return "ประเภทไม่ถูกต้อง";
    if (!ALLOWED_RATINGS.includes(form.rating)) return "เรตติ้งไม่ถูกต้อง";
    if (!CATEGORIES.some((c) => c.id === Number(form.category_id))) return "หมวดหมู่ไม่ถูกต้อง";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      if (id) {
        // โหมดแก้ไข
        const r = await API.put(`/novels/${id}`, {
          title: form.title,
          description: form.description,
          cover_url: form.cover_url,
          pen_name: form.pen_name,
          category_id: Number(form.category_id),
          status: "draft", // ปล่อยค่าเดิม/แก้ได้ภายหลังถ้าต้องการ
          rating: form.rating,
          type: form.type,
          is_featured: false,
          is_published: false,
          tags: form.tags || [],
        });
        // update คืนค่าทั้ง row มี slug อยู่แล้ว
        return nav(`/novels/${r.data.slug}`);
      } else {
        // โหมดสร้างใหม่
        const r = await API.post("/novels", {
          title: form.title,
          description: form.description,
          cover_url: form.cover_url,
          pen_name: form.pen_name,
          category_id: Number(form.category_id),
          type: form.type,
          rating: form.rating,
          tags: form.tags || [],
        });
        if (r.data.token) setToken(r.data.token); // ถ้า reader -> writer
        return nav(`/novels/${r.data.novel.slug}`);
      }
    } catch (err) {
      if (err.response?.status === 401) return nav("/signin");
      setErrorMsg(err.response?.data?.message || "บันทึกไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: 900 }}>
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h2>{id ? "แก้ไขเรื่องนิยาย" : "สร้างเรื่องนิยาย"}</h2>

      {errorMsg && (
        <div style={{ background: "#ffe3e3", border: "1px solid #ffb3b3", padding: 12, borderRadius: 10, marginBottom: 12 }}>
          {errorMsg}
        </div>
      )}

      <form className="form-grid" onSubmit={submit}>
        <div className="form-2">
          <div>
            <label>ชื่อเรื่อง</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
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
              placeholder="https://..."
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
              onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
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
        <TagInput value={form.tags} onChange={(tags) => setForm({ ...form, tags })} />

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="btn" disabled={submitting}>
            {submitting ? "กำลังบันทึก…" : id ? "บันทึกการแก้ไข" : "บันทึกและไปหน้ารายละเอียด"}
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={() => (id ? nav(-1) : nav("/"))}
            disabled={submitting}
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}
// หมายเหตุ: ถ้าแก้ไข จะไม่สามารถเปลี่ยนสถานะ is_published, is_featured ได้ที่หน้านี้ (เผื่อไว้สำหรับอนาคต)