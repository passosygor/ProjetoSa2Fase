import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const ref = useRef(null); // Referência ao elemento Footer
  const isInView = useInView(ref, { once: true }); // Detecta visibilidade (uma vez)

  return (
    <motion.footer
      className="footer"
      ref={ref}
      initial={{ opacity: 0, y: 100 }} // Começa invisível e 50px abaixo
      animate={isInView ? { opacity: 1, y: 0 } : {}} // Anima só quando visível
      transition={{ duration: 1.2 }} // Duração da animação
    >
      <div className="footer-content">
        <div className="footer-section">
          <h3>Sobre</h3>
          <ul>
            <li><a href="#nossa-historia">Nossa História</a></li>
            <li><a href="#missao">Missão</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contato</h3>
          <p>Telefone: (48) 99974-4446</p>
          <p>Email: suporteNutriFit@gmail.com</p>
        </div>
        <div className="footer-section social-links">
          <h3>Siga-nos</h3>
          <a href="#facebook">Facebook</a>
          <a href="#instagram">Instagram</a>
          <a href="#twitter">Twitter</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 NutriFit. Todos os direitos reservados.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;