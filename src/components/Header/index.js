import { useContext } from 'react';
import './style.css';
import avatar from '../../assets/avatar.png'

import { AuthContext } from '../../contexts/auth'
import { Link } from 'react-router-dom'
import { FiHome, FiLogOut, FiSettings, FiTrendingUp, FiShoppingCart, FiDollarSign } from 'react-icons/fi'

function Header() {

    const { user, signOut } = useContext(AuthContext);
    return (
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl} />
            </div>

            <Link to="/dashboard"><FiHome color="FFF" size={24} />Dashboard</Link>
            <Link to="/simulacoes"><FiTrendingUp color="FFF" size={24} />Simular Objetivos</Link>
            <Link to="/investimentos"><FiDollarSign color="FFF" size={24} />Meus Investimentos</Link>
            <Link to="/debitos"><FiShoppingCart color="FFF" size={24} />Meus Gastos</Link>  
            <Link to="/perfil"><FiSettings color="FFF" size={24} />Configurações</Link>
            <a className="logout-btn-menu" onClick={() => { signOut() }}>
            <FiLogOut color="FFF" size={24} />Sair
            </a>

        </div>

    )
}

export default Header;