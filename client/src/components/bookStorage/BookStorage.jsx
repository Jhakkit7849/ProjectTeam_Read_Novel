import "./BookStorage.css";
import Card from "../card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    desc: "A novel written by F. Scott Fitzgerald.",
    img: "https://www.beartai.com/wp-content/uploads/2021/01/20210129_The-Great-Gatsby.jpg",
  },
  {
    id: 2,
    title: "1984",
    desc: "A dystopian social science fiction novel by George Orwell.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgsZKOV0VPWylMOaeGgHr3pvDP4kljv9ZOrA&s",
  },
  {
    id: 3,
    title: "To Kill a Mockingbird",
    desc: "A novel by Harper Lee published in 1960.",
    img: "https://vinhanley.com/wp-content/uploads/2018/10/ok-harper-lee_s-to-kill-a-mockingbird-e1520599905726.jpg",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    desc: "A romantic novel by Jane Austen, first published in 1813.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjdowPMXGhBiQqGZOSAzm_zvJ01cwhF8nDZg&s",
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    desc: "A 1951 novel by J. D. Salinger about teenage alienation.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkLDHqFM0tKOvcJ6E67VX40fRA41QSLO7Zxw&s",
  },
  {
    id: 6,
    title: "Moby-Dick",
    desc: "A novel by Herman Melville, first published in 1851.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRulcBBInn0ki_tNsH2w33sn0nHBdUE7-OIDA&s",
  },
  {
    id: 7,
    title: "War and Peace",
    desc: "A historical novel by Leo Tolstoy, published in 1869.",
    img: "https://m.media-amazon.com/images/S/pv-target-images/e3f510e16e1d8744b286aca697eabebe8f8c0116ee43aed3d56ca195c1eddc00.jpg",
  },
];

const image_swiper = [
  "https://www.beartai.com/wp-content/uploads/2021/01/20210129_The-Great-Gatsby.jpg",
  "https://m.media-amazon.com/images/S/pv-target-images/e3f510e16e1d8744b286aca697eabebe8f8c0116ee43aed3d56ca195c1eddc00.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRulcBBInn0ki_tNsH2w33sn0nHBdUE7-OIDA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjdowPMXGhBiQqGZOSAzm_zvJ01cwhF8nDZg&s",
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
              <img src={img} className="img" />
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
    </div>
  );
};

export default BookStorage;
