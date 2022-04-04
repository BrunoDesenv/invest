import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import './forgot.css'

import { AuthContext } from '../../contexts/auth'

import logo from '../../assets/logo2.png'

function Forgot() {

  const [email, setEmail] = useState('');
  const { forgot, loadingAuth } = useContext(AuthContext);

  const navegate = useNavigate();

  function handledSubmit(e) {
    e.preventDefault();

    if(email === ''){
      return toast.error('É necessário informar um e-mail');
    }

    if(email){
      forgot(email);
      setEmail('');
      setTimeout(() => { navegate('/'); }, 10)      
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="logo-area">
          <img src={logo} alt="logo sistema" />
        </div>

        <form onSubmit={handledSubmit}>
          <h1>Esqueci minha senha</h1>
          <input type="text" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" >{loadingAuth ? 'Preparando tudo...' : 'Enviar'}</button>
        </form>

        <Link to="/">Já tem uma conta? Entre</Link>
      </div>
    </div>
  );
}

export default Forgot;
