import { useEffect, useState } from "react";
import API from "../lib/api";
import NovelGrid from "../components/NovelGrid";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [romance, setRomance] = useState([]);
  const [fantasy, setFantasy] = useState([]);
  const [drama, setDrama] = useState([]);
  useEffect(() => {
    API.get("/novels/featured").then((r) => setFeatured(r.data));
    API.get("/novels?q=&category_id=1").then((r) => setRomance(r.data));
    API.get("/novels?q=&category_id=2").then((r) => setFantasy(r.data));
    API.get("/novels?q=&category_id=3").then((r) => setDrama(r.data));
  }, []);
  return (
    <div className="container">
      <h2>นิยายแนะนำให้อ่าน</h2>
      <NovelGrid items={featured} />
      <h3 style={{ marginTop: 24 }}>หมวดหมู่: โรแมนติก</h3>
      <NovelGrid items={romance} />
      <h3 style={{ marginTop: 24 }}>หมวดหมู่: แฟนตาซี</h3>
      <NovelGrid items={fantasy} />
      <h3 style={{ marginTop: 24 }}>หมวดหมู่: ดราม่า</h3>
      <NovelGrid items={drama} />
    </div>
  );
}
