import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  const ref = useRef(null); // Referência ao elemento Hero
  const isInView = useInView(ref, { once: true }); // Detecta visibilidade (uma vez)

  return (
    <motion.section
      className="hero"
      ref={ref}
      style={{ backgroundImage: `url('/img/fundoog.png')` }} // Caminho absoluto
      initial={{ opacity: 0, y: 50 }} // Começa invisível e 50px abaixo
      animate={isInView ? { opacity: 1, y: 0 } : {}} // Anima só quando visível
      transition={{ duration: 0.8 }} // Duração da animação
    ></motion.section>
  );
};

export default Hero;