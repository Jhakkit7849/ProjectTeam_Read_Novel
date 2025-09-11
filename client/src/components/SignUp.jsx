import { use, useState } from "react";
import "./SignUp.css";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleName(event) {
    setName(event.target.value);
  }

  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  function handleConfirmPassword(event) {
    setConfirmPassword(event.target.value);
    console.log(confirmPassword);
  }

  return (
    <div>
      <NavBar />
      <div className="signup-page">
        <div className="signup-card">
          <h1 className="signup-title">Sign Up</h1>

          <form className="signup-form">
            {/* Name */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={handleName}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmail}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={handlePassword}
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleConfirmPassword}
              />
            </div>

            {/* Button */}
            <button type="submit" className="btn-primary">
              Sign Up
            </button>
          </form>

          <p className="signin-text">
            Already have an account?{" "}
            <Link to="/SignIn" className="signin-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
