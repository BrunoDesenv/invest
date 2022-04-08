import { useEffect, useState, useContext, useCallback } from 'react'

import { AuthContext } from '../../contexts/auth'
import { InvestimentosContext } from '../../contexts/investimento';
import Header from '../../components/Header'
import Title from '../../components/Title'

import ReactModal from 'react-modal'

import { FiDollarSign, FiEdit, FiX   } from 'react-icons/fi'

import './style.css';


function Simulation() {

  const { user, signOut } = useContext(AuthContext);
  const { saveInvestimentos, investimento, getInvestimentos, excluirInvestimento, updateInvestimentoValues } = useContext(InvestimentosContext);
  const [filtrado, setFiltrado] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isSimulate, SetIsSimulate] = useState(false);

  const [quantidade, setQuantidade] = useState(0);
  const [ativo, setAtivo] = useState('');
  const [capital, setCapital] = useState();
  const [anos, setAnos] = useState(1);
  const [rendimentoM, setRendimentoM] = useState();
  const [quanto, setQuanto] = useState();
  const [mensal, setMensal] = useState();
  const [rentabilidadeAno, setRentabilidadeAno] = useState();
  const [tMeses, setMeses] = useState([]);

  const [totalInvestido, setTotalInvestido] = useState(0);
  const [taxaMedia, setTotalTaxaMedia] = useState(0);
  const [totalrendimentoMensalMedioTotal, setTotalRendimentoMensal] = useState(0);
  const [totalRendimentoAnual, setTotalRendimentoAnual] = useState(0);

  const [investimentoIsOpen, setInvestimentoIsOpen] = useState(false);
  const [id, setId] = useState();
  const [invest, setInvest ] = useState();

  const listCategoria = [
    { id: 1, name: 'Fiis' },
    { id: 2, name: 'Ação' },
    { id: 3, name: 'CDB' },
    { id: 4, name: 'Tesouro' },
    { id: 5, name: 'Poupança' },
    { id: 5, name: 'Ação Estrangeira' },
    { id: 5, name: 'Criptos' }

  ];

  function calcular() {
    let totalMeses = anos * 12
    let montante = (capital * ((1 + (rendimentoM / 100)) ** totalMeses)) + (quantidade * (((((1 + (rendimentoM / 100)) ** totalMeses) - 1) / (rendimentoM / 100))));
    setQuanto(montante.toFixed(2));

    let rendimentoMensal = (capital * rendimentoM) / 100
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
    setAtivo();
    setCapital();
    setAnos();
    setRendimentoM();
  }

  function saveValues() {
    let data = {
      usuario: user.uid,
      ativo: ativo,
      valorinvestido: capital,
      taxaam: rendimentoM,
      retornomensal: mensal,
      retornoanual: rentabilidadeAno,
      invest: invest
    }
    console.log(data)

    saveInvestimentos(data);
    closeModal();
  }

  function openInvestimentoModal(item) {
    console.log(item)
    setId(item.key);
    setAtivo(item.ativo);
    setCapital(item.valorinvestido);
    setRendimentoM(item.taxaam)
    setInvestimentoIsOpen(true);
    SetIsSimulate(false); 
    setInvest(item.invest);
  }

  function closeInvestimentoModal() {
    clear();
    setInvestimentoIsOpen(false);
  }

  function clear(){
    setAtivo('');
    setCapital('');
    setRendimentoM('')
    setQuanto('')
    setMensal('')
    setRentabilidadeAno()
  }

  async function updateValues() {
    let data = {
      key: id,
      ativo: ativo,
      valorinvestido: capital,
      taxaam: rendimentoM,
      retornomensal: mensal,
      retornoanual: rentabilidadeAno,
      invest: invest
    }

    updateInvestimentoValues(data);
    closeInvestimentoModal();
  }

  useEffect(() => {
    let rtotalInvestido = 0;
    let rtotalTaxaMedia = 0;
    let rtotalRendimentoMensal = 0;
    let rtotalRendimentoAnual = 0;


    filtrado.forEach((item) => {
      rtotalInvestido = parseFloat(item.valorinvestido) + parseFloat(rtotalInvestido);
      rtotalRendimentoMensal = parseFloat(item.retornomensal) + parseFloat(rtotalRendimentoMensal);
      rtotalRendimentoAnual = parseFloat(item.retornoanual) + parseFloat(rtotalRendimentoAnual);
      rtotalTaxaMedia = parseFloat(item.taxaam) + parseFloat(rtotalTaxaMedia);
    })

    let ctaxamedia = rtotalTaxaMedia / filtrado.length;

    setTotalInvestido(rtotalInvestido);
    setTotalTaxaMedia(ctaxamedia);
    setTotalRendimentoMensal(rtotalRendimentoMensal);
    setTotalRendimentoAnual(rtotalRendimentoAnual);

  }, [filtrado]);


  useEffect(() => {
    getInvestimentos();
    let filtrado = investimento.filter(simulation => simulation.usuario === user.uid);
    setFiltrado(filtrado);
  }, [])

  useEffect(() => {
    let filtrado = investimento.filter(simulation => simulation.usuario === user.uid);
    setFiltrado(filtrado);
  }, [investimento])

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Title nome="Meus Investimentos">
          <FiDollarSign size={25} />
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

          {/* Card superior */}
          <button className="ReactModal__Submit" onClick={openModal}>Cadastrar Novo</button>
          <ReactModal
            isOpen={modalIsOpen}
            ariaHideApp={false}
            className={
              "ReactModal__Content"}>
            <div>
              <div className="ReactModal__form">
                <h2>Novo investimento</h2>

                <select value={invest} onChange={e => setInvest(e.target.value)}>
                  {listCategoria.map((item, index) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </select>

                <input value={ativo} placeholder="Ativo" onChange={(e) => setAtivo(e.target.value)} />
                <input value={capital} placeholder="Valor Investido" onChange={(e) => setCapital(e.target.value.replace(',', '.'))} />
                <input value={rendimentoM} placeholder="Taxa de rendimento" onChange={(e) => setRendimentoM(e.target.value.replace(',', '.'))} />
                <button className="ReactModal__Simulate" type="button" onClick={() => { calcular() }}>Simular</button>
                {isSimulate && <div>
                  <h2>Resultado (Retorno Mensal, Retorno Anual)</h2>
                  <input disabled={true} value={mensal} placeholder="Retorno Mensal" />
                  <input disabled={true} value={rentabilidadeAno} placeholder="Retorno Anual" />
                  <button className="ReactModal__save" type="button" onClick={() => { saveValues() }}>Salvar Simulação</button>
                </div>}
              </div>
              <button className="ReactModal__Cancel" onClick={closeModal}>Cancelar</button>
            </div>
          </ReactModal>


          <ReactModal
            isOpen={investimentoIsOpen}
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

                <input value={ativo} placeholder="Ativo" onChange={(e) => setAtivo(e.target.value)} />
                <input value={capital} placeholder="Valor Investido" onChange={(e) => setCapital(e.target.value.replace(',', '.'))} />
                <input value={rendimentoM} placeholder="Taxa de rendimento" onChange={(e) => setRendimentoM(e.target.value.replace(',', '.'))} />
                <button className="ReactModal__Simulate" type="button" onClick={() => { calcular() }}>Simular</button>
                {isSimulate && <div>
                  <h2>Resultado (Retorno Mensal, Retorno Anual)</h2>
                  <input disabled={true} value={mensal} placeholder="Retorno Mensal" />
                  <input disabled={true} value={rentabilidadeAno} placeholder="Retorno Anual" />
                  <button className="ReactModal__save" type="button" onClick={() => { updateValues() }}>Salvar Simulação modal </button>
                </div>}
              </div>
              <button className="ReactModal__Cancel" onClick={closeInvestimentoModal}>Cancelar</button>
            </div>
          </ReactModal>


          <div className="container-dash">
            <div className="containerTable">
              <table className="table1">
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>ativo</th>
                    <th>Valor Investido</th>
                    <th>Taxa A.M</th>
                    <th>Retorno Mensal</th>
                    <th>Retorno Anual</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrado.map((item) => {
                    return (
                      <tr key={item.key}>
                        <td>{item?.invest}</td>
                        <td>{item.ativo}</td>
                        <td>{item.valorinvestido}</td>
                        <td className="amount">{item.taxaam}</td>
                        <td className="amount">{item.retornomensal}</td>
                        <td className="amount">{item.retornoanual}</td>
                        <td><FiEdit onClick={() => { openInvestimentoModal(item) }} className="optIcon" /></td>
                        <td><FiX onClick={() => { excluirInvestimento(item.key) }} className="optIcon" /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Simulation;
