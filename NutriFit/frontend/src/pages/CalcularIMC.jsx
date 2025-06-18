import { useState } from 'react'
import './CalcularIMC.css'
import { useNavigate } from 'react-router-dom'

function App() {
const[altura, setAltura] = useState("")
const[peso, setPeso] = useState("")
const[imc, setImc] = useState('')
const navigate = useNavigate

function calcular(){
  const resultado = Number(peso) / (Number(altura) * Number(altura))
  setImc(resultado.toFixed(2))
}

  return (
    <>
        <div>
          <h1>Teste IMC</h1>
          <label>Digite sua altura </label>

          <input 
          type="number" value={altura} onChange={(e) => setAltura(e.target.value)}/>

          <label>Digite seu peso </label>
          <input 
          type="number" value={peso} onChange={(e) => setPeso(e.target.value)}/>
          <button onClick={calcular}>Calcular IMC</button>

        </div>
        {imc && (
         <p>
           Seu IMC é: {imc}
         </p> 

        )}
    </>
  )
}

export default App
