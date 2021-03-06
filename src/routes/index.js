
import { Routes, Route } from 'react-router-dom';

import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'


import RequireAuth from './requireAuth'


export default function Rotas() {

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth redirectTo="/dashboard">
            <SignIn />
          </RequireAuth>
        }
      />

      <Route
        path="/register"
        element={
          <RequireAuth redirectTo="/dashboard">
            <SignUp />
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
        path="/Profile"
        element={
          <RequireAuth redirectTo="/" isPrivate>
            <Profile />
          </RequireAuth>
        }
      />

    </Routes>
  )
}