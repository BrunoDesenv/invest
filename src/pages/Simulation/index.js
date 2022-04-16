import { useEffect, useState, useContext, useCallback } from 'react'

import { AuthContext } from '../../contexts/auth'
import { SimulationContext } from '../../contexts/simulation';
import Header from '../../components/Header'
import Title from '../../components/Title'

import { listarCategoria } from '../../services/lists'

import ReactModal from 'react-modal'

import { FiTrendingUp, FiEdit, FiX } from 'react-icons/fi'
import './style.css';
import { toast, ToastContainer } from 'react-toastify';


function Simulation() {

  const { user } = useContext(AuthContext);
  const { saveSimulation, simulation, getSimulations, excluirSimulacao, updateSimulacaoValues } = useContext(SimulationContext);
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

  const [totalInvestido, setTotalInvestido] = useState(0);
  const [taxaMedia, setTotalTaxaMedia] = useState(0);
  const [totalrendimentoMensalMedioTotal, setTotalRendimentoMensal] = useState(0);
  const [totalRendimentoAnual, setTotalRendimentoAnual] = useState(0);

  const [simulacaoIsOpen, setSimulacaoIsOpen] = useState(false);
  const [editarSimulacaoIsOpen, setEditarSimulacaoIsOpem] = useState(false);
  const [id, setId] = useState();
  const [invest, setInvest] = useState('FII');

  const [listCategoria, setListaCategoria] = useState([])

  function calcular() {

    if(invest === '' || objetivo === undefined || capital === undefined || quantidade === undefined || anos === undefined || rendimentoM === undefined){
      return toast.error("Para efetuar a simulação é necessário preencher os campos baixo");
     }

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
    setInvest('FII');
  }

  function openSimulacaoModal(item) {
    setObjetivo(item.objetivo);
    setCapital(item.valorinicial);
    setQuantidade(item.aportemensal);
    setAnos(item.tempoinvestido);
    setRendimentoM(item.rendimentomensal);
    setId(item.key);
    setInvest(item.categoria);
    setSimulacaoIsOpen(true);
    SetIsSimulate(false)
  }

  async function updateValues() {
    let data = {
      key: id,
      usuario: user.uid,
      objetivo: objetivo,
      valorinicial: capital,
      aportemensal: quantidade,
      tempoinvestido: anos,
      rendimentomensal: rendimentoM,
      saldofinal: quanto,
      retornomensal: mensal,
      retornoanual: rentabilidadeAno,
      totalmeses: tMeses,
      invest: invest
    }

    updateSimulacaoValues(data);
    closeSituacaoModal();
  }


  function closeSituacaoModal() {
    clear();
    setSimulacaoIsOpen(false);
    setEditarSimulacaoIsOpem(false);
  }

  function clear() {
    setObjetivo('');
    setCapital('');
    setQuantidade('');
    setAnos('');
    setRendimentoM('');
    setInvest('FII');
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
      totalmeses: tMeses,
      invest: invest
    }

    saveSimulation(data);
    closeModal();
  }

  useEffect(() => {
    let rtotalInvestido = 0;
    let rtotalTaxaMedia = 0;
    let rtotalRendimentoMensal = 0;
    let rtotalRendimentoAnual = 0;


    simulation.forEach((item) => {
      rtotalInvestido = parseFloat(item.saldofinal) + parseFloat(rtotalInvestido);
      rtotalRendimentoMensal = parseFloat(item.retornomensal) + parseFloat(rtotalRendimentoMensal);
      rtotalRendimentoAnual = parseFloat(item.retornoanual) + parseFloat(rtotalRendimentoAnual);
      rtotalTaxaMedia = parseFloat(item.rendimentomensal) + parseFloat(rtotalTaxaMedia);
    })

    let ctaxamedia = rtotalTaxaMedia / simulation.length;

    setTotalInvestido(rtotalInvestido);
    setTotalTaxaMedia(ctaxamedia);
    setTotalRendimentoMensal(rtotalRendimentoMensal);
    setTotalRendimentoAnual(rtotalRendimentoAnual);

  }, [simulation]);


  useEffect(() => {
    let listaCategoria = listarCategoria();
    setListaCategoria(listaCategoria);
    getSimulations(user.uid);
  }, []);

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Title nome="Simular Objetivo">
          <FiTrendingUp size={25} />
        </Title>
        <div className="container-dash">
          {/* Card superior */}

          <div className="row">
            <div className="col-xl-3">
              <div className="card border-left-primary">
                <div className="card-body">
                  <div className="row">
                    <div className="col mr-2">
                      <div className="text-xs">
                        Total Investido</div>
                      <div className="h5">R$ {totalInvestido.toFixed(2)}</div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-calendar"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success">
                <div className="card-body">
                  <div className="row no-gutters">
                    <div className="col mr-2">
                      <div className="text-xs">
                        Taxa média (Mensal)</div>
                      <div className="h5">{(taxaMedia) ? taxaMedia.toFixed(2) : 0}% A.M</div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-info">
                <div className="card-body">
                  <div className="row no-gutters">
                    <div className="col mr-2">
                      <div className="text-xs">
                        Rendimento Mensal
                      </div>
                      <div className="row no-gutters">
                        <div className="col-auto">
                          <div className="h5">R$ {totalrendimentoMensalMedioTotal.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-clipboard-list"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-warning">
                <div className="card-body">
                  <div className="row no-gutters">
                    <div className="col mr-2">
                      <div className="text-xs">
                        Rendimento Anual</div>
                      <div className="h5">R$ {totalRendimentoAnual.toFixed(2)}</div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-comments"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="actionsArea">
          <button className="ReactModal__Submit" onClick={openModal}>+ Novo</button>
            <button className="ReactModal__Clear" onClick={()=>{}}>Limpar tudo</button>
          </div>

          {/* Card superior */}
          
          <ReactModal
            isOpen={modalIsOpen}
            className={
              "ReactModal__Content"}>
            <div>
              <div className="ReactModal__form">
                <h2>Nova Simulação</h2>
                <select value={invest} onChange={e => setInvest(e.target.value)}>
                  {listCategoria.map((item, index) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </select>
                <input value={objetivo} placeholder="Objetivo" onChange={(e) => setObjetivo(e.target.value)} />
                <input value={capital} placeholder="Capital Inicial" onChange={(e) => setCapital(e.target.value.replace(',', '.'))} />
                <input value={quantidade} placeholder="Aporte Mensal" onChange={(e) => setQuantidade(e.target.value.replace(',', '.'))} />
                <input value={anos} placeholder="Tempo de Investimento" onChange={(e) => setAnos(e.target.value)} />
                <input value={rendimentoM} placeholder="Taxa de rendimento" onChange={(e) => setRendimentoM(e.target.value.replace(',', '.'))} />
                <button className="ReactModal__Simulate" type="button" onClick={() => { calcular() }}>Simular</button>
                {isSimulate && <div>
                  <h2>Resultado (Montante, Retorno Mensal, Retorno Anual)</h2>
                  <input disabled={true} value={quanto} placeholder="Montante" />
                  <input disabled={true} value={mensal} placeholder="Retorno Mensal" />
                  <input disabled={true} value={rentabilidadeAno} placeholder="Retorno Anual" />
                  <button className="ReactModal__save" type="button" onClick={() => { saveValues() }}>Salvar Simulação</button>
                </div>}
              </div>
              <button className="ReactModal__Cancel" onClick={closeModal}>Cancelar</button>
            </div>
          </ReactModal>
        </div>

        <ReactModal
          isOpen={simulacaoIsOpen}
          ariaHideApp={false}
          className={
            "ReactModal__Content"}>
          <div>
            <div className="ReactModal__form">
              <h2>Editar</h2>
              <select value={invest} onChange={e => setInvest(e.target.value)}>
                {listCategoria.map((item, index) => (
                  <option key={item.id} value={item.name}>{item.name}</option>
                ))}
              </select>
              <input value={objetivo} placeholder="Objetivo" onChange={(e) => setObjetivo(e.target.value)} />
              <input value={capital} placeholder="Capital Inicial" onChange={(e) => setCapital(e.target.value.replace(',', '.'))} />
              <input value={quantidade} placeholder="Aporte Mensal" onChange={(e) => setQuantidade(e.target.value.replace(',', '.'))} />
              <input value={anos} placeholder="Tempo de Investimento" onChange={(e) => setAnos(e.target.value)} />
              <input value={rendimentoM} placeholder="Taxa de rendimento" onChange={(e) => setRendimentoM(e.target.value.replace(',', '.'))} />
              <button className="ReactModal__Simulate" type="button" onClick={() => { calcular() }}>Simular</button>

              {isSimulate && <div>
                <h2>Resultado (Montante, Retorno Mensal, Retorno Anual)</h2>
                <input disabled={true} value={quanto} placeholder="Montante" />
                <input disabled={true} value={mensal} placeholder="Retorno Mensal" />
                <input disabled={true} value={rentabilidadeAno} placeholder="Retorno Anual" />
                <button className="ReactModal__save" type="button" onClick={() => { updateValues() }}>Salvar Simulação</button>
              </div>}
            </div>
            <button className="ReactModal__Cancel" onClick={closeSituacaoModal}>Cancelar</button>
          </div>
        </ReactModal>

        <div className="container-dash">
          <div className="containerTable">
            <table className="table1">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Objetivo</th>
                  <th>Valor Inicial</th>
                  <th>Aporte Mensal</th>
                  <th>Tempo de investimento</th>
                  <th>Taxa mensal</th>
                  <th>Saldo Final</th>
                  <th>Retorno Mensal</th>
                  <th>Retorno Anual</th>
                  <th>Editar</th>
                  <th>Excluir</th>
                </tr>
              </thead>
              <tbody>
                {simulation.map((item) => {
                  return (
                    <tr key={item.key}>
                      <td>{item.categoria}</td>
                      <td>{item.objetivo}</td>
                      <td>{item.valorinicial}</td>
                      <td>{item.aportemensal}</td>
                      <td>{item.tempoinvestido}</td>
                      <td className="amount">{item.rendimentomensal}</td>
                      <td className="amount">{item.saldofinal}</td>
                      <td className="amount">{item.retornomensal}</td>
                      <td className="amount">{item.retornoanual}</td>
                      <td><FiEdit onClick={() => { openSimulacaoModal(item) }} className="optIcon" /></td>
                      <td><FiX onClick={() => { excluirSimulacao(item.key, item.usuario) }} className="optIcon" /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div >
    </div>
  );
}

export default Simulation;
