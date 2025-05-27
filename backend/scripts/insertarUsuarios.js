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
  const passwordEstudiante = await bcrypt.hash('clave123', 10);
  const passwordEmpresa = await bcrypt.hash('empresa456', 10);
  const passwordAdmin = await bcrypt.hash('admin789', 10);

  // Insertar estudiante
  await db.run(`
    INSERT INTO estudiantes (legajo, dni, nombre, apellido, carrera, email, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['2023001', '44111222', 'Estudiante', 'Ejemplo', 'Ingeniería en Sistemas', 'nuevoemail@example.com', passwordEstudiante]
  );
  

  // Insertar empresa
  await db.run(`
    INSERT INTO empresas (cuit, razon_social, email, password)
    VALUES (?, ?, ?, ?)`,
    ['30123456789', 'Empresa S.A.', 'empresa@gmail.com', passwordEmpresa]
  );

  // Insertar admin (personal_sau)
  await db.run(`
    INSERT INTO personal_sau (nombre, apellido, dni, email, password)
    VALUES (?, ?, ?, ?, ?)`,
    ['Admin', 'Ejemplo', '10111213', 'milicapa91@gmail.com', passwordAdmin]
  );

  console.log('✅ Usuarios insertados correctamente');
}

insertarUsuarios().catch(err => {
  console.error('❌ Error al insertar usuarios:', err);
});
