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

## SICO-03: historial de estados de maquinas

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

[Nuevas entidades, atributos o relaciones afectadas] + Diagrama acutalizado 

 

## 5. Impacto en mockups 

[Mockups afectados y descripción de cambios necesarios] 

 

## 6. Impacto en arquitectura 

Para cumplir con transacciones atómicas y consistencia fuerte, tendrían que abandonar EDA y adoptar uno de estos dos estilos:

Arquitectura Monolítica (o de Capas tradicional): Todos los módulos (App, Inventario, Cotizaciones) viven en el mismo servidor y se conectan a una única y masiva base de datos relacional (SQL). Esto garantiza que, si se reserva un técnico, la base de datos se bloquea y la transacción es 100% atómica.

Microservicios Síncronos (con REST o gRPC): Separar los módulos, pero en lugar de usar un Bus de Eventos asíncrono, los módulos se hacen llamadas directas mediante APIs (como cuando una app de delivery verifica tu tarjeta de crédito).

El costo mortal del cambio: Si cambian a un modelo síncrono para cumplir estos nuevos requisitos, pierden automáticamente el autoguardado local y el soporte offline (SICO-09). Si el técnico de SICO no tiene señal de internet en la panadería, la aplicación web simplemente se colgará y no le dejará hacer nada, porque no podrá comunicarse con la base de datos central para garantizar la “consistencia fuerte”.
 

### 6.1 ¿Cambia el estilo arquitectónico? 

SI: El cambio afectaria principalmente a la seguridad de los usuarios y del mismo sistema, ya que, se veria en conflicto mayor informacion de los ya mencionados. A la vez con eso, el sistema debera sacrificar ciertos requisitos principalmente enfocado a la optimizacion y eficiencia del mismo.



 

### 6.2 Relación REF (repriorizado) con decisiones de arquitectura 

 

| REF ID | Prioridad nueva | Decisión de arquitectura que lo aborda         | 

|--------|-----------------|------------------------------------------------| 

| SICO-02 | Alta            | El sistema amerita mejor seguridad a la hora de recopilar informacion sobre el cliente  | 

| SICO-06 | Media            | El sistema, ya no puede ser tan intuitivo por la complejidad del mismo          | 

| SICO-07 | Media            | El sistema busca ahora una supervivencia extremas para mantenerse activo           |

## 7. Impacto en módulos 

 

| Módulo             | Tipo de impacto    | Responsabilidad actualizada        | Ofrece a otros (actualizado)   | 

|--------------------|--------------------|------------------------------------|--------------------------------| 

| [Módulo existente] | modificado         | [descripción actualizada]          | [interfaces actualizadas]      | 

| [Módulo nuevo]     | nuevo              | [responsabilidad]                  | [qué expone]                   | 

| [Módulo eliminado] | eliminado          | —                                  | —                              | 

 

Fundamentación de cambios modulares: 

[Justificar por qué se agregan, modifican o eliminan módulos en función del 

cambio de requerimientos y/o la repriorización de REF.] 

 

## 8. Nuevas decisiones de diseño 

 

### Decisión 1 

- Decisión: Agregación de modulos asistenciales. 

- Motivación: Mayor seguridad de los datos de los usuarios. 

- Alternativas consideradas: Se evaluaron cambios arquitectonicos de alto impacto.
 
- Impacto: Se enfoca en la seguridad y optimizacion del sistema. 

 

## 9. Trazabilidad actualizada 

 

| Historia | REF relacionado | Módulo     | Mockup  | 

|----------|-----------------|------------|---------| 

| US-XX    | REF-XX          | [módulo]   | [ref]   | 

 

## 10. Justificación global y trade-offs 

[Por qué la solución propuesta es coherente con el sistema. 

Qué trade-offs se asumieron, especialmente ante cambios de prioridad en REF. 

Qué se gana y qué se sacrifica con las decisiones tomadas.]


