import "./NavBar.css";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

const NavBar = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="nav-logo">
          <Link to={"/"}>GEE AEY Y</Link>
        </div>
        
        <ul className="nav-links">
          
          <li>
            <Link to="/" className="nav-link">
              หน้าหลัก
            </Link>
          </li>

          <li>
            <Link to={"/My_Storage"} className="nav-link">
              คลังหนังสือของฉัน
            </Link>
          </li>
          <li>
            <Link to="/" className="nav-link">
              ประวัติการอ่าน
            </Link>
          </li>
          <li>
          <input
            type="text"
            placeholder="Search..."
            className="search-box nav-link"
          />
        </li>

          <li>
            <Link to="/" className="nav-link">
              <CgProfile size={25} />
            </Link>
          </li>

           
        </ul>
      </nav>
    </div>
  );
};
export default NavBar;
