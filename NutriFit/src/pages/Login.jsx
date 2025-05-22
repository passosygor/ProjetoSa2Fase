import { useState } from 'react'
import React from 'react'
import './Login.css'

function Login() {
const[Nome, setNome] = useState("")
const[Senha, setSenha] = useState("")


  return (
    <>
      <div className='container'>


        <div className='div-esquerda'>
       
        <div className='caixa-login'>

        <h2>Faça seu Login</h2>

        <input type="text" 
        value={Nome}
        onChange={(e) => setNome(e.target.value)}
        className='input-nome'/>

        <input type="password" 
        value={Senha}
        onChange={(e) => setSenha(e.target.value)}
        className='input-senha'/>

      <div className='senha-esquecida'>
      <a href="https://passwords.google.com/intro?hl=pt">Esqueceu sua senha e/ou Usuario?</a>
      </div>
 
      <button >Login</button>


      <div className='sem-senha'>
      <b>Não possui uma conta?</b>
      <label>Entre em contato pelo e-mail
      suporte@nutrifit.com.br</label>
 
      </div>

      </div>

        </div>

        <div className='div-direita'>

           {/* <img src="/img/images.jpg" alt="" /> */}

        </div>

        </div>

    </>
  )
}

export default Login
