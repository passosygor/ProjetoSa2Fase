import { useState } from 'react'
import './Cadastro.css'
import User from '../components/User'


function Cadastro() {
  const[inputName, setInputName] = useState("")
  // const[inputAge, setInputAge] = useState("")
  const[inputSenha, setInputSenha] = useState("")
  const[users, setUsers] = useState([])

  function cadastrar(){
      let user = {
        id:Date.now(), 
        name: inputName,  
        senha: inputSenha
      }
      setUsers([user, ...users])
      
  }

  return (
    <>

    <div className='container-geral'>

    <div className='div-esquerdaa'>

        <div className='caixote-cadastro'>

          <h2>Cadastro de Usuários</h2>

          <input type="text" value={inputName} 
          name='nome' placeholder='Nome' 
          onChange={(e) => setInputName(e.target.value)}
          className='cadastro-usuario'/>

          <input type="password" value={inputSenha} 
          name='senha' placeholder='senha' 
          onChange={(e) => setInputSenha(e.target.value)}
          className='cadastro-senha'/>

          <button type='button' className='botao-cadastro' onClick={cadastrar}>Cadastrar</button>

          </div>


        {users.map((p) => (
          <User key={p.id} name={p.name}  senha={p.senha} id={p.id}/>
        ))}

    </div>

      <div className='div-direitaa'>
 
      </div>

      </div>

    </>
  )
}

export default Cadastro
