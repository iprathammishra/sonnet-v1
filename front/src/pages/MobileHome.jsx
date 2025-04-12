import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function MobileHome() {
  const [bars, setBars] = useState([]);
  useEffect(() => {
      const interval = setInterval(() => {
        setBars((prevBars) => [
          ...prevBars,
          ...Array.from({ length: Math.floor(Math.random() * 4) + 2 }).map(() => ({
            id: Math.random(),
            width: Math.random() * 50 + 50,
            top: Math.random() * 100 + "%",
            speed: Math.random() * 1 + 2,
          })),
        ]);
      }, 500);
      return () => clearInterval(interval);
    }, []);
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
      </div>
  );
}

export default MobileHome;