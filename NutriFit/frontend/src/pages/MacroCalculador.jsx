import React, { useEffect, useState } from 'react';
import './MacroCalculadora.css';

function MacroCalculador() {
  const [macros, setMacros] = useState([]);
  const [formData, setFormData] = useState({
    alimento: '',
    caloria: '',
    proteina: '',
    carbo: '',
    gordura: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [alimentoToDelete, setAlimentoToDelete] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('macros')) || [];
    setMacros(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('macros', JSON.stringify(macros));
  }, [macros]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let id = macros.length ? macros[macros.length - 1].id + 1 : 1;
    while (macros.some(macro => macro.id === id)) id++;

    const novoMacro = { id, ...formData };
    setMacros([...macros, novoMacro]);
    setFormData({ alimento: '', caloria: '', proteina: '', carbo: '', gordura: '' });
    setModalVisible(true);
  };

  const confirmarExclusao = () => {
    setMacros(macros.filter(m => m.id !== itemToDelete));
    setDeleteModalVisible(false);
    setItemToDelete(null);
    setAlimentoToDelete('');
  };

  return (
    <div className="macro-container">
      <h1>Calculadora de Macronutrientes</h1>
      <h2>Use a ferramenta para manter controle sobre seus macronutrientes e alcançar seu objetivo!</h2>

      <form onSubmit={handleSubmit}>
        {['alimento', 'caloria', 'proteina', 'carbo', 'gordura'].map((field) => (
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
            <th>Calorias</th>
            <th>Proteinas</th>
            <th>Carboidratos</th>
            <th>Gordura</th>
            <th>Exclusão</th>
          </tr>
        </thead>
        <tbody>
          {macros.map((macro) => (
            <tr key={macro.id}>
              <td>{macro.alimento}</td>
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
            <p>Alimento cadastrado com sucesso</p>
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
