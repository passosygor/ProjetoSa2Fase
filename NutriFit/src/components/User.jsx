import React from 'react'

function User(props) {
    return (
        <div className='card'>
            {/* <p>ID: {props.id} </p> */}
            <p>Nome: <span>{props.name}</span> </p>
            <p>Idade: <span>{props.age}</span></p>
            <p>Email: <span>{props.email}</span></p>
            <button className='excluir'>Excluir</button>
        </div>
    )
}

export default User