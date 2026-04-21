## Estilo Arquitectónico

              
<img width="196" height="122" alt="ssssss" src="https://github.com/user-attachments/assets/18b6f578-6da2-4906-bacb-1f717e9b1bd5" />

**¿Porque este estilo?**

Este estilo porque nuestras prioridades críticas son la Recuperabilidad [SICO-09], la Disponibilidad [SICO-03] y el Rendimiento [SICO-01]


Al tratarse de un sistema para ambientes industriales y trabajo en terreno, necesitamos que la plataforma siga operando incluso si falla la red (alta disponibilidad, SICO-03). Usando este estilo, la aplicación puede realizar un "autoguardado" y registrar la información de las inspecciones. Al momento de cuando vuelva la conexión, esos eventos se sincronizan sin perder ningún dato crítico de la maquinaria (alta recuperabilidad SICO-09).

Por el lado del Rendimiento (SICO-01). Se recibe una telemetría constante (vibración, temperatura de los hornos). Al manejar la telemetría como mensajes asíncronos en segundo plano, la interfaz principal queda liberada, asegurando que cualquier acción del usuario en la plataforma web se procese en menos de los 2 segundos exigidos.

| ID | TIPO | Descripcion | Porque ocupamos en este estilo |
|-----------|-----------|-----------|-----------|
| SICO-01 | Eficiencia/Rendimiento | El sistema debe procesar solicitudes en un tiempo máximo de 2 segundos. | Las tareas pesadas (como el cálculo masivo de telemetría) se emiten como eventos en segundo plano. Esto libera el hilo principal, asegurando que la interfaz de la web reaccione al instante para el usuario.|
| SICO-03 | Disponibilidad | El sistema debe tener una disponibilidad mínima del 99%. | Si el servicio de notificaciones o inventario sufre una caída, el sistema central sigue funcionando. El bus de eventos retiene los mensajes hasta que el servicio vuelva a estar en línea, garantizando que la operación en terreno nunca se detenga. |
| SICO-09 | Recuperabilidad | El sistema debe recuperar la información ante fallos sin pérdida de datos críticos. | La aplicación guarda las acciones de los tecnicos como eventos locales. Si un tecnico pierde la señal, al momento que detecta red nuevamente, la app transmite toda la ráfaga de eventos acumulados, asegurando que ningún dato de inspección se pierda. |


**¿Que estamos sacrificando?**

Al irnos por este estilo, el principal costo que asumimos es trabajar con consistencia eventual en lugar de una consistencia fuerte. Esto significa que el sistema puede mostrar datos temporalmente desfasados. Aceptamos esta desincronización temporal porque, para nuestra operación, es preferible que una lectura de inventario esté atrasada por unos minutos, a que un técnico no pueda registrar una mantención crítica en un horno panadero debido a una caída de conexión con la base de datos central.

## **Diagrama de arquitectura**

<img width="1440" height="937" alt="Untitled Diagram(2)" src="https://github.com/user-attachments/assets/c7e40f9b-21f8-46cc-95a1-44e0f85a0a6b" />



**Componentes principales**

1. Aplicacion web/movil -> Frontend, intterfaz especifica para los tecnicos en terreno y la administtracion.
2. Bus de eventos -> Gestion de mensajes, ataja y pone en fila todos los datos y alertas en tiempo real.
3. API Rest -> Backen, logica central de la empresa. Ya sea gestion de ordenes de trabajo, inventario y las cotizaciones).
4. Base de datos -> histoial de equipos y clientes.


**Requisito Arquitectónicamente Significativo**

El sistema debe procesar y notificar las alertas criticas de los sensores, por ejemplo, sobrecalentamiento de hornos, en menos de 2 segundos, bajo una carga concurrente de hasta 1,000 eventos por minuto provenientes de multiples panaderias.
