import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardEmpresa() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h2>Panel de Empresa</h2>
      <button className="crear-pasantia-btn">
        Crear Nueva Pasantía
      </button>
      {/* Aquí irá el formulario para crear pasantías */}
    </div>
  );
}

export default DashboardEmpresa;