// scripts/crearTablas.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const crearTablas = async () => {
  const db = await open({
    filename: './pasantias.db',
    driver: sqlite3.Database,
  });

  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS estudiantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        legajo TEXT UNIQUE NOT NULL,
        dni TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        carrera TEXT NOT NULL,
        materias_aprobadas TEXT,
        materias_regularizadas TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS verification_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudiante_legajo TEXT NOT NULL,
        codigo TEXT NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (estudiante_legajo) REFERENCES estudiantes(legajo)
      );

      CREATE TABLE IF NOT EXISTS empresas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cuit TEXT UNIQUE NOT NULL,
        razon_social TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS personal_sau (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        dni TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT NOT NULL CHECK(rol IN ('estudiante', 'empresa', 'admin'))
      );
    `);

    console.log('✅ Tablas creadas correctamente');
  } catch (err) {
    console.error('❌ Error al crear tablas:', err);
  }
};

crearTablas();
