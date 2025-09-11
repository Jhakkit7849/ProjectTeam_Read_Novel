import { Link } from "react-router-dom";
import "./Home.css";
import NavBar from "./NavBar";
import BookStorage from "./bookStorage/BookStorage";

const Home = () => {
  return (
    <div>
      <NavBar />

      {/* ✅ เนื้อหาหน้า Home */}
      <div className="home-content">
        
        <BookStorage />
      </div>
    </div>
  );
};

export default Home;
