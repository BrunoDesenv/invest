import { useState, createContext } from 'react'
import firebase from '../services/firebaseConnection'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from "uuid";
import moment from 'moment'

export const DividendosContext = createContext({})

function DividendosProvider({ children }) {

    const [dividendos, setDividendos] = useState([]);
    const [dividendosTotais, setDividendosTotais] = useState([])

    async function saveDividendos(data, mostrarMensagem = true) {

        let id = uuidv4();
        await firebase.firestore().collection('dividendos')
            .doc(id).set({
                key: id,
                usuario: data.usuario,
                ativo: data.ativo,
                valor: data.valor,
                dataPagamento: data.dataPagamento,
                dataCadastro: moment(new Date()).format("DD/MM/YYYY"),
            })
            .then(() => {
                if(mostrarMensagem)
                {
                    setDividendos([...dividendos, data]);
                    toast.success('Dividendo cadastrado');
                }
            })
            .catch(err => {
                toast.error('Algo deu errado')
            })
    }
    async function updateDividendosValues(data) {
        await firebase.firestore().collection('dividendos')
            .doc(data.key)
            .update({
                usuario: data.usuario,
                categoria: data.categoria,
                descricao: data.descricao,
                valor: data.valor,
                situacao: data.situacao, 
                dataVencimento: data.dataVencimento,
                contaFixa: data.contaFixa,
                quantidadeParcela: data.quantidadeParcela,
            })
            .then(() => {
                toast.success('Alterado com sucesso')
            })
            .catch((err) => {
                toast.success('Erro')
            })
    }

    async function excluirDividendo(idDividendo, mensagem = true) {
        await firebase.firestore().collection('dividendos')
            .doc(idDividendo)
            .delete()
            .then(() => {
                if(mensagem){
                   toast.success("Dado excluído")
                }               
            })
            .catch(() => {
                console.log('erro ao atualizar')
            })
    }

    async function getDividendos(userID) {
        setDividendosTotais([]);
        await firebase.firestore().collection('dividendos').where("usuario", "==", userID)
            .get()
            .then((snapshot) => {
                updateState(snapshot);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async function getDividendosByDataPagamento(userID, dataPagamento) {
        setDividendos([]);
        await firebase.firestore().collection('dividendos').where("usuario", "==" ,userID)
            .get()
            .then((snapshot) => {
                updateStateByDataPagamento(snapshot, dataPagamento);
            })
            .catch((error) => {
                console.log(error)
            })

    }

    async function updateStateByDataPagamento(snapshot, dataPagamento) {
        const isCollectionEmpty = snapshot.size === 0;
        if (!isCollectionEmpty) {
            let lista = [];
            snapshot.forEach((doc) => {
                if(doc.data().dataPagamento.substring(3, 10) == dataPagamento.substring(3, 10)){
                    lista.push({
                        key: doc.data().key,
                        usuario: doc.data().usuario,  
                        ativo: doc.data().ativo,              
                        valor: doc.data().valor,                 
                        dataPagamento: doc.data().dataPagamento,
                    });
                }
            })
            setDividendos(lista);
        } else {
            setDividendos([]);
        }
    }

    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;

        if (!isCollectionEmpty) {
            let lista = [];
            snapshot.forEach((doc) => {
                lista.push({
                    key: doc.data().key,
                    usuario: doc.data().usuario,  
                    ativo: doc.data().ativo,              
                    valor: doc.data().valor,                 
                    dataPagamento: doc.data().dataPagamento,
                })
            });
            setDividendosTotais(lista);
        } else {
            setDividendosTotais([]);
        }
    }

    return (
        <DividendosContext.Provider value={{
            saveDividendos,
            getDividendos,
            getDividendosByDataPagamento,
            dividendos,
            dividendosTotais,
            setDividendos,
            updateDividendosValues,
            excluirDividendo
        }}>
            {children}
        </DividendosContext.Provider>
    )
}

export default DividendosProvider;