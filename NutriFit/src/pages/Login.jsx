import React, { useState } from 'react'
import '../pages/Login.css'

function Login() {
    const[email, setEmail] = useState("")
    const[senha, setSenha] = useState("")
    
    function logar() {
        // Exemplo de login fake
        if (email === "1" && senha === "1") {
            alert("Login realizado com sucesso!");
        } else {
            alert("Email ou senha incorretos!");
        }
    }

  return (
<div className='login'>
    <div className='login-box'>
        <h1>Login</h1>
        <input 
            type="text" 
            placeholder="Digite seu email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
        />
        <input 
            type="password" 
            placeholder="Digite sua senha"
            value={senha} 
            onChange={(e) => setSenha(e.target.value)}
        />
        <button onClick={logar}>Logar</button>
    </div>
</div>

  )
}

export default Login