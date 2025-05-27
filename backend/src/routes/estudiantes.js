import express from 'express';
import sqlite3 from 'sqlite3';
const router = express.Router();
const db = new sqlite3.Database('./pasantias.db');

router.post('/verify-student', (req, res) => {
    const { legajo, dni } = req.body;

    db.get(
        'SELECT * FROM estudiantes WHERE legajo = ? AND dni = ?',
        [legajo, dni],
        (err, estudiante) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error al verificar los datos' 
                });
            }

            if (!estudiante) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'No se encontró un estudiante con esos datos' 
                });
            }

            res.json({ 
                success: true, 
                message: 'Estudiante verificado correctamente',
                estudiante: {
                    legajo: estudiante.legajo,
                    nombre: estudiante.nombre,
                    carrera: estudiante.carrera
                }
            });
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

router.post('/estudiantes/register', (req, res) => {
    const { 
        legajo, 
        disponibilidadHoraria, 
        habilidadesTecnicas, 
        habilidadesBlandas, 
        experienciaPrevia, 
        idiomas, 
        password 
    } = req.body;

    // Verificar que el estudiante exista
    db.get('SELECT * FROM estudiantes WHERE legajo = ?', [legajo], (err, estudiante) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al verificar el estudiante'
            });
        }

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }

        // Actualizar los datos del estudiante
        db.run(`
            UPDATE estudiantes 
            SET disponibilidad_horaria = ?,
                habilidades_tecnicas = ?,
                habilidades_blandas = ?,
                experiencia_previa = ?,
                idiomas = ?,
                password = ?
            WHERE legajo = ?
        `, 
        [
            disponibilidadHoraria,
            JSON.stringify(habilidadesTecnicas),
            JSON.stringify(habilidadesBlandas),
            experienciaPrevia || '',
            JSON.stringify(idiomas),
            password,
            legajo
        ],
        function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al actualizar los datos del estudiante'
                });
            }

            res.json({
                success: true,
                message: 'Registro completado exitosamente'
            });
        });
    });
});

router.post('/sysacad-info', (req, res) => {
    const { legajo } = req.body;
  
    db.get('SELECT * FROM sysacad WHERE legajo = ?', [legajo], (err, row) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error interno' });
      }
      if (!row) {
        return res.status(404).json({ success: false, message: 'Legajo no encontrado' });
      }
  
      // Parsear JSON antes de enviar
      let materiasAprobadas = [];
      let materiasRegularizadas = [];
      try {
        materiasAprobadas = JSON.parse(row.materias_aprobadas);
        materiasRegularizadas = JSON.parse(row.materias_regularizadas);
      } catch (e) {
        // manejar error en parseo si necesario
      }
  
      res.json({
        success: true,
        carrera: row.carrera,
        materiasAprobadas,
        materiasRegularizadas,
      });
    });
  });

export default router;