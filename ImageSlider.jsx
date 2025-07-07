import React, { useState, useEffect } from "react";

const images = [
  "https://img.freepik.com/free-photo/portrait-smiling-beautiful-girl-her-handsome-boyfriend-laughing_158538-4885.jpg",
  "https://img.freepik.com/free-photo/young-couple-love-outdoors_23-2148226406.jpg",
  "https://img.freepik.com/free-photo/happy-couple-love-park_1157-20551.jpg",
  "https://img.freepik.com/free-photo/couple-love-park_1157-20574.jpg",
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 2000); // 2 seconds

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="slider-container">
      <img src={images[currentIndex]} alt="Slider" className="slider-image" />
    </div>
  );
}
