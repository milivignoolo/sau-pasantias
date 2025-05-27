import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Agregar este import
import './RegistroEstudiante.css';

// Add these constant arrays before the component
const opcionesHabilidadesTecnicas = [
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'HTML/CSS',
  'React',
  'Node.js',
  'SQL',
  'Git'
];

const opcionesHabilidadesBlandas = [
  'Trabajo en equipo',
  'Comunicación',
  'Liderazgo',
  'Resolución de problemas',
  'Adaptabilidad',
  'Gestión del tiempo'
];

const opcionesIdiomas = [
  'Inglés',
  'Español',
  'Portugués',
  'Francés',
  'Alemán'
];

const niveles = [
  'Básico',
  'Intermedio',
  'Avanzado'
];


function RegistroEstudiante() {
  const navigate = useNavigate(); 
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [paso, setPaso] = useState(1); // 1: código, 2: formulario, 3: contraseña
  const [codigoVerificacion, setCodigoVerificacion] = useState('');
  const [datosFormulario, setDatosFormulario] = useState({
    disponibilidadHoraria: '',
    habilidadesTecnicas: [],
    habilidadesBlandas: [],
    experienciaPrevia: '',
    idiomas: []
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Nuevo estado para confirmar contraseña
  const [error, setError] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [sysacadData, setSysacadData] = useState(null);

  const handleHabilidadChange = (tipo, nombre, nivel) => {
    setDatosFormulario(prev => {
      const array = prev[tipo];
      if (nivel === null) {
        // Remove the skill if unchecked
        return {
          ...prev,
          [tipo]: array.filter(item => item.nombre !== nombre)
        };
      }
      
      const existingIndex = array.findIndex(item => item.nombre === nombre);
      if (existingIndex >= 0) {
        // Update existing skill
        const newArray = [...array];
        newArray[existingIndex] = { nombre, nivel };
        return { ...prev, [tipo]: newArray };
      } else {
        // Add new skill
        return { ...prev, [tipo]: [...array, { nombre, nivel }] };
      }
    });
  };

  useEffect(() => {
    // Obtener datos del estudiante del localStorage
    const data = localStorage.getItem('studentData');
    if (data) {
      setStudentData(JSON.parse(data));
    }
  }, []);

  const verificarCodigo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api1/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo: codigoVerificacion})
      });

      const data = await response.json();
      if (data.success) {
        // Obtener datos del SYSACAD
        const sysacadResponse = await fetch('http://localhost:4000/api1/sysacad-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ legajo: studentData.legajo })
        });
        
        const sysacadData = await sysacadResponse.json();
        if (sysacadData.success) {
          setSysacadData(sysacadData);
        }
        setPaso(2);
      } else {
        setError(data.message); 
      }
    } catch (error) {
      setError('Error al verificar el código');
    }
  };

  const handleFormularioSubmit = (e) => {
    e.preventDefault();
    setPaso(3);
  };

  return (
    <div className="registro-estudiante-container">
      <h2>Registro de Estudiante</h2>
      {error && <div className="error-message">{error}</div>}

      {paso === 1 && (
        <form onSubmit={verificarCodigo} className="verificacion-form">
          <h3>Verificación de Correo</h3>
          <p>Ingresa el código que enviamos a tu correo electrónico</p>
          <input
            type="text"
            value={codigoVerificacion}
            onChange={(e) => setCodigoVerificacion(e.target.value)}
            placeholder="Código de verificación"
            required
          />
          <button type="submit">Verificar Código</button>
        </form>
      )}

      {sysacadData && paso === 2 && (
        <div className="sysacad-info">
          <h3>Información Académica</h3>
          <p><strong>Carrera:</strong> {sysacadData.carrera}</p>
          
          <div className="materias-container">
            <div className="materias-section">
              <h4>Materias Aprobadas:</h4>
              <ul>
                {sysacadData.materiasAprobadas.map((materia, index) => (
                  <li key={index}>{materia}</li>
                ))}
              </ul>
            </div>
            
            <div className="materias-section">
              <h4>Materias Regularizadas:</h4>
              <ul>
                {sysacadData.materiasRegularizadas.map((materia, index) => (
                  <li key={index}>{materia}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {paso === 2 && (
        <form onSubmit={handleFormularioSubmit} className="form-registro">
          <h3>Datos Adicionales</h3>
          
          <div className="form-group">
            <label>Disponibilidad Horaria *</label>
            <textarea
              value={datosFormulario.disponibilidadHoraria}
              onChange={(e) => setDatosFormulario({
                ...datosFormulario,
                disponibilidadHoraria: e.target.value
              })}
              placeholder="Describe tu disponibilidad horaria"
              required
            />
          </div>

          <div className="form-group">
            <label>Habilidades Técnicas *</label>
            <div className="habilidades-container">
              {opcionesHabilidadesTecnicas.map(habilidad => (
                <div key={habilidad} className="habilidad-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={datosFormulario.habilidadesTecnicas.some(h => h.nombre === habilidad)}
                      onChange={(e) => handleHabilidadChange(
                        'habilidadesTecnicas',
                        habilidad,
                        e.target.checked ? 'Básico' : null
                      )}
                    />
                    {habilidad}
                  </label>
                  {datosFormulario.habilidadesTecnicas.some(h => h.nombre === habilidad) && (
                    <select
                      value={datosFormulario.habilidadesTecnicas.find(h => h.nombre === habilidad)?.nivel || 'Básico'}
                      onChange={(e) => handleHabilidadChange('habilidadesTecnicas', habilidad, e.target.value)}
                    >
                      {niveles.map(nivel => (
                        <option key={nivel} value={nivel}>{nivel}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Habilidades Blandas *</label>
            <div className="habilidades-container">
              {opcionesHabilidadesBlandas.map(habilidad => (
                <div key={habilidad} className="habilidad-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={datosFormulario.habilidadesBlandas.some(h => h.nombre === habilidad)}
                      onChange={(e) => handleHabilidadChange(
                        'habilidadesBlandas',
                        habilidad,
                        e.target.checked ? 'Básico' : null
                      )}
                    />
                    {habilidad}
                  </label>
                  {datosFormulario.habilidadesBlandas.some(h => h.nombre === habilidad) && (
                    <select
                      value={datosFormulario.habilidadesBlandas.find(h => h.nombre === habilidad)?.nivel || 'Básico'}
                      onChange={(e) => handleHabilidadChange('habilidadesBlandas', habilidad, e.target.value)}
                    >
                      {niveles.map(nivel => (
                        <option key={nivel} value={nivel}>{nivel}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Experiencia Previa</label>
            <textarea
              value={datosFormulario.experienciaPrevia}
              onChange={(e) => setDatosFormulario({
                ...datosFormulario,
                experienciaPrevia: e.target.value
              })}
              placeholder="Describe tu experiencia previa (opcional)"
            />
          </div>

          <div className="form-group">
            <label>Idiomas *</label>
            <div className="habilidades-container">
              {opcionesIdiomas.map(idioma => (
                <div key={idioma} className="habilidad-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={datosFormulario.idiomas.some(i => i.nombre === idioma)}
                      onChange={(e) => handleHabilidadChange(
                        'idiomas',
                        idioma,
                        e.target.checked ? 'Básico' : null
                      )}
                    />
                    {idioma}
                  </label>
                  {datosFormulario.idiomas.some(i => i.nombre === idioma) && (
                    <select
                      value={datosFormulario.idiomas.find(i => i.nombre === idioma)?.nivel || 'Básico'}
                      onChange={(e) => handleHabilidadChange('idiomas', idioma, e.target.value)}
                    >
                      {niveles.map(nivel => (
                        <option key={nivel} value={nivel}>{nivel}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-continuar">Continuar</button>
        </form>
      )}

{paso === 3 && (
  <form
    onSubmit={async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/api1/estudiantes/register',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            legajo: studentData.legajo,
            datosFormulario,
            password
          })
        });

        const data = await response.json();
        if (data.success) {
          // Redirigir a login
          navigate('/login');
        } else {
          setError(data.message || 'Error al registrar al estudiante');
        }
      } catch (error) {
        setError('Error al completar el registro');
      }
    }}
    className="form-password"
  >
    <h3>Crear Contraseña</h3>
    <div className="form-group">
      <label>Contraseña *</label>
      <input
        type={mostrarPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    <div className="form-group">
      <label>Confirmar Contraseña *</label>
      <input
        type={mostrarPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
    </div>

    <div className="form-group">
      <label>
        <input
          type="checkbox"
          checked={mostrarPassword}
          onChange={() => setMostrarPassword(!mostrarPassword)}
        />
        Mostrar contraseña
      </label>
    </div>

    <button type="submit">Finalizar Registro</button>
  </form>
)}
</div>
  );
}

export default RegistroEstudiante;

