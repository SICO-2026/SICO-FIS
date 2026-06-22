# Deuda Técnica

## Proyecto

**SICO-FIS – Sistema de Gestión de Equipos y Servicios Técnicos para Panadería**

---

## Objetivo del documento

Este documento identifica elementos de deuda técnica presentes en la implementación actual del sistema, junto con una propuesta de mejora para futuras iteraciones. La deuda técnica corresponde a decisiones de diseño o implementación que permiten avanzar en el desarrollo, pero que podrían afectar la mantenibilidad, escalabilidad o calidad del software si no se corrigen posteriormente.

---

## Deuda técnica identificada

| ID    | Ubicación          | Tipo de deuda                             | Descripción                                                                                                                                      | Impacto                                                                                                   | Propuesta de mejora                                                                                           |
| ----- | ------------------ | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| DT-01 | `index.js`         | Alta concentración de responsabilidades   | El archivo `index.js` contiene configuración del servidor, documentación Swagger, rutas, validaciones y lógica de negocio.                       | Dificulta la mantención del código si el sistema crece.                                                   | Separar el proyecto en carpetas como `routes/`, `controllers/`, `services/` y `repositories/`.                |
| DT-02 | `index.js`         | Lógica de cotización acoplada al endpoint | El cálculo de cotización se realiza directamente dentro del endpoint `POST /cotizacion`.                                                         | Si se agregan descuentos, impuestos o reglas comerciales, el endpoint puede volverse difícil de mantener. | Crear un servicio `cotizacionService.js` encargado de calcular totales y aplicar reglas de negocio.           |
| DT-03 | `index.js`         | Validaciones básicas                      | Las validaciones de entrada revisan campos obligatorios, pero no validan completamente tipos, rangos o formatos.                                 | Puede permitir datos inválidos en la base de datos.                                                       | Implementar validaciones más estrictas para precio, disponibilidad, fecha y tiempo de reparación.             |
| DT-04 | `db.js`            | Base de datos local simple                | El sistema usa SQLite local, adecuado para desarrollo y demostración, pero limitado para entornos productivos multiusuario.                      | Puede presentar limitaciones si varios usuarios usan el sistema simultáneamente.                          | Evaluar migración futura a PostgreSQL o MySQL si el sistema escala.                                           |
| DT-05 | `public/js/app.js` | Lógica frontend concentrada               | La lógica del frontend se concentra principalmente en `app.js`, incluyendo consumo de API, manejo de formularios y actualización de la interfaz. | Si se agregan más vistas o funcionalidades, el archivo puede crecer y ser más difícil de mantener.        | Separar la lógica en módulos, por ejemplo `equipos.js`, `cotizacion.js`, `mantenciones.js` y `api.js`.        |
| DT-06 | `public/js/app.js` | Manejo de estado simple                   | El estado de la interfaz se maneja de forma básica desde JavaScript del frontend.                                                                | Puede ser difícil de controlar si se agregan más secciones o interacciones entre módulos.                 | Implementar una estructura más ordenada para el estado de la aplicación y funciones reutilizables.            |
| DT-07 | Proyecto general   | Falta de pruebas automatizadas            | Los casos de prueba están documentados y pueden ejecutarse manualmente, pero no existen pruebas automatizadas.                                   | La verificación depende de pruebas manuales.                                                              | Incorporar pruebas con herramientas como Jest y Supertest para validar endpoints automáticamente.             |
| DT-08 | Proyecto general   | Manejo de errores básico                  | Los errores se manejan directamente en cada endpoint o función del frontend.                                                                     | Puede generar respuestas inconsistentes si el sistema crece.                                              | Centralizar el manejo de errores en middleware de Express y funciones comunes en frontend.                    |
| DT-09 | Documentación      | Diagramas y documentación dispersa        | Los artefactos están separados en distintos archivos, por lo que requieren estar correctamente vinculados desde el README.                       | Puede dificultar la revisión rápida del proyecto.                                                         | Mantener una tabla centralizada de enlaces a todos los artefactos en el README.                               |
| DT-10 | `POST /cotizacion` | Cotización no persistente                 | La cotización se genera como respuesta del sistema, pero no se almacena en una tabla propia de la base de datos.                                 | No queda historial de cotizaciones generadas.                                                             | Crear una tabla `cotizaciones` y una tabla intermedia `cotizacion_equipos` para guardar cotizaciones futuras. |

---

## Deuda técnica priorizada

| Prioridad | Deuda técnica                                            | Justificación                                                        |
| --------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| Alta      | Separar `index.js` en rutas, controladores y servicios   | Es la mejora más importante para mantener el backend ordenado.       |
| Alta      | Agregar pruebas automatizadas                            | Permite verificar la API sin depender solamente de pruebas manuales. |
| Media     | Modularizar `public/js/app.js`                           | Mejora la mantenibilidad de la lógica del frontend.                  |
| Media     | Mejorar validaciones de datos                            | Reduce errores de ingreso y datos inconsistentes.                    |
| Baja      | Migrar desde SQLite a una base de datos cliente-servidor | Es importante solo si el sistema pasa a producción real.             |

---

## Conclusión

La implementación actual cumple con el objetivo de demostrar una historia de usuario funcional con frontend, backend y base de datos. Sin embargo, existen elementos que podrían mejorarse en futuras iteraciones para aumentar la mantenibilidad, escalabilidad y calidad del sistema. Las principales mejoras recomendadas son separar responsabilidades en el backend, incorporar pruebas automatizadas y modularizar el frontend.
