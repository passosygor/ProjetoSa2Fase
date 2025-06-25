import React from 'react'
import './Header.css'
import Logo from './Logo'
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  return (
    <div className='container-header'>
        <Logo />
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
  )
}

export default Header