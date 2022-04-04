import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import './signin.css'
import { AuthContext } from '../../contexts/auth'

import logo from '../../assets/logo2.png'

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loadingAuth } = useContext(AuthContext);

  function handledSubmit(e) {
    e.preventDefault();
    if (email !== '' && password !== '') {
      signIn(email, password)
    }
  }


  return (
    <div className="container-center">
      <div className="login">
        <div className="logo-area">
          <img src={logo} alt="logo sistema" />
        </div>

        <form onSubmit={handledSubmit}>
          <h1>Entrar</h1>
          <input type="text" placeholder="email@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">{loadingAuth ? 'Carregando...' : 'Acessar' }</button>
        </form>

        <div className='info'>
          <Link className='register' to="/register">Cadastre-se</Link>
          <Link className ='forgot' to="/forgot">Esqueceu a senha?</Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
