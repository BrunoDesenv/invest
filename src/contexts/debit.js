import { useState, useEffect, createContext } from 'react'
import firebase from '../services/firebaseConnection'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from "uuid";


export const DebitContext = createContext({})

const listRef = firebase.firestore().collection('debits').orderBy('created', 'asc').limit(10)


function DebitProvider({ children }) {

    const [debit, setDebit] = useState([])
    const [lastDocs, setLastDocs] = useState();
    const [isEmpty, setIsEmpty] = useState(false);

    async function saveDebit(data) {
        debugger;
        let id = uuidv4();

        await firebase.firestore().collection('debits')
            .doc(id).set({
                key: id,
                usuario: data.usuario,
                categoria: data.categoria,
                descricao: data.descricao,
                valor: data.valor,
                pago: data.pago,
            })
            .then(() => {
                toast.success('Despesa cadastrada')
            })
            .catch(err => {
                console.log(err)
                toast.error('Algo deu errado')
            })
    }

    async function getDebits(userId) {
        setDebit([])
        await firebase.firestore().collection('debits')
            .get()
            .then((snapshot) => {
                updateState(snapshot);
                debugger;
                let filtrado = debit.filter(debit => debit.usuario == userId);
                // setSimularion(filtrado);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;
        debugger;
        if (!isCollectionEmpty) {
            let lista = [];

            snapshot.forEach((doc) => {
                lista.push({
                    usuario: doc.data().usuario,
                    categoria: doc.data().categoria,
                    descricao: doc.data().descricao,
                    valor: doc.data().valor,
                    pago: doc.data().pago
                })
            })
            debugger;
            const lastDoc = snapshot.docs[snapshot.docs.length - 1]; //Pegando o ultimo documento buscado

            setDebit(debit => [...debit, ...lista]);
            setLastDocs(lastDoc);
        } else {
            setIsEmpty(true);
        }
    }


    return (
        <DebitContext.Provider value={{
            saveDebit,
            getDebits,
            debit,
            setDebit
        }}>
            {children}
        </DebitContext.Provider>
    )
}

export default DebitProvider;