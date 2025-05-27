import bcrypt from 'bcrypt';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbPromise = open({
  filename: './pasantias.db',
  driver: sqlite3.Database
});

async function insertarUsuarios() {
  const db = await dbPromise;

  // Hashear contraseñas
  const passEstudiante = await bcrypt.hash('clave123', 10);
  const passEmpresa = await bcrypt.hash('empresa456', 10);
  const passAdmin = await bcrypt.hash('admin789', 10);

  // Insertar estudiante
  await db.run(`
    INSERT INTO estudiantes (legajo, dni, nombre, apellido, carrera, materias_aprobadas, materias_regularizadas, email, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      '2023001', '44111222', 'Lucia', 'Sanchez', 'Ingenieria en Sistemas',
      JSON.stringify(['Algoritmos', 'Matematica Discreta']),
      JSON.stringify(['Sistemas y Organizaciones']),
      'lucia@example.com', passEstudiante
    ]
  );

  // Insertar empresa
  await db.run(`
    INSERT INTO empresas (cuit, razon_social, email, password)
    VALUES (?, ?, ?, ?)`,
    ['30-12345678-9', 'Tech Solutions S.A.', 'empresa@example.com', passEmpresa]
  );

  // Insertar admin (personal_sau)
  await db.run(`
    INSERT INTO personal_sau (nombre, apellido, dni, email, password)
    VALUES (?, ?, ?, ?, ?)`,
    ['Ana', 'García', '11223344', 'ana@utn.edu.ar', passAdmin]
  );

  console.log('✅ Usuarios de prueba insertados correctamente');
}

insertarUsuarios().catch(err => {
  console.error('❌ Error insertando usuarios:', err);
});
