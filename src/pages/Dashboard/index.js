import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
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



import { useCurrentPng } from "recharts-to-png";
import FileSaver from "file-saver";


function Dashboard() {
  const { user } = useContext(AuthContext);
  const [getbarChartStackPng, { ref: barChartStackRef, isLoadingBarChartStack }] = useCurrentPng();
  const { debitos, getDebitos } = useContext(DebitosContext);
  const [debitosFiltrados, setDebitosFiltrados] = useState([]);

  const { investimento, getInvestimentos } = useContext(InvestimentosContext);
  const [investimentosFiltrados, setInvestimentosFiltrados] = useState([]);

  const [dataGrapgh, setDataGrapgh] = useState([]);
  const [dataContasPagoTotal, setContasPagoTotal] = useState([]);
  
  const [dataInvestimento, setDataInvestimento] = useState([]);

  const handleComposedDownloadBarChartStack = useCallback(async () => {
    const png = await getbarChartStackPng();
    if (png) {
      FileSaver.saveAs(png, "barChartStick.png");
    }
  }, [getbarChartStackPng]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];


  useEffect(() => {
    getDebitos();
    let debitosFiltrado = debitos.filter(debito => debito.usuario === user.uid);
    setDebitosFiltrados(debitosFiltrado);

    getInvestimentos();
    let investimentosfiltrado = investimento.filter(simulation => simulation.usuario === user.uid);
    setInvestimentosFiltrados(investimentosfiltrado);
    console.log(investimentosFiltrados);
  }, [])

  useEffect(() => {
    let aux = [];
    let pagar = 0;
    let pago = 0;

    if (debitosFiltrados.length > 0) {
      debitosFiltrados.reduce(function (res, currentValue) {
        //Função de calcular os que tem que pagar e os pago
        //se possivel separar em uma funcao
        pagar = parseFloat(currentValue.valor) + parseFloat(pagar)
        if (currentValue.situacao === "Pago") {
          pago = parseFloat(currentValue.valor) + parseFloat(pago);
        }

        //Função que agrupa as categorias
        //Se possivel separar em funcao
        if (!res[currentValue.categoria]) {
          res[currentValue.categoria] = { name: currentValue.categoria, valor: 0, porcentagem: 0 };
          aux.push(res[currentValue.categoria])
        }
        res[currentValue.categoria].valor += parseFloat(currentValue.valor);
        res[currentValue.categoria].porcentagem = 10;
        return res;
      });

      setDataGrapgh(aux);
    }

    dataContasPagoTotal.push({nome: "Pagar", valor: pagar});
    dataContasPagoTotal.push({nome: "Pago", valor: pago});
    setContasPagoTotal([]);
    setContasPagoTotal(dataContasPagoTotal);
 
  }, [debitosFiltrados])

  useEffect(() => {
    let investimentos = [];
    if (investimentosFiltrados.length > 0) {
      investimentosFiltrados.forEach((investimento) => {
        let porcentagem = 0;
        porcentagem = (1 * 100) /  investimentosFiltrados.length;
        investimentos.push({ativo: investimento.ativo , porcentagem: porcentagem})
      });
      setDataInvestimento(investimentos);
    }
  }, [investimentosFiltrados])

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Title nome="DashBoard">
          <FiHome size={25} />
        </Title>
        <div className="container-dash">   
          <div className="charts">
            <div>
              <div className="text-graph">
                Categorias Agrupadas
              </div>
              <PieChart width={730} height={250}>
                <Pie data={dataGrapgh} label dataKey="porcentagem" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                  {dataGrapgh.map((entry, index) => (
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
            </div>
          </div>

          <div className="charts">
            <div>
              <div className="text-graph">
                Valor Por Categoria
              </div>

              <BarChart
                width={500}
                height={300}
                data={dataGrapgh}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="valor" fill="#8884d8">
                  {dataGrapgh.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </div>
            <div>
              <div className="text-graph">
                Simulaçao de Investimentos
              </div>
              <BarChart
                width={500}
                height={300}
                data={investimentosFiltrados}
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
                <Bar dataKey="valorinvestido" fill="#8884d8">
                  {investimentosFiltrados.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </div>
          <div className="charts">
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
          </div>
        </div>

      </div>

      <div className="btnCharts">
        <button className="btnDownload" onClick={handleComposedDownloadBarChartStack}>
          {isLoadingBarChartStack ? 'Downloading...' : 'Download Chart'}
        </button>
      </div>
    </div>
  );

}
export default Dashboard;
