import "./Details.css";
import NavBar from "./NavBar";

const Details = () => {
  return (
    <div>
      <NavBar />

      <div className="details-container">
        {/* ส่วนบน: ปก + เนื้อหา */}
        <div className="details-top">
          <img
            src="https://cdn.readawrite.com/articles/18951/18950852/thumbnail/tiny.gif?1"
            alt="cover"
            className="details-cover"
          />
          <div className="details-info">
            <h1 className="details-title">ชื่อเรื่อง</h1>
            <p className="details-desc">
              เรื่องย่อ เพราะอยู่จุดสูงสุดมาโดยตลอด ทั้งหน้าตาดี เรียนเก่ง รวย มั่นใจว่าจีบใครอย่างไรก็ติด จนกระทั่งโดนปฏิเสธอย่างไม่ไว้หน้าจากชายหนุ่มผู้หนึ่ง
            </p>
            <div className="details-actions">
              <button className="btn btn-primary">อ่านต่อ</button>
              <button className="btn btn-outline">เพิ่มลงคลังหนังสือ</button>
            </div>
          </div>
        </div>

        {/* ส่วนล่าง: ตอนทั้งหมด */}
        <div className="details-chapters">
          <h2>ตอนทั้งหมด</h2>
          <hr />
          <div className="chapter-item">
            <span>#1</span>
            <span>ชื่อตอนที่ 1</span>
            <button className="btn btn-primary">อ่านต่อ</button>
          </div>
          <div className="chapter-item">
            <span>#2</span>
            <span>ชื่อตอนที่ 2</span>
            <button className="btn btn-primary">อ่านต่อ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
