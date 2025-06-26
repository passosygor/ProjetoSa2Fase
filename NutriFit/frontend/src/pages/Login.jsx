import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'
import Logo from '../components/Logo.jsx';

function Login() {
  const [Nome, setNome] = useState("")
  const [Senha, setSenha] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const resposta = await axios.post('http://localhost:3000/login', {
        email: Nome,
        senha: Senha
      })

      console.log('Login bem-sucedido!', resposta.data)
      localStorage.setItem('usuarioLogado', JSON.stringify(resposta.data.user)); //Salva o usuário no LocalStorage para ter acesso ao dashboard
      setShowModal(true)
      
    } catch (err) {
      console.error('Erro ao logar:', err)
      setShowErrorModal(true) // Mostra o modal de erro
    }
  }

  return (
    <>
      <div className='container'>

        {/* MODAL DE SUCESSO */}
        {showModal && (
          <div className="modal-sucesso">
            <div className="modal-conteudo">
              <h3>✅ Login realizado com sucesso!</h3>
              <button onClick={() => {
                setShowModal(false)
                navigate('/')
              }}>
                Prosseguir
              </button>
            </div>
          </div>
        )}

        {/* MODAL DE ERRO */}
        {showErrorModal && (
          <div className="modal-erro">
            <div className="modal-conteudo">
              <h3>❌ Usuário ou senha incorretos.</h3>
              <button onClick={() => setShowErrorModal(false)}>Tentar novamente</button>
            </div>
          </div>
        )}

        <div className='div-esquerda'>
          <div className='caixa-login'>
           <a href="/"><Logo /></a>
            <h2>Faça seu Login</h2>

            <form onSubmit={handleLogin}>
              <input
                type="text"
                value={Nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="E-mail"
                className='input-nome'
              />

              <input
                type="password"
                value={Senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                className='input-senha'
              />

              <br />

              <button type='submit' className='login'>Login</button>
              <div className='senha-esquecida'>
                <a href="http://localhost:5173/cadastro">
                  Ainda não tem cadastro? Registre-se! 
                  {/* Caso hospedar o site mudar o link! */}
                </a>
              </div>
            </form>
              
            {/* <div className='sem-senha2'>
              <b>Não possui uma conta?</b><br />
              <label>Entre em contato pelo e-mail suporte@nutrifit.com.br</label>
            </div> */}

          </div>
        </div>

        <div className='div-direita'></div>
      </div>
    </>
  )
}

export default Login
