## 1. Cambio solicitado 

 
 

## 2. Nuevas historias de usuario 

 

### SIN-01:  

Como coordinador de mantenimiento, quiero que se genere automáticamente un ticket (orden de trabajo) detallado cada vez que se confirma un servicio técnico, para estandarizar y automatizar el registro de la intervención, evitar el papeleo manual y no perder trazabilidad. 

Criterios de aceptación:
* Dado que un cliente requiere un servicio de mantenimiento preventivo, cuando el coordinador presiona “Confirmar Servicio” en la plataforma, entonces el sistema genera automáticamente una Orden de Trabajo con un código correlativo único.
* Dado que la Orden de Trabajo se genera de forma automática, cuando el coordinador abre el documento, entonces este debe contener prellenados obligatoriamente: el nombre del técnico, el número de serie del equipo a intervenir, la fecha programada y el cliente. 
* Dado que se requiere mantener un historial ordenado, cuando el sistema crea la nueva OT, entonces la vincula automáticamente al perfil y bitácora de esa maquinaria específica en la base de datos.

## SIN-02: 

Como encargado de la panadería, quiero que el sistema me asigne automáticamente al técnico disponible al solicitar un servicio de emergencia, para recibir atención inmediata y minimizar el tiempo en la línea de producción cuando este detenida.

Criterios de aceptación:
* Dado que un horno industrial falla y requiere asistencia urgente, cuando el encargado envía la solicitud, entonces el sistema cruza automáticamente la especialidad requerida con la ubicación y disponibilidad de los técnicos en terreno.
* Dado que hay un técnico calificado libre, cuando se procesa la solicitud, entonces el sistema le asigna el ticket automáticamente, bloquea ese espacio en su agenda y notifica al cliente el tiempo estimado de llegada.
* Dado que todos los técnicos están ocupados, cuando el encargado intenta crear la solicitud, entonces el sistema la pone en una cola prioritariay le informa al cliente que está en lista de espera prioritaria.

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

 

### 6.1 ¿Cambia el estilo arquitectónico? 

[Sí/No] — Justificación: 

[Si la repriorización de REF obliga a cambiar el estilo, explicar por qué. 

Si el estilo se mantiene, justificar que sigue siendo válido frente al cambio.] 

 

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

- Decisión: [qué se decide] 

- Motivación: [por qué, referenciando REF repriorizado si aplica] 

- Alternativas consideradas: [opciones evaluadas] 

- Impacto: [en qué módulos o REF afecta] 

 

## 9. Trazabilidad actualizada 

 

| Historia | REF relacionado | Módulo     | Mockup  | 

|----------|-----------------|------------|---------| 

| US-XX    | REF-XX          | [módulo]   | [ref]   | 

 

## 10. Justificación global y trade-offs 

[Por qué la solución propuesta es coherente con el sistema. 

Qué trade-offs se asumieron, especialmente ante cambios de prioridad en REF. 

Qué se gana y qué se sacrifica con las decisiones tomadas.]
