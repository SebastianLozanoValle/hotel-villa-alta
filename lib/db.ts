import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'translations.db');

// Asegurarse de que el directorio exista
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(dbPath);

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_text TEXT NOT NULL,
    target_lang TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_text, target_lang)
  )
`);

export default db;
