import { useState } from 'react'
import './Cadastro.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom' // <-- IMPORTANTE
// import User from '../components/User'


// PRIMEIRO LINK COM BDD, USAR DE REF

// TODA VEZ QUE RODAR TEM QUE COLOCAR NO CONSOLE " npx nodemon server.js "!!!!!!!!!!

//PARA DELETAR NO BANCO DE DADOS VIA COPILOT, EX: DELETE  => http://localhost:3000/usuarios/25


function Cadastro() {
  const [inputName, setInputName] = useState("")
  const [inputEmail, setInputEmail] = useState("")  //Teste Back
  const [inputSenha, setInputSenha] = useState("")
  const [users, setUsers] = useState([])

  const navigate = useNavigate(); // <-- CRIA O HOOK

  const handleSubmit = async (e) => {
    e.preventDefault();

    try { 
      const resposta = await axios.post('http://localhost:3000/usuarios', {
        usuario: inputName,
        email: inputEmail,
        senha: inputSenha
      });

      // Limpa os campos depois do envio
      setInputName('');
      setInputEmail('');
      setInputSenha('');

      // Atualiza a lista de usuários, se quiser exibir algo depois
      setUsers([...users, resposta.data]);

      console.log('Usuário cadastrado com sucesso!', resposta.data);

      navigate('/Login');

    } catch (err) {
      console.error('Erro ao cadastrar usuário:', err);
    }
  };


  function cadastrar() {
    let user = {
      id: Date.now(),
      name: inputName,
      senha: inputSenha
    }
    setUsers([user, ...users])

  }

  return (


    <div className='container-geral'>

  
      <div className='div-esquerdaa'>

        <div className='caixote-cadastro'>

          <h2>Cadastro de Usuários</h2>

          <form onSubmit={handleSubmit}>

            <input type="text" value={inputEmail}
              name='nome' placeholder='E-mail'
              onChange={(e) => setInputEmail(e.target.value)}
              className='cadastro-email' />

            <input type="text" value={inputName}
              name='nome' placeholder='Nome'
              onChange={(e) => setInputName(e.target.value)}
              className='cadastro-usuario' />

            <input type="password" value={inputSenha}
              name='senha' placeholder='Senha'
              onChange={(e) => setInputSenha(e.target.value)}
              className='cadastro-senha' />

           <button type='submit' className='botao-cadastro'>Cadastrar</button>

             <div className='senha-esquecida2'>
                <a href="http://localhost:5173/login">
                  Já possui cadastro?
                </a>
              </div>


          </form>
        </div>

        {/* COMANDO ABAIXO PARA MOSTRAR O QUE FOI DIGITADO NOS INPUTS, COM O LINK BACK END NÃO É MAIS NECESSÁRIO */}
        
        {/* {users.map((p) => (
          <User key={p.id_usuario} name={p.usuario} senha={p.senha} id={p.id_usuario} />
        ))} */}


      </div>

      <div className='div-direitaa'>

      </div>

    </div>


  )
}

export default Cadastro


