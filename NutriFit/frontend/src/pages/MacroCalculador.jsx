import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MacroCalculadora.css';
import Logo from '../components/Logo.jsx';

function MacroCalculador() {
  const [formData, setFormData] = useState({ alimento: '', gramas: '' });
  const [macros, setMacros] = useState([]);
  const [alimentos, setAlimentos] = useState([]);
  const [erro, setErro] = useState('');

  const totais = macros.reduce(
    (acc, item) => {
      acc.gramas += item.gramas;
      acc.calorias += item.calorias;
      acc.proteinas += item.proteinas;
      acc.carboidratos += item.carboidratos;
      acc.gorduras += item.gorduras;
      return acc;
    },
    { gramas: 0, calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 }
  );

  useEffect(() => {
    async function fetchAlimentos() {
      try {
        const res = await axios.get('http://localhost:3000/alimentos');
        setAlimentos(res.data);
      } catch (err) {
        console.error('Erro ao buscar alimentos:', err);
      }
    }
    fetchAlimentos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErro('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { alimento, gramas } = formData;

    const alimentoBase = alimentos.find(
      (item) => item.nome.toLowerCase() === alimento.toLowerCase()
    );

    if (!alimentoBase) {
      setErro('Alimento não encontrado!');
      return;
    }

    const fator = parseFloat(gramas) / alimentoBase.gramas;

    const macroCalculado = {
      id: Date.now(),
      nome: alimentoBase.nome,
      gramas: parseFloat(gramas),
      calorias: alimentoBase.calorias * fator,
      proteinas: alimentoBase.proteinas * fator,
      carboidratos: alimentoBase.carboidratos * fator,
      gorduras: alimentoBase.gorduras * fator
    };

    setMacros([...macros, macroCalculado]);
    setFormData({ alimento: '', gramas: '' });
  };

  const excluir = (id) => {
    setMacros(macros.filter(m => m.id !== id));
  };

  return (
    <div className="macro-container">
      <a href="/"><Logo /></a>
      <h1>Calculadora de Macronutrientes</h1>
      <h2>Digite o nome do alimento e a quantidade em gramas</h2>

      <form onSubmit={handleSubmit}>
        <label>Alimento:</label>
        <input
          type="text"
          name="alimento"
          value={formData.alimento}
          onChange={handleChange}
          required
        />

        <label>Gramas:</label>
        <input
          type="number"
          name="gramas"
          value={formData.gramas}
          onChange={handleChange}
          required
        />

        <button type="submit">Calcular</button>
      </form>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <table>
        <thead>
          <tr>
            <th>Alimento</th>
            <th>Gramas</th>
            <th>Calorias</th>
            <th>Proteínas</th>
            <th>Carboidratos</th>
            <th>Gorduras</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {macros.map((item) => (
            <tr key={item.id}>
              <td>{item.nome}</td>
              <td>{item.gramas.toFixed(1)}</td>
              <td>{item.calorias.toFixed(1)}</td>
              <td>{item.proteinas.toFixed(1)}</td>
              <td>{item.carboidratos.toFixed(1)}</td>
              <td>{item.gorduras.toFixed(1)}</td>
              <td><button onClick={() => excluir(item.id)}>Excluir</button></td>
            </tr>
          ))}
        </tbody>
        {macros.length > 0 && (
          <tfoot>
            <tr>
              <th>Total</th>
              <th>{totais.gramas.toFixed(1)}</th>
              <th>{totais.calorias.toFixed(1)}</th>
              <th>{totais.proteinas.toFixed(1)}</th>
              <th>{totais.carboidratos.toFixed(1)}</th>
              <th>{totais.gorduras.toFixed(1)}</th>
              <th></th>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default MacroCalculador;
