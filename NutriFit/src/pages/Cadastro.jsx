import { useState } from 'react'
import './Cadastro.css'
import User from '../components/User'


function Cadastro() {
  const[inputName, setInputName] = useState("")
  const[inputAge, setInputAge] = useState("")
  const[inputEmail, setInputEmail] = useState("")
  const[users, setUsers] = useState([])

  function cadastrar(){
      let user = {
        id:Date.now(), 
        name: inputName,  
        age: inputAge,
        email: inputEmail
      }
      setUsers([user, ...users])
      
  }

  return (
    <>
      <div className='container'>
        <form>
          <h1>Cadastro de Usuários</h1>
          <input type="text" value={inputName} name='nome' placeholder='Nome' onChange={(e) => setInputName(e.target.value)}/>
          <input type="number" value={inputAge} name='idade' placeholder='Idade' onChange={(e) => setInputAge(e.target.value)} />
          <input type="email" value={inputEmail} name='email' placeholder='E-mail' onChange={(e) => setInputEmail(e.target.value)}/>
          <button type='button' onClick={cadastrar}>Cadastrar</button>
        </form>


        {users.map((p) => (
          <User key={p.id} name={p.name} age={p.age} email={p.email} id={p.id}/>
        ))}

      </div>

    </>
  )
}

export default Cadastro
