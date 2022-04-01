import { BrowserRouter } from 'react-router-dom'
import Rotas from './routes'
import AuthProvider from './contexts/auth'
import SimulationProvider from './contexts/simulation'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <SimulationProvider>
        <BrowserRouter>
          <ToastContainer autoClose={3000} />
          <Rotas />
        </BrowserRouter>
      </SimulationProvider>
    </AuthProvider>
  );
}

export default App;
