import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Writing() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  // บังคับให้ล็อกอินก่อนเข้า
  useEffect(() => {
    if (!loading && !user) nav("/signin");
  }, [loading, user, nav]);

  if (loading) return null;

  return (
    <div className="container">
      <h2>Writing</h2>

      <div style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
        <div style={{ display: "grid", gap: 16, width: 220 }}>
            {user && <Link to="/write/new" className="btn">เขียนนิยาย</Link>}
            {user && <Link to="/my-works" className="btn secondary">ผลงานของฉัน</Link>}
        </div>
      </div>
    </div>
  );
}
