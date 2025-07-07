import { useState, useEffect, createContext } from 'react'
import { login, register } from '../api/auth'
import { toast } from 'react-toastify'
import api from '../api/axios'

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
        setLoadingAuth(true)
        try {
            const { user, token } = await register(nome, email, password)

            setUser(user)
            storageUser(user, token)

            toast.success('Usuário cadastrado com sucesso!')
        } catch (err) {
            console.error(err)
            toast.error('Erro no cadastro. Tente novamente.')
        } finally {
            setLoadingAuth(false)
        }
    }

    function storageUser(user, token) {
        localStorage.setItem('SistemaUser', JSON.stringify(user))
        localStorage.setItem('token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    function signOut() {
        setUser(null);

        localStorage.removeItem('SistemaUser');
        localStorage.removeItem('token');

        delete api.defaults.headers.common['Authorization'];

        toast.success('Desconectado');
    }

    async function signIn(email, password) {
        setLoadingAuth(true)
        try {
            const { user, token } = await login(email, password)
            setUser(user)
            storageUser(user, token)

            toast.success('Bem vindo de volta')
        } catch (err) {
            console.error(err)
            toast.error('Erro ao entrar. Tente novamente.')
        } finally {
            setLoadingAuth(false)
        }
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
            storageUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;