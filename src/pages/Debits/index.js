import { useEffect, useState, useContext } from 'react'

import { AuthContext } from '../../contexts/auth'
import { DebitosContext } from '../../contexts/debitos';
import Header from '../../components/Header'
import Title from '../../components/Title'

import ReactModal from 'react-modal'

import { FiShoppingCart } from 'react-icons/fi'

import './style.css';


function Debits() {

  const { user, signOut } = useContext(AuthContext);
  const { saveDebitos, debitos, getDebitos } = useContext(DebitosContext);
  const [filtrado, setFiltrado] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [categoria, setCategoria] = useState();
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState();
  const [situacao, setSituacao] = useState(1);
  const [pagar, setPagar] = useState();
  const [pago, setPago] = useState();
  const [essencial, setEssencial] = useState();


  
  function openModal() {
    setIsOpen(true);
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

      if(item.situacao === "Pago"){
        rPago = parseFloat(item.valor) + parseFloat(rPago);
      }

      if(item.categoria === "Divida"){
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
                      <div className="h5">R$ {(user.receita) ? user.receita : 0 }</div>
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
                      <div className="h5">R$ {pagar}</div>
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
                          <div className="h5">R$ {pago}</div>
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
                      <div className="h5">R$ {essencial}</div>
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

                <input value={categoria} placeholder="Categoria" onChange={(e) => setCategoria(e.target.value)} />
                <input value={descricao} placeholder="Descrição" onChange={(e) => setDescricao(e.target.value.replace(',', '.'))} />
                <input value={valor} placeholder="Valor" onChange={(e) => setValor(e.target.value.replace(',', '.'))} />
                <button className="ReactModal__Submit" type="button" onClick={() => { saveValues() }}>Salvar Gasto</button>
              </div>
              <button className="ReactModal__Cancel" onClick={closeModal}>Cancelar</button>
            </div>
          </ReactModal>
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
                    <td className="amount">{item.valor}</td>
                    <td>{item.situacao}</td>
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

export default Debits;
