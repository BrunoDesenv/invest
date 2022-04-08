import { useState, useEffect, createContext } from 'react'
import firebase from '../services/firebaseConnection'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from "uuid";


export const InvestimentosContext = createContext({})

function InvestimentosProvider({ children }) {

    const [investimento, setInvestimentos] = useState([])
    const [lastDocs, setLastDocs] = useState();
    const [isEmpty, setIsEmpty] = useState(false);

    async function saveInvestimentos(data) {

        let id = uuidv4();

        await firebase.firestore().collection('Investimentos')
            .doc(id).set({
                key: id,
                usuario: data.usuario,
                ativo: data.ativo,
                valorinvestido: data.valorinvestido,
                taxaam: data.taxaam,
                retornomensal: data.retornomensal,
                retornoanual: data.retornoanual,
                invest: data.invest
            })
            .then(() => {
                toast.success('Simulação cadastrada')
            })
            .catch(err => {
                console.log(err)
                toast.error('Algo deu errado')
            })

            getInvestimentos();
    }

    async function getInvestimentos() {
        setInvestimentos([])
        await firebase.firestore().collection('Investimentos')
            .get()
            .then((snapshot) => {
                updateState(snapshot);
            })
            .catch((error) => {
                console.log(error)
            })
            
    }

    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;

        if (!isCollectionEmpty) {
            let lista = [];

            snapshot.forEach((doc) => {
                lista.push({
                    key:doc.data().key,
                    usuario: doc.data().usuario,
                    ativo: doc.data().ativo,
                    valorinvestido: doc.data().valorinvestido, 
                    taxaam: doc.data().taxaam,
                    retornomensal: doc.data().retornomensal,
                    retornoanual: doc.data().retornoanual,
                    invest: doc.data().invest
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length - 1]; //Pegando o ultimo documento buscado

            setInvestimentos(investimento => [...investimento, ...lista]);
            setLastDocs(lastDoc);
        } else {
            setIsEmpty(true);
        }
    }

    async function excluirInvestimento(idInvestimento) {

        await firebase.firestore().collection('Investimentos')
            .doc(idInvestimento)
            .delete()
            .then(() => {
                toast.success('Dados excluidos')
            })
            .catch(() => {
                toast.success('Não foi possível excluir o registro, tente novamente mais tarde')
            })
            getInvestimentos();
    }

    async function updateInvestimentoValues(data) {

        await firebase.firestore().collection('Investimentos')
            .doc(data.key)
            .update({
                ativo: data.ativo,
                valorinvestido: data.valorinvestido,
                taxaam: data.taxaam,
                retornomensal: data.retornomensal,
                retornoanual: data.retornoanual,
                invest: data.invest
            })
            .then(() => {
                toast.success('Alterado com sucesso')
            })
            .catch((err) => {
                toast.error('Erro')
            })

        getInvestimentos();

    }

    return (
        <InvestimentosContext.Provider value={{
            saveInvestimentos,
            getInvestimentos,
            investimento,
            setInvestimentos,
            excluirInvestimento,
            updateInvestimentoValues
        }}>
            {children}
        </InvestimentosContext.Provider>
    )
}

export default InvestimentosProvider;