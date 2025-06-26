import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MacroCalculadora.css';
import Logo from '../components/Logo.jsx';

function MacroCalculador() {
  const [macros, setMacros] = useState([]);
  const [formData, setFormData] = useState({
    alimento: '',
    gramas: '',
    caloria: '',
    proteina: '',
    carbo: '',
    gordura: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [alimentoToDelete, setAlimentoToDelete] = useState('');

  // 🧮 Cálculo dos totais
  const totais = macros.reduce(
    (acc, item) => {
      acc.gramas += Number(item.gramas) || 0;
      acc.calorias += Number(item.caloria) || 0;
      acc.proteinas += Number(item.proteina) || 0;
      acc.carboidratos += Number(item.carbo) || 0;
      acc.gorduras += Number(item.gordura) || 0;
      return acc;
    },
    { gramas: 0, calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 }
  );

  useEffect(() => {
    async function fetchAlimentos() {
      try {
        const res = await axios.get('http://localhost:3000/alimentos');
        const dados = res.data.map(item => ({
          id: item.id_alimento,
          alimento: item.nome,
          gramas: item.gramas,
          caloria: item.calorias,
          proteina: item.proteinas,
          carbo: item.carboidratos,
          gordura: item.gorduras
        }));
        setMacros(dados);
      } catch (err) {
        console.error('Erro ao buscar alimentos:', err);
      }
    }
    fetchAlimentos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { alimento, gramas, caloria, proteina, carbo, gordura } = formData;
    try {
      const res = await axios.post('http://localhost:3000/alimentos', {
        nome: alimento,
        gramas: parseFloat(gramas),
        calorias: parseFloat(caloria),
        proteinas: parseFloat(proteina),
        carboidratos: parseFloat(carbo),
        gorduras: parseFloat(gordura)
      });
      const novoMacro = {
        id: res.data.id_alimento,
        alimento: res.data.nome,
        gramas: res.data.gramas,
        caloria: res.data.calorias,
        proteina: res.data.proteinas,
        carbo: res.data.carboidratos,
        gordura: res.data.gorduras
      };
      setMacros([...macros, novoMacro]);
      setFormData({ alimento: '', gramas: '', caloria: '', proteina: '', carbo: '', gordura: '' });
      setModalVisible(true);
    } catch (err) {
      console.error('Erro ao cadastrar alimento:', err);
    }
  };

  const confirmarExclusao = async () => {
    try {
      await axios.delete(`http://localhost:3000/alimentos/${itemToDelete}`);
      setMacros(macros.filter(m => m.id !== itemToDelete));
      setDeleteModalVisible(false);
      setItemToDelete(null);
      setAlimentoToDelete('');
    } catch (err) {
      console.error('Erro ao excluir alimento:', err);
    }
  };

  return (
    <div className="macro-container">
           <a href="/"><Logo /></a>
      <h1>Calculadora de Macronutrientes</h1>
      <h2>Use a ferramenta para manter controle sobre seus macronutrientes e alcançar seu objetivo!</h2>

      <form onSubmit={handleSubmit}>
        {['alimento', 'gramas', 'caloria', 'proteina', 'carbo', 'gordura'].map((field) => (
          <div key={field}>
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={field === 'alimento' ? 'text' : 'number'}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Adicionar</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Alimento</th>
            <th>Gramas {Number(totais.gramas).toFixed(1)} g</th>
            <th>Calorias {Number(totais.calorias).toFixed(1)} kcal</th>
            <th>Proteínas {Number(totais.proteinas).toFixed(1)} g</th>
            <th>Carboidratos {Number(totais.carboidratos).toFixed(1)} g</th>
            <th>Gorduras {Number(totais.gorduras).toFixed(1)} g</th>
            <th>Exclusão</th>
          </tr>
        </thead>
        <tbody>
          {macros.map((macro) => (
            <tr key={macro.id}>
              <td>{macro.alimento}</td>
              <td>{macro.gramas}</td>
              <td>{macro.caloria}</td>
              <td>{macro.proteina}</td>
              <td>{macro.carbo}</td>
              <td>{macro.gordura}</td>
              <td>
                <button
                  onClick={() => {
                    setItemToDelete(macro.id);
                    setAlimentoToDelete(macro.alimento);
                    setDeleteModalVisible(true);
                  }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de sucesso */}
      {modalVisible && (
        <div className="modal" onClick={() => setModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
            <p>✅ Alimento cadastrado com sucesso</p>
          </div>
        </div>
      )}

      {/* Modal de exclusão */}
      {deleteModalVisible && (
        <div className="modal" onClick={() => setDeleteModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setDeleteModalVisible(false)}>&times;</span>
            <p>Deseja realmente excluir o alimento <strong>{alimentoToDelete}</strong>?</p>
            <button id="confirmarExcluir" onClick={confirmarExclusao}>Excluir</button>
            <button id="cancelarExcluir" onClick={() => setDeleteModalVisible(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MacroCalculador;
