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
                totalmeses: data.totalmeses
            })
            .then(() => {
                toast.success('Simulação cadastrada')
            })
            .catch(err => {
                console.log(err)
                toast.error('Algo deu errado')
            })

            getSimulations();
    }

    async function getSimulations() {
        setSimularion([])
        await firebase.firestore().collection('simulations')
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
                    key:doc.data().id,
                    usuario: doc.data().usuario,
                    objetivo: doc.data().objetivo,
                    valorinicial: doc.data().valorinicial,
                    aportemensal: doc.data().aportemensal,
                    tempoinvestido: doc.data().tempoinvestido,
                    rendimentomensal: doc.data().rendimentomensal,
                    saldofinal: doc.data().saldofinal,
                    retornomensal: doc.data().retornomensal,
                    retornoanual: doc.data().retornoanual,
                    totalmeses: doc.data().totalmeses
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length - 1]; //Pegando o ultimo documento buscado

            setSimularion(simulation => [...simulation, ...lista]);
            setLastDocs(lastDoc);
        } else {
            setIsEmpty(true);
        }
    }


    return (
        <SimulationContext.Provider value={{
            saveSimulation,
            getSimulations,
            simulation,
            setSimularion
        }}>
            {children}
        </SimulationContext.Provider>
    )
}

export default SimulationProvider;