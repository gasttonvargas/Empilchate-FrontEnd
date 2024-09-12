import React from 'react';
import Register from '../components/auth/Register';
import Login from '../components/auth/Login';
import ProtectedRoute from '../components/auth/ProtectedRoute';

function AuthTestPage() {
  return (
    <div>
      <h1>Página de Prueba de Autenticación</h1>
      <h2>Registro</h2>
      <Register />
      <h2>Inicio de Sesión</h2>
      <Login />
      <h2>Ruta Protegida</h2>
      <ProtectedRoute />
    </div>
  );
}

export default AuthTestPage;