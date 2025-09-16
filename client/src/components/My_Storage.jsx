import Card from "./card/Card";
import "./My_Storage.css";
import NavBar from "./NavBar";

const books = [
  {
    id: 1,
    title: "Cranium ปริศนาซากมรณะ",
    desc: "โบราณว่าไว้ “ไม่ชอบอะไร ระวังจะได้อย่างนั้น” พบกับเรื่องราวของเพื่อน (ไม่) รักที่ต้องกลับมาทำงานร่วมกันในเหตุการณ์เครื่องบินตก การพบเจอกะโหลกปริศนาและความรู้สึกบางอย่างที่ก่อตัวขึ้น",
    img: "https://cdn.readawrite.com/articles/10309/10308987/thumbnail/tiny.gif?11",
  },
  {
    id: 2,
    title: "รอยลวงใต้แสงแฟรช",
    desc: "เมื่องานศพเป็นเพียงแค่ฉากบังหน้า",
    img: "https://cdn.readawrite.com/articles/23539/23538763/thumbnail/tiny.gif?1",
  },
  {
    id: 3,
    title: "Angel of mercy มรณะการุณย์",
    desc: "เมื่อเกิดคดีฆาตกรรมต่อเนื่องที่เลียนแบบคดีชื่อดังห้าสิบปีก่อน ดร.ศิริน นักวิเคราะห์พฤติกรรมจึงต้องมองหาความเชื่อมโยงเพื่อเสาะหาตัวฆาตกร ทว่าตวามเลวร้ายในอดีตที่กลบฝังไว้คล้ายตามมาหลอกหลอนอีกครั้ง",
    img: "https://cdn.readawrite.com/articles/397/396635/thumbnail/tiny.gif?7",
  },
  {
    id: 4,
    title: "เล่ห์รักนักต่อรอง",
    desc: "เรื่องราวของดร.เมลดา นักเจราจาต่อรองที่ต้องพยายามรักษาชีวิตของผู้เคราะห์ร้ายในสถานการณ์จับตัวประกัน ทั้งยังวุ่นวายกับเจ้าหน้าที่พิเศษผู้เป็นอดีตคนรักที่ปากบอกว่าไม่ได้อยากเป็นมากกว่าเพื่อนร่วมงาน",
    img: "https://cdn.readawrite.com/articles/6618/6617022/thumbnail/tiny.gif?2",
  },
  {
    id: 5,
    title: "เอกภพเขต8",
    desc: "พ.ศ. 2814 กรุงเทพถูกแบ่งเขตการปกครองเป็นสิบเขต “เอกภพ” ทายาทของผู้ปกครองเขตแปดถูกบังคับให้รับอดีตตำรวจหัวกะทิเป็นบอดี้การ์ดข้างกาย",
    img: "https://cdn.readawrite.com/articles/3562/3561659/thumbnail/tiny.gif?5",
  },
  {
    id: 6,
    title: "บันทึกคดีพิษบุปผชาติ",
    desc: "การตายอันเป็นปริศนาของพ่อทำให้สิรภพต้องเร่งมือสืบหาความจริง แต่กลับถูกท่ายชายเดี่ยวจับผิดอยู่ตลอด",
    img: "https://cdn.readawrite.com/articles/8111/8110834/thumbnail/tiny.gif?2",
  },
  {
    id: 7,
    title: "เมือง—หมอก—วิปลาส",
    desc: "วันนั้นผู้คนคับคั่งที่ทิลเบอรีเฟสติวัล มันเป็นเวลาบ่ายสองโมง ลินคอล์นจำได้แม่น เมื่อลูกโป่งสีแดงหลุดลอยขึ้นแตะหมอกสีทึม ทันใดนั้นเหตุการณ์ไม่คาดฝันก็เกิดขึ้น",
    img: "https://cdn.readawrite.com/articles/4577/4576010/thumbnail/tiny.gif?71",
  },
];

const My_Storage = () => {
  return (
    <div>
      <NavBar />
      <div className="storage-container">
        <h1 className="storage-title">คลังของฉัน</h1>
        <div className="storage-grid">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <img src={book.img} alt={book.title} className="book-img" />
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-desc">{book.desc}</p>
                <button className="btn-read">Start reading</button>
              </div>
            </div>
            
          ))}
        </div>
      </div>
    </div>
  );
};

export default My_Storage;
