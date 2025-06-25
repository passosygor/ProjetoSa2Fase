import React from 'react';
import './Hero.css' ;


const Hero = () => {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url('/img/fundocomlogo.png')` }} // Caminho absoluto
    ></section>
  );
};

export default Hero