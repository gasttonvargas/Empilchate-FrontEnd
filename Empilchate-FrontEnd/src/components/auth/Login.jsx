import React, { useState } from 'react';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Inicio de sesión exitoso:', data);
        // Guardo el token en localStorage y puedo redirigir al usuario
        localStorage.setItem('token', data.token);
      } else {
        throw new Error(data.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.message);
      // Puedo manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}

export default Login;