import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import initDB from '../../database/db.js'; // o como accedas a la base de datos

const router = express.Router();

router.post('/login', async (req, res) => {
  const { identificacion, password, tipoUsuario } = req.body;

  try {
    const db = await initDB();
    let user;

    switch(tipoUsuario) {
      case 'estudiante':
        user = await db.get('SELECT * FROM estudiantes WHERE legajo = ? OR dni = ?', [identificacion, identificacion]);
        break;
      case 'empresa':
        user = await db.get('SELECT * FROM empresas WHERE cuit = ?', [identificacion]);
        break;
      case 'admin':
        user = await db.get('SELECT * FROM personal_sau WHERE dni = ?', [identificacion]);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Tipo de usuario inválido' });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        tipo: tipoUsuario,
        identificacion: tipoUsuario === 'estudiante' ? user.legajo : 
                       tipoUsuario === 'empresa' ? user.cuit : user.dni
      },
      process.env.JWT_SECRET || 'tu_secreto_jwt',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        tipo: tipoUsuario,
        identificacion: tipoUsuario === 'estudiante' ? user.legajo : 
                       tipoUsuario === 'empresa' ? user.cuit : user.dni
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

export default router;
