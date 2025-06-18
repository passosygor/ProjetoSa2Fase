import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Plano.css';

function Plano() {
  const [plano, setPlano] = useState(null);
  const [alimentos, setAlimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const idUsuario = usuarioLogado?.id_usuario;

  useEffect(() => {
    async function fetchDados() {
      try {
        const planoRes = await axios.get(`http://localhost:3000/planos/${idUsuario}`);
        setPlano(planoRes.data);

        const alimentosRes = await axios.get('http://localhost:3000/alimentos');
        setAlimentos(alimentosRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setErro('Erro ao buscar plano ou alimentos.');
        setLoading(false);
      }
    }
    
    if (idUsuario) {
      fetchDados();
    } else {
      setErro('Usuário não autenticado');
      setLoading(false);
    }
  }, [idUsuario]);

  function gerarCardapio() {
    if (!plano || alimentos.length === 0) return null;

    const metaCalorias = plano.calorias;
    const metaProteinas = Math.round((metaCalorias * 0.25) / 4);
    const metaCarboidratos = Math.round((metaCalorias * 0.50) / 4);
    const metaGorduras = Math.round((metaCalorias * 0.25) / 9);

    const resumo = alimentos.reduce((acc, alimento) => {
      acc.calorias += Number(alimento.calorias) || 0;
      acc.proteinas += Number(alimento.proteinas) || 0;
      acc.carboidratos += Number(alimento.carboidratos) || 0;
      acc.gorduras += Number(alimento.gorduras) || 0;
      return acc;
    }, { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });

    return (
      <div className="plano-dieta">
        <h2>Plano alimentar para {plano.objetivo.toLowerCase()}</h2>
        <p>Meta calórica diária: <strong>{metaCalorias} kcal</strong></p>
        <p><strong>Macronutrientes alvo:</strong></p>
        <ul>
          <li>Proteínas: {metaProteinas}g</li>
          <li>Carboidratos: {metaCarboidratos}g</li>
          <li>Gorduras: {metaGorduras}g</li>
        </ul>

        <h3>Lista sugerida de alimentos:</h3>
        <ul>
          {alimentos.map((item) => (
            <li key={item.id_alimento}>
              {item.nome} – {item.calorias} kcal, {item.proteinas}g P, {item.carboidratos}g C, {item.gorduras}g G
            </li>
          ))}
        </ul>

        <h4>Total atual da sugestão:</h4>
        <p>{resumo.calorias} kcal | {resumo.proteinas}g P | {resumo.carboidratos}g C | {resumo.gorduras}g G</p>
      </div>
    );
  }

  if (loading) return <p>Carregando plano...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className="plano-container">
      {gerarCardapio() || <p>Não foi possível gerar um plano alimentar.</p>}
    </div>
  );
}

export default Plano;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Plano.css'; // (crie um depois se quiser estilizar)

// function Plano() {
//   const [plano, setPlano] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [erro, setErro] = useState(null);

//   const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
//   const idUsuario = usuarioLogado?.id_usuario;

//   if (!idUsuario) {
//   console.error('ID do usuário não encontrado no localStorage');
//   return;
// }


//   useEffect(() => {
//     async function buscarPlano() {
//       try {
//         const res = await axios.get(`http://localhost:3000/planos/${idUsuario}`);
//         setPlano(res.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Erro ao buscar plano:', err);
//         setErro('Erro ao buscar plano alimentar');
//         setLoading(false);
//       }
//     }

//     buscarPlano();
//   }, []);

//   // Exemplo fictício de planos baseados em objetivo
//   function gerarCardapio(plano) {
//     if (plano.objetivo === 'ganho de massa') {
//       return planoGanhoDeMassa(plano.calorias);
//     } else if (plano.objetivo === 'perda de peso') {
//       return planoDeficit(plano.calorias);
//     } else {
//       return planoManutencao(plano.calorias);
//     }
//   }

//   function planoGanhoDeMassa(cal) {
//     return (
//       <div>
//         <h2>Plano alimentar para ganho de massa</h2>
//         <p>Meta calórica diária: <strong>{cal} kcal</strong></p>

//         <h3>Café da manhã</h3>
//         <ul>
//           <li>60g de aveia em flocos – 233 kcal</li>
//           <li>1 scoop de whey – 120 kcal</li>
//           <li>1 banana média – 100 kcal</li>
//           <li>1 colher sopa de pasta de amendoim – 94 kcal</li>
//           <li>250ml de leite desnatado – 113 kcal</li>
//         </ul>

//         <h3>Lanche da manhã</h3>
//         <ul>
//           <li>200g iogurte grego – 190 kcal</li>
//           <li>1 maçã média – 95 kcal</li>
//           <li>10g castanhas – 45 kcal</li>
//         </ul>

//         <h3>Almoço</h3>
//         <ul>
//           <li>200g peito de frango – 330 kcal</li>
//           <li>200g arroz integral – 260 kcal</li>
//           <li>200g batata-doce – 172 kcal</li>
//           <li>Salada + azeite – 119 kcal</li>
//           <li>100g feijão – 76 kcal</li>
//         </ul>

//         <h3>Jantar</h3>
//         <ul>
//           <li>150g salmão – 310 kcal</li>
//           <li>150g quinoa cozida – 180 kcal</li>
//           <li>200g batata inglesa – 172 kcal</li>
//           <li>100g legumes grelhados – 50 kcal</li>
//           <li>1 pera média – 95 kcal</li>
//         </ul>
//       </div>
//     );
//   }

//   function planoDeficit(cal) {
//     return (
//       <div>
//         <h2>Plano alimentar para perda de peso</h2>
//         <p>Meta calórica diária: <strong>{cal} kcal</strong></p>
//         <p>Aqui viria um cardápio com volume maior de fibras, menos gordura, mais saciedade e calorias reduzidas.</p>
//         {/* Lista de refeições */}
//       </div>
//     );
//   }

//   function planoManutencao(cal) {
//     return (
//       <div>
//         <h2>Plano alimentar para manutenção</h2>
//         <p>Meta calórica diária: <strong>{cal} kcal</strong></p>
//         <p>Cardápio equilibrado para manter peso.</p>
//         {/* Lista de refeições */}
//       </div>
//     );
//   }

//   if (loading) return <p>Carregando plano...</p>;
//   if (erro) return <p>{erro}</p>;

//   return (
//     <div className="plano-container">
//       {plano ? gerarCardapio(plano) : <p>Plano não encontrado.</p>}
//     </div>
//   );
// }

// export default Plano;
