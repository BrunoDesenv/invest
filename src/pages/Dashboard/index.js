import { useEffect, useState, useContext, useCallback } from 'react'
import { AuthContext } from '../../contexts/auth'
import { DebitosContext } from '../../contexts/debitos';
import { InvestimentosContext } from '../../contexts/investimento';

import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiHome } from 'react-icons/fi'

import './style.css';

import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";


function Dashboard() {
  const { user } = useContext(AuthContext);
    
  const { debitos, getDebitos } = useContext(DebitosContext);
  const { investimento, getInvestimentos } = useContext(InvestimentosContext);

  const [dataCategoriasAgrupadas, setDataCategoriasAgrupadas] = useState([]);
  const [dataContasPagoTotal, setContasPagoTotal] = useState([]);
  const [dataInvestimento, setDataInvestimento] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    getDebitos(user.uid);
    getInvestimentos(user.uid);
  }, [])

  useEffect(() => {
    CalculosDebito();    
  }, [debitos])

  useEffect(() => {
    CalculaInvestimento();
  }, [investimento])

  function CalculaInvestimento(){

    let investimentosLocal = [];
    let porcentagem = 0;

    investimento.forEach((inv) => {
      porcentagem = (1 / investimento.length) * 100;
      investimentosLocal.push({ ativo: inv.ativo, porcentagem: parseFloat(porcentagem.toFixed(2)) })
    });
    setDataInvestimento(investimentosLocal);

  }

  function CalculosDebito(){
    let pagamentos = {
      pagar: 0,
      pago: 0
    }
    const categoriasAgrupadas = [];

    debitos.forEach(debito => {
      CalculoPagamentos(pagamentos, debito);
      debugger;
      CalculoCategorias(categoriasAgrupadas, debito);
    });

    categoriasAgrupadas.forEach(categoria => {
      categoria.porcentagem = parseFloat(((1 / categoriasAgrupadas.length) * 100).toFixed(2));
    });

    dataContasPagoTotal.push({ nome: "Pagar", valor: pagamentos.pagar });
    dataContasPagoTotal.push({ nome: "Pago", valor: pagamentos.pago });

    setDataCategoriasAgrupadas(categoriasAgrupadas);
    setContasPagoTotal(dataContasPagoTotal);
  }

  function CalculoPagamentos(pagamentos, debito){
    pagamentos.pagar = parseFloat(debito.valor) + parseFloat(pagamentos.pagar)
    if (debito.situacao === "Pago") {
      pagamentos.pago = parseFloat(debito.valor) + parseFloat(pagamentos.pago);
    }
  }

  function CalculoCategorias(categoriasAgrupadas, debito) {
    let indexCategoria = categoriasAgrupadas.findIndex(categoria => categoria.nome === debito.categoria);
    if(indexCategoria != -1){
      categoriasAgrupadas[indexCategoria].valor += parseFloat(debito.valor);
    }
    else{
      categoriasAgrupadas.push({ nome: debito.categoria, valor: parseFloat(debito.valor), porcentagem: 0 })
    }
  }

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Title nome="DashBoard">
          <FiHome size={25} />
        </Title>
        <div className="container-dash">   
          <div className="charts">
            {/* <div>
              <div className="text-graph">
                Categorias Agrupadas
              </div>
              <PieChart width={730} height={250}>
                <Pie data={dataCategoriasAgrupadas} label dataKey="porcentagem" nameKey="nome" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                  {dataCategoriasAgrupadas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div>   
              <div className="text-graph">
                Contas Pagas VS A Pagar
              </div>
              <PieChart width={730} height={250}>
                <Pie data={dataContasPagoTotal} label dataKey="valor" nameKey="nome" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                  {dataContasPagoTotal.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </div> */}
          </div>

          <div className="charts">
            <div>
              <div className="text-graph">
                Valor Por Categoria
              </div>

              <BarChart
                width={500}
                height={300}
                data={dataCategoriasAgrupadas}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="valor" fill="#8884d8">
                  {dataCategoriasAgrupadas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </div>
            <div>
              <div className="text-graph">
                Meus Investimentos
              </div>
              <BarChart
                width={500}
                height={300}
                data={dataInvestimento}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="ativo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="porcentagem" fill="#8884d8">
                  {dataInvestimento.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </div>
          {/* <div className="charts">
            <div>
              <div className="text-graph">
                % investido por ativo
              </div>
              <PieChart width={730} height={250}>
                <Pie data={dataInvestimento} label dataKey="porcentagem" nameKey="ativo" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                  {dataInvestimento.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div> */}
        </div>

      </div>
      </div>
  );

}
export default Dashboard;
