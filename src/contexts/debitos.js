import { useState, createContext } from 'react'
import firebase from '../services/firebaseConnection'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from "uuid";


export const DebitosContext = createContext({})

function DebitosProvider({ children }) {

    const [debitos, setDebitos] = useState([])
    const [lastDocs, setLastDocs] = useState();
    const [isEmpty, setIsEmpty] = useState(false);

    async function saveDebitos(data) {

        let id = uuidv4();

        await firebase.firestore().collection('debits')
            .doc(id).set({
                key: id,
                usuario: data.usuario,
                categoria: data.categoria,
                descricao: data.descricao,
                valor: data.valor,
                situacao: data.situacao
            })
            .then(() => {
                toast.success('Simulação cadastrada')
            })
            .catch(err => {
                console.log(err)
                toast.error('Algo deu errado')
            })

        getDebitos(data.usuario);
    }

    async function updateDebitsValues(data) {

        await firebase.firestore().collection('debits')
            .doc(data.key)
            .update({
                usuario: data.usuario,
                categoria: data.categoria,
                descricao: data.descricao,
                valor: data.valor,
                situacao: data.situacao
            })
            .then(() => {
                toast.success('Alterado com sucesso')
            })
            .catch((err) => {
                toast.success('Erro')
            })

        getDebitos(data.usuario);

    }

    async function excluirDebits(idDebit, userId) {

        await firebase.firestore().collection('debits')
            .doc(idDebit)
            .delete()
            .then(() => {
                console.log('Dados excluidos')
            })
            .catch(() => {
                console.log('erro ao atualizar')
            })
        getDebitos(userId);
    }

    async function getDebitos(userID) {
        setDebitos([])
        await firebase.firestore().collection('debits').where("usuario", "==" ,userID)
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
                    key: doc.data().key,
                    usuario: doc.data().usuario,
                    categoria: doc.data().categoria,
                    descricao: doc.data().descricao,
                    valor: doc.data().valor,
                    situacao: doc.data().situacao
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length - 1]; //Pegando o ultimo documento buscado

            setDebitos(lista.sort(function (a,b) {
                if(a.categoria < b.categoria){
                    return -1;
                }
                else {
                    return true;
                }
            }));

            // setDebitos(debito => [...debito, ...lista]);
            setLastDocs(lastDoc);
        } else {
            setIsEmpty(true);
        }
    }


    return (
        <DebitosContext.Provider value={{
            saveDebitos,
            getDebitos,
            debitos,
            setDebitos,
            updateDebitsValues,
            excluirDebits
        }}>
            {children}
        </DebitosContext.Provider>
    )
}

export default DebitosProvider;