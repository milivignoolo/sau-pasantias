import db from './db.js';  // tu conexión a SQLite
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDatabase() {
  try {
    const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
    await new Promise((resolve, reject) => {
      db.exec(schemaSQL, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Tablas creadas exitosamente');
          resolve();
        }
      });
    });

    const seedSQL = readFileSync(join(__dirname, 'seed.sql'), 'utf8');
    await new Promise((resolve, reject) => {
      db.exec(seedSQL, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Datos de prueba insertados exitosamente');
          resolve();
        }
      });
    });

    console.log('Base de datos inicializada correctamente');
    process.exit(0);  // finaliza el script exitosamente
  } catch (err) {
    console.error('Error inicializando la base de datos:', err);
    process.exit(1);  // finaliza con error
  }
}

initDatabase();
