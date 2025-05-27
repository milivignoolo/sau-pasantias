import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardEstudiante() {
  const [pasantias, setPasantias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Aquí irá la lógica para cargar las pasantías filtradas
    const cargarPasantias = async () => {
      try {
        const response = await fetch('http://localhost:4000/api1/pasantias', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setPasantias(data.pasantias);
        }
      } catch (error) {
        console.error('Error al cargar pasantías:', error);
      }
    };

    cargarPasantias();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h2>Pasantías Disponibles</h2>
      {/* Aquí irá el listado de pasantías */}
    </div>
  );
}

export default DashboardEstudiante;