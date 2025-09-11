import NavBar from "./NavBar";
import "./SignIn.css";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div>
      <NavBar />
      <div className="signin-page">
        <div className="signin-card">
          <h1 className="signin-title">Sign In</h1>

          <form className="signin-form">
            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>

            {/* Button */}
            <button type="submit" className="btn-primary">
              Sign In
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account?{" "}
            <Link to="/signup" className="signup-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
