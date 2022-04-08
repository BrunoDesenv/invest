import { useState, useEffect, createContext } from 'react'
import firebase from '../services/firebaseConnection'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from "uuid";


export const SimulationContext = createContext({})

const listRef = firebase.firestore().collection('simulations').orderBy('created', 'asc').limit(10)


function SimulationProvider({ children }) {

    const [simulation, setSimularion] = useState([])
    const [lastDocs, setLastDocs] = useState();
    const [isEmpty, setIsEmpty] = useState(false);

    async function saveSimulation(data) {

        let id = uuidv4();

        await firebase.firestore().collection('simulations')
            .doc(id).set({
                key: id,
                usuario: data.usuario,
                objetivo: data.objetivo,
                valorinicial: data.valorinicial,
                aportemensal: data.aportemensal,
                tempoinvestido: data.tempoinvestido,
                rendimentomensal: data.rendimentomensal,
                saldofinal: data.saldofinal,
                retornomensal: data.retornomensal,
                retornoanual: data.retornoanual,
                totalmeses: data.totalmeses, 
                categoria: data.invest
            })
            .then(() => {
                toast.success('Simulação cadastrada')
            })
            .catch(err => {
                console.log(err)
                toast.error('Algo deu errado')
            })

            getSimulations(data.usuario);
    }

    async function getSimulations(userId) {
        setSimularion([])
        await firebase.firestore().collection('simulations').where("usuario", "==" ,userId)
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
                    objetivo: doc.data().objetivo,
                    valorinicial: doc.data().valorinicial,
                    aportemensal: doc.data().aportemensal,
                    tempoinvestido: doc.data().tempoinvestido,
                    rendimentomensal: doc.data().rendimentomensal,
                    saldofinal: doc.data().saldofinal,
                    retornomensal: doc.data().retornomensal,
                    retornoanual: doc.data().retornoanual,
                    totalmeses: doc.data().totalmeses, 
                    categoria: doc.data().categoria 
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length - 1]; //Pegando o ultimo documento buscado

            setSimularion(simulation => [...simulation, ...lista]);
            setLastDocs(lastDoc);
        } else {
            setIsEmpty(true);
        }
    }

    async function excluirSimulacao(idSimulacao, userId) {

        await firebase.firestore().collection('simulations')
            .doc(idSimulacao)
            .delete()
            .then(() => {
                toast.success('Dados excluidos')
            })
            .catch(() => {
                toast.success('Não foi possível excluir o registro, tente novamente mais tarde')
            })
            getSimulations(userId);
    }

    async function updateSimulacaoValues(data) {

        await firebase.firestore().collection('simulations')
            .doc(data.key)
            .update({
                usuario: data.usuario,
                objetivo: data.objetivo,
                valorinicial: data.valorinicial,
                aportemensal: data.aportemensal,
                tempoinvestido: data.tempoinvestido,
                rendimentomensal: data.rendimentomensal,
                saldofinal: data.saldofinal,
                retornomensal: data.retornomensal,
                retornoanual: data.retornoanual,
                totalmeses: data.totalmeses, 
                categoria: data.invest

            })
            .then(() => {
                toast.success('Alterado com sucesso')
            })
            .catch((err) => {
                toast.error('Erro')
            })

        getSimulations(data.usuario);

    }

    return (
        <SimulationContext.Provider value={{
            saveSimulation,
            getSimulations,
            simulation,
            setSimularion,
            updateSimulacaoValues,
            excluirSimulacao
        }}>
            {children}
        </SimulationContext.Provider>
    )
}

export default SimulationProvider;