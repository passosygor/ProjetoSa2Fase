
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Header from '../components/Header.jsx';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editando, setEditando] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState('');
  const [novoEmail, setNovoEmail] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [showSuccessEditModal, setShowSuccessEditModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
      const userObj = JSON.parse(usuarioSalvo);
      setUser(userObj);
      setNovoUsuario(userObj.usuario);
      setNovoEmail(userObj.email);
    }
  }, []);

  const handleSalvarEdicao = async () => {
    try {
      const resposta = await fetch(`http://localhost:3000/usuarios/${user.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuario: novoUsuario,
          email: novoEmail,
          senha: user.senha
        })
      });

      if (resposta.ok) {
        const usuarioAtualizado = {
          ...user,
          usuario: novoUsuario,
          email: novoEmail
        };
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
        setUser(usuarioAtualizado);
        setEditando(false);
        setShowSuccessEditModal(true);
      } else {
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error('Erro:', err);
      setShowErrorModal(true);
    }
  };

  const confirmarExclusao = async () => {
    try {
      const resposta = await fetch(`http://localhost:3000/usuarios/${user.id_usuario}`, {
        method: 'DELETE'
      });

      if (resposta.ok) {
        localStorage.removeItem('usuarioLogado');
        setShowConfirmModal(false);
        setShowDeletedModal(true);
      } else {
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error('Erro:', err);
      setShowErrorModal(true);
    }
  };

  const handleSair = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  if (!user) {
    return <h2 className="erro">Usuário não encontrado. Faça login novamente.</h2>;
  }

  return (
    <>
    <Header />
      <div className="dashboard-bg">
      <div className="dashboard-card">
        {editando ? (
          <>
            <h2>Editar Informações</h2>
            <input
              type="text"
              value={novoUsuario}
              onChange={(e) => setNovoUsuario(e.target.value)}
              placeholder="Novo nome de usuário"
            />
            <input
              type="email"
              value={novoEmail}
              onChange={(e) => setNovoEmail(e.target.value)}
              placeholder="Novo email"
            />
            <button onClick={handleSalvarEdicao}>Salvar</button>
            <button onClick={() => setEditando(false)}>Cancelar</button>
          </>
        ) : (
          <>
            <h1>Bem-vindo, {user.usuario}</h1>
            <p>Email: {user.email}</p>

            <div className="dashboard-actions">
              <button onClick={() => setEditando(true)}>Editar Conta</button>
              <button onClick={() => setShowConfirmModal(true)} className="excluir">Excluir Conta</button>
              <button onClick={() => navigate('/')}>Voltar à Home</button>
              <button onClick={handleSair}>Sair</button>
            </div>
          </>
        )}
      </div>

      {/* Modal de sucesso edição */}
      {showSuccessEditModal && (
        <div className="modal-sucesso">
          <div className="modal-conteudo">
            <h3>✅ Dados atualizados com sucesso!</h3>
            <button onClick={() => setShowSuccessEditModal(false)}>OK</button>
          </div>
        </div>
      )}

      {/* Modal de erro */}
      {showErrorModal && (
        <div className="modal-erro">
          <div className="modal-conteudo">
            <h3>❌ Ocorreu um erro. Tente novamente.</h3>
            <button onClick={() => setShowErrorModal(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {showConfirmModal && (
        <div className="modal-erro">
          <div className="modal-conteudo">
            <h3>⚠️ Tem certeza que deseja excluir sua conta?</h3>
            <button onClick={confirmarExclusao}>Sim, excluir</button>
            <button onClick={() => setShowConfirmModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal de sucesso após exclusão */}
      {showDeletedModal && (
        <div className="modal-sucesso">
          <div className="modal-conteudo">
            <h3>✅ Conta excluída com sucesso!</h3>
            <button onClick={() => {
              setShowDeletedModal(false);
              navigate('/login');
            }}>
              Voltar ao Login
            </button>
          </div>
        </div>
      )}
    </div>
  </>);
}

export default Dashboard;
