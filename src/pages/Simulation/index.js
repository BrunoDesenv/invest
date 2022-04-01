import { useEffect, useState, useContext, useCallback } from 'react'

import { AuthContext } from '../../contexts/auth'
import { SimulationContext } from '../../contexts/simulation';
import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiTrendingUp } from 'react-icons/fi'

import './style.css';


function Simulation() {

  const { user, signOut } = useContext(AuthContext);
  const { simulation, getSimulations } = useContext(SimulationContext);
  const [filtrado, setFiltrado] = useState([]);

  useEffect(() => {

    getSimulations(user.uid);
    let filtrado = simulation.filter(simulation => simulation.usuario === user.uid);
    setFiltrado(filtrado);
  }, [])

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Title nome="Simulações">
          <FiTrendingUp size={25} />
        </Title>
        <div className="container-dash">
          <table className="table1">
            <thead>
              <tr>
                <th>Objetivo</th>
                <th>Valor Inicial</th>
                <th>Aporte Mensal</th>
                <th>Tempo de investimento</th>
                <th>Rendimento mensal</th>
                <th>Saldo Final</th>
                <th>Retorno Mensal</th>
                <th>Retorno Anual</th>
              </tr>
            </thead>
            <tbody>
              {filtrado.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.objetivo}</td>
                    <td>{item.valorinicial}</td>
                    <td>{item.aportemensal}</td>
                    <td>{item.tempoinvestido}</td>
                    <td className="amount">{item.rendimentomensal}</td>
                    <td className="amount">{item.saldofinal}</td>
                    <td className="amount">{item.retornomensal}</td>
                    <td className="amount">{item.retornoanual}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

        </div>
      </div>
    </div >
  );
}

export default Simulation;
