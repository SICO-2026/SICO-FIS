const express      = require('express');
const db           = require('./db');
const swaggerUi    = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
 
const app = express();
app.use(express.json());
app.use(express.static('public'));
 
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'API Servicio Técnico Panadería', version: '1.0.0' },
    
  servers: [
  { url: 'http://localhost:3000', description: 'Servidor local' }

    ]
  },
  apis: ['./index.js']
});
 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
// ─────────────────────────────────────────────
//  RECURSO 1: EQUIPOS + COTIZACIÓN
//  HU3: "Como encargada de producción, quiero consultar y cotizar equipos industriales"
// ─────────────────────────────────────────────
 
/**
 * @swagger
 * /equipos:
 *   get:
 *     summary: Lista todos los equipos con sus especificaciones, precio y disponibilidad
 *     tags: [Equipos]
 *     responses:
 *       200:
 *         description: Array de equipos
 */
app.get('/equipos', (req, res) => {
  res.json(db.prepare('SELECT * FROM equipos').all());
});
 
/**
 * @swagger
 * /equipos/{id}:
 *   get:
 *     summary: Obtiene un equipo por ID con todas sus especificaciones
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Equipo encontrado
 *       404:
 *         description: No encontrado
 */
app.get('/equipos/:id', (req, res) => {
  const equipo = db.prepare('SELECT * FROM equipos WHERE id=?').get(req.params.id);
  if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });
  res.json(equipo);
});
 
/**
 * @swagger
 * /equipos:
 *   post:
 *     summary: Registra un nuevo equipo
 *     tags: [Equipos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, tipo, marca, especificaciones, precio, disponible]
 *             properties:
 *               nombre:          { type: string,  example: "Horno rotativo HR-500" }
 *               tipo:            { type: string,  example: "Horno" }
 *               marca:           { type: string,  example: "Rational" }
 *               especificaciones: { type: string,  example: "Capacidad 20 bandejas, 400V, 15kW" }
 *               precio:          { type: number,  example: 4500000 }
 *               disponible:      { type: integer, example: 1, description: "1 = disponible, 0 = no disponible" }
 *     responses:
 *       201:
 *         description: Equipo registrado
 */
app.post('/equipos', (req, res) => {
  const { nombre, tipo, marca, especificaciones, precio, disponible } = req.body;
  if (!nombre || !tipo || !marca || !especificaciones || precio === undefined || disponible === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, tipo, marca, especificaciones, precio, disponible' });
  }
  const r = db.prepare(
    'INSERT INTO equipos (nombre, tipo, marca, especificaciones, precio, disponible) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(nombre, tipo, marca, especificaciones, precio, disponible);
  res.status(201).json({ id: r.lastInsertRowid, nombre, tipo, marca, especificaciones, precio, disponible });
});
 
/**
 * @swagger
 * /equipos/{id}:
 *   put:
 *     summary: Actualiza los datos de un equipo
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:          { type: string }
 *               tipo:            { type: string }
 *               marca:           { type: string }
 *               especificaciones: { type: string }
 *               precio:          { type: number }
 *               disponible:      { type: integer }
 *     responses:
 *       200:
 *         description: Equipo actualizado
 *       404:
 *         description: No encontrado
 */
app.put('/equipos/:id', (req, res) => {
  const { nombre, tipo, marca, especificaciones, precio, disponible } = req.body;
  const i = db.prepare(
    'UPDATE equipos SET nombre=?, tipo=?, marca=?, especificaciones=?, precio=?, disponible=? WHERE id=?'
  ).run(nombre, tipo, marca, especificaciones, precio, disponible, req.params.id);
  if (i.changes === 0) return res.status(404).json({ error: 'Equipo no encontrado' });
  res.json({ mensaje: 'Equipo actualizado' });
});
 
/**
 * @swagger
 * /equipos/{id}:
 *   delete:
 *     summary: Elimina un equipo
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Equipo eliminado
 *       404:
 *         description: No encontrado
 */
app.delete('/equipos/:id', (req, res) => {
  const i = db.prepare('DELETE FROM equipos WHERE id=?').run(req.params.id);
  if (i.changes === 0) return res.status(404).json({ error: 'Equipo no encontrado' });
  res.json({ mensaje: 'Equipo eliminado' });
});
 
/**
 * @swagger
 * /cotizacion:
 *   post:
 *     summary: Genera una cotización con uno o más equipos seleccionados
 *     tags: [Equipos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [equipo_ids]
 *             properties:
 *               equipo_ids:
 *                 type: array
 *                 items: { type: integer }
 *                 example: [1, 2]
 *     responses:
 *       200:
 *         description: Cotización generada
 *       400:
 *         description: No se seleccionaron equipos válidos
 */
app.post('/cotizacion', (req, res) => {
  const { equipo_ids } = req.body;
 
  if (!equipo_ids || !Array.isArray(equipo_ids) || equipo_ids.length === 0) {
    return res.status(400).json({ error: 'Debe seleccionar al menos un equipo válido' });
  }
 
  const placeholders = equipo_ids.map(() => '?').join(',');
  const equipos = db.prepare(`SELECT * FROM equipos WHERE id IN (${placeholders})`).all(...equipo_ids);
 
  if (equipos.length === 0) {
    return res.status(400).json({ error: 'Ninguno de los equipos seleccionados existe' });
  }
 
  const total = equipos.reduce((sum, eq) => sum + eq.precio, 0);
 
  res.json({
    cotizacion: {
      fecha: new Date().toISOString().split('T')[0],
      equipos: equipos.map(eq => ({
        id: eq.id,
        nombre: eq.nombre,
        marca: eq.marca,
        especificaciones: eq.especificaciones,
        precio: eq.precio,
        disponible: eq.disponible === 1 ? 'Disponible' : 'No disponible'
      })),
      total
    }
  });
});
 
// ─────────────────────────────────────────────
//  RECURSO 2: MANTENCIONES
//  HU2: "Como cliente, quiero consultar el historial de mantenciones de mis máquinas"
// ─────────────────────────────────────────────
 
/**
 * @swagger
 * /mantenciones:
 *   post:
 *     summary: Registra una nueva mantención para un equipo
 *     tags: [Mantenciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [equipo_id, tipo, descripcion, fecha, tiempo_reparacion_horas]
 *             properties:
 *               equipo_id:               { type: integer, example: 1 }
 *               tipo:                    { type: string, enum: [preventiva, correctiva], example: "correctiva" }
 *               descripcion:             { type: string, example: "Falla en resistencia de calefacción" }
 *               fecha:                   { type: string, example: "2025-05-10" }
 *               tiempo_reparacion_horas: { type: number, example: 3.5 }
 *     responses:
 *       201:
 *         description: Mantención registrada
 */
app.post('/mantenciones', (req, res) => {
  const { equipo_id, tipo, descripcion, fecha, tiempo_reparacion_horas } = req.body;
  if (!equipo_id || !tipo || !descripcion || !fecha || tiempo_reparacion_horas === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: equipo_id, tipo, descripcion, fecha, tiempo_reparacion_horas' });
  }
  const equipo = db.prepare('SELECT id FROM equipos WHERE id=?').get(equipo_id);
  if (!equipo) return res.status(404).json({ error: 'El equipo especificado no existe' });
 
  const r = db.prepare(
    'INSERT INTO mantenciones (equipo_id, tipo, descripcion, fecha, tiempo_reparacion_horas) VALUES (?, ?, ?, ?, ?)'
  ).run(equipo_id, tipo, descripcion, fecha, tiempo_reparacion_horas);
  res.status(201).json({ id: r.lastInsertRowid, equipo_id, tipo, descripcion, fecha, tiempo_reparacion_horas });
});
 
/**
 * @swagger
 * /mantenciones/equipo/{equipo_id}:
 *   get:
 *     summary: Consulta el historial de mantenciones de una máquina específica
 *     tags: [Mantenciones]
 *     parameters:
 *       - in: path
 *         name: equipo_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Historial de mantenciones
 *       404:
 *         description: Equipo no encontrado
 */
app.get('/mantenciones/equipo/:equipo_id', (req, res) => {
  const equipo = db.prepare('SELECT * FROM equipos WHERE id=?').get(req.params.equipo_id);
  if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });
 
  const mantenciones = db.prepare('SELECT * FROM mantenciones WHERE equipo_id=? ORDER BY fecha DESC').all(req.params.equipo_id);
 
  if (mantenciones.length === 0) {
    return res.json({ equipo: equipo.nombre, mensaje: 'No existen registros de mantención para este equipo', mantenciones: [] });
  }
 
  res.json({ equipo: equipo.nombre, total_registros: mantenciones.length, mantenciones });
});
 
/**
 * @swagger
 * /mantenciones:
 *   get:
 *     summary: Lista todas las mantenciones registradas
 *     tags: [Mantenciones]
 *     responses:
 *       200:
 *         description: Array de mantenciones
 */
app.get('/mantenciones', (req, res) => {
  res.json(db.prepare('SELECT * FROM mantenciones ORDER BY fecha DESC').all());
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));