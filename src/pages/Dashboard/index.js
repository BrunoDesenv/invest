import { useState, useContext } from 'react'

import { AuthContext } from '../../contexts/auth'
import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiHome } from 'react-icons/fi'

import './style.css';


function Dashboard() {

  const { signOut } = useContext(AuthContext);

  const [quantidade, setQuantidade] = useState('0');
  const [capital, setCapital] = useState('0');
  const [anos, setAnos] = useState('0');
  const [rendimentoM, setRendimentoM] = useState('0');
  const [quanto, setQuanto] = useState('0');
  const [mensal, setMensal] = useState('0');
  const [rentabilidadeAno, setRentabilidadeAno] = useState('0');

  function calcular() {

    let totalMeses = anos * 12
    let montante = (capital * ((1 + (rendimentoM / 100)) ** totalMeses)) + (quantidade * (((((1 + (rendimentoM / 100)) ** totalMeses) - 1) / (rendimentoM / 100))));
    setQuanto(montante.toFixed(2));

    let rendimentoMensal = (montante * rendimentoM) / 100
    setMensal(rendimentoMensal.toFixed(2))

    let rendimentoAnual = (rendimentoMensal * 12)
    setRentabilidadeAno(rendimentoAnual.toFixed(2));

  }

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Title nome="Calculo de FII">
          <FiHome size={25} />
        </Title>
        <div className="container-dash">

          <div class="wrapper">
            <div>
              <p>Valor Inicial</p>
              <input type="text" value={capital} onChange={(e) => setCapital(e.target.value)}></input>
            </div>
            <div>
              <p>Aporte Mensal</p>
              <input type="text" value={quantidade} onChange={(e) => setQuantidade(e.target.value)}></input>
            </div>
            <div>
              <p>Tempo de investimento</p>
              <input type="text" value={anos} onChange={(e) => setAnos(e.target.value)}></input>
            </div>
            <div>
              <p>Rendimento mensal</p>
              <input type="text" value={rendimentoM} onChange={(e) => setRendimentoM(e.target.value.replace(',', '.'))}></input>
            </div>
            <div>
              <button className="btnCalcular" onClick={() => { calcular() }}>Calcular</button>
            </div>
          </div>




          <div class="wrapper">
            <div>
              <p>Saldo Final</p>
              <input type="text" disabled={true} value={quanto}></input>
            </div>
            <div>
              <p>Retorno Mensal</p>
              <input type="text" disabled={true} value={mensal}></input>
            </div>
            <div>
              <p>Retorno Anual</p>
              <input type="text" disabled={true} value={rentabilidadeAno}></input>
            </div>
          </div>
        </div>
        <div className="container-dash">
          <button className="logout-btn" onClick={() => { signOut() }}>
            Sair
          </button>
        </div>
      </div>
    </div >
  );
}

export default Dashboard;
