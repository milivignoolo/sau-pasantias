import express from 'express';
import { authEstudiante, authEmpresa, authAdmin } from '../middleware/auth.js';

const router = express.Router();

// Ruta para estudiantes
router.get('/pasantias', authEstudiante, (req, res) => {
  res.json({ mensaje: `Acceso permitido al estudiante con ID: ${req.user.id}` });
});

// Ruta para empresas
router.post('/crear-pasantia', authEmpresa, (req, res) => {
  res.json({ mensaje: `Empresa autorizada para crear pasantía. ID: ${req.user.id}` });
});

// Ruta para admins
router.get('/pendientes', authAdmin, (req, res) => {
  res.json({ mensaje: `Acceso de administrador autorizado. ID: ${req.user.id}` });
});

export default router;
