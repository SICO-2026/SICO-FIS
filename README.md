# SICO-FIS

## Somos Sico, empresa encargada de supervicion, control, gestion y mantenimiento de maquinaria industrial relacionada al mundo gastronomico.

## Equipo de trabajo:

**Scrum master**: Ariel Miranda

**Product owner**: Percival Leiva

**Devs**: Rafaella Diaz, David Bombal e Ivan Rodriguez.

## Caracteristicas Principales.

+Gestión de equipo: Registro de activos con números de serie únicos y validación de campos técnicos obligatorios (modelo de horno, tipo de amasadora).

+Consulta de historial: Acceso al historial completo de mantenimientos, reparaciones y repuestos usados en la maqwuinaria.

+Autoguardado local: Sincronización automática de datos de inspección y reportes de campo para evitar pérdidas de información crítica en zonas de baja conectividad.

+Generador de cotizaciones: Creación de cotizaciones de servicio o repuestos en PDF, o en la web, prellenadas con datos técnicos y precios vigentes.

+Gestión de repuestos: Control detallado del inventario de piezas, incluyendo equivalencias de SKU de distintos proveedores para hornos y amasadoras.

+Alertas de mantenimiento: Notificaciones automáticas y programables para mantenimientos preventivos inminentes basadas en horas de operación o fecha calendaria.

+Telemetría de control: Monitoreo remoto en tiempo real de temperatura, vibración y consumo energético para detección de anomalías en hornos y/o líneas de producción.


## Figma

https://glue-habit-23423275.figma.site/

## Atributos

<img width="853" height="620" alt="Captura" src="https://github.com/user-attachments/assets/7b68f67a-4db0-4142-84bc-f470a872b001" />

## Estilo de arquitectura

              
<img width="196" height="122" alt="ssssss" src="https://github.com/user-attachments/assets/18b6f578-6da2-4906-bacb-1f717e9b1bd5" />

**¿Porque este estilo?**

Elegimos el estilo arquitectónico "Event-Driven" porque nuestras prioridades principales son el **Rendimiento, la Disponibilidad y la Recuperabilidad**. Al monitorear maquinaria industrial de panadería, necesitamos que el sistema procese alertas de sensores de forma asíncrona para no saturar la red. Este enfoque altamente desacoplado garantiza que el sistema general no se caiga si un módulo falla, asegura que no se pierdan datos críticos de mantenimiento y permite a los equipos de desarrollo actualizar componentes de forma independiente, favoreciendo también la **Mantenibilidad**.

**¿Que estamos sacrificando?**

Al irnos por este estilo, estamos sacrificando simplicidad en el desarrollo. Configurar toda esta arquitectura al principio es más complejo, y hacer debugging (encontrar errores) con flujos de datos asíncronos es bastante más enredado que en un sistema tradicional. Aceptamos este costo porque para nosotros la Disponibilidad y la Recuperabilidad son intransables; preferimos asumir ese peso técnico extra ahora, antes que arriesgarnos a perder una alerta de emergencia de un horno industrial simplemente porque el servidor principal tuvo una caída de un par de minutos.

**Componentes principales**

1. Aplicacion web/movil -> Frontend, intterfaz especifica para los tecnicos en terreno y la administtracion.
2. Bus de eventos -> Gestion de mensajes, ataja y pone en fila todos los datos y alertas en tiempo real.
3. API Rest -> Backen, logica central de la empresa. Ya sea gestion de ordenes de trabajo, inventario y las cotizaciones).
4. Base de datos -> histoial de equipos y clientes.


**Requisito Arquitectónicamente Significativo**

El sistema debe procesar y notificar las alertas criticas de los sensores, por ejemplo, sobrecalentamiento de hornos, en menos de 2 segundos, bajo una carga concurrente de hasta 1,000 eventos por minuto provenientes de multiples panaderias.









