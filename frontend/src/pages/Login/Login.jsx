import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importar los íconos
import './Login.css';

function Login() {
  const [identificacion, setIdentificacion] = useState('');
  const [password, setPassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('estudiante');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:4000/api1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identificacion,
          password,
          tipoUsuario
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Guardar token y tipo de usuario
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userType', tipoUsuario);
        
        // Redirigir según el tipo de usuario
        switch(tipoUsuario) {
          case 'estudiante':
            navigate('/dashboard-estudiante');
            break;
          case 'empresa':
            navigate('/dashboard-empresa');
            break;
          case 'admin':
            navigate('/dashboard-admin');
            break;
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      
      <div className="tipo-selector">
        <button 
          className={tipoUsuario === 'estudiante' ? 'activo' : ''} 
          onClick={() => setTipoUsuario('estudiante')}
        >
          Estudiante
        </button>
        <button 
          className={tipoUsuario === 'empresa' ? 'activo' : ''} 
          onClick={() => setTipoUsuario('empresa')}
        >
          Empresa
        </button>
        <button 
          className={tipoUsuario === 'admin' ? 'activo' : ''} 
          onClick={() => setTipoUsuario('admin')}
        >
          Administrador
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            {tipoUsuario === 'estudiante' ? 'Legajo' : 
             tipoUsuario === 'empresa' ? 'CUIT' : 
             'Identificación'}
          </label>
          <input
            type="text"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            placeholder={
              tipoUsuario === 'estudiante' ? 'Ingresa tu legajo o DNI' :
              tipoUsuario === 'empresa' ? 'Ingresa el CUIT' :
              'Ingresa tu identificación'
            }
            required
          />
        </div>

        <div className="form-group password-field">
          <label>Contraseña</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="login-btn">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default Login;