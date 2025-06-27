import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Calculador.css';
import Logo from '../components/Logo.jsx';

function Calculador() {
  const [macros, setMacros] = useState([]);
  const [formData, setFormData] = useState({
    alimento: '',
    categoria: '',
    gramas: '',
    caloria: '',
    proteina: '',
    carbo: '',
    gordura: '',
    contem_gluten: false,
    contem_lactose: false
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [alimentoToDelete, setAlimentoToDelete] = useState('');

  useEffect(() => {
    async function fetchAlimentos() {
      try {
        const res = await axios.get('http://localhost:3000/alimentos');
        const dados = res.data.map(item => ({
          id: item.id_alimento,
          alimento: item.nome,
          categoria: item.categoria,
          gramas: item.gramas,
          caloria: item.calorias,
          proteina: item.proteinas,
          carbo: item.carboidratos,
          gordura: item.gorduras,
          contem_gluten: item.contem_gluten,
          contem_lactose: item.contem_lactose
        }));
        setMacros(dados);
      } catch (err) {
        console.error('Erro ao buscar alimentos:', err);
      }
    }
    fetchAlimentos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      alimento, categoria, gramas, caloria,
      proteina, carbo, gordura,
      contem_gluten, contem_lactose
    } = formData;

    try {
      const res = await axios.post('http://localhost:3000/alimentos', {
        nome: alimento,
        categoria,
        gramas: parseFloat(gramas),
        calorias: parseFloat(caloria),
        proteinas: parseFloat(proteina),
        carboidratos: parseFloat(carbo),
        gorduras: parseFloat(gordura),
        contem_gluten,
        contem_lactose
      });

      const novoMacro = {
        id: res.data.id_alimento,
        alimento,
        categoria,
        gramas,
        caloria,
        proteina,
        carbo,
        gordura,
        contem_gluten,
        contem_lactose
      };

      setMacros([...macros, novoMacro]);
      setFormData({
        alimento: '',
        categoria: '',
        gramas: '',
        caloria: '',
        proteina: '',
        carbo: '',
        gordura: '',
        contem_gluten: false,
        contem_lactose: false
      });
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
      <h1>Tabela de Alimentos</h1>
      <h2>Use a ferramenta para adicionar alimentos e suas informações calóricas!</h2>

      <form onSubmit={handleSubmit}>
        {['alimento', 'categoria', 'gramas', 'caloria', 'proteina', 'carbo', 'gordura'].map((field) => (
          <div key={field}>
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={field === 'alimento' || field === 'categoria' ? 'text' : 'number'}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div>
          <label htmlFor="contem_gluten">Contém Glúten:</label>
          <input
            type="checkbox"
            id="contem_gluten"
            name="contem_gluten"
            checked={formData.contem_gluten}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="contem_lactose">Contém Lactose:</label>
          <input
            type="checkbox"
            id="contem_lactose"
            name="contem_lactose"
            checked={formData.contem_lactose}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Adicionar</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Alimento</th>
            <th>Categoria</th>
            <th>Gramas</th>
            <th>Calorias</th>
            <th>Proteínas</th>
            <th>Carboidratos</th>
            <th>Gorduras</th>
            <th>Glúten</th>
            <th>Lactose</th>
            <th>Exclusão</th>
          </tr>
        </thead>
        <tbody>
          {macros.map((macro) => (
            <tr key={macro.id}>
              <td>{macro.alimento}</td>
              <td>{macro.categoria}</td>
              <td>{macro.gramas}</td>
              <td>{macro.caloria}</td>
              <td>{macro.proteina}</td>
              <td>{macro.carbo}</td>
              <td>{macro.gordura}</td>
              <td>{macro.contem_gluten ? 'Sim' : 'Não'}</td>
              <td>{macro.contem_lactose ? 'Sim' : 'Não'}</td>
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

      {modalVisible && (
        <div className="modal" onClick={() => setModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
            <p>Alimento cadastrado com sucesso</p>
          </div>
        </div>
      )}

      {deleteModalVisible && (
        <div className="modal" onClick={() => setDeleteModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setDeleteModalVisible(false)}>&times;</span>
            <p>Deseja realmente excluir o alimento <strong>{alimentoToDelete}</strong>?</p>
            <button onClick={confirmarExclusao}>Excluir</button>
            <button onClick={() => setDeleteModalVisible(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculador;
