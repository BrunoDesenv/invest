import { useContext } from 'react';
import './style.css';
import avatar from '../../assets/avatar.png'

import { AuthContext } from '../../contexts/auth'
import { Link } from 'react-router-dom'
import { FiHome, FiUsers, FiSettings, FiTrendingUp, FiShoppingCart } from 'react-icons/fi'

function Header() {

    const { user } = useContext(AuthContext);
    return (
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl} />
            </div>

            <Link to="/dashboard"><FiHome color="FFF" size={24} />Simular</Link>
            <Link to="/simulations"><FiTrendingUp color="FFF" size={24} />Simulações</Link>
            <Link to="/debits"><FiShoppingCart color="FFF" size={24} />Meus Gastos</Link>
            <Link to="/profile"><FiSettings color="FFF" size={24} />Configurações</Link>

        </div>

    )
}

export default Header;