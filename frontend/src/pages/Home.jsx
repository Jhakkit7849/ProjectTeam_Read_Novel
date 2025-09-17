import { useEffect, useState } from "react";
import API from "../lib/api";
import NovelGrid from "../components/NovelGrid";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [romance, setRomance] = useState([]);
  const [fantasy, setFantasy] = useState([]);
  const [drama, setDrama] = useState([]);
  const [mystery, setMystery] = useState([]);
  const [horror, setHorror] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
  Promise.all([
    API.get("/novels/featured"),
    API.get("/novels?q=&category_id=1"),
    API.get("/novels?q=&category_id=2"),
    API.get("/novels?q=&category_id=3"),
    API.get("/novels?q=&category_id=4"),
    API.get("/novels?q=&category_id=5"),
    API.get("/novels?q=&category_id=6"),
  ]).then(([f, r, fa, d, m, h, c]) => {
    setFeatured(f.data);
    setRomance(r.data);
    setFantasy(fa.data);
    setDrama(d.data);
    setMystery(m.data);
    setHorror(h.data);
    setComedy(c.data);

    // ✅ อัปเดต images หลังจากมีค่าของทุก category แล้ว
    setImages([
      f.data[0]?.cover_url,
      r.data[0]?.cover_url,
      fa.data[0]?.cover_url,
      d.data[0]?.cover_url,
      m.data[0]?.cover_url,
      h.data[0]?.cover_url,
      c.data[0]?.cover_url,
    ]);
  });
  console.log(images);
}, []);

  return (
    <div className="container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        slidesPerView={1}
        style={{ height: "50vh", marginBottom: "2rem" }} // สูงครึ่งจอ
      >
        {images.map((image, idx) => (
          
          <SwiperSlide key={idx}>
            <img
              src={image || "https://picsum.photos/536/354"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
                
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <h2>นิยายแนะนำให้อ่าน</h2>
      <NovelGrid items={featured} />
      <h3 style={{ marginTop: 24 }}>หมวดหมู่: โรแมนติก</h3>
      <NovelGrid items={romance} />
      <h3 style={{ marginTop: 24 }}>หมวดหมู่: แฟนตาซี</h3>
      <NovelGrid items={fantasy} />
      <h3 style={{ marginTop: 24 }}>หมวดหมู่: ดราม่า</h3>
      <NovelGrid items={drama} />
      <h3 style={{ marginTop: 24 }}>หมวดหมู่: สืบสวน</h3>
      <NovelGrid items={mystery} />
      <h3 style={{ marginTop: 24 }}>หมวดหมู่: สยองขวัญ</h3>
      <NovelGrid items={horror} />
      <h3 style={{ marginTop: 24 }}>หมวดหมู่: คอมมาดี้</h3>
      <NovelGrid items={comedy} />
    </div>
  );
}
