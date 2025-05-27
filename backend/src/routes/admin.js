import express from 'express';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import initDB from '../../database/db.js';

dotenv.config();

const router = express.Router();

// Mapa para guardar códigos temporales de verificación con expiración
const codigosVerificacion = new Map();

// Configurar transporter de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Validación básica de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Ruta para verificar los datos preliminares del admin (nombre, apellido, dni)
router.post('/verify-admin', async (req, res) => {
  const { nombre, apellido, dni } = req.body;

  if (!nombre || !apellido || !dni) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    const db = await initDB();

    const existePersonal = await db.get(
      `SELECT * FROM personal_sau WHERE nombre = ? AND apellido = ? AND dni = ?`,
      [nombre, apellido, dni]
    );

    if (!existePersonal) {
      return res.status(400).json({ message: 'No autorizado' });
    }

    const yaRegistrado = await db.get(
      `SELECT * FROM administradores WHERE dni = ?`,
      [dni]
    );

    if (yaRegistrado) {
      return res.status(400).json({ message: 'Ya registrado' });
    }

    res.status(200).json({ message: 'Verificación exitosa' });
  } catch (error) {
    console.error('Error en verificación de admin:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para enviar código de verificación al email del admin
router.post('/send-code-admin', async (req, res) => {
  const { email } = req.body;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email inválido o faltante' });
  }

  const codigo = Math.floor(100000 + Math.random() * 900000); // 6 dígitos
  const expiracion = Date.now() + 5 * 60 * 1000; // 5 minutos

  codigosVerificacion.set(email, { codigo, expiracion });

  try {
    await transporter.sendMail({
      from: '"SAU UTN" <' + process.env.GMAIL_USER + '>',
      to: email,
      subject: 'Código de verificación SAU',
      text: `Tu código de verificación es: ${codigo}`,
    });

    res.status(200).json({ message: 'Código enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ message: 'Error al enviar el código' });
  }
});

// Ruta para verificar el código enviado
router.post('/verify-code-admin', (req, res) => {
  const { email, codigoIngresado } = req.body;

  if (!email || !codigoIngresado) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  const entry = codigosVerificacion.get(email);

  if (
    entry &&
    entry.codigo.toString() === codigoIngresado.toString() &&
    Date.now() < entry.expiracion
  ) {
    codigosVerificacion.delete(email); // Eliminar tras uso
    return res.status(200).json({ message: 'Código correcto' });
  } else {
    return res.status(400).json({ message: 'Código incorrecto o expirado' });
  }
});

// Ruta para registrar admin con todos los datos
router.post('/registro-admin', async (req, res) => {
  const { nombre, apellido, dni, email, password, codigo } = req.body;

  if (!nombre || !apellido || !dni || !email || !password || !codigo) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  const entry = codigosVerificacion.get(email);

  if (!entry) {
    return res.status(400).json({ message: 'Código expirado o no generado' });
  }

  if (entry.codigo.toString() !== codigo.toString() || Date.now() > entry.expiracion) {
    return res.status(400).json({ message: 'Código incorrecto o expirado' });
  }

  try {
    const db = await initDB();

    const personal = await db.get(
      'SELECT * FROM personal_sau WHERE nombre = ? AND apellido = ? AND dni = ?',
      [nombre, apellido, dni]
    );

    if (!personal) {
      return res.status(400).json({ message: 'No autorizado para registrarse' });
    }

    const adminExistente = await db.get(
      'SELECT * FROM administradores WHERE dni = ?',
      [dni]
    );

    if (adminExistente) {
      return res.status(400).json({ message: 'Administrador ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      'INSERT INTO administradores (nombre, apellido, dni, gmail, password_hash) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, dni, email, hashedPassword]
    );

    codigosVerificacion.delete(email); // Eliminar tras registrar
    res.status(200).json({ message: 'Registro exitoso' });
  } catch (error) {
    console.error('Error en registro de admin:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
