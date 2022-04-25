import { useEffect, useState, useContext } from 'react'

import { AuthContext } from '../../contexts/auth'
import { DebitosContext } from '../../contexts/debitos';
import Header from '../../components/Header'
import Title from '../../components/Title'
import moment from 'moment'

import ReactModal from 'react-modal'
import { listarDebitos, listarSituacao } from '../../services/lists'
import { FiShoppingCart, FiEdit, FiX } from 'react-icons/fi'

import Card from '../../components/Card';

import './style.css';
import { toast } from 'react-toastify';


function Debits() {

  const { user } = useContext(AuthContext);
  const { saveDebitos, updateDebitsValues, excluirDebits, debitos, getDebitos } = useContext(DebitosContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [situacaoIsOpen, setSituacaoIsOpen] = useState(false);
  const [id, setId] = useState();


  const [categoria, setCategoria] = useState('Casa');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState();
  const [situacao, setSituacao] = useState(1);
  const [pagar, setPagar] = useState();
  const [pago, setPago] = useState();
  const [essencial, setEssencial] = useState();
  const [vdata, setData] = useState();

  const [listSituacao, SetlistSituacao] = useState([]);
  const [listCategoria, SetListCategoria] = useState([]);
  const [showGastoGategoria, setShowGastoGategoria] = useState(false);
  const [categoriaSum, setCategoriaSum] = useState([]);
  const [info, setInfo] = useState([])

  function openModal() {
    setIsOpen(true);
  }

  function openSituacaoModal(item) {
    setCategoria(item.categoria)
    setDescricao(item.descricao)
    setSituacao(item.situacao)
    setValor(item.valor)
    setId(item.key)
    setSituacaoIsOpen(true);
  }

  function closeSituacaoModal() {
    setSituacaoIsOpen(false);
    setCategoria('Casa');
    setDescricao();
    setValor();
    setSituacao();
  }

  function closeModal() {
    setIsOpen(false);
    setCategoria('Casa');
    setDescricao();
    setValor();
    setSituacao();
  }

  function saveValues() {

    let data = {
      usuario: user.uid,
      categoria: categoria,
      descricao: descricao,
      valor: valor,
      situacao: 'Pendente', 
      dataVencimento: vdata
    }

    saveDebitos(data);
    closeModal();
  }

  async function updateValues() {
    let data = {
      key: id,
      usuario: user.uid,
      categoria: categoria,
      descricao: descricao,
      valor: valor,
      situacao: situacao,
      dataVencimento: vdata
    }

    updateDebitsValues(data);
    closeSituacaoModal();
  }

  useEffect(() => {
    let situacao = listarSituacao();
    let categorias = listarDebitos();

    SetlistSituacao(situacao);
    SetListCategoria(categorias);

    getDebitos(user.uid);
  }, [])

  useEffect(() => {
    let rPagar = 0;
    let rPago = 0;
    let rEssencial = 0;


    debitos.forEach((item) => {
      rPagar = parseFloat(item.valor) + parseFloat(rPagar);

      if (item.situacao === "Pago") {
        rPago = parseFloat(item.valor) + parseFloat(rPago);
      }

      if (item.categoria === "Casa" || item.categoria === "Dívida" || item.categoria === "Responsabilidade") {
        rEssencial = parseFloat(item.valor) + parseFloat(rEssencial);
      }
    })

    setPagar(rPagar);
    setPago(rPago);
    setEssencial(rEssencial);

  }, [debitos]);


  const showCategory = () => {
    countCaterory();
    setShowGastoGategoria(!showGastoGategoria);
  }

  const countCaterory = () => {
    let result = [];
    result = debitos.reduce(function(res, value) {
      if (!res[value.categoria]) {
        res[value.categoria] = { Id: value.categoria, valor: 0 };
        result.push(res[value.categoria])
      }
      res[value.categoria].valor +=  parseFloat(value.valor);
      return res;
    }, {});

    setCategoriaSum(result);
    

  }

  const limparTudo = () => {

    if(debitos.length === 0 ){
      return toast.error("Não existe registro a serem excluido")
    }

    const confirme = window.confirm("Tem certeza que deseja exluir todos os registro?");

    if(confirme){
      debitos.forEach(debito => {
      excluirDebits(debito.key, debito.usuario, false);
     });

     return toast.success("Dados excluído");

    }

  }
  return (
    <div className="App">
      <Header />
      <div className="content">
        <Title nome="Meus Gastos">
          <FiShoppingCart size={25} />
        </Title>
        <div className="container-dash">
          {/* Card superior */}

          <div className="row">

            <Card 
              classCol={''} 
              categoria={'Receita (Mês)'} 
              essencial={user.receita} 
              classBorderLeft={'primary'} 
              calssRow={''}
              classComment={'fa-calendar'}
            />

            <Card 
              classCol={'col-md-6 mb-4'} 
              categoria={'A Pagar (Mensal)'} 
              essencial={pagar} 
              classBorderLeft={'success'} 
              calssRow={'no-gutters'}
              classComment={'fa-dollar-sign'}
            />

            <Card 
              classCol={'col-md-6 mb-4'} 
              categoria={'Pago'} 
              essencial={pago} 
              classBorderLeft={'info'} 
              calssRow={'no-gutters'}
              classComment={'fa-clipboard-list'}
            />

            <Card 
              classCol={'col-md-6 mb-4'} 
              categoria={'Total Essencial'} 
              essencial={essencial} 
              classBorderLeft={'warning'} 
              calssRow={'no-gutters'}
              classComment={'fa-comments'}
            />
 
          </div>

          <div className='card-por-categoria' onClick={() => showCategory()}>
            <a>Exibir total por categoria</a>
          </div>

          <div className='card-info-categoria'>
          { showGastoGategoria && 
            Object.values(categoriaSum).map((categoria,index)=> {
              return (
                  <Card 
                  classCol={''} 
                  categoria={categoria.Id} 
                  essencial={categoria.valor} 
                  classBorderLeft={'info'} 
                  calssRow={''}
                  classComment={'fa-comments'}
                />
            )
            })
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
                <h2>Novo Gasto</h2>
                <select value={categoria} onChange={e => setCategoria(e.target.value)}>
                  {listCategoria.map((item, index) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </select>
                <input value={descricao} placeholder="Descrição" onChange={(e) => setDescricao(e.target.value.replace(',', '.'))} />
                <input value={valor} placeholder="Valor" onChange={(e) => setValor(e.target.value.replace(',', '.'))} />

                <input type="date" value={vdata} placeholder="Data de vencimento" onChange={(e) => setData(e.target.value)} />

                
              </div>
              <div className='ReactModal_style'>
                <button className="ReactModal__save" type="button" onClick={() => { saveValues() }}>Salvar Gasto</button>
                <button className="ReactModal__Cancel" onClick={closeModal}>Cancelar</button>
              </div>
                
            </div>
          </ReactModal>

          <ReactModal
            isOpen={situacaoIsOpen}
            ariaHideApp={false}
            className={
              "ReactModal__Content"}>
            <div>
              <div className="ReactModal__form">
                <h2>Editar</h2>
                <select value={categoria} onChange={e => setCategoria(e.target.value)}>
                  {listCategoria.map((item, index) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </select>
                <input value={descricao} placeholder="Descrição" onChange={(e) => setDescricao(e.target.value.replace(',', '.'))} />
                <input value={valor} placeholder="Valor" onChange={(e) => setValor(e.target.value.replace(',', '.'))} />
                <input type="date" value={vdata} placeholder="Data de vencimento" onChange={(e) => setData(e.target.value)} />

                <select value={situacao} onChange={e => setSituacao(e.target.value)}>
                  {listSituacao.map((item, index) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </select>

                <button className="ReactModal__save" type="button" onClick={() => { updateValues() }}>Atualizar Gasto</button>
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
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Vencimento</th>
                    <th>Situação</th>
                    <th>Editar</th>
                    <th>Excluir</th>
                  </tr>
                </thead>
                <tbody>
                  {debitos.map((item) => {
                    return (
                      <tr key={item.key}>
                        <td>{item.categoria}</td>
                        <td>{item.descricao}</td>
                        <td>R$ {item.valor}</td>
                        <td>{item.dataVencimento ? moment(item.dataVencimento).format("DD/MM/YYYY") : ''}</td>
                        {item.situacao === "Pendente" && <td className="status-pending">{item.situacao}</td>}
                        {item.situacao === "Pago" && <td className="status-paid">{item.situacao}</td>}
                        {item.situacao === "Atrasado" && <td className="status--unpaid">{item.situacao}</td>}
                        <td><FiEdit onClick={() => { openSituacaoModal(item) }} className="optIcon" /></td>
                        <td><FiX onClick={() => { excluirDebits(item.key, item.usuario) }} className="optIcon" /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debits;
