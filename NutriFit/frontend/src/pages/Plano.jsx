import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Plano.css';
import Logo from '../components/Logo.jsx';

function Plano() {
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const idUsuario = usuarioLogado?.id_usuario;

  useEffect(() => {
    async function fetchPlano() {
      try {
        const response = await axios.get(`http://localhost:3000/planos/${idUsuario}`);
        setPlano(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.erro || err.message);
        setLoading(false);
      }
    }
    if (idUsuario) fetchPlano();
  }, [idUsuario]);

  const calcularTotais = (refeicao) => {
    if (!refeicao || !refeicao.length) return { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 };
    return refeicao.reduce((totais, item) => {
      const fator = item.quantidade / item.gramas;
      totais.calorias += item.calorias * fator;
      totais.proteinas += item.proteinas * fator;
      totais.carboidratos += item.carboidratos * fator;
      totais.gorduras += item.gorduras * fator;
      return totais;
    }, { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });
  };

  if (loading) return <div className="loading">Carregando plano...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="plano-container">
      {plano && (
        <>
          <a href="/" className="logo-link"><Logo /></a>
          <h2>Seu Plano Alimentar</h2>

          <div className="dados-usuario">
            <p><strong>Objetivo:</strong> {plano.objetivo}</p>
            <p><strong>Calorias diárias:</strong> {plano.calorias} kcal</p>
            <p><strong>IMC:</strong> {plano.imc}</p>
            {plano.alergias && <p><strong>Restrições:</strong> {plano.alergias}</p>}
          </div>

          {plano.cardapio && (
            <div className="cardapio">
              {['cafeDaManha', 'almoco', 'jantar'].map((refeicaoNome) => {
                const refeicaoMap = {
                  cafeDaManha: 'Café da Manhã',
                  almoco: 'Almoço',
                  jantar: 'Jantar'
                };
                const refeicao = plano.cardapio[refeicaoNome];
                const totais = calcularTotais(refeicao);
                return (
                  <div className="refeicao" key={refeicaoNome}>
                    <h3>{refeicaoMap[refeicaoNome]}</h3>
                    <ul>
                      {refeicao?.map((item, idx) => (
                        <li key={idx}>
                          <span>{item.quantidade}g de {item.nome}</span>
                          <span>{Math.round(item.calorias * (item.quantidade / item.gramas))} kcal</span>
                        </li>
                      ))}
                    </ul>
                    <div className="totais-refeicao">
                      <span>Calorias: <strong>{Math.round(totais.calorias)}</strong> kcal</span>
                      <span>Proteínas: <strong>{Math.round(totais.proteinas)}</strong> g</span>
                      <span>Carboidratos: <strong>{Math.round(totais.carboidratos)}</strong> g</span>
                      <span>Gorduras: <strong>{Math.round(totais.gorduras)}</strong> g</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button className="btn-voltar" onClick={() => window.location.href = '/'}>← Voltar</button>
        </>
      )}
    </div>
  );
}

export default Plano;
