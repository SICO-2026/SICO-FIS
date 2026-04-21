<img width="213" height="350" alt="foto" src="https://github.com/user-attachments/assets/6ab8ac8b-5a3c-4d69-80e9-88aabd640c0b" />

## 1. Cambio solicitado 
El cambio va enfocado a la respuesta del sistema en un aumento de solicitudes de tecnicos y aumento de usuarios en el mismo a la hora de solicitar historial de mantenciones y visitas de tecnicos.
 

## 2. Nuevas historias de usuario 

 

### SIN-01:  Ticket de orden de trabajo

Como coordinador de mantenimiento, quiero que se genere automáticamente un ticket (orden de trabajo) detallado cada vez que se confirma un servicio técnico, para estandarizar y automatizar el registro de la intervención, evitar el papeleo manual y no perder trazabilidad. 

Criterios de aceptación:
* Dado que un cliente requiere un servicio de mantenimiento preventivo, cuando el coordinador presiona “Confirmar Servicio” en la plataforma, entonces el sistema genera automáticamente una Orden de Trabajo con un código correlativo único.
* Dado que la Orden de Trabajo se genera de forma automática, cuando el coordinador abre el documento, entonces este debe contener prellenados obligatoriamente: el nombre del técnico, el número de serie del equipo a intervenir, la fecha programada y el cliente. 
* Dado que se requiere mantener un historial ordenado, cuando el sistema crea la nueva OT, entonces la vincula automáticamente al perfil y bitácora de esa maquinaria específica en la base de datos.

## SIN-02: Atencion urgente

Como encargado de la panadería, quiero que el sistema me asigne automáticamente al técnico disponible al solicitar un servicio de emergencia, para recibir atención inmediata y minimizar el tiempo en la línea de producción cuando este detenida.

Criterios de aceptación:
* Dado que un horno industrial falla y requiere asistencia urgente, cuando el encargado envía la solicitud, entonces el sistema cruza automáticamente la especialidad requerida con la ubicación y disponibilidad de los técnicos en terreno.
* Dado que hay un técnico calificado libre, cuando se procesa la solicitud, entonces el sistema le asigna el ticket automáticamente, bloquea ese espacio en su agenda y notifica al cliente el tiempo estimado de llegada.
* Dado que todos los técnicos están ocupados, cuando el encargado intenta crear la solicitud, entonces el sistema la pone en una cola prioritariay le informa al cliente que está en lista de espera prioritaria.

## SIN-03: historial de estados de maquinas

Como administrador de la plataforma, quiero que cualquier actualización en el estado o historial de las maquinarias se refleje en tiempo real en todos los módulos, para asegurar que tanto los técnicos como los clientes tomen decisiones basadas en información 100% consistente y actualizada.

Criterios de aceptacion:
Dado que un técnico en terreno cambia una pieza de una maquina, cuando marca la tarea como “Finalizada” en su aplicación, entonces el módulo central de inventario descuenta inmediatamente el repuesto utilizado sin necesidad de intervención manual.

## 3. Impacto en requisitos extrafuncionales 


| REF ID  | Descripción                                                                 | Prioridad Anterior | Prioridad Nueva | Cambio / Motivo                                   |
|--------|------------------------------------------------------------------------------|--------------------|-----------------|--------------------------------------------------|
| SICO-02 | El sistema debe contar con autenticación avanzada de usuarios.              | Media              | Alta            | Mayor información de usuarios                    |
| SICO-06 | La interfaz debe ser intuitiva.                                             | Alta               | Media           | No será tan expedito para el usuario             |
| SICO-07 | El sistema debe soportar un aumento exponencial de usuarios sin degradar su rendimiento. | Baja               | Media           | Optimización                                     |
| SICO-09 | El sistema no debe permitir pérdidas críticas.                              | Alta               | Media           | Eficiencia del sistema                           |

 

## 4. Impacto en entidades del dominio 

Entidad: Orden de Trabajo
Atributos:

idOrdenTrabajo (PK)
codigoCorrelativo (único)
fechaCreacion
fechaProgramada
estado (pendiente, en_proceso, finalizada, cancelada)
tipoServicio (preventivo, correctivo, urgente)
clienteId (FK)
tecnicoId (FK)
maquinaId (FK)
descripcionProblema
prioridad

Entidad: Asignacion Tecnico
Atributos:

idAsignacion (PK)
fechaAsignacion
estadoAsignacion (asignado, en_espera, rechazado)
tiempoEstimadoLlegada
ubicacionTecnico
especialidadRequerida
prioridad

Entidad: Historial Maquina
Atributos:

idHistorial (PK)
maquinaId (FK)
fechaEvento
tipoEvento (mantencion, falla, cambio_pieza)
descripcion
estadoMaquina
tecnicoId (FK)
ordenTrabajoId (FK)
repuestoUtilizadoId (FK, opcional)



## 5. Impacto en mockups 

Las nuevas historias de usuario afectan de manera significativa el proyecto, ya que amplían su alcance más allá de la simple visualización y registro de solicitudes. En primer lugar, la generación automática de una orden de trabajo impacta directamente el módulo de solicitud de servicio y el tablero, porque el sistema ya no solo debe recibir la solicitud, sino también crear un ticket con datos obligatorios, código correlativo y vínculo con el historial de la maquinaria. En segundo lugar, la asignación automática de técnico modifica el flujo de atención, debido a que el sistema debe considerar disponibilidad, especialidad y prioridad para asignar o dejar en espera una solicitud de emergencia. Además, la actualización en tiempo real afecta de forma transversal a todos los módulos, ya que cualquier cambio en el estado de una maquinaria, servicio o historial debe reflejarse inmediatamente en la plataforma. Finalmente, el descuento automático de repuestos incorpora un nuevo alcance funciona.

 

## 6. Impacto en arquitectura 

Hemos decidido modificar nuestra propuesta original y migrar hacia una Arquitectura de Microservicios, comunicados mediante API REST/gRPC, y respaldados por un modelo de datos con consistencia fuerte.

Esta decisión responde directamente a la introducción de dos nuevos requerimientos críticos para el negocio que un modelo asíncrono no puede satisfacer sin comprometer la integridad de los datos:

Garantía de Transacciones Atómicas (cambio funcional): La asignación de técnicos urgentes ahora requiere una confirmación inmediata. La conexión se mantiene abierta hasta que se verifica la disponibilidad del técnico y se crea la orden de trabajo simultáneamente. Si un paso falla, se revierte toda la operación al instante , garantizando que nunca se genere un ticket sin un técnico real asignado.
 

### 6.1 ¿Cambia el estilo arquitectónico? 

SI: El cambio afectaria principalmente a la seguridad de los usuarios y del mismo sistema, ya que, se veria en conflicto mayor informacion de los ya mencionados. A la vez con eso, el sistema debera sacrificar ciertos requisitos principalmente enfocado a la optimizacion y eficiencia del mismo.



### 6.2 Relación REF (repriorizado) con decisiones de arquitectura 

 

| REF ID  | Prioridad nueva | Decisión de arquitectura que lo aborda                                                                 |
|---------|----------------|--------------------------------------------------------------------------------------------------------|
| SICO-02 | Alta           | El sistema requiere mayor seguridad al recopilar información del cliente.                              |
| SICO-06 | Media          | El sistema ya no puede ser tan intuitivo debido al aumento de su complejidad.                          |
| SICO-07 | Media          | El sistema prioriza una alta disponibilidad para mantenerse activo en condiciones exigentes.           |

## 7. Impacto en módulos 

 

| Módulo             | Tipo de impacto | Responsabilidad actualizada                                                                                                                                 | Ofrece a otros                                      |
|--------------------|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| Cotizaciones       | Modificado     | Se transforma en Órdenes de Trabajo y Cotizaciones; ya no solo genera PDFs, también formaliza tickets y asocia costos, repuestos, cliente, técnico y servicio. | Órdenes de trabajo, cotizaciones y documentos formales |
| Órdenes de Trabajo | Nuevo          | Centraliza solicitudes, confirma servicios, asigna técnicos y gestiona el seguimiento del estado de cada intervención.                                    | Tickets, estados de servicio, asignación y trazabilidad |                | 

 

Fundamentación de cambios modulares: 
Cotizaciones (modificado):
Este módulo deja de ser solo generador de documentos y pasa a tener un rol operativo, ya que ahora no solo cotiza, sino que también permite formalizar servicios reales. Esto se debe a que las cotizaciones pueden transformarse en Órdenes de Trabajo, integrando datos como cliente, técnico, repuestos y servicio, y aportando trazabilidad completa.

Órdenes de Trabajo (nuevo):
Se incorpora como el núcleo del sistema para gestionar cada intervención. Permite centralizar la asignación de técnicos, el seguimiento del servicio y el estado de las solicitudes. Su creación responde a la necesidad de automatización, atención en tiempo real y consistencia en la información.


 

## 8. Nuevas decisiones de diseño 

 

### Decisión 1 

- Decisión: Agregación de modulos asistenciales. 

- Motivación: Mayor seguridad de los datos de los usuarios. 

- Alternativas consideradas: Se evaluaron cambios arquitectonicos de alto impacto.
 
- Impacto: Se enfoca en la seguridad y optimizacion del sistema. 

 

## 9. Trazabilidad actualizada 

 

| Historia | REF relacionado | Módulo     | Mockup  | 

|----------|-----------------|------------|---------| 

| SIN-01    | SICO-01          | Orden de trabajo   |  Solicitar servicio  |

| SIN-02    | SICO-03          | Orden de trabajo   | Solicitar servicio   | 

| SIN-03    | SICO-08          | Cotizaciones   | Tablero   | 

 

## 10. Justificación global y trade-offs 

Aceptamos conscientemente que nuestra aplicación perderá la capacidad de “autoguardado offline”. Si un técnico se encuentra en una zona de la planta sin conexión a internet, no podrá generar órdenes ni actualizar historiales hasta recuperar la señal, ya que el sistema ahora requiere comunicación directa y en tiempo real con el servidor central para validar cada paso.


