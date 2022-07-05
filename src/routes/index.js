
import { Routes, Route } from 'react-router-dom';

import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import Debits from '../pages/Debits'
import Simulation from '../pages/Simulation'
import Investimento from '../pages/Investimentos'
import Forgot from '../pages/Forgot';
import ContaPaga from '../pages/ContaPaga';

import RequireAuth from './requireAuth'
import Dividendos from '../pages/Dividendos';



export default function Rotas() {

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth redirectTo="/simulacoes">
            <SignIn />
          </RequireAuth>
        }
      />

      <Route
        path="/register"
        element={
          <RequireAuth redirectTo="/simulacoes">
            <SignUp />
          </RequireAuth>
        }
      />

      <Route
        path="/forgot"
        element={
          <RequireAuth redirectTo="/simulacoes">
            <Forgot />
          </RequireAuth>
        }
      />

      <Route
        path="/dashboard"
        element={

          <RequireAuth redirectTo="/" isPrivate>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/perfil"
        element={
          <RequireAuth redirectTo="/" isPrivate>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path="/simulacoes"
        element={
          <RequireAuth redirectTo="/" isPrivate>
            <Simulation />
          </RequireAuth>
        }
      />
      <Route
        path="/investimentos"
        element={
          <RequireAuth redirectTo="/" isPrivate>
            <Investimento />
          </RequireAuth>
        }
      />
      <Route
        path="/dividendos"
        element={
          <RequireAuth redirectTo="/" isPrivate>
            <Dividendos />
          </RequireAuth>
        }
      />
      <Route
        path="/debitos"
        element={
          <RequireAuth redirectTo="/" isPrivate>
            <Debits />
          </RequireAuth>
        }
      />
      <Route 
        path="/contaPaga/:token" 
        element={
          <ContaPaga />
        } />

    </Routes>
  )
}