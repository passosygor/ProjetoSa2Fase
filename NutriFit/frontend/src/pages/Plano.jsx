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
        {console.log(response.data)}
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.erro || err.message);
        setLoading(false);
      }
    }

    if (idUsuario) fetchPlano();
  }, [idUsuario]);

  const calcularTotais = (refeicao) => {
    if (!refeicao || !refeicao.length) return {};
    return refeicao.reduce((totais, item) => {
      const fator = item.quantidade / item.gramas;
      totais.calorias += item.calorias * fator;
      totais.proteinas += item.proteinas * fator;
      totais.carboidratos += item.carboidratos * fator;
      totais.gorduras += item.gorduras * fator;
      return totais;
    }, { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });
  };

  if (loading) return <div>Carregando plano...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="plano-container">
      {plano && (
        <>
             <a href="/"><Logo /></a>
          <h2>Seu Plano Alimentar</h2>
          
          <div className="dados-usuario">
            <p><strong>Objetivo:</strong> {plano.objetivo}</p>
            <p><strong>Calorias diárias:</strong> {plano.calorias} kcal</p>
            <p><strong>IMC:</strong> {plano.imc}</p>
            {plano.alergias && <p><strong>Restrições:</strong> {plano.alergias}</p>}
          </div>

          {plano.cardapio && (
            <div className="cardapio">
              <div className="refeicao">
                <h3>Café da Manhã</h3>
                <ul>
                  {plano.cardapio.cafeDaManha?.map((item, index) => (
                    <li key={index}>
                      {item.quantidade}g de {item.nome} - {Math.round(item.calorias * (item.quantidade / item.gramas))} kcal
                    </li>
                  ))}
                </ul>
                <div className="totais-refeicao">
                  {Object.entries(calcularTotais(plano.cardapio.cafeDaManha)).map(([key, value]) => (
                    <span key={key}>{key}: {Math.round(value)} </span>
                  ))}
                </div>
              </div>

              <div className="refeicao">
                <h3>Almoço</h3>
                {console.log(plano.cardapio.almoco)}
                <ul>
                  {plano.cardapio.almoco?.map((item, index) => (
                    <li key={index}> {console.log(item)}
                      {item.quantidade}g de {item.nome} - {Math.round(item.calorias * (item.quantidade / item.gramas))} kcal
                    </li>
                  ))}
                </ul>
                <div className="totais-refeicao">
                  {Object.entries(calcularTotais(plano.cardapio.almoco)).map(([key, value]) => (
                    <span key={key}>{key}: {Math.round(value)} </span>
                  ))}
                </div>
              </div>

              <div className="refeicao">
                <h3>Jantar</h3>
                <ul>
                  {plano.cardapio.jantar?.map((item, index) => (
                    <li key={index}>
                      {item.quantidade}g de {item.nome} - {Math.round(item.calorias * (item.quantidade / item.gramas))} kcal
                    </li>
                  ))}
                </ul>
                <div className="totais-refeicao">
                  {Object.entries(calcularTotais(plano.cardapio.jantar)).map(([key, value]) => (
                    <span key={key}>{key}: {Math.round(value)} </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Plano;