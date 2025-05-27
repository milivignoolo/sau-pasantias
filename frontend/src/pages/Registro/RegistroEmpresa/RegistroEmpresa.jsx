import { useState } from 'react';
import './RegistroEmpresa.css';
import { useNavigate } from 'react-router-dom';

function RegistroEmpresa() {
  const [paso, setPaso] = useState(1);
  const [rubro, setRubro] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [referente, setReferente] = useState('');
  const [cargoReferente, setCargoReferente] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [sitioWeb, setSitioWeb] = useState('');
  const [redes, setRedes] = useState('');
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [codigoEnviado] = useState('123456'); // Simulado
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validarEmail = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const siguientePaso = async () => {
    if (paso === 1) {
      if (!rubro || !domicilio || !email || !telefono || !referente || !cargoReferente || !ubicacion) {
        setError('Complete todos los campos obligatorios.');
        return;
      }
      if (!validarEmail(email)) {
        setError('Formato de correo electrónico inválido.');
        return;
      }
      setError('');
      setPaso(2); // Enviaría código por email
    } else if (paso === 2) {
      if (!codigoIngresado || codigoIngresado !== codigoEnviado) {
        setError('Código incorrecto. Intente nuevamente.');
        return;
      }
      setError('');
      setPaso(3);
    } else if (paso === 3) {
      if (!password || !confirmarPassword) {
        setError('Por favor completá ambos campos de contraseña.');
        return;
      }
      if (password !== confirmarPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      const passValida = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
      if (!passValida) {
        setError('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
        return;
      }

      try {
        const empresa = JSON.parse(localStorage.getItem('empresaData'));

        const response = await fetch('http://localhost:4000/api2/register-empresa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cuit: empresa.cuit,
            razon_social: empresa.razon_social,
            email,
            telefono,
            password,
          }),
        });

        const data = await response.json();

        if (data.success) {
          alert('Empresa registrada con éxito');
          navigate('/login');
        } else {
          setError(data.message || 'Error al registrar la empresa');
        }
      } catch (err) {
        console.error(err);
        setError('Ocurrió un error al registrar la empresa');
      }
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro de Empresa</h2>

      {paso === 1 && (
        <div className="form-paso">
          <div className="form-group">
            <label>Rubro o Actividad Principal *</label>
            <input value={rubro} onChange={e => setRubro(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Domicilio Legal *</label>
            <input value={domicilio} onChange={e => setDomicilio(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Correo Electrónico *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Teléfono de Contacto *</label>
            <input value={telefono} onChange={e => setTelefono(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Nombre del Referente *</label>
            <input value={referente} onChange={e => setReferente(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Cargo del Referente *</label>
            <input value={cargoReferente} onChange={e => setCargoReferente(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Ubicación del Lugar de Trabajo *</label>
            <input value={ubicacion} onChange={e => setUbicacion(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Sitio Web</label>
            <input value={sitioWeb} onChange={e => setSitioWeb(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Redes Sociales</label>
            <input value={redes} onChange={e => setRedes(e.target.value)} />
          </div>
        </div>
      )}

      {paso === 2 && (
        <>
          <label>Ingrese el código enviado a su correo electrónico</label>
          <input
            type="text"
            value={codigoIngresado}
            onChange={(e) => setCodigoIngresado(e.target.value)}
          />
        </>
      )}

      {paso === 3 && (
        <>
          <label>Contraseña</label>
          <div className="form-group">
            <input
              type={mostrar ? 'text' : 'password'}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <label>Confirmar Contraseña</label>
          <input
            type={mostrar ? 'text' : 'password'}
            placeholder="********"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
          />
          
          <button
              type="button"
              onClick={() => setMostrar((prev) => !prev)}
              className="btn-show"
            >
              {mostrar ? 'Ocultar' : 'Mostrar'}
            </button>

          <p>El perfil sera verificado por un administrador de la SAU.</p>
        </>
      )}

      {error && <div className="error-msg">{error}</div>}

      <button type="button" className="btn-primary" onClick={siguientePaso}>
        {paso === 3 ? 'Enviar para verificar' : 'Siguiente'}
      </button>
    </div>
  );
}

export default RegistroEmpresa;
