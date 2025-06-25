import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
// import logo from '../../img/logo.png';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';


const navigateDieta = () => navigate('/quiz');

function Home() {
  const navigate = useNavigate();
  
  return (
    <>
    <Header />
    <Hero />
{/* Seção Plano de Dieta */}
    <Section
      title="Plano de Dieta Personalizado"
      description="Crie um plano de dieta sob medida para suas necessidades."
      buttonText="Saiba Mais"
      imageSrc={"/img/sectiondieta.jpg"}
      onNavigate={navigateDieta}
      />
    </>
  );
}

export default Home;
