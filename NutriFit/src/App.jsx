import { useEffect, useState } from 'react'
import Contador from './components/Contador'
import './App.css'

function App() {
  const[inputNome, setInputNome] = useState()
  const[inputCaloria,setInputCaloria] = useState()
  const[inputGramas, setInputGramas] = useState()
  const[produtos, setProdutos] = useState([])
  

  useEffect(() => 
    console.log(produtos)
  ,[produtos])

  useEffect(() => 
  console.log("Carregando dados...")
  ,[])

  // function testar(){
  // //   // console.log(produtos);
  // //   let produto = {
  // //     id:Date.now(),
  // //     modelo:"Produto Secreto",
  // //     preco : 10
  // //   }

  //   setProdutos([produto, ... produtos])
  // }

  function cadastrar(){
    let cards = {
      id:Date.now(),
      nome: inputNome,
      gramas : Number(inputGramas),
      caloria : Number(inputCaloria)

  }
  setProdutos([cards, ... produtos])
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

      {/* <Produto modelo={"Galaxy A15"} preco={809} />
      <Produto modelo={`Smart TV 32" Full HD LED TCL`} preco={971.10} />
      <Produto modelo={produtos[0].modelo} preco={produtos[0].preco}/>
      <Produto modelo={produtos[1].modelo} preco={produtos[1].preco}/>
      <Produto modelo={produtos[2].modelo} preco={produtos[2].preco}/> */}

      {/* <button onClick={testar}>TESTAR</button> */}

      {/* {produtos.map((p) => (
        <Produto modelo={p.modelo} preco={p.preco} />
      ))} */}

      <div className='cards'>
      {produtos.map((p) => (
        <Contador key= {p.id} nome = {p.nome} gramas={p.gramas} caloria={p.caloria}/*id= {p.id}*//>
      ))}
      </div>
      

    </div>
  )
}

export default App