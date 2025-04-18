import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./styles/MovingBars.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const [bars, setBars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      navigate(`/${parsedUser._id}`);
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBars((prevBars) => [
        ...prevBars,
        ...Array.from({ length: Math.floor(Math.random() * 4) + 2 }).map(() => ({
          id: Math.random(),
          width: Math.random() * 50 + 50,
          top: Math.random() * 80 + "%",
          speed: Math.random() * 1 + 2,
        })),
      ]);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    try {
      const response = await fetch("https://sonnet-backend-dep.onrender.com/api/auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: decoded.name, email: decoded.email }),
      });

      const data = await response.json();
      const userWithId = { ...decoded, _id: data.userId };
      localStorage.setItem("user", JSON.stringify(userWithId));

      navigate(`/${data.userId}`);
    } catch (error) {
      console.error("Error saving user to database:", error);
    }
  };

  return (
    <div className="container">
      {bars.map((bar) => (
        <motion.div
          key={bar.id}
          className="bar"
          initial={{ left: "-20%" }}
          animate={{ left: "100%" }}
          transition={{ duration: bar.speed, ease: "linear" }}
          style={{ width: bar.width, top: bar.top }}
        />
      ))}

      <div className="button-container">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => console.log("Login failed.")}
          auto_select={true}
        />
      </div>
    </div>
  );
};

export default Authentication;
