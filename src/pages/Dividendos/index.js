import { useEffect, useState, useContext, useCallback } from 'react'

import { AuthContext } from '../../contexts/auth'
import { DividendosContext } from '../../contexts/dividendos';
import Header from '../../components/Header'
import Title from '../../components/Title'

import ReactModal from 'react-modal'

import { FiDollarSign, FiEdit, FiX } from 'react-icons/fi'

import './style.css';
import { toast } from 'react-toastify';
import moment from 'moment'

import {
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts";



function Dividendos() {

  const { user } = useContext(AuthContext);
  const { saveDividendos, dividendos, dividendosTotais, getDividendos, 
          getDividendosByDataPagamento, excluirDividendo, updateDividendosValues } = useContext(DividendosContext);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [ativo, setAtivo] = useState('');
  const [valor, setValor] = useState();
  const [dataPagamento, setDataPagamento] = useState();

  const [totalDividendos, setTotalDividendos] = useState(0);
  const [dividendosIsOpen, setDividendosIsOpen] = useState(false);
  const [id, setId] = useState();

  const [dividendosAgrupados, setDividendosAgrupados] = useState([]);
  const [dividendosTotaisAgrupados, setDividendosTotaisAgrupados] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000", "#800000", "#808000",
    "#00FF00", "#008000", "#00FFFF", "#008080", "#0000FF", "#000080", "#FF00FF", "#800080"]
    
  const [showGraficos, setShowGraficos] = useState(false);

  const mesAtual = new Date().toLocaleString("pt-BR", { month: "long" });
  const [dataInicial, setDataInicial] = useState([]);
  const [dataFinal, setDataFinal] = useState([]);
  
  function DataFormatada(){
    return moment(new Date()).format("DD/MM/YYYY");
  }

  function showGraficosDisponiveis() {
    setShowGraficos(!showGraficos);
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setAtivo();
    setValor();
    setDataPagamento(DataFormatada());
  }

  function saveValues() {    
    let data = {
      userId: user.id,
      ativo: ativo,
      valor: valor,
      dataPagamento: moment(dataPagamento).format("DD/MM/YYYY")
    };
    console.log(data);
    saveDividendos(data);
    closeModal();
  }

  function openDividendosModal(dividendo) {

    setId(dividendo.key);
    setAtivo(dividendo.ativo);
    setValor(dividendo.valor);
    setDataPagamento(dividendo.dataPagamento);
    setDividendosIsOpen(true);
  }

  function closeDividendoModal() {
    clear();
    setDividendosIsOpen(false);
  }

  function clear() {
    setAtivo('');
    setValor('');
    setDataPagamento(DataFormatada());
  }

  async function updateValues() {
    let dataPagamentoCTX = moment(dataPagamento).format("DD/MM/YYYY");

    let data = {
      key: id,
      usuario: user.uid,
      ativo: ativo,
      valor: valor,
      dataPagamento: dataPagamentoCTX,
    }
    
    updateDividendosValues(data);
    closeDividendoModal();
  }

  function CalcularDividendos() {
    const dividendosAgrupados = [];
    dividendos.forEach((dividendo) => {
      dividendosAgrupados.push({ ativo: dividendo.ativo, valor: parseFloat(dividendo.valor).toFixed(2) })
    });

    setDividendosAgrupados(dividendosAgrupados);
  }

  function CalcularDividendosTotais() {
    let dividendosAgrupados = [];    
    dividendosTotais.reduce(function(res, value) {
      let dataPagamento = value.dataPagamento.substring(3, 10);

      if (!res[dataPagamento]) {
        res[dataPagamento] = { valor: value.valor, dataPagamento: dataPagamento };
        dividendosAgrupados.push({ valor: value.valor, dataPagamento: dataPagamento });
      }
      res[dataPagamento].valor += parseFloat(value.valor);
      return res;
    }, {});
    for (let i = 1; i < dividendosAgrupados.length; i++) {
      dividendosAgrupados[i].valor = parseFloat(dividendosAgrupados[i].valor) + parseFloat(dividendosAgrupados[i - 1].valor);
    };

    setDividendosTotaisAgrupados(dividendosAgrupados);
  }

  function AplicarFiltro(){
    getDividendosByDataPagamento(user.uid, dataInicial);
  }

  useEffect(() => {
    let totalDividendos = 0;

    dividendos.forEach((dividendo) => {
      totalDividendos += parseFloat(dividendo.valor);
    })

    setTotalDividendos(totalDividendos);
    CalcularDividendos();
    
  }, [dividendos]);

  useEffect(() => {
    CalcularDividendosTotais();
  }, [dividendosTotais]);

  useEffect(() => {
    getDividendosByDataPagamento(user.uid, DataFormatada());
    getDividendos(user.uid);
  }, [])

  const limparTudo = () => {
    if(dividendos.length === 0 ) {
      return toast.error("Não existe registro a serem excluido");
    }

    const confirme = window.confirm("Tem certeza que deseja exluir todos os registro?");

    if(confirme){
      dividendos.forEach(inves => {
        excluirDividendo(inves.key, false);
     });
     return toast.success("Dados excluído");

    }
  }

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Title nome="Meus Dividendos">
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
                        Total Dividendos</div>
                      <div className="h5">R$ {totalDividendos.toFixed(2)}</div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-calendar"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div>
            Data Inicio
            <input type="date" value={dataInicial}
              onChange={e => setDataInicial(e.target.value)}
              name="dataInicial"
            />

            Data Final
            <input
              type="date"
              value={dataFinal}
              onChange={e => setDataFinal(e.target.value)}
              name="dataFinal"
            />

            <button className="ReactModal__Submit" onClick={AplicarFiltro}>Aplicar</button>
          </div>

          <div className="actionsArea">
            <button className="ReactModal__Submit" onClick={openModal}>+ Novo</button>
            <button className="ReactModal__Clear" onClick={()=> limparTudo() }>Limpar tudo</button>
          </div>
          {/* Card superior */}

          <ReactModal
            isOpen={modalIsOpen}
            ariaHideApp={false}
            className={
              "ReactModal__Content"}>
            <div>
              <div className="ReactModal__form">
                <h2>Novo</h2>

                <input value={ativo} placeholder="Ativo" onChange={(e) => setAtivo(e.target.value)} />
                <input value={valor} placeholder="Valor Dividendo" onChange={(e) => setValor(e.target.value.replace(',', '.'))} />
                <input type="date" value={dataPagamento} placeholder="Data de Pagamento" onChange={(e) => setDataPagamento(e.target.value)} />

              </div>
              <div className='ReactModal_style'>
                  <button className="ReactModal__save" type="button" onClick={() => { saveValues() }}>Salvar</button>
                  <button className="ReactModal__Cancel" onClick={closeModal}>Cancelar</button>
                </div>
              
            </div>
          </ReactModal>


          <ReactModal
            isOpen={dividendosIsOpen}
            ariaHideApp={false}
            className={
              "ReactModal__Content"}>
            <div>
              <div className="ReactModal__form">
                <h2>Editar</h2>

                <input value={ativo} placeholder="Ativo" onChange={(e) => setAtivo(e.target.value)} />
                <input value={valor} placeholder="Valor Dividendo" onChange={(e) => setValor(e.target.value.replace(',', '.'))} />
                <input value={dataPagamento} placeholder="Data de Pagamento" onChange={(e) => setDataPagamento(e.target.value)} />

              </div>
              <button className="ReactModal__save" type="button" onClick={() => { updateValues() }}>Atualizar</button>
              <button className="ReactModal__Cancel" onClick={closeDividendoModal}>Cancelar</button>
            </div>
          </ReactModal>


          <div className="container-dash">
            <div className="containerTable">
              <table className="table1">
                <thead>
                  <tr>
                    <th>Ativo</th>
                    <th>Valor Dividendo</th>
                    <th>Data de Pagamento</th>
                    <th>Editar</th>
                    <th>Excluir</th>
                  </tr>
                </thead>
                <tbody>
                  {dividendos.map((dividendo) => {
                    return (
                      <tr key={dividendo.key}>
                        <td>{dividendo.ativo}</td>
                        <td>R$ {dividendo.valor}</td>
                        <td>{dividendo.dataPagamento}</td>
                        <td><FiEdit onClick={() => { openDividendosModal(dividendo) }} className="optIcon" /></td>
                        <td><FiX onClick={() => { excluirDividendo(dividendo.key, dividendo.usuario) }} className="optIcon" /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className='card-por-categoria' onClick={() => showGraficosDisponiveis()}>
            <a>Exibir gráficos simples </a>
          </div>

          {showGraficos && 
            <div className="charts">
              <div>
                <div className="text-graph">
                  Montante por Ativo(Mês)
                </div>
                <BarChart
                  width={550}
                  height={300}
                  data={dividendosAgrupados}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="5 5" />
                  <XAxis dataKey="ativo" />
                  <YAxis type="number" domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#8884d8">
                    {dividendosAgrupados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </div>
              <div>
                <div className="text-graph">
                  Progressão Total
                </div>
                <LineChart 
                  width={600} 
                  height={300} 
                  data={dividendosTotaisAgrupados} 
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="valor" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                <XAxis dataKey="dataPagamento" />
                <YAxis />
                <Tooltip />
                </LineChart>
              </div>
            </div>
          }
          
        </div>
      </div>
    </div >
  );
}

export default Dividendos;
