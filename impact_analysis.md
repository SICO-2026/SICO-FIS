## 1. Cambio solicitado 

 
 

## 2. Nuevas historias de usuario 

 

### US-XX: [nombre] 

Como [actor], 

quiero [acción], 

para [beneficio]. 

 

Criterios de aceptación: 

- CA1: ... 

- CA2: ... 

 

## 3. Impacto en requisitos extrafuncionales 

 

Indicar si el cambio altera la prioridad de algún REF o introduce nuevos. 

Trazar cambios de prioridad que motiven cambios en decisiones de arquitectura. 

 

| REF ID | Descripción                    | Prioridad anterior | Prioridad nueva | Cambio / Motivo           | 

|--------|--------------------------------|--------------------|-----------------|---------------------------| 

| REF-01 | [descripción]                  | Alta               | Alta            | Sin cambio                | 

| REF-03 | [descripción]                  | Media              | Alta            | El cambio lo hace crítico | 

| REF-07 | [nuevo REF derivado del cambio]| —                  | Alta            | Nuevo requisito           | 

 

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
