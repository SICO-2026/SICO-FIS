# Especificación de Historia de Usuario

## US-03: Consultar y cotizar equipos industriales

---

## Historia de usuario

Como encargada de producción de una panadería, quiero consultar equipos industriales disponibles y generar una cotización con los equipos seleccionados, para evaluar costos antes de solicitar una compra o servicio técnico.

---

## Descripción de la funcionalidad implementada

La historia de usuario implementada permite consultar equipos industriales registrados en el sistema SICO-FIS y generar una cotización a partir de uno o más equipos seleccionados por su identificador.

La funcionalidad contempla frontend, backend y persistencia en base de datos SQLite. El frontend permite visualizar los equipos registrados y solicitar una cotización. El backend procesa la solicitud mediante la ruta `POST /cotizacion`, consulta los equipos en la base de datos y calcula el total de la cotización.

Además, el sistema incorpora funcionalidades complementarias de gestión de equipos, como registrar, editar y eliminar equipos, las cuales permiten mantener actualizada la información utilizada para la cotización.

---

## Actores

| Actor                   | Descripción                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| Encargada de producción | Usuario principal que consulta equipos industriales y genera cotizaciones desde la interfaz web. |
| Sistema SICO-FIS        | Sistema responsable de procesar la solicitud, consultar los datos y generar la cotización.       |

---

## Precondiciones

| ID     | Precondición                                                                                    |
| ------ | ----------------------------------------------------------------------------------------------- |
| PRE-01 | La aplicación debe estar instalada y ejecutándose mediante `npm start`.                         |
| PRE-02 | La base de datos SQLite debe estar creada o generarse automáticamente al iniciar la aplicación. |
| PRE-03 | Deben existir equipos registrados en la tabla `equipos`.                                        |
| PRE-04 | La encargada de producción debe acceder a la interfaz web desde el navegador.                   |

---

## Flujo principal

| Paso | Actor/Sistema           | Acción                                                                                     |
| ---- | ----------------------- | ------------------------------------------------------------------------------------------ |
| 1    | Encargada de producción | Ingresa al sistema SICO-FIS desde el navegador.                                            |
| 2    | Sistema                 | Muestra la interfaz principal con las secciones disponibles.                               |
| 3    | Encargada de producción | Consulta el listado de equipos industriales registrados.                                   |
| 4    | Sistema                 | Muestra los equipos con su nombre, tipo, marca, especificaciones, precio y disponibilidad. |
| 5    | Encargada de producción | Identifica los equipos que desea cotizar.                                                  |
| 6    | Encargada de producción | Ingresa los IDs de los equipos seleccionados en la sección de cotización.                  |
| 7    | Encargada de producción | Presiona el botón para generar la cotización.                                              |
| 8    | Sistema                 | Envía la solicitud `POST /cotizacion` con el parámetro `equipo_ids`.                       |
| 9    | Sistema                 | Valida que `equipo_ids` exista, sea un arreglo y contenga al menos un ID.                  |
| 10   | Sistema                 | Consulta en SQLite los equipos cuyo ID coincide con los IDs recibidos.                     |
| 11   | Sistema                 | Calcula el total sumando los precios de los equipos encontrados.                           |
| 12   | Sistema                 | Genera una respuesta con fecha, detalle de equipos seleccionados y total calculado.        |
| 13   | Encargada de producción | Visualiza la cotización generada en la interfaz web.                                       |

---

## Flujos alternativos

| ID    | Condición                                                     | Flujo alternativo                                                                                    |
| ----- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| FA-01 | La lista `equipo_ids` está vacía, no existe o no es válida.   | El sistema responde `400 Bad Request` con el mensaje: `Debe seleccionar al menos un equipo válido`.  |
| FA-02 | Ninguno de los IDs enviados corresponde a equipos existentes. | El sistema responde `400 Bad Request` con el mensaje: `Ninguno de los equipos seleccionados existe`. |
| FA-03 | La base de datos no contiene equipos registrados.             | El sistema no puede generar una cotización válida hasta que existan equipos registrados.             |
| FA-04 | El usuario ingresa IDs incorrectos desde la interfaz.         | El sistema informa el error y solicita corregir los datos ingresados.                                |

---

## Postcondiciones

| ID      | Postcondición                                                                     |
| ------- | --------------------------------------------------------------------------------- |
| POST-01 | La cotización es generada correctamente cuando existen equipos válidos.           |
| POST-02 | La cotización muestra fecha, equipos seleccionados y total calculado.             |
| POST-03 | La generación de una cotización no modifica el estado persistente de los equipos. |
| POST-04 | En caso de error, el sistema entrega un mensaje informativo al usuario.           |

---

## Criterios de aceptación

| ID    | Criterio de aceptación                                                                                                                                                       | Resultado esperado                                                                   |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| CA-01 | Dado que existen equipos registrados, cuando la encargada consulta el listado, entonces el sistema debe mostrar los equipos disponibles en la interfaz.                      | Se visualiza el listado de equipos con nombre, tipo, marca, precio y disponibilidad. |
| CA-02 | Dado que la encargada ingresa IDs válidos, cuando presiona generar cotización, entonces el sistema debe enviar una solicitud `POST /cotizacion` con `equipo_ids`.            | El backend recibe un arreglo `equipo_ids`.                                           |
| CA-03 | Dado que `equipo_ids` contiene IDs existentes, cuando el backend procesa la solicitud, entonces debe consultar la tabla `equipos` en SQLite.                                 | Se obtienen los equipos correspondientes desde la base de datos.                     |
| CA-04 | Dado que existen equipos encontrados, cuando el sistema calcula la cotización, entonces debe sumar los precios de los equipos seleccionados.                                 | El total corresponde a la suma de los precios.                                       |
| CA-05 | Dado que la cotización se genera correctamente, cuando el backend responde, entonces debe retornar fecha, equipos seleccionados y total.                                     | La respuesta contiene el objeto `cotizacion`.                                        |
| CA-06 | Dado que el usuario no ingresa equipos válidos, cuando intenta generar la cotización, entonces el sistema debe retornar un error `400 Bad Request`.                          | Se muestra un mensaje de error.                                                      |
| CA-07 | Dado que los IDs ingresados no existen en la base de datos, cuando se procesa la solicitud, entonces el sistema debe retornar un error `400 Bad Request`.                    | Se informa que ningún equipo seleccionado existe.                                    |
| CA-08 | Dado que la aplicación está ejecutándose, cuando el usuario accede a `/docs`, entonces debe visualizar la documentación Swagger de la API.                                   | Swagger muestra los endpoints documentados.                                          |
| CA-09 | Dado que la aplicación se instala desde cero, cuando se ejecuta `npm install` y `npm start`, entonces el sistema debe iniciar correctamente.                                 | La aplicación queda disponible en `http://localhost:3000`.                           |
| CA-10 | Dado que la base de datos no existe inicialmente, cuando se inicia la aplicación, entonces `db.js` debe crear las tablas necesarias y cargar datos iniciales si corresponde. | La base de datos queda lista para consultar equipos y mantenciones.                  |

---

## Definition of Done

La historia de usuario se considera terminada cuando:

| ID     | Condición de término                                                                               |
| ------ | -------------------------------------------------------------------------------------------------- |
| DoD-01 | La funcionalidad de consulta de equipos está disponible desde la interfaz web.                     |
| DoD-02 | La funcionalidad de generación de cotización está disponible desde la interfaz web.                |
| DoD-03 | El endpoint `POST /cotizacion` recibe el parámetro `equipo_ids` y genera una cotización válida.    |
| DoD-04 | El backend valida entradas vacías, inválidas o sin equipos existentes.                             |
| DoD-05 | La información de equipos se obtiene desde SQLite mediante `better-sqlite3`.                       |
| DoD-06 | La respuesta de cotización incluye fecha, equipos seleccionados y total calculado.                 |
| DoD-07 | Los endpoints principales están documentados en Swagger en `/docs`.                                |
| DoD-08 | Existen casos de prueba documentados en `CasosDePrueba.md`.                                        |
| DoD-09 | La aplicación puede instalarse y ejecutarse localmente con `npm install` y `npm start`.            |
| DoD-10 | La documentación del repositorio referencia los diagramas, casos de prueba y artefactos asociados. |

---

## Endpoints asociados

| Método | Endpoint                          | Descripción                                                            |
| ------ | --------------------------------- | ---------------------------------------------------------------------- |
| GET    | `/equipos`                        | Lista todos los equipos registrados.                                   |
| GET    | `/equipos/:id`                    | Consulta un equipo por ID.                                             |
| POST   | `/equipos`                        | Registra un nuevo equipo.                                              |
| PUT    | `/equipos/:id`                    | Actualiza un equipo existente.                                         |
| DELETE | `/equipos/:id`                    | Elimina un equipo.                                                     |
| POST   | `/cotizacion`                     | Genera una cotización con equipos seleccionados mediante `equipo_ids`. |
| GET    | `/mantenciones`                   | Lista mantenciones registradas.                                        |
| POST   | `/mantenciones`                   | Registra una mantención asociada a un equipo.                          |
| GET    | `/mantenciones/equipo/:equipo_id` | Consulta el historial de mantenciones de un equipo.                    |

---

## Tecnologías utilizadas

| Tecnología     | Uso en el proyecto                                          |
| -------------- | ----------------------------------------------------------- |
| Node.js        | Entorno de ejecución del backend.                           |
| Express        | Framework para crear la API REST.                           |
| SQLite         | Base de datos local.                                        |
| better-sqlite3 | Librería utilizada para conectar Node.js con SQLite.        |
| Swagger        | Documentación de endpoints de la API.                       |
| HTML           | Estructura de la interfaz web.                              |
| CSS            | Estilos visuales de la interfaz.                            |
| JavaScript     | Lógica del frontend y consumo de la API mediante `fetch()`. |
