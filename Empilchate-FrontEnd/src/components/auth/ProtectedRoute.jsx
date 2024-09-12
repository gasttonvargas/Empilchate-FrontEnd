import React, { useState, useEffect } from 'react';

function ProtectedRoute() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setData(userData);
        } else {
          throw new Error('No pude acceder a la ruta protegida');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error:', error);
      }
    };

    fetchProtectedData();
  }, []);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Estoy cargando...</div>;

  return (
    <div>
      <h2>Mis Datos de Usuario</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default ProtectedRoute;