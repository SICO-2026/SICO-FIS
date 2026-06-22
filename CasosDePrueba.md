# Casos de Prueba

## Historia de usuario evaluada

**US-03: Consultar y cotizar equipos industriales**

Como encargada de producción de una panadería, quiero consultar equipos industriales disponibles y generar una cotización con los equipos seleccionados, para evaluar costos antes de solicitar una compra o servicio técnico.

---

## Objetivo de las pruebas

Verificar que el sistema permita consultar equipos industriales, generar cotizaciones válidas y manejar errores cuando los datos ingresados no son correctos. Las pruebas consideran el frontend, la API REST, Swagger y la persistencia de datos en SQLite.

---

## Casos de prueba

| ID    | Funcionalidad                           | Acción / Entrada                                                                                                                                                                                   | Salida esperada                                                                                     | Estado   |
| ----- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------- |
| CP-01 | Listar equipos                          | Ingresar al frontend en `http://localhost:3000` y presionar “Cargar equipos”. También puede probarse con `GET /equipos` desde Swagger.                                                             | El sistema muestra los equipos registrados con ID, nombre, tipo, marca, precio y disponibilidad.    | Aprobado |
| CP-02 | Generar cotización válida               | Ingresar IDs válidos, por ejemplo `[1, 2]`, usando el parámetro `equipo_ids`, y presionar “Generar cotización”. También puede probarse con `POST /cotizacion` enviando `{ "equipo_ids": [1, 2] }`. | El sistema retorna una cotización con fecha, detalle de equipos seleccionados y total calculado.    | Aprobado |
| CP-03 | Generar cotización sin equipos          | Dejar vacío el campo de IDs o enviar `POST /cotizacion` con `{ "equipo_ids": [] }`.                                                                                                                | El sistema retorna `400 Bad Request` con el mensaje: `Debe seleccionar al menos un equipo válido`.  | Aprobado |
| CP-04 | Generar cotización con IDs inexistentes | Enviar `POST /cotizacion` con `{ "equipo_ids": [999, 1000] }`.                                                                                                                                     | El sistema retorna `400 Bad Request` con el mensaje: `Ninguno de los equipos seleccionados existe`. | Aprobado |
| CP-05 | Validar documentación Swagger           | Ingresar a `http://localhost:3000/docs`.                                                                                                                                                           | Swagger muestra los endpoints de equipos, cotización y mantenciones apuntando al servidor local.    | Aprobado |

---

## Datos de prueba utilizados

| ID | Equipo                        | Tipo         | Marca      | Precio  | Disponibilidad |
| -- | ----------------------------- | ------------ | ---------- | ------- | -------------- |
| 1  | Horno rotativo HR-500         | Horno        | Rational   | 4500000 | Disponible     |
| 2  | Amasadora Espiral AE-200      | Amasadora    | Maquipan   | 2800000 | Disponible     |
| 3  | Cámara de fermentación CF-100 | Fermentadora | Panatec    | 3200000 | No disponible  |
| 4  | Batidora Industrial BI-80     | Batidora     | KitchenPro | 2500000 | Disponible     |

---

## Evidencias

Las evidencias de ejecución de pruebas se almacenan en la carpeta `Evidencias/pruebas/`.

| Caso  | Evidencia                                                  |
| CP-00 | `Evidencias/pruebas/CP-00-npm-start.png`                   |
| ----- | ---------------------------------------------------------- |
| CP-01 | `Evidencias/pruebas/CP-01-listar-equipos.png`              |
| CP-02 | `Evidencias/pruebas/CP-02-cotizacion-valida.png`           |
| CP-03 | `Evidencias/pruebas/CP-03-cotizacion-vacia.png`            |
| CP-04 | `Evidencias/pruebas/CP-04-cotizacion-ids-inexistentes.png` |
| CP-05 | `Evidencias/pruebas/CP-05-swagger.png`                     |

---

## Resumen de cobertura

| Caso  | Funcionalidad validada          | Resultado esperado             |
| ----- | ------------------------------- | ------------------------------ |
| CP-01 | Consulta de equipos             | Lista equipos registrados      |
| CP-02 | Cotización válida               | Genera cotización con total    |
| CP-03 | Cotización sin equipos          | Retorna `400 Bad Request`      |
| CP-04 | Cotización con IDs inexistentes | Retorna `400 Bad Request`      |
| CP-05 | Documentación Swagger           | Muestra endpoints documentados |
