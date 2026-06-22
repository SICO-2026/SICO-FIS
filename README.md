# SICO-FIS

## Sistema de Gestión de Equipos y Servicios Técnicos para Panadería

SICO-FIS es una aplicación web orientada a la gestión de equipos industriales utilizados en el rubro panadero. El sistema permite consultar equipos, administrar sus datos principales, generar cotizaciones y registrar mantenciones asociadas a cada equipo.

La Entrega 3 se enfoca en la implementación funcional de una historia de usuario completa, considerando frontend, backend y persistencia en base de datos.

---

## Historia de usuario implementada

### US-03: Consultar y cotizar equipos industriales

**Como** encargada de producción de una panadería,
**quiero** consultar equipos industriales disponibles y generar una cotización con los equipos seleccionados,
**para** evaluar costos antes de solicitar una compra o servicio técnico.

---

## Funcionalidades implementadas

La historia de usuario implementada permite:

* Visualizar un tablero general con equipos activos, equipos no disponibles y mantenciones registradas.
* Consultar equipos industriales registrados.
* Filtrar equipos por nombre, tipo, marca y disponibilidad.
* Registrar nuevos equipos.
* Editar datos de equipos existentes.
* Eliminar equipos.
* Generar cotizaciones a partir de los IDs de equipos seleccionados.
* Registrar mantenciones preventivas o correctivas.
* Consultar historial de mantenciones por equipo.
* Revisar documentación de endpoints mediante Swagger.

---

## Tecnologías utilizadas

| Tecnología     | Uso                                    |
| -------------- | -------------------------------------- |
| Node.js        | Entorno de ejecución del backend       |
| Express        | Implementación de API REST             |
| SQLite         | Base de datos local                    |
| better-sqlite3 | Conexión entre Node.js y SQLite        |
| Swagger        | Documentación interactiva de endpoints |
| HTML           | Estructura del frontend                |
| CSS            | Estilos de la interfaz                 |
| JavaScript     | Lógica del frontend y consumo de API   |

---

## Artefactos de análisis y diseño

Los artefactos de análisis y diseño se encuentran documentados en `Diagramas.md` y respaldados con imágenes en la carpeta `Evidencias/diagramas/`.


| Artefacto                                 | Archivo                                                                                         |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Modelo de dominio                         | [modelo-dominio.drawio.png](Evidencias/diagramas/modelo-dominio.drawio.png)                     |
| Diagrama de casos de uso                  | [diagrama-caso-de-uso.png](Evidencias/diagramas/diagrama-caso-de-uso.png)                       |
| Diagrama de estados del equipo            | [diagrama-estados-equipo.png](Evidencias/diagramas/diagrama-estados-equipo.png)                 |
| Diagrama de despliegue con componentes    | [diagrama-despliegue-componentes.png](Evidencias/diagramas/diagrama-despliegue-componentes.png) |
| Diagrama de componentes                   | [diagrama-componentes.png](Evidencias/diagramas/diagrama-componentes.png)                       |
| Diagrama de secuencia: generar cotización | [diagrama-secuencia-cotizacion.png](Evidencias/diagramas/diagrama-secuencia-cotizacion.png)     |

Documento principal de diagramas: [`Diagramas.md`](Diagramas.md)


---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/SICO-2026/SICO-FIS.git
cd SICO-FIS
```
### Requisitos previos

- Node.js 18 o superior
- npm
- Git
### Variables de entorno

El proyecto no requiere variables de entorno para ejecutarse en esta versión.
La base de datos SQLite se crea y gestiona localmente mediante `db.js`.

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar el servidor

```bash
npm start
```

### 4. Abrir la aplicación

Frontend:

```txt
http://localhost:3000
```

Documentación Swagger:

```txt
http://localhost:3000/docs
```

---

## Datos iniciales

El sistema incluye datos iniciales de ejemplo en `db.js`.
Estos datos se insertan automáticamente solo si la tabla `equipos` está vacía.

Equipos de prueba:

| Equipo                        | Tipo         | Marca      | Disponibilidad |
| ----------------------------- | ------------ | ---------- | -------------- |
| Horno rotativo HR-500         | Horno        | Rational   | Disponible     |
| Amasadora Espiral AE-200      | Amasadora    | Maquipan   | Disponible     |
| Cámara de fermentación CF-100 | Fermentadora | Panatec    | No disponible  |
| Batidora Industrial BI-80     | Batidora     | KitchenPro | Disponible     |

---

## Endpoints principales

| Método | Endpoint                          | Descripción                                     |
| ------ | --------------------------------- | ----------------------------------------------- |
| GET    | `/equipos`                        | Lista todos los equipos registrados             |
| GET    | `/equipos/:id`                    | Consulta un equipo específico por ID            |
| POST   | `/equipos`                        | Registra un nuevo equipo                        |
| PUT    | `/equipos/:id`                    | Actualiza un equipo existente                   |
| DELETE | `/equipos/:id`                    | Elimina un equipo                               |
| POST   | `/cotizacion`                     | Genera una cotización con equipos seleccionados |
| POST   | `/mantenciones`                   | Registra una mantención                         |
| GET    | `/mantenciones`                   | Lista todas las mantenciones registradas        |
| GET    | `/mantenciones/equipo/:equipo_id` | Consulta historial de mantenciones por equipo   |

---

## Artefactos de la entrega

| Artefacto                             | Archivo / Ubicación          | Descripción                                                         |
| ------------------------------------- | ---------------------------- | ------------------------------------------------------------------- |
| Código fuente backend                 | `index.js`                   | API REST desarrollada con Express                                   |
| Base de datos                         | `db.js`                      | Creación de tablas SQLite y datos iniciales                         |
| Frontend                              | `public/index.html`          | Interfaz web conectada a la API                                     |
| Documentación Swagger                 | `http://localhost:3000/docs` | Documentación interactiva de endpoints                              |
| Especificación de historia de usuario | `EspecificacionHU.md`        | Historia implementada, criterios de aceptación y Definition of Done |
| Casos de prueba                       | `CasosDePrueba.md`           | Pruebas funcionales de la historia implementada                     |
| Deuda técnica                         | `DeudaTecnica.md`            | Identificación de deuda técnica y propuestas de mejora              |
| Arquitectura                          | `Arquitectura.md`            | Descripción del estilo arquitectónico                               |
| Requisitos extra funcionales          | `ReqExtraFuncionales.md`     | Requisitos de calidad del sistema                                   |
| Análisis de impacto                   | `impact_analysis.md`         | Evaluación de impacto de cambios                                    |
| Colección de pruebas manuales         | `thunder-request.json`       | Requests para validación manual de endpoints                        |
| Diagramas de análisis y diseño        | `Diagramas.md`               | Modelo de dominio, diagrama de casos de uso, diagrama de estados, diagrama de despliegue y componentes, diagrama de componentes con dependencias e interfaces y diagrama de secuencia |
| Evidencias de ejecución | `Evidencias/` | Capturas del frontend, cotización, historial, Swagger y servidor ejecutándose |


---


## Equipo de trabajo y responsabilidades

| Integrante     | Rol en la entrega                    | Ítems de la rúbrica a cargo                         | Responsabilidades específicas                                                                                                 |
| -------------- | ------------------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Ariel Miranda  | Desarrollo backend / API REST        | Desarrollo de HU, endpoints y validación funcional  | Implementación y revisión de endpoints de equipos, cotización y mantenciones en `index.js`.                                   |
| Percival Leiva | Base de datos y persistencia         | Desarrollo de HU y persistencia de datos            | Creación de tablas, conexión SQLite, datos iniciales y revisión del archivo `db.js`.                                          |
| Rafaella Díaz  | Frontend, documentación y evidencias(QA) | README, pruebas, documentación y apoyo en frontend  | Organización del frontend, documentación de casos de prueba, evidencias de ejecución y revisión final de artefactos.          |
| Ivan Rodríguez | Arquitecto        | Diagramas de análisis y diseño                      | Apoyo en modelo de dominio, casos de uso, diagrama de estados, despliegue, componentes y secuencia.                           |
| David Bombal   | Pruebas, deuda técnica y revisión    | Casos de prueba, deuda técnica y control de calidad | Apoyo en ejecución de pruebas manuales, registro de evidencias, revisión de `DeudaTecnica.md` y consistencia del repositorio. |


---

## Historias de usuario del proyecto

| ID    | Nombre                                                                      | Issue                                                       |
| ----- | --------------------------------------------------------------------------- | ----------------------------------------------------------- |
| US-01 | Configurar alertas automáticas de mantenimiento preventivo                  | [Issue #1](https://github.com/SICO-2026/SICO-FIS/issues/11) |
| US-02 | Consultar guía de solución por código de error                              | [Issue #2](https://github.com/SICO-2026/SICO-FIS/issues/10) |
| US-03 | Consultar y cotizar equipos industriales                                    | [Issue #3](https://github.com/SICO-2026/SICO-FIS/issues/9)  |
| US-04 | Consultar historial de mantenciones y reparaciones                          | [Issue #4](https://github.com/SICO-2026/SICO-FIS/issues/8)  |
| US-05 | Programar mantenciones futuras de maquinaria                                | [Issue #5](https://github.com/SICO-2026/SICO-FIS/issues/12) |
| US-06 | Visualizar estado general de las máquinas                                   | [Issue #6](https://github.com/SICO-2026/SICO-FIS/issues/13) |
| US-07 | Solicitar servicio técnico para maquinaria                                  | [Issue #7](https://github.com/SICO-2026/SICO-FIS/issues/3)  |
| US-08 | Revisar estado y guía de uso de hornos                                      | [Issue #8](https://github.com/SICO-2026/SICO-FIS/issues/2)  |
| US-09 | Solicitar servicio técnico urgente                                          | [Issue #9](https://github.com/SICO-2026/SICO-FIS/issues/1)  |
| US-10 | Revisión de refrigerador con problemas de enfriamiento y sobrecalentamiento | [Issue #10](https://github.com/SICO-2026/SICO-FIS/issues/7) |
| US-11 | Solicitud de revisión técnica de freidora con fallas múltiples              | [Issue #11](https://github.com/SICO-2026/SICO-FIS/issues/6) |
| US-12 | Revisión de sistema de pedidos con errores críticos                         | [Issue #12](https://github.com/SICO-2026/SICO-FIS/issues/5) |

---

## Figma

Prototipo visual del sistema:

https://www.figma.com/proto/PnVdpinWa4A87yrm3EO9zI/SICO?node-id=0-1&t=B9ebn7E1LTdqadFC-1


---

## Conclusión

La versión actual permite demostrar una historia de usuario completa de extremo a extremo. El usuario puede interactuar con una interfaz web, consumir endpoints REST, almacenar información en SQLite y validar el funcionamiento mediante Swagger y casos de prueba documentados.
