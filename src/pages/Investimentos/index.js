import { useEffect, useState, useContext, useCallback } from 'react'

import { AuthContext } from '../../contexts/auth'
import { InvestimentosContext } from '../../contexts/investimento';
import Header from '../../components/Header'
import Title from '../../components/Title'

import ReactModal from 'react-modal'

import { listarCategoria } from '../../services/lists'

import { FiDollarSign, FiEdit, FiX } from 'react-icons/fi'

import './style.css';
import { toast } from 'react-toastify';


function Simulation() {

  const { user } = useContext(AuthContext);
  const { saveInvestimentos, investimento, getInvestimentos, excluirInvestimento, updateInvestimentoValues } = useContext(InvestimentosContext);
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
  const [invest, setInvest] = useState('FII');

  const [listCategoria, setListaCategoria] = useState([])

  const [showGastoGategoria, setShowGastoGategoria] = useState(false);
  const [categoriaSum, setCategoriaSum] = useState([]);

  function calcular() {

    if (invest === '' || ativo === undefined || capital === undefined || rendimentoM === undefined) {
      return toast.error("Para efetuar a simulação é necessário preencher os campos baixo");
    }

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

  const countCaterory = () => {
    let result = [];
    result = investimento.reduce(function (res, value) {
      if (!res[value.invest]) {
        res[value.invest] = { Id: value.invest, valorinvestido: 0 };
        result.push(res[value.invest])
      }
      res[value.invest].valorinvestido += parseFloat(value.valorinvestido);
      return res
    }, {});

    setCategoriaSum(result);

  }

  const showCategory = () => {
    countCaterory();
    setShowGastoGategoria(!showGastoGategoria);
  }

  function closeModal() {
    setIsOpen(false);
    setQuantidade();
    setAtivo();
    setCapital();
    setAnos();
    setRendimentoM();
    setInvest('FII');
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

    saveInvestimentos(data);
    closeModal();
  }

  function openInvestimentoModal(item) {
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

  function clear() {
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
      usuario: user.uid,
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


    investimento.forEach((item) => {
      rtotalInvestido = parseFloat(item.valorinvestido) + parseFloat(rtotalInvestido);
      rtotalRendimentoMensal = parseFloat(item.retornomensal) + parseFloat(rtotalRendimentoMensal);
      rtotalRendimentoAnual = parseFloat(item.retornoanual) + parseFloat(rtotalRendimentoAnual);
      rtotalTaxaMedia = parseFloat(item.taxaam) + parseFloat(rtotalTaxaMedia);
    })

    let ctaxamedia = rtotalTaxaMedia / investimento.length;

    setTotalInvestido(rtotalInvestido);
    setTotalTaxaMedia(ctaxamedia);
    setTotalRendimentoMensal(rtotalRendimentoMensal);
    setTotalRendimentoAnual(rtotalRendimentoAnual);

  }, [investimento]);


  useEffect(() => {
    let listaCategoria = listarCategoria();
    setListaCategoria(listaCategoria);
    getInvestimentos(user.uid);
  }, [])

  const limparTudo = () => {
    if(investimento.length === 0 ){
      return toast.error("Não existe registro a serem excluido")
    }

    const confirme = window.confirm("Tem certeza que deseja exluir todos os registro?");

    if(confirme){
      investimento.forEach(inves => {
        excluirInvestimento(inves.key, inves.usuario, false);
     });

     return toast.success("Dados excluído");

    }

  }


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

          <div className='card-por-categoria' onClick={() => showCategory()}>
            <a>Exibir total por categoria</a>
          </div>

          <div className='card-info-categoria'>
            {showGastoGategoria &&

              <div className="row">
                <div className="col-xl-3">
                  <div className="card border-left-primary">
                    <div className="card-body">
                      <div className="row">
                        <div className="col mr-2">
                          <div className="text-xs">
                            Total FII</div>
                          <div className="h5">R$ {categoriaSum.FII.valorinvestido.toFixed(2)}</div>
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
                            Total Ação</div>
                          <div className="h5">{(categoriaSum.AÇÃO.valorinvestido) ? categoriaSum.AÇÃO.valorinvestido.toFixed(2) : 0}</div>
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
                            Total Ação Estrangeira
                          </div>
                          <div className="row no-gutters">
                            <div className="col-auto">
                              <div className="h5">R$ {JSON.stringify(categoriaSum['AÇÃO ESTRANGEIRA'].valorinvestido)}</div>
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
                            Total Poupança</div>
                          <div className="h5">R$ {categoriaSum.POUPANÇA.valorinvestido.toFixed(2)}</div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-comments"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
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
                  
                </div>}
              </div>
              <div className='ReactModal_style'>
                  {isSimulate && 
                    <button className="ReactModal__save" type="button" onClick={() => { saveValues() }}>Salvar Simulação</button>
                  }
                  <button className="ReactModal__Cancel" onClick={closeModal}>Cancelar</button>
                </div>
              
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
                  <button className="ReactModal__save" type="button" onClick={() => { updateValues() }}>Salvar Simulação</button>
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
                    <th>Editar</th>
                    <th>Excluir</th>
                  </tr>
                </thead>
                <tbody>
                  {investimento.map((item) => {
                    return (
                      <tr key={item.key}>
                        <td>{item?.invest}</td>
                        <td>{item.ativo}</td>
                        <td>R$ {item.valorinvestido}</td>
                        <td className="amount">{item.taxaam} %</td>
                        <td className="amount">R$ {item.retornomensal}</td>
                        <td className="amount">R$ {item.retornoanual}</td>
                        <td><FiEdit onClick={() => { openInvestimentoModal(item) }} className="optIcon" /></td>
                        <td><FiX onClick={() => { excluirInvestimento(item.key, item.usuario) }} className="optIcon" /></td>
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
