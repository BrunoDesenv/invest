//LIBS
import { useEffect, useState, useContext } from 'react'
import ReactModal from 'react-modal'
import { FiShoppingCart } from 'react-icons/fi'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { toast } from 'react-toastify';


//COMPONENTS
import { AuthContext } from '../../contexts/auth'
import { DebitosContext } from '../../contexts/debitos';
import Header from '../../components/Header'
import Title from '../../components/Title'
import { listarDebitos, listarSituacao } from '../../services/lists'
import Card from '../../components/Card';

//CSS
import './style.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

//List/functions
import { listTipoConta, onRowEditComplete, _listCategoria, _listSituacao } from '../../services/Debit/DebitServices';

//Utils
import { bodyTemplateListByLabel, bodyTemplateListByValue, listTemplateEdit, textTemplateEditor } from '../../Utils';

function Debits() {

  const { user } = useContext(AuthContext);
  const { saveDebitos, updateDebitsValues, excluirDebits, debitos, getDebitos, payDebito } = useContext(DebitosContext);
  const [selecionarItemGrid, setSelecionarItemGrid] = useState()


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

  //Necessário mudar esse item para buscar a informação da lista do DebitService
  //ListTipoConta
  const Fixo = 0
  const Variavel = 1
  const Parcelado = 2


  function openModal() {
    setIsOpen(true);
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
      userId: user.id,
      categoria: categoria,
      descricao: descricao,
      valor: valor,
      situacao: 'Pendente',
      contaFixa: contaFixa,
      dataVencimento: vdata === undefined ? null : vdata,
      quantidadeParcela: qtdParcela === undefined ? null : qtdParcela,
      dataReferencia: mesReferencia,
      dataCadastro: Date()
    }
    saveDebitos(data);
    closeModal();
  }

  async function updateValues() {
    let data = {
      _id: id,
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
    closeSituacaoModal();
  }

  useEffect(() => {
    let situacao = listarSituacao();
    let categorias = listarDebitos();

    SetlistSituacao(situacao);
    SetListCategoria(categorias);

    getDebitos(user.uid)
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


  const limparTudo = () => {
    if (debitos.length === 0) {
      return toast.error("Não existe registro a serem excluido")
    }

    let _itens = [...selecionarItemGrid]
    const confirme = window.confirm("Tem certeza que deseja exluir todos os registro?");

    if (confirme) {
      _itens.forEach(debito => {
        excluirDebits(debito._id, debito.usuario, false);
      });

      return toast.success("Dados excluído");

    }
  }

  const alterar = () => {
    if (debitos.length === 0) {
      return toast.error("Não existe registro a serem excluido")
    }

    let _itens = [...selecionarItemGrid]
    const confirme = window.confirm("Tem certeza que deseja exluir todos os registro?");

    if (confirme) {
      _itens.forEach(debito => {
        payDebito(debito._id);
      });

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

          <div className="actionsArea">
            {/* <button className="ReactModal__Submit" onClick={CriarNovoMes}>Virar Mês</button> */}
            <button className="ReactModal__Submit" onClick={openModal}>+ Novo</button>
            <button className="ReactModal__Clear" onClick={limparTudo}>- Remover</button>
            <button className="ReactModal__Clear" onClick={alterar}>Alterar Status</button>
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


          <div className="card p-fluid">
            <Toolbar className="mb-4 toolbar-main-header" id="toolbar-main-header" ></Toolbar>
            <DataTable className="datatable-main" id="datatable-main" value={debitos} editMode="row" dataKey="_id"
              onRowEditComplete={onRowEditComplete}
              globalFilterFields={['categoria', 'descricao']} responsiveLayout="scroll"
              paginator
              sortMode="multiple"
              paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Exibindo {first} até {last} de {totalRecords}" rows={50} rowsPerPageOptions={[5, 10, 20, 50]}
              selection={selecionarItemGrid} onSelectionChange={e => setSelecionarItemGrid(e.value)}
            >
              <Column selectionMode="multiple" headerStyle={{ width: '5%' }}></Column>
              <Column field="categoria" header="Categoria"
                body={(dataRow) => bodyTemplateListByLabel(dataRow, "categoria", _listCategoria)}
                editor={(options) => listTemplateEdit(options, _listCategoria, "Seleciona uma Categoria")}
                style={{ width: '5%' }} >
              </Column>
              <Column field="descricao" header="Descrição" editor={textTemplateEditor} style={{ width: '5%' }} sortable></Column>
              <Column field="valor" header="Valor" style={{ width: '5%' }} ></Column>
              <Column field="dataVencimento" header="Vencimento" editor={textTemplateEditor} style={{ width: '5%' }} ></Column>
              <Column field="situacao" header="Situação"
                body={(dataRow) => bodyTemplateListByLabel(dataRow, "situacao", _listSituacao)}
                editor={(options) => listTemplateEdit(options, _listSituacao, "Seleciona a Situação")}

                style={{ width: '5%' }} sortable></Column>
              <Column field="contaFixa" header="Tipo de Conta"
                body={(dataRow) => bodyTemplateListByValue(dataRow, "contaFixa", listTipoConta)}
                editor={(options) => listTemplateEdit(options, listTipoConta, "Seleciona o Tipo de Conta")}
                style={{ width: '5%' }} >
              </Column>
              <Column
                header="Ações"
                body={(rowData) => (
                  <button
                    onClick={() => {
                      setId(rowData._id); 
                      setCategoria(rowData.categoria);
                      setDescricao(rowData.descricao);
                      setValor(rowData.valor);
                      setSituacao(rowData.situacao);
                      setContaFixa(rowData.contaFixa);
                      setData(rowData.dataVencimento);
                      setQtdParcela(rowData.quantidadeParcela);
                      setSituacaoIsOpen(true);
                    }}
                  >
                    ✏️
                  </button>
                )}
                style={{ width: '8rem' }}
              />
              {/* <Column field="quantidadeParcela" header="Quantidade de Parcelas" style={{ width: '5%' }} ></Column> */}
              {/* <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debits;
