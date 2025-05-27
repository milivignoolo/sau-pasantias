import './Registro.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCheck } from 'react-icons/fa';

function Registro() {
  const [tipo, setTipo] = useState('estudiante');
  const [legajo, setLegajo] = useState('');
  const [dni, setDni] = useState('');
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cambiarTipo = (nuevoTipo) => {
    setTipo(nuevoTipo);
    setError('');
  };

  const handleVerifyClick = async (e) => {
    e.preventDefault();
    if (!legajo || !dni) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api1/verify-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ legajo, dni })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('studentData', JSON.stringify(data.estudiante));
        navigate('/registro-estudiante');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError('Error al verificar estudiante.');
    }
  };

  const handleVerifyEmpresa = async (e) => {
    e.preventDefault();

    const cuitValido = /^\d{11}$/.test(cuit);
    if (!cuitValido) {
      setError('El CUIT debe tener 11 números sin guiones ni espacios.');
      return;
    }

    if (!razonSocial.trim()) {
      setError('La razón social es requerida.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api2/verify-empresa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cuit, razonSocial })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('empresaData', JSON.stringify(data.empresa));
        navigate('/registro-empresa');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Hubo un problema al verificar los datos. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="registro-container">
      <div className="tipo-selector">
        <button
          className={tipo === 'estudiante' ? 'activo' : ''}
          onClick={() => cambiarTipo('estudiante')}
        >
          Soy Estudiante
        </button>
        <button
          className={tipo === 'empresa' ? 'activo' : ''}
          onClick={() => cambiarTipo('empresa')}
        >
          Soy Empresa
        </button>
      </div>

      {tipo === 'estudiante' && (
  <form className="formulario-registro" onSubmit={handleVerifyClick}>
    <h2>Registro de Estudiante</h2>
    <p>Completá tus datos para acceder a las pasantías.</p>

    <label>Legajo Universitario</label>
    <input
      type="text"
      placeholder="12345"
      value={legajo}
      onChange={(e) => setLegajo(e.target.value)}
      required
    />

    <label>Número de DNI</label>
    <input
      type="text"
      placeholder="11222333"
      value={dni}
      onChange={(e) => setDni(e.target.value)}
      required
    />
    <small>Ingresá tu DNI sin puntos.</small>

    {error && <div className="error-msg">{error}</div>}

    <button type="submit" className="verificar-btn">
      <FaUserCheck className="icono" />
      Verificar Datos en Sysacad
    </button>
  </form>
)}


      {tipo === 'empresa' && (
        <div className="formulario-registro">
          <h2>Registro de Empresa</h2>
          <p>Ingrese los datos de su empresa para verificación.</p>

          <form onSubmit={handleVerifyEmpresa}>
            <label>CUIT</label>
            <input
              type="text"
              placeholder="30123456789"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              required
            />
            <small>Ingrese el CUIT sin guiones ni espacios</small>

            <label>Razón Social</label>
            <input
              type="text"
              placeholder="Empresa Tecnológica S.A."
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              required
            />

            {error && <div className="error-msg">{error}</div>}

            <button type="submit" className="verificar-btn">
              <FaUserCheck className="icono" />
              Verificar Empresa
            </button>
          </form>
        </div>
      )}
      
      <button 
        className="admin-btn" 
        onClick={() => navigate('/registro-admin')}
      >
        ¿Eres administrador?
      </button>
    </div>
  );
}

export default Registro;
