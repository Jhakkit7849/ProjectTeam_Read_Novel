import "./BookStorage.css";
import Card from "../card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

const books = [
  {
    id: 1,
    title: "พี่ชัชชนอย่าหยอกเล่น #ระวังปลาเลียปาก",
    desc: "เพราะอยู่จุดสูงสุดมาโดยตลอด ทั้งหน้าตาดี เรียนเก่ง รวย มั่นใจว่าจีบใครอย่างไรก็ติด จนกระทั่งโดนปฏิเสธอย่างไม่ไว้หน้าจากชายหนุ่มผู้หนึ่ง",
    img: "https://cdn.readawrite.com/articles/18951/18950852/thumbnail/tiny.gif?1",
  },
  {
    id: 2,
    title: "ม่อนปลายตะวัน",
    desc: "แอบรักพี่แทบตาย สุดท้ายเขาบอกว่าเขาเป็นแค่น้องชาย ปลายตะวันไม่ยอม!!",
    img: "https://cdn.readawrite.com/articles/23876/23875370/thumbnail/tiny.gif?1",
  },
  {
    id: 3,
    title: "ที่รักของรักคุณ",
    desc: "เขาบอกว่าถ้าชอบพระเอกนิยายเรื่องไหนให้จีบไรต์เรื่องนั้น งั้นขอเป็นที่รักของรักคุณเลยได้มั้ยไหนๆก็ชื่อที่รักแล้ว",
    img: "https://cdn.readawrite.com/articles/22620/22619308/thumbnail/tiny.gif?3",
  },
  {
    id: 4,
    title: "ดั่งจันทร์ที่หวนคืน",
    desc: "ลูกแค่สงสัยว่าทำไมต้องเป็นหล่อนด้วย ในสยามมีผู้หญิงตั้งมากมาย...แต่ทำไมต้องเป็นอินทุอร",
    img: "https://cdn.readawrite.com/articles/17011/17010128/thumbnail/tiny.gif?2",
  },
  {
    id: 5,
    title: "ใต้เงาเดียวกัน",
    desc: "ทำอาหารให้กินทุกมื้อ ทำความสะอาดบ้านเก่ง น่ารัก เท่ ของเสียซ่อมได้ ครบเครื่องขนาดนี้สมัครเป็นแฟนเลยดีไหม",
    img: "https://cdn.readawrite.com/articles/23824/23823811/thumbnail/tiny.gif?1",
  },
  {
    id: 6,
    title: "ความลับ(รัก)ของนางร้าย",
    desc: "จากอคติสู่ความใกล้ชิด ภารกิจตีสนิทเพื่อล้วงความลับของนางร้าย กลับเริ่มสั่นคลอนหัวใจของนางเอกทีละนิด",
    img: "https://cdn.readawrite.com/articles/23334/23333803/thumbnail/tiny.gif?3",
  },
  {
    id: 7,
    title: "Crush on you รันจะจีบ",
    desc: "เมื่อสาวสวยเจ้าชู้ตัวแม่ ต้องมาตกหลุมรักเจ้าของร้านดอกไม้ที่ใจแข็งดั่งหิน ปฏิบัติการตามจีบพี่สาวคนสวยจึงเริ่มขึ้น",
    img: "https://cdn.readawrite.com/articles/23818/23817745/thumbnail/tiny.gif?1",
  },
];

const books_2 = [
  {
    id: 1,
    title: "แฟนใหม่ใกล้ฉัน จับมือกันสู้เซิร์ก",
    desc: "หลังโดนน้องชายและคู่หมั้นฆ่า ถังอวี่ย้อนกลับมาหนึ่งปีก่อนหน้า พอสอบเข้าโรงเรียนทหารแห่งดาราจักรดันได้เป็นรูมเมตกับรุ่นพี่สุดเย็นชาอย่างป๋ายจิ่น ชีวิตวุ่นๆจึงเริ่มขึ้น",
    img: "https://cdn.readawrite.com/articles/22525/22524535/thumbnail/tiny.gif?1",
  },
  {
    id: 2,
    title: "บ้านพลตรีมีหนุ่มน้อยนำโชค",
    desc: "อวี๋จิ่นลี่ ปลาจิ๋นหลี่เปลี่ยนโชคชะตาที่แปลงกายได้ไม่นาน ก็ทะลุมิติมาอยู่ในร่างคนอื่นแล้วถูกจับแต่งงานกับคนพิการแทนพี่ชาย ในเมื่อแต่งกันแล้วย่อมไม่นิ่งดูดาย ปลาน้อยคนนี้จะเปลี่ยนชะตาของนายให้ดู",
    img: "https://cdn.readawrite.com/articles/11247/11246454/thumbnail/tiny.gif?3",
  },
  {
    id: 3,
    title: "การเป็นเบต้าในโลกของอัลฟ่าและโอเมก้า",
    desc: "สำหรับตระกูลอัลฟ่าโอเมก้า เด็กที่เกิดมาเป็นเบต้าคือความผิดพลาดและน่า อับอาย เขาจึงไม่มีแม้กระทั่งชื่อของตัวเอง แต่เขาจะพยายามมีชีวิตต่อไป เพราะ ชีวิตที่ผิดพลาดและน่าอับอาย ก็นับเป็นชีวิตที่มีค่าเช่นกัน",
    img: "https://cdn.readawrite.com/articles/14515/14514339/thumbnail/tiny.gif?7",
  },
  {
    id: 4,
    title: "#ผมคือตัวบัคของหอคอยดันเจี้ยน",
    desc: "'ลั่วกัง' แค่อยากพักผ่อนอย่างสงบ เป็นมอนสเตอร์ระดับ SSS ที่วัน ๆ ไม่ต้องทํา อะไรเลย รอชะตากรรมถูกฆ่าตายอย่างเดียว แต่ด้วยเหตุผลบางอย่าง...ทําให้เขา สวมร่างมนุษย์ ออกจากหอคอยดันเจี้ยนแล้วกลายเป็นฮันเตอร์",
    img: "https://cdn.readawrite.com/articles/20970/20969852/thumbnail/tiny.gif?8",
  },
  {
    id: 5,
    title: "โลกเกมจีบสาว…แต่สาวจีบฉัน!?",
    desc: "แทนที่เหล่านางเอกควรจะสนใจพระเอก ทำไมถึงเอาแต่วนเวียนอยู่รอบตัวฉันเนี่ย!?",
    img: "https://cdn.readawrite.com/articles/9327/9326307/thumbnail/tiny.gif?5",
  },
  {
    id: 6,
    title: "Belinda พงศวดารนักแปรธาตุจ้าวมนตรา",
    desc: "ความลับที่ไม่เคยคาดคิด โชคชะตาที่ไม่เคยคาดฝัน กลับมาบรรจบกันในท้ายที่สุด",
    img: "https://cdn.readawrite.com/articles/18170/18169266/thumbnail/tiny.gif?2",
  },
  {
    id: 7,
    title: "ได้เกิดใหม่ทั้งที จะเป็นสามีของคุณนางร้ายให้ได้เลยค่ะ",
    desc: "เมื่อนางในดวงใจมาอยู่ตรงหน้าตัวเป็น ๆ ใครจะอดใจไหวกัน พระเอกทั้งหลายกรุณาหลบด่วน งานนี้นางเอกขอจีบนางร้ายค่ะ!",
    img: "https://cdn.readawrite.com/articles/11419/11418146/thumbnail/tiny.gif?38",
  },
];

const books_3 = [
  {
    id: 1,
    title: "ซอมบี้สีชมพู",
    desc: "ถึงมันจะเริ่มต้นด้วยความบังเอิญ แต่ก็จบลงอย่างตั้งใจ",
    img: "https://cdn.readawrite.com/articles/23763/23762705/thumbnail/tiny.gif?1",
  },
  {
    id: 2,
    title: "เพราะ 'คุณรัชช์' นอนไม่เต็มอิ่ม",
    desc: "วันไหนหัวหน้านอนไม่เต็มอิ่ม เธอจะน่ากลัวคูณสิบเลย",
    img: "https://cdn.readawrite.com/articles/23831/23830972/thumbnail/tiny.gif?2",
  },
  {
    id: 3,
    title: "ละลายรัก",
    desc: "สำหรับตระกูลอัลฟ่าโอเมก้า เด็กที่เกิดมาเป็นเบต้าคือความผิดพลาดและน่า อับอาย เขาจึงไม่มีแม้กระทั่งชื่อของตัวเอง แต่เขาจะพยายามมีชีวิตต่อไป เพราะ ชีวิตที่ผิดพลาดและน่าอับอาย ก็นับเป็นชีวิตที่มีค่าเช่นกัน",
    img: "https://cdn.readawrite.com/articles/17169/17168322/thumbnail/tiny.gif?2",
  },
  {
    id: 4,
    title: "Engineer So cute! เมื่อผมถูกจิ้นกับหนุ่มวิศวะ",
    desc: "แอบชอบหนุ่มเนิร์ดวิศวะอยู่ดี ๆ ดันถูกคนจับไปจิ้นกับหนุ่มฮอตวิศวะซะงั้น",
    img: "https://cdn.readawrite.com/articles/13471/13470961/thumbnail/tiny.gif?3",
  },
  {
    id: 5,
    title: "ทำไมพระเอกถึงไล่ตามตัวปลอมอย่างผมได้ล่ะครับ?",
    desc: "พอรู้สึกตัวอีกที ผมก็กลายเป็นคุณชายตัวปลอมที่สวมรอยแทนนางเอกในละครสั้น ผงจึงละทิ้งแผนการและหนีพระเอก ทั้ง ๆ ที่ทำแบบนั้นไปแล้ว แต่ทำไมเขาถึงยังมาตามผมต้อย ๆ ได้ล่ะ",
    img: "https://cdn.readawrite.com/articles/23616/23615737/thumbnail/tiny.gif?1",
  },
  {
    id: 6,
    title: "เมื่อผมอยากเป็นยูทูบเบอร์แข่งกับแฟนเก่า",
    desc: "ช่องยูทูบใหม่ของผมจะต้องมีคนติดตามเยอะกว่าแฟนเก่า!!",
    img: "https://cdn.readawrite.com/articles/5770/5769283/thumbnail/tiny.gif?12",
  },
  {
    id: 7,
    title: "ภารกิจฮีลใจพระรอง แล้วทำไมพระเอกถึงตกหลุมรักผมได้!",
    desc: "“โตเกียว” ถูกระบบส่งมาอยู่ในโลกภาพยนตร์เรื่องหนึ่งในรางของ “แคลร์” สตอล์กเกอร์ลูกคนรวยผู้คลั่งไคล้พระเอกของเรื่อง แต่เขาดันได้รับภารกิจให้ไปตามจีบพระรองแทน",
    img: "https://cdn.readawrite.com/articles/23817/23816415/thumbnail/tiny.gif?3",
  },
];

const books_4 = [
  {
    id: 1,
    title: "THE EARTH #วิวาห์ปฐพี",
    desc: "วิวาห์ข้างกายในฐานะภรรยา แท้จริงเป็นเพียงคนนอกสายตาและเงาลวง",
    img: "https://cdn.readawrite.com/articles/11321/11320310/thumbnail/tiny.gif?1",
  },
  {
    id: 2,
    title: "THE WATER #นทีร้อยเล่ห์",
    desc: " เพื่อทุกสิ่งทุกอย่างที่ต้องการ หากไม่ได้ด้วยเล่ห์ ก็ต้องเอาด้วยกล",
    img: "https://cdn.readawrite.com/articles/11609/11608197/thumbnail/tiny.gif?1",
  },
  {
    id: 3,
    title: "THE AIR #เสน่หาวาโย",
    desc: "อันของสูงแม้ปองต้องจิต ถ้าไม่คิดปีนป่ายจะได้หรือ",
    img: "https://cdn.readawrite.com/articles/11321/11320310/thumbnail/tiny.gif?1",
  },
  {
    id: 4,
    title: "THE FIRE #โซ่รักอัคนี",
    desc: "คนหนึ่งเปรียบเหมือนเปลวไฟรุ่มร้อน อีกคนหนึ่งเปรียบเหมือนน้ำมันที่พร้อมจะทำให้เพลิงยิ่งลุกโชน",
    img: "https://cdn.readawrite.com/articles/12396/12395894/thumbnail/tiny.gif?2",
  },
  {
    id: 5,
    title: "หนีจากอ้อมกอดอัลฟ่า",
    desc: "จะหนีจากฉันเหรอ? ถ้าจะทำแบบนั้น ควรแน่ใจก่อนว่าฉันยอมให้หนี",
    img: "https://cdn.readawrite.com/articles/23366/23365375/thumbnail/tiny.gif?3",
  },
  {
    id: 6,
    title: "คุณหนูโอเมก้าที่สามีไม่รัก",
    desc: "ภชายืนอ่านนิยายเกย์ระหว่างรอบีทีเอส ดันโดนลูกหลงเด็กช่างจนขิต ตื่นมาในร่างของดนิษฐ์คุณหนูโอเมก้าแสนเอาแต่ใจ ไม่เว้นแม้แต่สามี",
    img: "https://cdn.readawrite.com/articles/5770/5769283/thumbnail/tiny.gif?12",
  },
  {
    id: 7,
    title: "เกิดใหม่ทั้งทีดันเป็นลูกไอ้สารเลวนั่นเสียได้!",
    desc: "การได้มาเกิดใหม่โดยที่ยังมีความทรงจำเดิมอยู่มันไม่สนุก แถมยังเป็นมีไอ้สาวเลวนั่นเป็นพ่ออีก ชีวิตช่างน่าสังเวชอะไรแบบนี้",
    img: "https://cdn.readawrite.com/articles/23589/23588998/thumbnail/tiny.gif?1",
  },
];

const books_5 = [
  {
    id: 1,
    title: "พยัคฆ์ยศธา",
    desc: "ยศธาถูกพ่อครูประจำหมู่บ้านทักว่าก่อนอายุ 35 จะมีอันเป็นไปหากยังไม่มีเมีย ทำให้เขาต้องมีเมียในนามที่ผู้เป็นแม่หามาให้อย่างสีเทียนเพื่อต่อดวงชะตา",
    img: "https://cdn.readawrite.com/articles/23165/23164711/thumbnail/tiny.gif?9",
  },
  {
    id: 2,
    title: "ผมถูกตัวร้ายตามจีบในโลกสยองขวัญ",
    desc: "ทะลุมิติมาเกิดใหม่ก็นึกว่าเป็นโลกธรรมดา แต่ไหง 25 ปีผ่านมา ตัวร้ายในนิยายสยองขวัญถึงตามจีบผมเช้าเย็นได้เล่า",
    img: "https://cdn.readawrite.com/articles/23586/23585923/thumbnail/tiny.gif?1",
  },
  {
    id: 3,
    title: "ต้องแสงสูรย์",
    desc: "ไม่มีใครบอกหรือไงว่ามึงลุกขึ้นมารำทุกกลางดึกของวันพระ",
    img: "https://cdn.readawrite.com/articles/21415/21414553/thumbnail/tiny.gif?7",
  },
  {
    id: 4,
    title: "คุณวาน่ากลัวกว่าผี",
    desc: "เมี่ยงถูกจ้างให้มาไล่ผีสาวที่ตามติดทายาทเศรษฐีดวงตก และเขาคิดว่าคุณวาเป้าหมายของตนอาจเป็นต้นเหตุการตายของเธอ",
    img: "https://cdn.readawrite.com/articles/17106/17105334/thumbnail/tiny.gif?23",
  },
  {
    id: 5,
    title: "เจ้าลั่นทม",
    desc: "หล่อนยังคงรอคอย..จนกว่าจะถึงวันนั้น วันที่เธอจะให้อภัย และปลดปล่อยหล่อนจากพันธนาการแห่งความแค้น",
    img: "https://cdn.readawrite.com/articles/23526/23525418/thumbnail/tiny.gif?2",
  },
  {
    id: 6,
    title: "ธำมรงค์",
    desc: "แหวนทองคำจากร้านของเก่า นำโชคดีมาให้มินตราในชั่วพริบตา แต่กานต์กลับสัมผัสได้ถึงพลังมืดที่แฝงอยู่..นี่คือจุดเริ่มต้นของชะตาที่มิอาจหวนคืน",
    img: "https://cdn.readawrite.com/articles/23691/23690637/thumbnail/tiny.gif?2",
  },
  {
    id: 7,
    title: "LALUNA เจรจา ล่า ผี",
    desc: "ไม่ใช่ทุกคนที่จะกลายเป็นผี แต่ผีทุกตนล้วนเคยเป็นคนมาก่อน",
    img: "https://cdn.readawrite.com/articles/10511/10510873/thumbnail/tiny.gif?3",
  },
];

const books_6 = [
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

const image_swiper = [
  "https://cdn.readawrite.com/articles/14515/14514339/thumbnail/tiny.gif?7",
  "https://cdn.readawrite.com/articles/11419/11418146/thumbnail/tiny.gif?38",
  "https://cdn.readawrite.com/articles/18951/18950852/thumbnail/tiny.gif?1",
  "https://cdn.readawrite.com/articles/20970/20969852/thumbnail/tiny.gif?8",
];

const BookStorage = () => {
  return (
    <div>
      <Swiper
        modules={[Navigation]}
        navigation={true}
        loop={true}
        slidesPerView={1}
        spaceBetween={10}
        className="my-swiper"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        
      >
        {image_swiper.map((img, index) => {
          return (
            <SwiperSlide key={index}>
              <img src={img} className="img"/>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="book-storage">
        <h2>โรแมนติก</h2>
        <div className="card-grid">
          {books.map((book) => (
            <Card
              key={book.id}
              title={book.title}
              desc={book.desc}
              img={book.img}
            />
          ))}
        </div>
      </div>

      <div className="book-storage">
        <h2>แฟนตาซี</h2>
        <div className="card-grid">
          {books_2.map((book) => (
            <Card
              key={book.id}
              title={book.title}
              desc={book.desc}
              img={book.img}
            />
          ))}
        </div>
      </div>

      <div className="book-storage">
        <h2>คอมมาดี้</h2>
        <div className="card-grid">
          {books_3.map((book) => (
            <Card
              key={book.id}
              title={book.title}
              desc={book.desc}
              img={book.img}
            />
          ))}
        </div>
      </div>

      <div className="book-storage">
        <h2>ดราม่า</h2>
        <div className="card-grid">
          {books_4.map((book) => (
            <Card
              key={book.id}
              title={book.title}
              desc={book.desc}
              img={book.img}
            />
          ))}
        </div>
      </div>

      <div className="book-storage">
        <h2>สยองขวัญ</h2>
        <div className="card-grid">
          {books_5.map((book) => (
            <Card
              key={book.id}
              title={book.title}
              desc={book.desc}
              img={book.img}
            />
          ))}
        </div>
      </div>

      <div className="book-storage">
        <h2>สืบสวน</h2>
        <div className="card-grid">
          {books_6.map((book) => (
            <Card
              key={book.id}
              title={book.title}
              desc={book.desc}
              img={book.img}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookStorage;
