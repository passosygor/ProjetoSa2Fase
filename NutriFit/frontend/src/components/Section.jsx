
import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import './Section.css';
import { useNavigate } from 'react-router-dom';

const Section = ({ title, description, buttonText, imageSrc, url }) => {
  const navigate = useNavigate();
  const ref = useRef(null); // Referência ao elemento da seção
  const isInView = useInView(ref, { once: true }); // Detecta quando está visível (executa uma vez)

  const handleClick = () => {
    navigate(url);
  };

  return (
    <div className="section-container" ref={ref}>
      <motion.div
        className="section-image"
        initial={{ opacity: 0, x: -100 }} // Começa invisível e 100px à esquerda
        animate={isInView ? { opacity: 1, x: 0 } : {}} // Anima só quando visível
        transition={{ duration: 0.8 }} // Duração da animação
      >
        <img src={imageSrc} alt={title} />
      </motion.div>
      <motion.div
        className="section-content"
        initial={{ opacity: 0, x: -100 }} // Começa invisível e 100px à esquerda
        animate={isInView ? { opacity: 1, x: 0 } : {}} // Anima só quando visível
        transition={{ duration: 1.2, delay: 0.2 }} // Pequeno delay para sequência
      >
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={handleClick} className="section-button">
          {buttonText}
        </button>
      </motion.div>
    </div>
  );
};

export default Section;