import { useEffect, useState } from "react";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import My_Storage from "./components/My_Storage";
import Details from "./components/Details";

function App() {
  const [message, setMessage] = useState("Loading...");

  // useEffect(() => {
  //   fetch("/api/hello")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message))
  //     .catch((err) => {
  //       console.error(err);
  //       setMessage("Error connecting to backend");
  //     });
  // }, []);

  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/My_Storage" element={<My_Storage />} />
          <Route path="/Details" element={<Details />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
