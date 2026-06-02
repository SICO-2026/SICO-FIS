const Database = require('better-sqlite3');
const db = new Database('serviciotecnico.db');
 
db.exec(`
  CREATE TABLE IF NOT EXISTS equipos (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre            TEXT NOT NULL,
    tipo              TEXT NOT NULL,
    marca             TEXT NOT NULL,
    especificaciones  TEXT NOT NULL,
    precio            REAL NOT NULL,
    disponible        INTEGER NOT NULL DEFAULT 1
  );
 
  CREATE TABLE IF NOT EXISTS mantenciones (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    equipo_id               INTEGER NOT NULL,
    tipo                    TEXT NOT NULL,
    descripcion             TEXT NOT NULL,
    fecha                   TEXT NOT NULL,
    tiempo_reparacion_horas REAL NOT NULL,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id)
  );
`);
 
module.exports = db;
