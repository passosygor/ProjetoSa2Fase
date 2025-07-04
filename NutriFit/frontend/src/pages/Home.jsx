import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
// import logo from '../../img/logo.png';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import Sectiond from '../components/Sectiond.jsx';
import Footer from '../components/Footer.jsx';



function Home() {
  // const navigate = useNavigate();
  // const navigateDieta = () => navigate('/quiz');
  
  return (
    <>
    <Header />
    <Hero />
{/* Seção Plano de Dieta */}
    <Section
      title="Plano de Dieta Personalizado"
      description="Faça o quiz e montamos um plano de dieta para suas necessidades."
      buttonText="Saiba Mais"
      imageSrc={"/img/dietasection.jpg"}
      url='/quiz'
      />
      <Sectiond
      title="Cadastro de Alimentos"
      description="Personalize os alimentos e suas quantidades."
      buttonText="Saiba Mais"
      imageSrc={"/img/alimentoaqui.jpg"}
      url='/calculador'
      />
      <Section
      title="Calculadora de MacroNutrientes"
      description="Calcule seu consumo calorico por refeição!."
      buttonText="Comece agora"
      imageSrc={"/img/acad.jpg"}
      url='/Macro'
      />  
      <Footer />
    </>
  );
}

export default Home;
