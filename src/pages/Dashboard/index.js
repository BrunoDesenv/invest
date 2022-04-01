import { useState, useContext, useCallback } from 'react'

import { AuthContext } from '../../contexts/auth'
import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiHome } from 'react-icons/fi'

import './style.css';
//import './card.scss';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useCurrentPng } from "recharts-to-png";
import FileSaver from "file-saver";

function Dashboard() {

  const { signOut } = useContext(AuthContext);
  const [quantidade, setQuantidade] = useState(0);
  const [capital, setCapital] = useState(0);
  const [anos, setAnos] = useState(0);
  const [rendimentoM, setRendimentoM] = useState(0);
  const [quanto, setQuanto] = useState(0);
  const [mensal, setMensal] = useState(0);
  const [rentabilidadeAno, setRentabilidadeAno] = useState(0);
  const [tMeses, setMeses] = useState([]);
  const [getPng, { isLoading, ref: charRef }] = useCurrentPng();
  
  const handleDownload = useCallback(async () => {
    debugger;
    const png = await getPng();
    // Verify that png is not undefined
    if (png) {
      // Download with FileSaver
      FileSaver.saveAs(png, 'myChart.png');
    }
  }, [getPng])

  function calcular() {

    let totalMeses = anos * 12
    let montante = (capital * ((1 + (rendimentoM / 100)) ** totalMeses)) + (quantidade * (((((1 + (rendimentoM / 100)) ** totalMeses) - 1) / (rendimentoM / 100))));
    setQuanto(montante.toFixed(2));

    let rendimentoMensal = (montante * rendimentoM) / 100
    setMensal(rendimentoMensal.toFixed(2))

    let rendimentoAnual = (rendimentoMensal * 12)
    setRentabilidadeAno(rendimentoAnual.toFixed(2));

    let tg = 0.5;
    let va = capital;
    let tm = 0;
    let ar = [{ mes: 'Inicial', valor: capital }]

    for (let i = 1; i <= totalMeses; i++) {

      tm = (capital * ((1 + (rendimentoM / 100)) ** i)) + (quantidade * (((((1 + (rendimentoM / 100)) ** i) - 1) / (rendimentoM / 100))));
      tm = tm.toFixed(2)
      
      ar.push({ mes: i, valor: tm, valorInvestido:  quantidade * i});
    }

    setMeses(ar);
  }

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Title nome="Calculo de FII">
          <FiHome size={25} />
        </Title>
        <div className="container-dash">

          <div className="wrapper">
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

          <div className="wrapper">
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
          <table>
            <tbody>
              <tr>
                <th>Mês</th>
                <th>Valor</th>
              </tr>
              {tMeses.map((item) => {
                return (
                  <tr key={item.mes}>
                    <td>{item.mes}</td>
                    <td>R$ {item.valor}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

         
        <div className="container-dash">            
          <div class="card-container" ontouchstart="this.classList.toggle('hover');">
            <div class="card">
              <div class="front">
                <h2>Stuff on Front1</h2>
              </div>
              <div class="back">
                <h2>Stuff on Back1</h2>
              </div>
            </div>
          </div>  
        </div>  

        <div className="container-dash">
            <BarChart ref={charRef}
              width={500}
              height={300}
              data={tMeses}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill="#8884d8" />
              <Bar dataKey="valorInvestido" fill="#82ca9d" />
            </BarChart>

            <button onClick={handleDownload}>
              {isLoading ? 'Downloading...' : 'Download Chart'}
            </button>
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
