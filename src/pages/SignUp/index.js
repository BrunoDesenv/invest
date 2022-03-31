import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import './signup.css'

import { AuthContext } from '../../contexts/auth'

import logo from '../../assets/logo2.png'

function SignUp() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  function handledSubmit(e) {
    e.preventDefault();

    if(nome !== '' && email !== '' && password !== '') {

      signUp(email, password, nome);
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="logo-area">
          <img src={logo} alt="logo sistema" />
        </div>

        <form onSubmit={handledSubmit}>
          <h1>Criar conta</h1>
          <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input type="text" placeholder="email@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">{loadingAuth ? 'Preparando tudo...' : 'Cadastrar' }</button>
        </form>

        <Link to="/">Já tem uma conta? Entre</Link>
      </div>
    </div>
  );
}

export default SignUp;
