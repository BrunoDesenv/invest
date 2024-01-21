import { useState, createContext } from 'react'
import firebase from '../services/firebaseConnection'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from "uuid";


export const DebitosContext = createContext({})

function DebitosProvider({ children }) {

    const [debitos, setDebitos] = useState([])
    const [lastDocs, setLastDocs] = useState();
    const [isEmpty, setIsEmpty] = useState(false);

    async function saveDebitos(data, mostrarMensagem = true) {

        let id = uuidv4();
        await firebase.firestore().collection('debits')
            .doc(id).set({
                key: id,
                usuario: data.usuario,
                categoria: data.categoria,
                descricao: data.descricao,
                valor: data.valor,
                situacao: data.situacao,
                dataVencimento: data.dataVencimento,
                contaFixa: data.contaFixa,
                quantidadeParcela: data.quantidadeParcela,
                dataCadastro: new Date(),
                dataReferencia: data.dataReferencia
            })
            .then(() => {
                if (mostrarMensagem) {
                    toast.success('Débito cadastrado')
                }
            })
            .catch(err => {
                toast.error('Algo deu errado')
            })
    }
    async function updateDebitsValues(data) {
        await firebase.firestore().collection('debits')
            .doc(data.key)
            .update({
                usuario: data.usuario,
                categoria: data.categoria,
                descricao: data.descricao,
                valor: data.valor,
                situacao: (data.situacao === 'Pago') ? 'Pendente' : 'Pago',
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

    async function excluirDebits(idDebit, userId, mensagem = true) {
        await firebase.firestore().collection('debits')
            .doc(idDebit)
            .delete()
            .then(() => {
                if (mensagem) {
                    toast.success("Dado exclído")
                }
            })
            .catch(() => {
                console.log('erro ao atualizar')
            })
    }

    async function getDebitos(userID) {
        setDebitos([])
        await firebase.firestore().collection('debits').where("usuario", "==", userID)
            .get()
            .then((snapshot) => {
                updateState(snapshot);
            })
            .catch((error) => {
                console.log(error)
            })

    }

    async function getDebitosByMesReferencia(userID, dataReferencia) {
        setDebitos([])
        await firebase.firestore().collection('debits').where("usuario", "==", userID)
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
                    situacao: doc.data().situacao,
                    dataVencimento: doc.data().dataVencimento,
                    quantidadeParcela: doc.data().quantidadeParcela ? doc.data().quantidadeParcela : 0,
                    contaFixa: doc.data().contaFixa,
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length - 1]; //Pegando o ultimo documento buscado

            setDebitos(lista.sort(function (a, b) {
                if (a.categoria < b.categoria) {
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

        async function getDebitos(userID) {
            setDebitos([])
            await firebase.firestore().collection('debits').where("usuario", "==", userID)
                .get()
                .then((snapshot) => {
                    updateState(snapshot);
                })
                .catch((error) => {
                    console.log(error)
                })

        }

    }

    async function getDebitoByToken(token) {
        await firebase.firestore().collection('debits').where("token", "==", token)
            .get()
            .then((debito) => {
                if (!debito.empty) {
                    return setDebitos(debito.docs[0].data());
                };
                return setDebitos([]);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async function payDebito(key) {
        await firebase.firestore().collection('debits').doc(key)
            .update('situacao', 'Pago')
            .then(() => {
                return true;
            })
            .catch((err) => {
                console.log(err);
                return false;
            })
    }

    return (
        <DebitosContext.Provider value={{
            saveDebitos,
            getDebitos,
            debitos,
            setDebitos,
            updateDebitsValues,
            excluirDebits,
            getDebitosByMesReferencia,
            getDebitoByToken,
            payDebito
        }}>
            {children}
        </DebitosContext.Provider>
    )
}

export default DebitosProvider;