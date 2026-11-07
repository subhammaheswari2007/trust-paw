import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '..', '..', 'trustpaw.db');

let db;

/**
 * Get (or lazily create) the SQLite database connection.
 * Enables WAL mode for better concurrency.
 */
export function getDB() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
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
