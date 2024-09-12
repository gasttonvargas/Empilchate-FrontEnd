import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Registro exitoso:', data);
        // Puedo manejar el éxito aquí, por ejemplo, redirigiendo al usuario o guardando el token
      } else {
        throw new Error(data.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error en el registro:', error.message);
      // Puedo manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="firstName" placeholder="Nombre" onChange={handleChange} />
      <input type="text" name="lastName" placeholder="Apellido" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Register;