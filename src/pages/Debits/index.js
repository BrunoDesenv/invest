import { useState, useContext, useCallback } from 'react'

import { AuthContext } from '../../contexts/auth'
import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiShoppingCart } from 'react-icons/fi'

import './style.css';

function Debits() {

  const { signOut } = useContext(AuthContext);

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Title nome="Meus Gastos">
          <FiShoppingCart size={25} />
        </Title>
      </div>
    </div >
  );
}

export default Debits;
