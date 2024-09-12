import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import './App.css'
import AuthTestPage from './pages/AuthTestPage'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Products from './pages/admin/Products'

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/auth-test">Auth Test</Link>
            </li>
            <li>
              <Link to="/products">Productos</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/auth-test" element={<AuthTestPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/" element={
            <>
              <h1>Bienvenido a mi App de Autenticación</h1>
              <h2>Registro</h2>
              <Register />
              <h2>Inicio de Sesión</h2>
              <Login />
              <h2>Ruta Protegida</h2>
              <ProtectedRoute />
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App;