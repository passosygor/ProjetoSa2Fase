import React from 'react'
import './Header.css'
import Logo from './Logo'

function Header() {
  return (
    <div className='container-header'>
        <Logo />
    <h1 className='titulo'>NutriFit</h1>
    <div className='troca-pagina'>
    <a className='home-voltar' >Home</a>
    <a className='contato' >Contato</a>
    </div>

    </div>
  )
}

export default Header