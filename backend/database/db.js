import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = resolve(__dirname, './../pasantias.db');

const initDB = async () => {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
};

export default initDB;
