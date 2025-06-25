import { useState, createContext } from 'react';
import { toast } from 'react-toastify';
import {
  createDebit,
  listDebits,
  updateDebit,
  deleteDebit,
  togglePayDebit
} from '../api/debitos';

export const DebitosContext = createContext({});

function DebitosProvider({ children }) {
  const [debitos, setDebitos] = useState([]);

  async function saveDebitos(data, mostrarMensagem = true) {
    try {
      const created = await createDebit(data);
      setDebitos(prev => [...prev, created]);
      if (mostrarMensagem) {
        toast.success('Débito cadastrado');
      }
    } catch {
      toast.error('Algo deu errado');
    }
  }

  async function updateDebitsValues(data) {
    try {
      const updated = await updateDebit(data._id, data);
      setDebitos(prev =>
        prev.map(d => (d._id === updated._id ? updated : d))
      );
      toast.success('Alterado com sucesso');
    } catch {
      toast.error('Erro ao alterar');
    }
  }

  async function excluirDebits(id, mensagem = true) {
    try {
      await deleteDebit(id);
      setDebitos(prev => prev.filter(d => d._id !== id));
      if (mensagem) {
        toast.success('Dado excluído');
      }
    } catch {
      toast.error('Erro ao excluir');
    }
  }

  async function getDebitos(usuario, dataReferencia) {
    try {
      const list = await listDebits(usuario, dataReferencia);
      setDebitos(list);
    } catch {
      console.log('Erro ao buscar débitos');
    }
  }

  async function getDebitosByMesReferencia(usuario, dataReferencia) {
    await getDebitos(usuario, dataReferencia);
  }

  async function payDebito(id) {
    try {
      const toggled = await togglePayDebit(id);
      setDebitos(prev =>
        prev.map(d => (d._id === toggled._id ? toggled : d))
      );
      return true;
    } catch {
      return false;
    }
  }

  return (
    <DebitosContext.Provider
      value={{
        debitos,
        saveDebitos,
        getDebitos,
        getDebitosByMesReferencia,
        updateDebitsValues,
        excluirDebits,
        payDebito
      }}
    >
      {children}
    </DebitosContext.Provider>
  );
}

export default DebitosProvider;
