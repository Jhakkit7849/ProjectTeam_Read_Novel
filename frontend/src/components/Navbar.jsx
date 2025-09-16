import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="nav">
      <div className="wrap">
        <Link className="brand" to="/">
          GEE AEY Y
        </Link>
        <Link to="/library">คลังของฉัน</Link>
        <Link to="/rankings">อันดับ</Link>
        {user && <Link to="/writing" style={{ marginLeft: 12 }}>Writing</Link>}
        <div style={{ marginLeft: "auto" }} />
        {user ? (
          <>
            <Link to="/me">{user.display_name}</Link>
            <button
              className="btn secondary"
              onClick={() => {
                logout();
                nav("/signin");
              }}
            >
              ออก
            </button>
          </>
        ) : (
          <>
            <Link to="/signin">เข้าสู่ระบบ</Link>
            <Link to="/signup" style={{ marginLeft: 12 }}>
              สมัคร
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
