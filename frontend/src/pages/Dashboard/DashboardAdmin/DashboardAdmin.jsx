import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardAdmin.css';

function DashboardAdmin() {
  const [pasantiasPendientes, setPasantiasPendientes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const cargarPasantiasPendientes = async () => {
      try {
        const response = await fetch('http://localhost:4000/api3/pasantias-pendientes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setPasantiasPendientes(data.pasantias);
        } else {
          setError('Error al cargar las pasantías pendientes');
        }
      } catch (error) {
        setError('Error de conexión con el servidor');
      }
    };

    cargarPasantiasPendientes();
  }, [navigate]);


  const handleApprove = async (pasantiaId) => {
    try {
      const response = await fetch(`http://localhost:4000/api3/aprobar-pasantia/${pasantiaId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setPasantiasPendientes(prevPasantias => 
          prevPasantias.filter(p => p.id !== pasantiaId)
        );
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error al aprobar la pasantía');
    }
  };
  
  const handleReject = async (pasantiaId) => {
    try {
      const response = await fetch(`http://localhost:4000/api3/rechazar-pasantia/${pasantiaId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setPasantiasPendientes(prevPasantias => 
          prevPasantias.filter(p => p.id !== pasantiaId)
        );
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error al rechazar la pasantía');
    }
  };

  return (
    <div className="dashboard-admin">
      <h2>Panel de Administración</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="dashboard-section">
        <h3>Pasantías Pendientes de Aprobación</h3>
        <div className="pasantias-list">
          {pasantiasPendientes.length > 0 ? (
            pasantiasPendientes.map((pasantia) => (
              <div key={pasantia.id} className="pasantia-card">
                <h4>{pasantia.titulo}</h4>
                <p><strong>Empresa:</strong> {pasantia.empresa}</p>
                <p><strong>Fecha de solicitud:</strong> {new Date(pasantia.fechaSolicitud).toLocaleDateString()}</p>
                <div className="action-buttons">
                  <button 
                    className="approve-btn"
                    onClick={() => handleApprove(pasantia.id)}
                  >
                    Aprobar
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleReject(pasantia.id)}
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No hay pasantías pendientes de aprobación</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;