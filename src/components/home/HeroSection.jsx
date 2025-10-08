import React from "react";
import heroImg from "../../assets/imagenesSimpsons/hero.png";
const HeroSection = () => {
  return (
    <div className="container-fluid alturaMinima hero d-flex justify-content-center align-items-center">
      <img src={heroImg} alt="" />
    </div>
  );
};

export default HeroSection;
