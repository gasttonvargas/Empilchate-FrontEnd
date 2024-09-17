import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarComponent from './components/NavbarR';
import Register from './components/auth/Register';
import Products from './pages/admin/Products';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <div>
        <NavbarComponent />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/" element={<h1>Bienvenido a mi App</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;