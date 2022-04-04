import { useEffect, useState, useContext } from 'react'

import { AuthContext } from '../../contexts/auth'
import { DebitosContext } from '../../contexts/debitos';
import Header from '../../components/Header'
import Title from '../../components/Title'
import { toast } from 'react-toastify'

import ReactModal from 'react-modal'

import { FiShoppingCart, FiEdit, FiX } from 'react-icons/fi'

import './style.css';


function Debits() {

  const { user, signOut } = useContext(AuthContext);
  const { saveDebitos, updateDebitsValues, excluirDebits, debitos, getDebitos } = useContext(DebitosContext);
  const [filtrado, setFiltrado] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [situacaoIsOpen, setSituacaoIsOpen] = useState(false);
  const [id, setId] = useState();


  const [categoria, setCategoria] = useState();
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState();
  const [situacao, setSituacao] = useState(1);
  const [pagar, setPagar] = useState();
  const [pago, setPago] = useState();
  const [essencial, setEssencial] = useState();

  const listSituacao = [
    { id: 1, name: 'Pago' },
    { id: 2, name: 'Pendente' },
    { id: 3, name: 'Atrasado' }
  ];

  const listCategoria = [
    { id: 1, name: 'Casa' },
    { id: 2, name: 'Investimentos' },
    { id: 3, name: 'Responsabilidade' },
    { id: 4, name: 'Pessoal' },
    { id: 5, name: 'Dívida' }
  ];



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
    setCategoria();
    setDescricao();
    setValor();
    setSituacao();
  }

  function closeModal() {
    setIsOpen(false);
    setCategoria();
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
      situacao: 'Pendente'
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
      situacao: situacao
    }

    updateDebitsValues(data);
    closeSituacaoModal();
  }


  useEffect(() => {
    getDebitos();
    let filtrado = debitos.filter(debito => debito.usuario === user.uid);
    setFiltrado(filtrado);
  }, [])

  useEffect(() => {
    let filtrado = debitos.filter(debito => debito.usuario === user.uid);
    setFiltrado(filtrado);
  }, [debitos])


  useEffect(() => {
    let rPagar = 0;
    let rPago = 0;
    let rEssencial = 0;


    filtrado.forEach((item) => {
      rPagar = parseFloat(item.valor) + parseFloat(rPagar);

      if (item.situacao === "Pago") {
        rPago = parseFloat(item.valor) + parseFloat(rPago);
      }

      if (item.categoria === "Casa" || item.categoria === "Dívida" || item.categoria === "Responsabilidades") {
        rEssencial = parseFloat(item.valor) + parseFloat(rEssencial);
      }
    })

    setPagar(rPagar);
    setPago(rPago);
    setEssencial(rEssencial);

  }, [filtrado]);

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
            <div className="col-xl-3">
              <div className="card border-left-primary">
                <div className="card-body">
                  <div className="row">
                    <div className="col mr-2">
                      <div className="text-xs">
                        Receita (Mês)</div>
                      <div className="h5">R$ {(user.receita) ? Number(user.receita).toFixed(2).replace('.', ',') : 0}</div>
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
                        A Pagar (Mensal)</div>
                      <div className="h5">R$ {Number(pagar).toFixed(2).replace('.', ',')}</div>
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
                        Pago
                      </div>
                      <div className="row no-gutters">
                        <div className="col-auto">
                          <div className="h5">R$ {Number(pago).toFixed(2).replace('.', ',')}</div>
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
                        Total Essencial</div>
                      <div className="h5">R$ {Number(essencial).toFixed(2).replace('.', ',')}</div>
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
                <h2>Novo Gasto</h2>
                <select value={categoria} onChange={e => setCategoria(e.target.value)}>
                  {listCategoria.map((item, index) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </select>
                <input value={descricao} placeholder="Descrição" onChange={(e) => setDescricao(e.target.value.replace(',', '.'))} />
                <input value={valor} placeholder="Valor" onChange={(e) => setValor(e.target.value.replace(',', '.'))} />
                <button className="ReactModal__save" type="button" onClick={() => { saveValues() }}>Salvar Gasto</button>
              </div>
              <button className="ReactModal__Cancel" onClick={closeModal}>Cancelar</button>
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
                <input value={categoria} placeholder="Categoria" onChange={(e) => setCategoria(e.target.value)} />
                <input value={descricao} placeholder="Descrição" onChange={(e) => setDescricao(e.target.value.replace(',', '.'))} />
                <input value={valor} placeholder="Valor" onChange={(e) => setValor(e.target.value.replace(',', '.'))} />

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
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrado.map((item) => {
                    return (
                      <tr key={item.key}>
                        <td>{item.categoria}</td>
                        <td>{item.descricao}</td>
                        <td>{item.valor}</td>
                        {item.situacao === "Pendente" && <td className="status-pending">{item.situacao}</td>}
                        {item.situacao === "Pago" && <td className="status-paid">{item.situacao}</td>}
                        {item.situacao === "Atrasado" && <td className="status--unpaid">{item.situacao}</td>}
                        <td><FiEdit onClick={() => { openSituacaoModal(item) }} className="optIcon" /></td>
                        <td><FiX onClick={() => { excluirDebits(item.key) }} className="optIcon" /></td>
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
