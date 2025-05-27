// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Header() {
  const navigate = useNavigate()
  const [logueado, setLogueado] = useState(false) // simulamos login

  const handleLogout = () => {
    // acá eliminarías el token del localStorage si lo usás
    setLogueado(false)
    navigate('/')
  }

  return (
    <header style={{ background: '#004a99', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div 
        onClick={() => navigate('/')} 
        style={{ 
          color: 'white', 
          fontWeight: 'bold', 
          fontSize: '1.2rem',
          cursor: 'pointer' 
        }}
      >
        Pasantías UTN
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {!logueado ? (
          <>
            <button
              style={{ backgroundColor: '#e6b800', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
              onClick={() => navigate('/registrar')}
            >
            Registrarse
            </button>
            <button
              style={{ backgroundColor: 'white', color: '#004a99', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            >
            Ingresar
            </button>
          </>
        ) : (
          <button
            style={{ backgroundColor: '#ff6961', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
            onClick={handleLogout}
          >
          Salir
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
