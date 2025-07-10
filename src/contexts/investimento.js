import { useState, createContext } from 'react';
import { toast } from 'react-toastify';
import {
  createInvestment,
  listInvestments,
  updateInvestment,
  deleteInvestment
} from '../api/investments';

export const InvestimentosContext = createContext({});

function InvestimentosProvider({ children }) {
  const [investimentos, setInvestimentos] = useState([]);

  async function saveInvestimentos(payload) {
    try {
      const inv = await createInvestment(payload);
      setInvestimentos(prev => [...prev, inv]);
      toast.success('Simulação cadastrada');
      getInvestimentos(payload.userId);
    } catch (err) {
      console.error('Erro ao criar investimento:', err);
      toast.error('Algo deu errado');
    }
  }

  async function getInvestimentos(userId) {
    try {
      console.log('Buscando investimentos para o usuário:', userId);
      const list = await listInvestments(userId);
      setInvestimentos(list);
    } catch (err) {
      console.error('Erro ao buscar investimentos:', err);
    }
  }

  async function excluirInvestimento(id, userId) {
    try {
      await deleteInvestment(id);
      toast.success('Dados excluídos');
      getInvestimentos(userId);
    } catch {
      toast.error('Não foi possível excluir o registro');
    }
  }

  async function updateInvestimentoValues(data) {
    try {
      await updateInvestment(data._id, data);
      toast.success('Alterado com sucesso');
      getInvestimentos(data.userId);
    } catch {
      toast.error('Erro ao alterar investimento');
    }
  }

  return (
    <InvestimentosContext.Provider
      value={{
        investimentos,
        saveInvestimentos,
        getInvestimentos,
        excluirInvestimento,
        updateInvestimentoValues
      }}
    >
      {children}
    </InvestimentosContext.Provider>
  );
}

export default InvestimentosProvider;
