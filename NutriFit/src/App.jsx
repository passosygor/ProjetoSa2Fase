import React from 'react'
import './App.css'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Header from './components/Header'



function App() {
  return (
    <div className='container-app'>
      <Header />
      {/* <Cadastro /> */}
      <Login />
    </div>
  )
}

export default App
