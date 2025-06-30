import React, { useEffect, useState } from 'react';
import './Header.css';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userSalvo = JSON.parse(localStorage.getItem('usuarioLogado'));
    setUsuario(userSalvo);
  }, []);


  return (
    <div className='container-header'>
      <a href="/"><Logo /></a>
      <div className="menu">


        {!usuario && (
          <>
            <button className="menu-button" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="menu-button" onClick={() => navigate('/cadastro')}>
              Cadastro
            </button>
          </>
        )}



        {usuario && (
          <>
                  <button className="menu-button" onClick={() => navigate('/dashboard')}>
          Minha Conta
        </button>
            <span className="menu-usuario">Olá, {usuario.nome?.toUpperCase() || usuario.usuario?.toUpperCase()}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
