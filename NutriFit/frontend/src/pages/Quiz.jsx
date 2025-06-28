// Quiz.jsx
import React, { useState } from 'react';
import './Quiz.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';

function Quiz() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1);
  const [formData, setFormData] = useState({
    idade: '',
    sexo: '',
    altura: '',
    peso: '',
    objetivo: '',
    atividade: '',
    condicoes: '',
    alergias: '',
  });
  const [resumo, setResumo] = useState(null);

  const handleChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const calcularIMC = () => {
    const alturaM = formData.altura / 100;
    return (formData.peso / (alturaM * alturaM));
  };

  const gerarPlano = async () => {
    const alturaM = formData.altura / 100;
    const imc = (formData.peso / (alturaM * alturaM));
    let calorias = 2000;

    if (formData.objetivo === 'perda de peso') calorias = 1800;
    else if (formData.objetivo === 'ganho de massa') calorias = 2500;

    const user = JSON.parse(localStorage.getItem('usuarioLogado'));

    const plano = {
      id_usuario: user.id_usuario,
      ...formData,
      imc,
      calorias
    };
    console.log(plano);
    

    try {
      await axios.post('http://localhost:3000/planos', plano);
      setResumo(plano);
    } catch (err) {
      console.error('Erro ao salvar plano:', err);
    }
  };

  const proxima = () => setEtapa(etapa + 1);
  const voltar = () => setEtapa(etapa - 1);
  const concluirProcesso = () => navigate('/planoalimentar');

  return (
    <div className="wrapper">
      <div className="quiz-container">
        {etapa === 1 && (
          <div className="quiz-card">
           <a href="/"><Logo /></a>
            <h2>Informe seus dados</h2>
            <input type="number" placeholder="Idade" value={formData.idade} onChange={(e) => handleChange('idade', e.target.value)} />
            <select value={formData.sexo} onChange={(e) => handleChange('sexo', e.target.value)}>
              <option value="">Sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
            <input type="number" placeholder="Altura (cm)" value={formData.altura} onChange={(e) => handleChange('altura', e.target.value)} />
            <input type="number" placeholder="Peso (kg)" value={formData.peso} onChange={(e) => handleChange('peso', e.target.value)} />
            <button onClick={proxima} className='buttonNext' disabled={!formData.idade || !formData.sexo || !formData.altura || !formData.peso}>Avançar</button>
          </div>
        )}

        {etapa === 2 && (
          <div className="quiz-card">
            <h2>Qual é o seu objetivo?</h2>
            <div className="quiz-options">
              {[{ label: 'Ganho de massa magra', value: 'ganho de massa' }, { label: 'Perder Peso', value: 'perda de peso' }, { label: 'Ganhar Peso', value: 'ganho de massa' }].map((opt) => (
                <button key={opt.label} className={formData.objetivo === opt.value ? 'selected' : ''} onClick={() => handleChange('objetivo', opt.value)}>{opt.label}</button>
              ))}
            </div>
            <div className="nav-buttons">
              <button onClick={voltar}>Voltar</button>
              <button onClick={proxima} disabled={!formData.objetivo}>Avançar</button>
            </div>
          </div>
        )}

        {etapa === 3 && (
          <div className="quiz-card">
            <h2>Nível de atividade física</h2>
            <div className="quiz-options">
              {['Sedentário', 'Levemente ativo', 'Moderadamente ativo', 'Altamente ativo'].map((opt) => (
                <button key={opt} className={formData.atividade === opt ? 'selected' : ''} onClick={() => handleChange('atividade', opt)}>{opt}</button>
              ))}
            </div>
            <div className="nav-buttons">
              <button onClick={voltar}>Voltar</button>
              <button onClick={proxima} disabled={!formData.atividade}>Avançar</button>
            </div>
          </div>
        )}

        {etapa === 4 && (
          <div className="quiz-card">
            <h2>Você tem alguma condição crônica?</h2>
            <div className="quiz-options">
              {['Diabetes', 'Hipertensão', 'Dislipidemias', 'Nenhuma'].map((opt) => (
                <button key={opt} className={formData.condicoes === opt ? 'selected' : ''} onClick={() => handleChange('condicoes', opt)}>{opt}</button>
              ))}
            </div>
            <div className="nav-buttons">
              <button onClick={voltar}>Voltar</button>
              <button onClick={proxima} disabled={!formData.condicoes}>Avançar</button>
            </div>
          </div>
        )}

        {etapa === 5 && (
          <div className="quiz-card">
            <h2>Tem alguma alergia ou intolerância?</h2>
            <div className="quiz-options">
              {['Glúten', 'Lactose', 'Nenhuma'].map((opt) => (
                <button key={opt} className={formData.alergias === opt ? 'selected' : ''} onClick={() => handleChange('alergias', opt)}>{opt}</button>
              ))}
            </div>
            <div className="nav-buttons">
              <button onClick={voltar}>Voltar</button>
              <button onClick={() => { gerarPlano(); proxima(); }} disabled={!formData.alergias}>Finalizar</button>
            </div>
          </div>
        )}

        {etapa === 6 && resumo && (
          <div className="quiz-card resultado">
            <h2>Plano Alimentar Quase Completo!</h2>
            <p><strong>IMC:</strong> {resumo.imc}</p>
            <p><strong>Objetivo:</strong> {resumo.objetivo}</p>
            <p><strong>Calorias sugeridas:</strong> {resumo.calorias} kcal</p>
            <button className='buttonNext' onClick={concluirProcesso}>Concluir Processo</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;



// import React, { useState } from 'react';
// import './Quiz.css';
// import axios from 'axios';
// import { func } from 'prop-types';
// import { useNavigate } from 'react-router-dom';

// function Quiz() {

// function concluirProcesso(){
//   navigate('/planoalimentar')
// }
//   const navigate = useNavigate(null)
//   const [etapa, setEtapa] = useState(1);
//   const [formData, setFormData] = useState({
//     idade: '',
//     sexo: '',
//     altura: '',
//     peso: '',
//     objetivo: '',
//     atividade: '',
//     condicoes: '',
//     alergias: '',
//   });
//   const [resumo, setResumo] = useState(null);

//   const handleChange = (campo, valor) => {
//     setFormData({ ...formData, [campo]: valor });
//   };

//   const calcularIMC = () => {
//     const alturaM = formData.altura / 100;
//     return (formData.peso / (alturaM * alturaM)).toFixed(2);
//   };


//   const gerarPlano = async () => {
//   const alturaM = formData.altura / 100;
//   const imc = (formData.peso / (alturaM * alturaM)).toFixed(2);
//   let calorias = 2000;

//   if (formData.objetivo === 'Perder Peso') calorias = 1800;
//   else if (formData.objetivo === 'Ganho de massa magra') calorias = 2500;
//   else if (formData.objetivo === 'Ganhar Peso') calorias = 2800;

//   const user = JSON.parse(localStorage.getItem('usuarioLogado'));

//   const plano = {
//     id_usuario: user.id_usuario,
//     ...formData,
//     imc,
//     calorias
//   };

//   try {
//     await axios.post('http://localhost:3000/planos', plano); // ou a rota do seu backend
//     setResumo(plano);
//   } catch (err) {
//     console.error('Erro ao salvar plano:', err);
//   }
// };

// //ACIMA TESTE

//   const proxima = () => setEtapa(etapa + 1);
//   const voltar = () => setEtapa(etapa - 1);

//   return (
//     <div className="wrapper">
//       <div className="quiz-container">
//         {etapa === 1 && (
//           <div className="quiz-card">
//             <h2>Informe seus dados <br /> para obtermos o melhor para você!</h2>
//             <input type="number" placeholder="Idade" value={formData.idade} onChange={(e) => handleChange('idade', e.target.value)} />
//             <select value={formData.sexo} onChange={(e) => handleChange('sexo', e.target.value)}>
//               <option value="">Sexo</option>
//               <option value="Masculino">Masculino</option>
//               <option value="Feminino">Feminino</option>
//             </select>
//             <input type="number" placeholder="Altura (cm)" value={formData.altura} onChange={(e) => handleChange('altura', e.target.value)} />
//             <input type="number" placeholder="Peso (kg)" value={formData.peso} onChange={(e) => handleChange('peso', e.target.value)} />
//             <button onClick={proxima} className='buttonNext' disabled={!formData.idade || !formData.sexo || !formData.altura || !formData.peso}>Avançar</button>
//           </div>
//         )}

//         {etapa === 2 && (
//           <div className="quiz-card">
//             <h2>Qual é o seu objetivo?</h2>
//             <div className="quiz-options">
//               {['Ganho de massa magra', 'Perder Peso', 'Ganhar Peso'].map((opt) => (
//                 <button key={opt} className={formData.objetivo === opt ? 'selected' : ''} onClick={() => handleChange('objetivo', opt)}>{opt}</button>
//               ))}
//             </div>
//             <div className="nav-buttons">
//               <button onClick={voltar}>Voltar</button>
//               <button onClick={proxima} disabled={!formData.objetivo}>Avançar</button>
//             </div>
//           </div>
//         )}

//         {etapa === 3 && (
//           <div className="quiz-card">
//             <h2>Nível de atividade física</h2>
//             <div className="quiz-options">
//               {['Sedentário', 'Levemente ativo', 'Moderadamente ativo', 'Altamente ativo'].map((opt) => (
//                 <button key={opt} className={formData.atividade === opt ? 'selected' : ''} onClick={() => handleChange('atividade', opt)}>{opt}</button>
//               ))}
//             </div>
//             <div className="nav-buttons">
//               <button onClick={voltar}>Voltar</button>
//               <button onClick={proxima} disabled={!formData.atividade}>Avançar</button>
//             </div>
//           </div>
//         )}

//         {etapa === 4 && (
//           <div className="quiz-card">
//             <h2>Você tem alguma condição crônica?</h2>
//             <div className="quiz-options">
//               {['Diabetes', 'Hipertensão', 'Dislipidemias', 'Nenhuma'].map((opt) => (
//                 <button key={opt} className={formData.condicoes === opt ? 'selected' : ''} onClick={() => handleChange('condicoes', opt)}>{opt}</button>
//               ))}
//             </div>
//             <div className="nav-buttons">
//               <button onClick={voltar}>Voltar</button>
//               <button onClick={proxima} disabled={!formData.condicoes}>Avançar</button>
//             </div>
//           </div>
//         )}

//         {etapa === 5 && (
//           <div className="quiz-card">
//             <h2>Tem alguma alergia ou intolerância?</h2>
//             <div className="quiz-options">
//               {['Glúten', 'Lactose', 'Nenhuma'].map((opt) => (
//                 <button key={opt} className={formData.alergias === opt ? 'selected' : ''} onClick={() => handleChange('alergias', opt)}>{opt}</button>
//               ))}
//             </div>
//             <div className="nav-buttons">
//               <button onClick={voltar}>Voltar</button>
//               <button onClick={() => { gerarPlano(); proxima(); }} disabled={!formData.alergias}>Finalizar</button>
//             </div>
//           </div>
//         )}

//         {etapa === 6 && resumo && (
//           <div className="quiz-card resultado">
//             <h2>Plano Alimentar Quase Completo!</h2>
//             <h3>Suas informações:</h3> <br />
//             <p><strong>IMC:</strong> {resumo.imc}</p>
//             <p><strong>Objetivo:</strong> {resumo.objetivo}</p>
//             <p><strong>Calorias sugeridas:</strong> {resumo.calorias} kcal</p>
//             <p><strong>Atividade:</strong> {resumo.atividade}</p>
//             <p><strong>Condições:</strong> {resumo.condicoes}</p>
//             <p><strong>Alergias:</strong> {resumo.alergias}</p> <br />
//             <button onClick={concluirProcesso} className='concluirProcesso'>Concluir Processo</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Quiz;
