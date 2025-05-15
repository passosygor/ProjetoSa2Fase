import Contador from './components/Contador'
import './pages/Calculador.css'

function Calculador() {
  const[inputNome, setInputNome] = useState()
  const[inputCaloria,setInputCaloria] = useState()
  const[inputGramas, setInputGramas] = useState()
  const[produtos, setProdutos] = useState([])


  function cadastrar(){
    let cards = {
      id:Date.now(),
      nome: inputNome,
      gramas : Number(inputGramas),
      caloria : Number(inputCaloria)

  }
  setProdutos([cards, ...produtos])
  console.log (produtos)
}

  return (
    <div className='container-app'>

      <h1>Contador de Caloria</h1>

      <div className='form-produto'>
        <label htmlFor="">Nome</label>
      <input type="Text" 
      value={inputNome} 
      onChange={(e) => setInputNome(e.target.value) }
      />
      <label htmlFor="">Quantidade(g)</label>
      <input type="Number" 
      value={inputGramas} 
      onChange={(e) => setInputGramas(e.target.value)}
      />
      <label htmlFor="">Caloria</label>
      <input type="Number" 
      value={inputCaloria} 
      onChange={(e) => setInputCaloria(e.target.value)}
      />

      <div className='botao'>
      <button onClick={cadastrar}>Cadastrar</button>
      </div>

      </div>

      <div className='cards'>
      {produtos.map((p) => (
        <Contador key= {p.id} nome = {p.nome} gramas={p.gramas} caloria={p.caloria}/*id= {p.id}*//>
      ))}
      </div>
      

    </div>
  )
}

export default Calculador