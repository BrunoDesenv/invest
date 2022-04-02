import { useEffect, useState, useContext, useCallback } from 'react'

import { AuthContext } from '../../contexts/auth'
import { SimulationContext } from '../../contexts/simulation';
import Header from '../../components/Header'
import Title from '../../components/Title'

import ReactModal from 'react-modal'

import { FiTrendingUp } from 'react-icons/fi'

import './style.css';


function Simulation() {

  const { user, signOut } = useContext(AuthContext);
  const { saveSimulation, simulation, getSimulations } = useContext(SimulationContext);
  const [filtrado, setFiltrado] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isSimulate, SetIsSimulate] = useState(false);

  const [quantidade, setQuantidade] = useState();
  const [objetivo, setObjetivo] = useState('');
  const [capital, setCapital] = useState();
  const [anos, setAnos] = useState();
  const [rendimentoM, setRendimentoM] = useState();
  const [quanto, setQuanto] = useState();
  const [mensal, setMensal] = useState();
  const [rentabilidadeAno, setRentabilidadeAno] = useState();
  const [tMeses, setMeses] = useState([]);

  function calcular() {
    let totalMeses = anos * 12
    let montante = (capital * ((1 + (rendimentoM / 100)) ** totalMeses)) + (quantidade * (((((1 + (rendimentoM / 100)) ** totalMeses) - 1) / (rendimentoM / 100))));
    setQuanto(montante.toFixed(2));

    let rendimentoMensal = (montante * rendimentoM) / 100
    setMensal(rendimentoMensal.toFixed(2))

    let rendimentoAnual = (rendimentoMensal * 12)
    setRentabilidadeAno(rendimentoAnual.toFixed(2));

    let tm = 0;
    let ar = [{ mes: 'Inicial', valor: capital }]

    for (let i = 1; i <= totalMeses; i++) {
      tm = (capital * ((1 + (rendimentoM / 100)) ** i)) + (quantidade * (((((1 + (rendimentoM / 100)) ** i) - 1) / (rendimentoM / 100))));
      tm = tm.toFixed(2)
      ar.push({ mes: i, valor: tm, valorInvestido: quantidade * i });
    }
    SetIsSimulate(true)
  }

  function openModal() {
    setIsOpen(true);
    SetIsSimulate(false);
  }

  function closeModal() {
    setIsOpen(false);
    setQuantidade();
    setObjetivo();
    setCapital();
    setAnos();
    setRendimentoM();
  }

  function saveValues() {
    let data = {
      usuario: user.uid,
      objetivo: objetivo,
      valorinicial: capital,
      aportemensal: quantidade,
      tempoinvestido: anos,
      rendimentomensal: rendimentoM,
      saldofinal: quanto,
      retornomensal: mensal,
      retornoanual: rentabilidadeAno,
      totalmeses: tMeses
    }

    saveSimulation(data);
    closeModal();
  }

  useEffect(() => {
    getSimulations();
    let filtrado = simulation.filter(simulation => simulation.usuario === user.uid);
    setFiltrado(filtrado);
  }, [])

  useEffect(() => {
    let filtrado = simulation.filter(simulation => simulation.usuario === user.uid);
    setFiltrado(filtrado);
  }, [simulation])

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Title nome="Simulações">
          <FiTrendingUp size={25} />
        </Title>
        <div className="container-dash">
          <button className="ReactModal__Submit" onClick={openModal}>Criar Simulação</button>
          <ReactModal
            isOpen={modalIsOpen}
            className={
              "ReactModal__Content"}>
            <div>
              <div className="ReactModal__form">
                <h2>Nova Simulação</h2>

                <input value={objetivo} placeholder="Objetivo" onChange={(e) => setObjetivo(e.target.value)} />
                <input value={capital} placeholder="Capital Inicial" onChange={(e) => setCapital(e.target.value)} />
                <input value={quantidade} placeholder="Aporte Mensal" onChange={(e) => setQuantidade(e.target.value)} />
                <input value={anos} placeholder="Tempo de Investimento" onChange={(e) => setAnos(e.target.value)} />
                <input value={rendimentoM} placeholder="Taxa de rendimento" onChange={(e) => setRendimentoM(e.target.value.replace(',', '.'))} />
                <button className="ReactModal__Simulate" type="button" onClick={() => { calcular() }}>Simular</button>
                {isSimulate && <div>
                  <h2>Resultado (Montante, Retorno Menslal, Retorno Anual)</h2>
                  <input disabled={true} value={quanto} placeholder="Montante" />
                  <input disabled={true} value={mensal} placeholder="Retorno Mensal" />
                  <input disabled={true} value={rentabilidadeAno} placeholder="Retorno Anual" />
                  <button className="ReactModal__Submit" type="button" onClick={() => { saveValues() }}>Salvar Simulação</button>
                </div>}
              </div>
              <button className="ReactModal__Cancel" onClick={closeModal}>Cancelar</button>
            </div>
          </ReactModal>
          <table className="table1">
            <thead>
              <tr>
                <th>Objetivo</th>
                <th>Valor Inicial</th>
                <th>Aporte Mensal</th>
                <th>Tempo de investimento</th>
                <th>Taxa mensal</th>
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
