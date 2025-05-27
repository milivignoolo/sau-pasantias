import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home/Home';
import Registro from './pages/Registro/Registro';
import RegistroEstudiante from './pages/Registro/RegistroEstudiantes/RegistroEstudiante';
import RegistroEmpresa from './pages/Registro/RegistroEmpresa/RegistroEmpresa';
import Login from './pages/Login/Login';
import RegistroAdmin from './pages/Registro/RegistroAdministrador/RegistroAdministrador';
import DashboardAdmin from './pages/Dashboard/DashboardAdmin/DashboardAdmin'
import DashboardEmpresa from './pages/Dashboard/DashboardEmpresa/DashboardEmpresa'
import DashboardEstudiante from './pages/Dashboard/DashboardEstudiante/DashboardEstudiante'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrar" element={<Registro />} />
        <Route path="/registro-estudiante" element={<RegistroEstudiante />} />
        <Route path="/registro-empresa" element={<RegistroEmpresa />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro-admin" element={<RegistroAdmin />} />
        <Route path="/dashboard-estudiante" element={<DashboardEstudiante />} />
        <Route path="/dashboard-empresa" element={<DashboardEmpresa />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
      </Routes>
    </>
  );
}

export default App;
