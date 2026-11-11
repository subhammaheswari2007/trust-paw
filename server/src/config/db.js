import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '..', '..', 'trustpaw.db');

let db;

/**
 * Get (or lazily create) the SQLite database connection.
 * Uses native node:sqlite DatabaseSync (Node 22.5+) with fallback to better-sqlite3.
 */
export function getDB() {
  if (!db) {
    try {
      const { DatabaseSync } = require('node:sqlite');
      db = new DatabaseSync(DB_PATH);
      db.exec('PRAGMA journal_mode = WAL');
      db.exec('PRAGMA foreign_keys = ON');
    } catch {
      const Database = require('better-sqlite3');
      db = new Database(DB_PATH);
      db.pragma('journal_mode = WAL');
      db.pragma('foreign_keys = ON');
    }
  }
  return db;
}

/**
 * Close the database connection (used for graceful shutdown).
 */
export function closeDB() {
  if (db) {
    db.close();
    db = null;
  }
}
