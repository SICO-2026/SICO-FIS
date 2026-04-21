## Estilo Arquitectónico

              
<img width="196" height="122" alt="ssssss" src="https://github.com/user-attachments/assets/18b6f578-6da2-4906-bacb-1f717e9b1bd5" />

**¿Porque este estilo?**

Este estilo porque nuestras prioridades críticas son la Recuperabilidad [SICO-09], la Disponibilidad [SICO-03] y el Rendimiento [SICO-01]


Al tratarse de un sistema para ambientes industriales y trabajo en terreno, necesitamos que la plataforma siga operando incluso si falla la red (alta disponibilidad, SICO-03). Usando este estilo, la aplicación puede realizar un "autoguardado" y registrar la información de las inspecciones. Al momento de cuando vuelva la conexión, esos eventos se sincronizan sin perder ningún dato crítico de la maquinaria (alta recuperabilidad SICO-09).

Por el lado del Rendimiento (SICO-01). Se recibe una telemetría constante (vibración, temperatura de los hornos). Al manejar la telemetría como mensajes asíncronos en segundo plano, la interfaz principal queda liberada, asegurando que cualquier acción del usuario en la plataforma web se procese en menos de los 2 segundos exigidos.

| ID | TIPO | Descripcion | Porque ocupamos en este estilo |
|-----------|-----------|-----------|-----------|
| SICO-01 | Eficiencia/Rendimiento | El sistema debe procesar solicitudes en un tiempo máximo de 2 segundos. | Las tareas pesadas (como el cálculo masivo de telemetría) se emiten como eventos en segundo plano. Esto libera el hilo principal, asegurando que la interfaz de la web reaccione al instante para el usuario.|
| SICO-03 | Disponibilidad | El sistema debe tener una disponibilidad mínima del 99%. | Si el servicio de notificaciones sufre una caída, el sistema central sigue funcionando. El bus de eventos retiene los mensajes hasta que el servicio vuelva a estar en línea, garantizando que la operación en terreno nunca se detenga. |
| SICO-09 | Recuperabilidad | El sistema debe recuperar la información ante fallos sin pérdida de datos críticos. | La aplicación guarda las acciones de los tecnicos como eventos locales. Si un tecnico pierde la señal, al momento que detecta red nuevamente, la app transmite toda la ráfaga de eventos acumulados, asegurando que ningún dato de inspección se pierda. |


**¿Que estamos sacrificando?**

Al irnos por este estilo, el principal costo que asumimos es trabajar con consistencia eventual en lugar de una consistencia fuerte. Esto significa que el sistema puede mostrar datos temporalmente desfasados. Aceptamos esta desincronización temporal porque, para nuestra operación, es preferible que una lectura de inventario esté atrasada por unos minutos, a que un técnico no pueda registrar una mantención crítica en un horno panadero debido a una caída de conexión con la base de datos central.

## **Diagrama de arquitectura**

<img width="1440" height="937" alt="Untitled Diagram(2)" src="https://github.com/user-attachments/assets/c7e40f9b-21f8-46cc-95a1-44e0f85a0a6b" />



**Componentes principales**

3. Descomposición Modular

Módulo Sensores y Telemetría 
- Responsabilidad: Capturar, procesar y emitir métricas físicas continuas (temperatura, vibraciones) directamente desde los hornos y amasadoras de la línea de producción.
- Ofrece a otros módulos: Flujos de datos en tiempo real sobre el estado del hardware, emitidos como eventos como ejemplo: telemetria.actualizada, sensor.anomalia_detectada.
- Depende de: Ninguno

Módulo App de Mantenimiento 
- Responsabilidad: Proveer la interfaz para que los técnicos registren las inspecciones en terreno, reporten fallas y declaren los repuestos utilizados, gestionando el autoguardado local cuando estos no tengan conexion a internet.
- Ofrece a otros módulos: Registros de las acciones del técnico en terreno, estos emitidos como eventos al recuperar red.
- Depende de: Módulo de Gestión de Maquinaria.

Módulo Gestión de Maquinaria e Inventario 
- Responsabilidad: Administrar la base de datos maestra de los equipos registrados, perfiles técnicos, y mantener el control del stock de repuestos.
- Ofrece a otros módulos: Validación de autenticidad de hardware, catálogos de precios para repuestos y eventos de inventario.
- Depende de: Módulo App de Mantenimiento.

Módulo Alertas y Notificaciones (Consumidor)
- Responsabilidad: Monitorear el flujo de eventos buscando umbrales críticos para despachar avisos urgentes al personal técnico.
- Ofrece a otros módulos: Un canal centralizado para la entrega de notificaciones (Email/SMS).
- Depende de: Módulo Sensores y Módulo Gestión.

Módulo Cotizaciones (Consumidor)
- Responsabilidad: Automatizar la creación de presupuestos formales , generando documentos en PDF con valores precisos.
- Ofrece a otros módulos: Archivos PDF.
- Depende de: Módulo App de Mantenimiento y Módulo Gestión de Maquinaria.

Módulo Historial y Analytics (Consumidor)
- Responsabilidad: Persistir una bitácora de todo lo que ocurre con cada maquinaria para auditorías y generar métricas de rendimiento.
- Ofrece a otros módulos: Reportes de vida útil de las máquinas.
- Depende de: Módulo Sensores y Módulo App.

