import { useState, useEffect, createContext } from 'react'
import firebase from '../services/firebaseConnection'
import { toast } from 'react-toastify'

export const AuthContext = createContext({})


function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [load, setLoad] = useState(true);

    useEffect(() => {

        const storageUser = localStorage.getItem('SistemaUser');

        if (storageUser) {
            setUser(JSON.parse(storageUser));
            setLoad(false);
        }

        setLoad(false);

    }, [])


    async function signUp(email, password, nome) {
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;

                await firebase.firestore().collection('users')
                    .doc(uid).set({
                        nome: nome,
                        avatarUrl: null, 
                        receita: 0
                    })
                    .then(() => {
                        let data = {
                            uid: uid,
                            nome: nome,
                            email: value.user.email,
                            avatarUrl: null, 
                        }
                        setUser(data);
                        storageUser(data);
                        setLoadingAuth(false);
                        toast.success('Usuario cadastrado')


                    })
            })
            .catch(err => {
                console.log(err)
                toast.error('Algo deu errado')
                setLoadingAuth(false)
            })
    }

    function storageUser(data) {
        localStorage.setItem('SistemaUser', JSON.stringify(data))
    }

    async function signOut() {
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        toast.success('Desconectado')
        setUser(null);
    }

    async function signIn(email, password) {
        setLoadingAuth(true);
        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;

                const userProfile = await firebase.firestore().collection('users')
                    .doc(uid).get();

                let data = {
                    uid: uid,
                    nome: userProfile.data().nome,
                    avatarUrl: userProfile.data().avatarUrl,
                    email: value.user.email, 
                    receita: userProfile.data().receita
                };

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success('Bem vindo de volta')

            })
            .catch((err) => {
                console.log(err)
                toast.error('Algo deu errado')
                setLoadingAuth(false);
            })
    }
    
    function forgot(email){
        firebase.auth().sendPasswordResetEmail(email)
        .then((response)=>{ 
            console.log("response", response);
            toast.success('Verifique seu e-mail para alterar a senha');
        })
        .catch((error)=>{
            console.log("error", error) 
            toast.error('Ocorreu um erro, tente novamente mais tarde');    
        });
    }

    return (
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            load,
            signUp,
            signOut,
            signIn,
            loadingAuth, 
            setUser, 
            storageUser,
            forgot
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;