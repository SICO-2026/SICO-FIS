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
 // ─────────────────────────────────────────────
// DATOS INICIALES / SEED
// Se insertan solo si las tablas están vacías
// ─────────────────────────────────────────────

// Seed de equipos
const totalEquipos = db.prepare('SELECT COUNT(*) AS total FROM equipos').get().total;

if (totalEquipos === 0) {
  const insertarEquipo = db.prepare(`
    INSERT INTO equipos (nombre, tipo, marca, especificaciones, precio, disponible)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertarEquipo.run(
    'Horno rotativo HR-500',
    'Horno',
    'Rational',
    'Capacidad 20 bandejas, 400V, 15kW',
    4500000,
    1
  );

  insertarEquipo.run(
    'Amasadora Espiral AE-200',
    'Amasadora',
    'Maquipan',
    'Capacidad 40 kg, acero inoxidable',
    2800000,
    1
  );

  insertarEquipo.run(
    'Cámara de fermentación CF-100',
    'Fermentadora',
    'Panatec',
    'Control de temperatura y humedad, capacidad 12 bandejas',
    3200000,
    0
  );

  insertarEquipo.run(
    'Batidora Industrial BI-80',
    'Batidora',
    'KitchenPro',
    'Capacidad 80 litros, velocidad variable',
    2500000,
    1
  );

  console.log('Datos iniciales de equipos insertados.');
}

// Seed de mantenciones
const totalMantenciones = db.prepare('SELECT COUNT(*) AS total FROM mantenciones').get().total;

if (totalMantenciones === 0) {
  const horno = db.prepare('SELECT id FROM equipos WHERE nombre = ?').get('Horno rotativo HR-500');
  const amasadora = db.prepare('SELECT id FROM equipos WHERE nombre = ?').get('Amasadora Espiral AE-200');
  const camara = db.prepare('SELECT id FROM equipos WHERE nombre = ?').get('Cámara de fermentación CF-100');

  const insertarMantencion = db.prepare(`
    INSERT INTO mantenciones (equipo_id, tipo, descripcion, fecha, tiempo_reparacion_horas)
    VALUES (?, ?, ?, ?, ?)
  `);

  if (horno) {
    insertarMantencion.run(
      horno.id,
      'preventiva',
      'Revisión general del sistema eléctrico, limpieza interna y verificación de temperatura.',
      '2026-06-01',
      2.5
    );

    insertarMantencion.run(
      horno.id,
      'correctiva',
      'Cambio de resistencia de calefacción y prueba de funcionamiento.',
      '2026-06-12',
      3.5
    );
  }

  if (amasadora) {
    insertarMantencion.run(
      amasadora.id,
      'preventiva',
      'Lubricación de engranajes, revisión de motor y ajuste de piezas móviles.',
      '2026-06-05',
      1.8
    );
  }

  if (camara) {
    insertarMantencion.run(
      camara.id,
      'correctiva',
      'Diagnóstico por falla en control de humedad y temperatura.',
      '2026-06-15',
      4.0
    );
  }

  console.log('Datos iniciales de mantenciones insertados.');
}
module.exports = db;
