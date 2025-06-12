import React, { useState, useEffect } from 'react';
import Contador from '../components/Contador';
import axios from 'axios';
import '../pages/Calculador.css';

function Calculador() {
  const [inputNome, setInputNome] = useState('');
  const [inputCaloria, setInputCaloria] = useState('');
  const [inputGramas, setInputGramas] = useState('');
  const [inputProteinas, setInputProteinas] = useState('');
  const [inputCarboidratos, setInputCarboidratos] = useState('');
  const [inputGorduras, setInputGorduras] = useState('');
  const [produtos, setProdutos] = useState([]);

  const API = 'http://localhost:3000';

  useEffect(() => {
    async function fetchAlimentos() {
      try {
        const res = await axios.get(`${API}/alimentos`);
        const listaFormatada = res.data.map(item => ({
          id: item.id_alimento,
          nome: item.nome,
          gramas: item.gramas,
          caloria: item.calorias,
          proteinas: item.proteinas,
          carboidratos: item.carboidratos,
          gorduras: item.gorduras
        }));
        setProdutos(listaFormatada);
      } catch (err) {
        console.error('Erro ao buscar alimentos:', err);
      }
    }
    fetchAlimentos();
  }, []);

  async function cadastrar() {
    if (!inputNome || !inputGramas || !inputCaloria || !inputProteinas || !inputCarboidratos || !inputGorduras) {
      alert('Preencha todos os campos antes de cadastrar!');
      return;
    }

    const novo = {
      nome: inputNome,
      gramas: Number(inputGramas),
      calorias: Number(inputCaloria),
      proteinas: Number(inputProteinas),
      carboidratos: Number(inputCarboidratos),
      gorduras: Number(inputGorduras)
    };

    try {
      const res = await axios.post(`${API}/alimentos`, novo);
      const criado = res.data;
      const alimentoFormatado = {
        id: criado.id_alimento,
        nome: criado.nome,
        gramas: criado.gramas,
        caloria: criado.calorias,
        proteinas: criado.proteinas,
        carboidratos: criado.carboidratos,
        gorduras: criado.gorduras
      };
      setProdutos([alimentoFormatado, ...produtos]);
      setInputNome('');
      setInputGramas('');
      setInputCaloria('');
      setInputProteinas('');
      setInputCarboidratos('');
      setInputGorduras('');
    } catch (err) {
      console.error('Erro ao cadastrar alimento:', err);
      alert('Não foi possível cadastrar. Tenta de novo.');
    }
  }

  return (
    <div className="container-app-calculador">
      <h1>Cadastro de Alimentos</h1>

      <div className="form-produto">
        <label>Nome</label>
        <input type="text" value={inputNome} onChange={(e) => setInputNome(e.target.value)} />

        <label>Quantidade (g)</label>
        <input type="number" value={inputGramas} onChange={(e) => setInputGramas(e.target.value)} />

        <label>Caloria</label>
        <input type="number" value={inputCaloria} onChange={(e) => setInputCaloria(e.target.value)} />

        <label>Proteínas (g)</label>
        <input type="number" value={inputProteinas} onChange={(e) => setInputProteinas(e.target.value)} />

        <label>Carboidratos (g)</label>
        <input type="number" value={inputCarboidratos} onChange={(e) => setInputCarboidratos(e.target.value)} />

        <label>Gorduras (g)</label>
        <input type="number" value={inputGorduras} onChange={(e) => setInputGorduras(e.target.value)} />

        <div className="botao">
          <button onClick={cadastrar}>Cadastrar</button>
        </div>
      </div>
    </div>
  );
}

export default Calculador;



// import React, { useState, useEffect } from 'react';
// import Contador from '../components/Contador';
// import axios from 'axios';
// import '../pages/Calculador.css';


// function Calculador() {
//   const [inputNome, setInputNome] = useState('');
//   const [inputCaloria, setInputCaloria] = useState('');
//   const [inputGramas, setInputGramas] = useState('');
//   const [produtos, setProdutos] = useState([]);

//   // URL base do back-end
//   const API = 'http://localhost:3000';

//   //  Carrega todos os alimentos do banco quando o componente monta
//   useEffect(() => {
//     async function fetchAlimentos() {
//       try {
//         const res = await axios.get(`${API}/alimentos`);
      
//         const listaFormatada = res.data.map(item => ({
//           id: item.id_alimento,
//           nome: item.nome,
//           gramas: item.gramas,
//           caloria: item.calorias,
//         }));
//         setProdutos(listaFormatada);
//       } catch (err) {
//         console.error('Erro ao buscar alimentos:', err);
//       }
//     }
//     fetchAlimentos();
//   }, []);

//   // Função pra cadastrar um novo alimento no banco e atualizar a lista
//   async function cadastrar() {
//     if (!inputNome || !inputGramas || !inputCaloria) {
//       alert('Preencha todos os campos antes de cadastrar!');  
//       return;
//     }

//     const novo = {
//       nome: inputNome,
//       gramas: Number(inputGramas),
//       calorias: Number(inputCaloria),
//     };

//     try {
//       const res = await axios.post(`${API}/alimentos`, {
//         nome: novo.nome,
//         gramas: novo.gramas,
//         calorias: novo.calorias,
        

        
//       });
//       // res.data é { id_alimento, nome, gramas, calorias }
//       const criado = res.data;
//       const alimentoFormatado = {
//         id: criado.id_alimento,
//         nome: criado.nome,
//         gramas: criado.gramas,
//         caloria: criado.calorias,
//       };
//       setProdutos([alimentoFormatado, ...produtos]);
//       setInputNome('');
//       setInputGramas('');
//       setInputCaloria('');
//       console.log('Alimento cadastrado com sucesso!', produtos.data);

//     } catch (err) {
//       console.error('Erro ao cadastrar alimento:', err);
//       alert('Não foi possível cadastrar. Tenta de novo.');
//     }
//   }

//   return (
//     <div className="container-app-calculador">
//       <h1>Cadastro de Alimentos</h1>

//       <div className="form-produto">
//         <label>Nome</label>
//         <input
//           type="text"
//           value={inputNome}
//           onChange={(e) => setInputNome(e.target.value)}
//         />

//         <label>Quantidade (g)</label>
//         <input
//           type="number"
//           value={inputGramas}
//           onChange={(e) => setInputGramas(e.target.value)}
//         />

//         <label>Caloria</label>
//         <input
//           type="number"
//           value={inputCaloria}
//           onChange={(e) => setInputCaloria(e.target.value)}
//         />

//         <div className="botao">
//           <button onClick={cadastrar}>Cadastrar</button>
//         </div>
//       </div>


//     </div>
//   );
// }

// export default Calculador;

