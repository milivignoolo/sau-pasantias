import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <main className="home-main">
        <h1>Gestión de Pasantías</h1>
        <p>Un sistema ágil para conectar estudiantes, empresas e instituciones.</p>
        <div className="home-buttons">
          <button 
            className="home-button student"
            onClick={() => navigate('/registrar')}
          >
            Ver Pasantías como Estudiante
          </button>
          <button 
            className="home-button company"
            onClick={() => navigate('/registrar')}
          >
            Subir Pasantías como Empresa
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
