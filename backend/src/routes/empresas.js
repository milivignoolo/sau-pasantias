import express from 'express';
import db from '../../database/db.js';
const router = express.Router();


router.post('/verify-empresa', (req, res) => {
  const { cuit, razonSocial } = req.body;

  if (!cuit || !razonSocial) {
    return res.status(400).json({
      success: false,
      message: 'CUIT y Razón Social son requeridos'
    });
  }

  db.get('SELECT * FROM empresas WHERE cuit = ? AND razon_social = ?', [cuit, razonSocial], (err, empresaEncontrada) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar la empresa en la base de datos'
      });
    }

    if (!empresaEncontrada) {
      // Si no se encontró, insertamos la empresa
      db.run('INSERT INTO empresas (cuit, razon_social) VALUES (?, ?)', [cuit, razonSocial], (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Error al registrar la empresa'
          });
        }

        // Después de registrar, respondemos como no tiene password aún
        res.json({
          success: true,
          message: 'Empresa verificada y registrada correctamente',
          empresa: {
            cuit,
            razonSocial,
            registrada: false
          }
        });
      });
    } else {
      // Si ya existe
      res.json({
        success: true,
        message: 'Empresa verificada correctamente',
        empresa: {
          cuit: empresaEncontrada.cuit,
          razonSocial: empresaEncontrada.razon_social,
          registrada: !!empresaEncontrada.password
        }
      });
    }
  });
});


router.post('/verify-code', (req, res) => {
  const { codigo } = req.body;

  if (!codigo) {
      return res.status(400).json({
          success: false,
          message: 'El código es requerido'
      });
  }

  db.get(
      'SELECT * FROM verification_codes WHERE codigo = ?',
      [codigo],
      (err, result) => {
          if (err) {
              return res.status(500).json({
                  success: false,
                  message: 'Error al verificar el código'
              });
          }

          if (!result) {
              return res.status(404).json({
                  success: false,
                  message: 'Código de verificación inválido'
              });
          }
          
          res.json({
              success: true,
              message: 'Código verificado correctamente'
          });
      }
  );
});


export default router;