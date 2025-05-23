import React from 'react'

function User(props) {
    return (
        <div className='card'>
            {/* <p>ID: {props.id} </p> */}
            <p>Nome: <span>{props.name}</span> </p>
            <p>Senha: <span>{props.senha}</span></p>
            <button className='excluir'>Excluir</button>
        </div>
    )
}

export default User