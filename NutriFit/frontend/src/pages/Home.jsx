import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import logo from '../../img/logo.png';
import fundo from '../../img/Imagem Fundo Nutrifit.png'; // substitua pelo caminho correto da sua imagem

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Imagem de fundo com blur */}
      <img src={fundo} alt="Fundo Nutrição" className="background-blur" />

      <div className="logo-section">
        <img src={logo} alt="NutriFit Logo" className="logo" />
        <h1 className="frase">Transforme sua saúde. Viva o seu melhor!</h1>
      </div>

      <div className="menu">
        <button className="menu-button" onClick={() => navigate('/quiz')}>
          Plano de Dieta
        </button>
        <button className="menu-button" onClick={() => navigate('/calculador')}>
          Cadastrar Alimentos
        </button>
        <button className="menu-button" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="menu-button" onClick={() => navigate('/')}>
          Cadastro
        </button>
        <button className="menu-button" onClick={() => navigate('/dashboard')}>
          Dashboard
        </button>
      </div>
    </div>
  );
}

export default Home;
