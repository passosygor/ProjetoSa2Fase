import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Sectiond.css';
import { useNavigate } from 'react-router-dom';

const Sectiond = ({ title, description, buttonText, imageSrc, url }) => {
  const navigate = useNavigate(); // Declaração do hook no topo
  const ref = useRef(null); // Referência ao elemento da seção
  const isInView = useInView(ref, { once: true }); // Detecta visibilidade (uma vez)

  const handleClick = () => {
    navigate(url);
  };

  return (
    <div className="sectiond-container" ref={ref}>
      <motion.div
        className="sectiond-content"
        initial={{ opacity: 0, x: 100 }} // Começa invisível e 100px à direita
        animate={isInView ? { opacity: 1, x: 0 } : {}} // Anima só quando visível
        transition={{ duration: 1.2 }} // Duração da animação
      >
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={handleClick} className="sectiond-button">
          {buttonText}
        </button>
      </motion.div>
      <motion.div
        className="sectiond-image"
        initial={{ opacity: 0, x: 150 }} // Começa invisível e 100px à direita
        animate={isInView ? { opacity: 1, x: 0 } : {}} // Anima só quando visível
        transition={{ duration: 1.2, delay: 0.2 }} // Pequeno delay para sequência
      >
        <img src={imageSrc} alt={title} />
      </motion.div>
    </div>
  );
};

export default Sectiond;