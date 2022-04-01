import { useState, useContext, useCallback } from 'react'

import { AuthContext } from '../../contexts/auth'
import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiTrendingUp } from 'react-icons/fi'

import './style.css';


function Simulation() {

  const { signOut } = useContext(AuthContext);

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Title nome="Simulações">
          <FiTrendingUp size={25} />
        </Title>

      </div>
    </div >
  );
}

export default Simulation;
