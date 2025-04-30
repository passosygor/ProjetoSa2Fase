import React from 'react'
import './Contador.css'

function Contador(props) {
  return (
    <div className='container-produto'>
     <h2>{props.nome}</h2>
     <p>Quantidade(g): {props.gramas}</p>
     <p>Calorias: {props.caloria}</p>
     <p>{props.id}</p>
    </div>
  )
}

export default Contador
