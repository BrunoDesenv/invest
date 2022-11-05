import { useEffect, useState, useContext } from 'react'

import { AuthContext } from '../../contexts/auth'
import { DebitosContext } from '../../contexts/debitos';
import Header from '../../components/Header'
import Title from '../../components/Title'
import moment, { locale } from 'moment'

import ReactModal from 'react-modal'
import { listarDebitos, listarSituacao } from '../../services/lists'
import { FiShoppingCart, FiEdit, FiX } from 'react-icons/fi'

import Card from '../../components/Card';

import './style.css';
import { toast } from 'react-toastify';


function Debits() {

  const { updateMesesReferencia, user } = useContext(AuthContext);
  const { saveDebitos, updateDebitsValues, excluirDebits, debitos, getDebitosByMesReferencia } = useContext(DebitosContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [situacaoIsOpen, setSituacaoIsOpen] = useState(false);
  const [id, setId] = useState();

  const [categoria, setCategoria] = useState('Casa');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState();
  const [situacao, setSituacao] = useState(1);
  const [contaFixa, setContaFixa] = useState(1);
  const [pagar, setPagar] = useState();
  const [pago, setPago] = useState();
  const [essencial, setEssencial] = useState();
  const [vdata, setData] = useState();
  const [qtdParcela, setQtdParcela] = useState();

  const [listSituacao, SetlistSituacao] = useState([]);
  const [listCategoria, SetListCategoria] = useState([]);
  const [showGastoGategoria, setShowGastoGategoria] = useState(false);
  const [categoriaSum, setCategoriaSum] = useState([]);
  const [mesReferencia, setMesReferencia] = useState(null)
  const [mesComboBox, setMesComboBox] = useState()
  const mesAtual = new Date().toLocaleString("pt-BR", { month: "long" });
  const [qtdShowMensagemDadosIncompletos, setQtdShowMensagemDadosIncompletos] = useState(0)

  const Fixo = 0
  const Variavel = 1
  const Parcelado = 2

  function virarMes(dataAtual, dataUsuario) {
    SalvarMesUsuario();
    if (dataUsuario == null) {
      dataUsuario = FormatarDataTual(ObterUltimoMesUsuario());
    }

    SalvarMesDebitos(dataUsuario, dataAtual);
    getDebitosByMesReferencia(user.uid, dataAtual);
    setMesReferencia(dataAtual);
    setMesComboBox(mesAtual);
  }

  function SalvarMesUsuario() {
    let mesesReferencia = [];

    if (VerificarSeMesReferenciaVazio()) {
      mesesReferencia.push({ mes: mesAtual });
    }

    //Aqui precisa verificar pois não e para pegar o mês atual e sim o próximo mês
    if (user.mesesReferencia !== undefined) {

      const mesUsuario = ObterUltimoMesUsuario();
      const dataUsuario = FormatarDataTual(mesUsuario);
      const dataAtual = FormatarDataTual(mesAtual);

      if (dataUsuario !== dataAtual) {
        user.mesesReferencia.map((userMesReferencia, index) => {
          mesesReferencia.push({ mes: userMesReferencia.mes });
          mesesReferencia.push({ mes: mesAtual });
        });
      }
    }

    if (mesesReferencia.length > 0) {
      user.mesesReferencia = mesesReferencia;
      updateMesesReferencia(user);
    }
  }


  function VerificarSeMesReferenciaVazio() {
    if (user.mesesReferencia === undefined ||
      user.mesesReferencia === null) {
      return true;
    }
    return false;
  }

  function SalvarMesDebitos(dataUsuario, dataAtual) {
    let debitosFixos = [];
    getDebitosByMesReferencia(user.uid, dataUsuario).then(() => {
      debitosFixos = debitos.filter(x => x.contaFixa == Fixo || x.contaFixa == Parcelado);
      debitosFixos.forEach((debito) => {
        if (debito.contaFixa == Fixo ||
          (debito.contaFixa == Parcelado && debito.quantidadeParcela !== 0)) {

          let deveInserir = DeveInserir(debito);
          if (deveInserir) {
            let debitoFixo = {
              usuario: user.uid,
              categoria: debito.categoria,
              descricao: debito.descricao,
              valor: debito.valor,
              quantidadeParcela: ObterQuantidadeParcela(debito),
              situacao: 'Pendente',
              contaFixa: debito.contaFixa,
              dataVencimento: ObterDataVencimento(debito),
              dataReferencia: dataAtual,
              token: token()
            };
            saveDebitos(debitoFixo, false);
          }
        }
      });
    });
  }

  const token = () => {
    return rand() + rand();
  };

  const rand = () => {
    return Math.random().toString(36).slice(2);
  };

  function ObterDataVencimento(debito) {
    let dataVencimento = null;
    if (debito.dataVencimento !== null && debito.dataVencimento !== '') {
      dataVencimento = new Date(debito.dataVencimento);
      dataVencimento = new Date(dataVencimento.setMonth(dataVencimento.getMonth() + 1))
    }
    return dataVencimento;
  }

  function ObterQuantidadeParcela(debito) {
    if (debito.quantidadeParcela !== undefined &&
      debito.quantidadeParcela !== null) {
      return debito.quantidadeParcela - 1;
    }
    return 0;
  }

  function DeveInserir(debito) {
    if (parseInt(debito.contaFixa) == Parcelado &&
      ObterQuantidadeParcela(debito) === 0) {
      return false;
    }
    return true;
  }

  function openModal() {
    setIsOpen(true);
  }

  function openSituacaoModal(item) {
    setCategoria(item.categoria);
    setDescricao(item.descricao);
    setSituacao(item.situacao);
    setValor(item.valor);
    setQtdParcela(item.quantidadeParcela);
    setId(item.key);
    setSituacaoIsOpen(true);
    setContaFixa(item.contaFixa);
  }

  function closeSituacaoModal() {
    setSituacaoIsOpen(false);
    setCategoria('Casa');
    setDescricao();
    setValor();
    setSituacao();
    setQtdParcela();
    setContaFixa(1);
  }

  function closeModal() {
    setIsOpen(false);
    setCategoria('Casa');
    setDescricao();
    setValor();
    setSituacao();
    setQtdParcela();
    setContaFixa(1);
  }

  function saveValues() {
    let data = {
      usuario: user.uid,
      categoria: categoria,
      descricao: descricao,
      valor: valor,
      situacao: 'Pendente',
      contaFixa: contaFixa,
      dataVencimento: vdata === undefined ? null : vdata,
      quantidadeParcela: qtdParcela === undefined ? null : qtdParcela,
      dataReferencia: mesReferencia
    }
    saveDebitos(data);
    getDebitosByMesReferencia(user.uid, mesReferencia);
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
      contaFixa: parseInt(contaFixa),
      dataVencimento: vdata === undefined ? null : vdata,
      quantidadeParcela: qtdParcela
    }
    updateDebitsValues(data);
    getDebitosByMesReferencia(user.uid, mesReferencia);
    closeSituacaoModal();
  }

  useEffect(() => {
    let situacao = listarSituacao();
    let categorias = listarDebitos();

    SetlistSituacao(situacao);
    SetListCategoria(categorias);
    ObterMesReferencia();
  }, [])

  ///
  //Se o usuario não tiver data de referencia irá pegar a atual
  //caso ao contrario pega do propio usuario
  ///
  function ObterMesReferencia() {
    let mesesReferencia = user.mesesReferencia;

    if (mesesReferencia !== undefined &&
      mesesReferencia !== null) {
      const mes = ObterMes(mesesReferencia[mesesReferencia.length - 1].mes);
      const dataReferencia = moment(Date()).format("01/" + mes + "/YYYY");

      setMesReferencia(dataReferencia);
      let mesUsuario = ObterUltimoMesUsuario();
      setMesComboBox(mesUsuario);
      return;
    }
    setMesReferencia(moment(Date()).format("01/MM/YYYY"));
  }

  useEffect(() => {
    if (mesReferencia !== undefined && user.mesesReferencia !== undefined) {
      getDebitosByMesReferencia(user.uid, mesReferencia);
    }
    else {
      toast.error("No momento alguns dos seus dados de débito estão incompletos. Por gentileza verifique.");
      setQtdShowMensagemDadosIncompletos(2)
    }
  }, [mesReferencia])

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
    result = debitos.reduce(function (res, value) {
      if (!res[value.categoria]) {
        res[value.categoria] = { Id: value.categoria, valor: 0 };
        result.push(res[value.categoria])
      }
      res[value.categoria].valor += parseFloat(value.valor);
      return res;
    }, {});

    setCategoriaSum(result);
  }

  function MudarMesComboBox(mes) {
    let mesMoment = ObterMes(mes);
    let mesReferenciaSelecionado = FormatarDataTual(mesMoment);

    setMesReferencia(mesReferenciaSelecionado);
    getDebitosByMesReferencia(user.uid, mesReferenciaSelecionado);
    setMesComboBox(mes);
  }

  function ObterMes(mes) {

    switch (mes) {
      case 'janeiro':
        mes = 'January ';
        break
      case 'fevereiro':
        mes = 'February';
        break
      case 'março':
        mes = 'March';
        break
      case 'abril':
        mes = 'April';
        break
      case 'maio':
        mes = 'May';
        break
      case 'junho':
        mes = 'June';
        break
      case 'julho':
        mes = 'July';
        break
      case 'agosto':
        mes = 'August';
        break
      case 'setembro':
        mes = 'September';
        break
      case 'outubro':
        mes = 'October';
        break
      case 'novembro':
        mes = 'November';
        break
      case 'dezembro':
        mes = 'December';
        break
    }

    return moment().month(mes).format("MM");
  }

  function FormatarDataTual(mes) {
    if (mes.length > 2) {
      mes = ObterMes(mes);
    }
    return moment(Date()).format("01/" + mes + "/YYYY");
  }

  function ObterUltimoMesUsuario() {
    if (VerificarSeMesReferenciaVazio()) {
      user.mesesReferencia = [];
      user.mesesReferencia.push({ mes: mesAtual });
      return user.mesesReferencia[user.mesesReferencia.length - 1].mes;
    }

    if (user.mesesReferencia !== undefined) {
      return user.mesesReferencia[user.mesesReferencia.length - 1].mes;
    }
  }

  const limparTudo = () => {
    if (debitos.length === 0) {
      return toast.error("Não existe registro a serem excluido")
    }

    const confirme = window.confirm("Tem certeza que deseja exluir todos os registro?");

    if (confirme) {
      debitos.forEach(debito => {
        excluirDebits(debito.key, debito.usuario, false);
      });

      return toast.success("Dados excluído");

    }
  }

  const CriarNovoMes = () => {
    let mes = ObterMes(mesAtual);
    let dataAtual = FormatarDataTual(mes);
    let dataUsuario;

    if (!VerificarSeMesReferenciaVazio()) {
      dataUsuario = FormatarDataTual(ObterUltimoMesUsuario());
      if (dataUsuario === dataAtual) {
        return toast.error("Você já possui o mês vigente cadastrado.")
      }
    }

    const confirme = window.confirm("Essa ação irá virar o mês levando as contas fixas para o próximo mês. Deseja continuar ?");
    if (confirme) {
      virarMes(dataAtual, dataUsuario);
      return toast.success("Mês criado com sucesso.");
    };
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
            {showGastoGategoria &&
              Object.values(categoriaSum).map((categoria, index) => {
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
              })}
          </div>

          <div>

            <span className='tMes'>Mês</span>
            {user.mesesReferencia !== undefined ?
              (<select
                value={mesComboBox}
                className="cmbMes"
                onChange={e => MudarMesComboBox(e.target.value)}>
                {user.mesesReferencia.map((item, index) => (
                  <option key={item.mes} value={item.mes}>{item.mes}</option>
                ))}
              </select>) : (
                <select
                  value={mesComboBox}
                  onChange={e => MudarMesComboBox(e.target.value)}>
                  <option key={mesAtual} value={mesAtual}>{mesAtual}</option>
                </select>
              )}

          </div>
          <div className="actionsArea">
            <button className="ReactModal__Submit" onClick={CriarNovoMes}>Virar Mês</button>
            <button className="ReactModal__Submit" onClick={openModal}>+ Novo</button>
            <button className="ReactModal__Clear" onClick={limparTudo}>Limpar tudo</button>
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

                <select value={contaFixa} onChange={e => setContaFixa(e.target.value)}>
                  <option value={Fixo}>Fixo</option>
                  <option value={Variavel}>Variavel</option>
                  <option value={Parcelado}>Parcelado</option>
                </select>

                {parseInt(contaFixa) === Parcelado ? (
                  <input type="number" value={qtdParcela} placeholder="Quantidade de Parcelas" onChange={(e) => setQtdParcela(e.target.value)} />
                ) : (
                  null
                )}

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

                <select value={contaFixa} onChange={e => setContaFixa(e.target.value)}>
                  <option value={Fixo}>Fixo</option>
                  <option value={Variavel}>Variavel</option>
                  <option value={Parcelado}>Parcelado</option>
                </select>

                {parseInt(contaFixa) === Parcelado ? (
                  <input type="number" value={qtdParcela} placeholder="Quantidade de Parcelas" onChange={(e) => setQtdParcela(e.target.value)} />
                ) : (
                  null
                )}

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
                    <th>Conta Fixa</th>
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
                        <td>{item.dataVencimento !== null &&
                          item.dataVencimento !== undefined &&
                          item.dataVencimento !== '' ? moment(item.dataVencimento).format("DD/MM/YYYY") : ''}</td>
                        {item.situacao === "Pendente" && <td className="status-pending">{item.situacao}</td>}
                        {item.situacao === "Pago" && <td className="status-paid">{item.situacao}</td>}
                        {item.situacao === "Atrasado" && <td className="status--unpaid">{item.situacao}</td>}
                        {parseInt(item.contaFixa) === Fixo && <td className="status-pending">Fixa</td>}
                        {parseInt(item.contaFixa) === Variavel && <td className="status-pending">Variavel</td>}
                        {parseInt(item.contaFixa) === Parcelado && <td className="status--unpaid">Parcelado</td>}
                        {item.contaFixa === undefined && <td className="status--unpaid">Não Informado</td>}
                        <td><FiEdit onClick={() => { openSituacaoModal(item) }} className="optIcon" /></td>
                        <td><FiX onClick={() => {
                          excluirDebits(item.key, item.usuario);
                          getDebitosByMesReferencia(user.uid, mesReferencia);
                        }} className="optIcon" /></td>
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
