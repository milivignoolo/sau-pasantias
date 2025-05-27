import { useState } from 'react';
import './RegistroAdministrador.css';

function RegistroAdministrador() {
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [error, setError] = useState('');

  const handleVerificarIdentidad = async () => {
    setError('');
    try {
      const response = await fetch('http://localhost:4000/api3/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          dni: dni.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error de verificación');
        return;
      }

      setStep(2); // Avanza al paso del correo
    } catch (err) {
      setError('Error del servidor');
    }
  };

  const enviarCodigo = async () => {
    try {
      const res = await fetch('http://localhost:4000/api3/send-code-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje);

      alert('Código enviado al correo');
      setStep(3);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCrearCuenta = async () => {
    setError('');
    try {
      const response = await fetch('http://localhost:4000/api3/registro-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          dni,
          email,
          password,
          codigo,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Error al registrar');
        return;
      }

      setRegistroExitoso(true);
    } catch (err) {
      setError('Error al registrar al administrador');
    }
  };

  return (
    <div className="registro-admin">
      <h2>Registro de Administrador SAU</h2>

      {registroExitoso ? (
        <p>Registro exitoso. Ahora podés iniciar sesión con DNI y contraseña.</p>
      ) : (
        <>
          {step === 1 && (
            <div>
              <label>Nombre:</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <label>Apellido:</label>
              <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} />
              <label>DNI:</label>
              <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} />
              <button onClick={handleVerificarIdentidad}>Verificar identidad</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <label>Correo institucional (Gmail):</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button onClick={enviarCodigo}>Enviar código de verificación</button>
            </div>
          )}

          {step === 3 && (
            <div>
              <label>Ingresá el código recibido por correo:</label>
              <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
              <label>Crear contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres, una mayúscula, un número"
              />
              <button onClick={handleCrearCuenta}>Crear cuenta</button>
            </div>
          )}
        </>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default RegistroAdministrador;
