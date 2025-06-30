// Quiz.jsx melhorado e corrigido

import React, { useState, useEffect } from 'react';
import './Quiz.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import confetti from 'canvas-confetti';

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

  const etapasTotais = 6;

  const handleChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const gerarPlano = async () => {
    const alturaM = formData.altura / 100;
    const imc = formData.peso / (alturaM * alturaM);
    let calorias = 2000;
    if (formData.objetivo === 'perda_de_peso') calorias = 1800;
    else if (formData.objetivo === 'ganho_de_massa_magra' || formData.objetivo === 'ganho_de_peso')
      calorias = 2500;

    const user = JSON.parse(localStorage.getItem('usuarioLogado'));

    const plano = {
      id_usuario: user.id_usuario,
      ...formData,
      imc,
      calorias,
    };

    try {
      await axios.post('http://localhost:3000/planos', plano);
      setResumo(plano);
    } catch (err) {
      console.error('Erro ao salvar plano:', err);
    }
  };

  // Função para finalizar, aguarda salvar e só depois avança a etapa
  const finalizar = async () => {
    await gerarPlano();
    setEtapa(etapa + 1);
  };

  useEffect(() => {
    if (etapa === 6 && resumo) {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
    }
  }, [etapa, resumo]);

  const frases = {
    1: 'Vamos começar com algumas informações básicas para personalizar seu plano 📝',
    2: 'Qual é seu foco? Tudo começa com um objetivo claro 🎯',
    3: 'Nos diga como é sua rotina física 💪',
    4: 'Precisamos saber se você possui alguma condição específica 🩺',
    5: 'Nos avise sobre restrições alimentares ⚠️',
    6: 'Tudo pronto! Veja o resultado final 📋',
  };

  const proxima = () => setEtapa(etapa + 1);
  const voltar = () => setEtapa(etapa - 1);
  const concluirProcesso = () => navigate('/planoalimentar');

  return (
    <div className="wrapper">
      <div className="quiz-container">
        {/* Barra de Progresso */}
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(etapa / etapasTotais) * 100}%` }}></div>
        </div>

        {/* Texto motivacional */}
        <p className="quiz-intro">{frases[etapa]}</p>

        {/* Etapas */}
        <div className="quiz-card fade-in">
          {etapa === 1 && (
            <>
              <a href="/">
                <Logo />
              </a>
              <h2>🧠 Informe seus dados</h2>
              <label className="quiz-label">👶 Idade</label>
              <input
                type="number"
                placeholder="Ex: 25"
                value={formData.idade}
                onChange={(e) => handleChange('idade', e.target.value)}
              />
              <label className="quiz-label">🚻 Sexo</label>
              <select value={formData.sexo} onChange={(e) => handleChange('sexo', e.target.value)}>
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
              <label className="quiz-label">📏 Altura (cm)</label>
              <input
                type="number"
                placeholder="Ex: 170"
                value={formData.altura}
                onChange={(e) => handleChange('altura', e.target.value)}
              />
              <label className="quiz-label">⚖️ Peso (kg)</label>
              <input
                type="number"
                placeholder="Ex: 65"
                value={formData.peso}
                onChange={(e) => handleChange('peso', e.target.value)}
              />
              <button
                className="buttonNext"
                onClick={proxima}
                disabled={!formData.idade || !formData.sexo || !formData.altura || !formData.peso}
              >
                Avançar
              </button>
            </>
          )}

          {etapa === 2 && (
            <>
              <h2>🎯 Qual é o seu objetivo?</h2>
              <div className="quiz-options">
                {[
                  { label: '💪 Ganho de massa magra', value: 'ganho_de_massa_magra' },
                  { label: '⚖️ Perder Peso', value: 'perda_de_peso' },
                  { label: '🍔 Ganhar Peso', value: 'ganho_de_peso' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={formData.objetivo === opt.value ? 'selected' : ''}
                    onClick={() => handleChange('objetivo', opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="nav-buttons">
                <button onClick={voltar}>Voltar</button>
                <button onClick={proxima} disabled={!formData.objetivo}>
                  Avançar
                </button>
              </div>
            </>
          )}

          {etapa === 3 && (
            <>
              <h2>🏃‍♂️ Nível de atividade física</h2>
              <div className="quiz-options">
                {[
                  '🛋️ Sedentário',
                  '🚶 Levemente ativo',
                  '🏃 Moderadamente ativo',
                  '🏋️ Altamente ativo',
                ].map((opt) => (
                  <button
                    key={opt}
                    className={formData.atividade === opt ? 'selected' : ''}
                    onClick={() => handleChange('atividade', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="nav-buttons">
                <button onClick={voltar}>Voltar</button>
                <button onClick={proxima} disabled={!formData.atividade}>
                  Avançar
                </button>
              </div>
            </>
          )}

          {etapa === 4 && (
            <>
              <h2>🩺 Condições crônicas?</h2>
              <div className="quiz-options">
                {['🩸 Diabetes', '💓 Hipertensão', '🧬 Dislipidemias', '✅ Nenhuma'].map((opt) => (
                  <button
                    key={opt}
                    className={formData.condicoes === opt ? 'selected' : ''}
                    onClick={() => handleChange('condicoes', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="nav-buttons">
                <button onClick={voltar}>Voltar</button>
                <button onClick={proxima} disabled={!formData.condicoes}>
                  Avançar
                </button>
              </div>
            </>
          )}

          {etapa === 5 && (
            <>
              <h2>⚠️ Alergias ou intolerâncias?</h2>
              <div className="quiz-options">
                {['🌾 Glúten', '🥛 Lactose', '❌ Nenhuma'].map((opt) => (
                  <button
                    key={opt}
                    className={formData.alergias === opt ? 'selected' : ''}
                    onClick={() => handleChange('alergias', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="nav-buttons">
                <button onClick={voltar}>Voltar</button>
                <button onClick={finalizar} disabled={!formData.alergias}>
                  Finalizar
                </button>
              </div>
            </>
          )}

          {etapa === 6 && resumo && (
            <>
              <h2>🎉 Resultado Final</h2>
              <p>
                <strong>IMC:</strong> {resumo.imc.toFixed(2)}
              </p>
              <p>
                <strong>Objetivo:</strong> {resumo.objetivo.replace(/_/g, ' ')}
              </p>
              <p>
                <strong>Calorias sugeridas:</strong> {resumo.calorias} kcal
              </p>
              <button className="buttonNext" onClick={concluirProcesso}>
                Concluir Processo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
