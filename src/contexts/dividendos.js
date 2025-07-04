import { useState, createContext } from 'react';
import { toast } from 'react-toastify';
import {
  createDividendo,
  listDividendos,
  listDividendosByDataPagamento,
  updateDividendo,
  deleteDividendo
} from '../api/dividendos';

export const DividendosContext = createContext({});

function DividendosProvider({ children }) {
  const [dividendos, setDividendos] = useState([]);
  const [dividendosTotais, setDividendosTotais] = useState([]);

  async function saveDividendos(data, mostrarMensagem = true) {
    try {
      const criado = await createDividendo(data);
      setDividendos(prev => [...prev, criado]);
      setDividendosTotais(prev => [...prev, criado]);
      if (mostrarMensagem) toast.success('Dividendo cadastrado');
    } catch {
      toast.error('Algo deu errado');
    }
  }

  async function updateDividendosValues(data) {
    try {
      const atualizado = await updateDividendo(data._id, data);
      setDividendosTotais(prev =>
        prev.map(d => (d._id === atualizado._id ? atualizado : d))
      );
      setDividendos(prev =>
        prev.map(d => (d._id === atualizado._id ? atualizado : d))
      );
      toast.success('Alterado com sucesso');
    } catch {
      toast.error('Erro ao alterar');
    }
  }

  async function excluirDividendo(id, mensagem = true) {
    try {
      await deleteDividendo(id);
      setDividendos(prev => prev.filter(d => d._id !== id));
      setDividendosTotais(prev => prev.filter(d => d._id !== id));
      if (mensagem) toast.success('Dado excluído');
    } catch {
      toast.error('Erro ao excluir');
    }
  }

  async function getDividendos(usuario) {
    try {
      const lista = await listDividendos(usuario);
      setDividendosTotais(lista);
    } catch {
      console.log('Erro ao buscar dividendos');
    }
  }

  async function getDividendosByDataPagamento(usuario, dataPagamento) {
    try {
      const lista = await listDividendosByDataPagamento(usuario, dataPagamento);
      setDividendos(lista);
    } catch {
      console.log('Erro ao buscar por data de pagamento');
    }
  }

  return (
    <DividendosContext.Provider
      value={{
        dividendos,
        dividendosTotais,
        saveDividendos,
        getDividendos,
        getDividendosByDataPagamento,
        updateDividendosValues,
        excluirDividendo
      }}
    >
      {children}
    </DividendosContext.Provider>
  );
}

export default DividendosProvider;
