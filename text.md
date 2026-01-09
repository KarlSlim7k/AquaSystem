### **Módulos Recomendados del Sistema**

### **1. Módulo de Censo y Registro de Usuarios**

- Captura de datos personales de usuarios del servicio
- Formulario de registro con validación de datos
- Captura de geolocalización (coordenadas GPS)
- Asignación de número de cuenta único
- Fotografía del domicilio/toma de agua

### **2. Módulo de Gestión de Pagos**

- Registro de pagos realizados
- Generación de recibos digitales
- Cálculo automático de adeudos
- Alertas de pagos vencidos
- Consulta de estado de cuenta

### **3. Módulo de Historial y Reportes**

- Historial completo de pagos por usuario
- Reportes de cobranza (diarios, mensuales, anuales)
- Estadísticas de recaudación
- Usuarios morosos
- Exportación de datos (PDF, Excel)

### **4. Módulo de Administración**

- Gestión de usuarios del sistema (administradores, cobradores)
- Configuración de tarifas del servicio
- Respaldo de base de datos
- Bitácora de actividades del sistema

### **5. Módulo de Geolocalización**

- Mapa interactivo con ubicación de usuarios
- Visualización de rutas de cobro
- Identificación visual de usuarios morosos vs al corriente

### **6. Módulo de Notificaciones** *(Recomendación adicional)*

- Avisos de próximos vencimientos
- Recordatorios de pago
- Notificaciones de cortes programados

---

## ✅ REQUISITOS FUNCIONALES DEL SISTEMA

### **RF-001: Gestión de Censo de Usuarios**

**RF-001.1** - El sistema debe permitir registrar nuevos usuarios con los siguientes datos obligatorios:

- Nombre completo
- Dirección completa
- Teléfono de contacto
- Correo electrónico (opcional)
- Número de identificación oficial
- Coordenadas de geolocalización (latitud y longitud)

**RF-001.2** - El sistema debe generar automáticamente un número de cuenta único para cada usuario registrado.

**RF-001.3** - El sistema debe permitir capturar la geolocalización del domicilio mediante GPS del dispositivo móvil.

**RF-001.4** - El sistema debe permitir capturar fotografías del domicilio y del medidor de agua.

**RF-001.5** - El sistema debe validar que no existan usuarios duplicados mediante verificación de dirección y datos personales.

**RF-001.6** - El sistema debe permitir editar y actualizar la información de usuarios existentes.

**RF-001.7** - El sistema debe permitir dar de baja usuarios (baja lógica, no eliminar registros).

---

### **RF-002: Gestión de Pagos**

**RF-002.1** - El sistema debe permitir registrar pagos con los siguientes datos:

- Número de cuenta del usuario
- Monto pagado
- Fecha y hora del pago
- Periodo que cubre el pago
- Método de pago (efectivo, transferencia, tarjeta)
- Usuario del sistema que registra el pago

**RF-002.2** - El sistema debe calcular automáticamente el monto a pagar según la tarifa configurada y el periodo de consumo.

**RF-002.3** - El sistema debe identificar y calcular adeudos acumulados de periodos anteriores.

**RF-002.4** - El sistema debe permitir aplicar recargos por mora según los días de atraso.

**RF-002.5** - El sistema debe generar un recibo digital al momento de registrar un pago.

**RF-002.6** - El sistema debe permitir imprimir o enviar por correo/WhatsApp el recibo de pago.

**RF-002.7** - El sistema debe permitir registrar pagos parciales y llevar control del saldo pendiente.

**RF-002.8** - El sistema debe permitir cancelar pagos registrados erróneamente (con justificación y registro en bitácora).

---

### **RF-003: Historial de Pagos**

**RF-003.1** - El sistema debe mantener un historial completo de todos los pagos realizados por cada usuario.

**RF-003.2** - El sistema debe permitir consultar el historial de pagos por:

- Usuario específico
- Rango de fechas
- Periodo de facturación
- Método de pago

**RF-003.3** - El sistema debe mostrar en el historial: fecha, monto, periodo pagado, método de pago y usuario que registró el pago.

**RF-003.4** - El sistema debe permitir visualizar el estado de cuenta actual de cada usuario (adeudos, pagos anticipados).

**RF-003.5** - El sistema debe indicar visualmente el estatus de pago de cada usuario (al corriente, con adeudo, moroso).

---

### **RF-004: Reportes y Estadísticas**

**RF-004.1** - El sistema debe generar reporte de cobranza diaria con:

- Total recaudado
- Número de pagos registrados
- Detalle por usuario

**RF-004.2** - El sistema debe generar reporte de cobranza mensual y anual.

**RF-004.3** - El sistema debe generar listado de usuarios morosos con:

- Monto adeudado
- Periodos adeudados
- Días de atraso

**RF-004.4** - El sistema debe generar reporte de usuarios al corriente en sus pagos.

**RF-004.5** - El sistema debe permitir exportar reportes en formato PDF y Excel.

**RF-004.6** - El sistema debe mostrar estadísticas gráficas de:

- Recaudación por periodo
- Porcentaje de cobranza efectiva
- Distribución de usuarios por estatus de pago

---

### **RF-005: Geolocalización y Mapas**

**RF-005.1** - El sistema debe mostrar un mapa interactivo con la ubicación de todos los usuarios registrados.

**RF-005.2** - El sistema debe utilizar marcadores diferenciados por color según el estatus de pago:

- Verde: Al corriente
- Amarillo: Próximo a vencer
- Rojo: Moroso

**RF-005.3** - El sistema debe permitir hacer clic en un marcador para ver información básica del usuario y su estado de cuenta.

**RF-005.4** - El sistema debe permitir generar rutas de cobro optimizadas basadas en la geolocalización.

**RF-005.5** - El sistema debe permitir filtrar usuarios en el mapa por estatus de pago, zona o ruta.

---

### **RF-006: Gestión de Configuración**

**RF-006.1** - El sistema debe permitir configurar las tarifas del servicio de agua.

**RF-006.2** - El sistema debe permitir configurar el porcentaje de recargos por mora.

**RF-006.3** - El sistema debe permitir configurar los periodos de facturación (mensual, bimestral, etc.).

**RF-006.4** - El sistema debe permitir configurar los días de gracia antes de aplicar recargos.

**RF-006.5** - El sistema debe mantener un historial de cambios en las configuraciones.

---

### **RF-007: Gestión de Usuarios del Sistema**

**RF-007.1** - El sistema debe contar con tres niveles de usuarios:

- Administrador: Acceso total
- Cobrador: Registro de pagos y consultas
- Consulta: Solo visualización de información

**RF-007.2** - El sistema debe requerir autenticación mediante usuario y contraseña.

**RF-007.3** - El sistema debe mantener registro de las acciones realizadas por cada usuario del sistema (bitácora).

**RF-007.4** - El sistema debe permitir al administrador crear, editar y desactivar usuarios del sistema.

**RF-007.5** - El sistema debe cerrar automáticamente la sesión después de un periodo de inactividad.

---

### **RF-008: Notificaciones** *(Funcionalidad adicional recomendada)*

**RF-008.1** - El sistema debe generar alertas automáticas de próximos vencimientos de pago.

**RF-008.2** - El sistema debe permitir enviar recordatorios de pago vía SMS o WhatsApp (integración opcional).

**RF-008.3** - El sistema debe notificar a los administradores sobre pagos registrados en el día.

---

### **RF-009: Adaptabilidad y Responsividad**

**RF-009.1** - El sistema debe ser completamente responsivo y adaptarse a:

- Dispositivos móviles (smartphones y tablets)
- Computadoras de escritorio
- Diferentes navegadores web

**RF-009.2** - La interfaz debe ser intuitiva y fácil de usar en pantallas táctiles.

**RF-009.3** - El sistema debe funcionar correctamente en condiciones de conectividad limitada (modo offline básico para registro de pagos, con sincronización posterior).

---

### **RF-010: Seguridad y Respaldos**

**RF-010.1** - El sistema debe implementar encriptación de datos sensibles.

**RF-010.2** - El sistema debe realizar respaldos automáticos de la base de datos de forma periódica.

**RF-010.3** - El sistema debe permitir al administrador realizar respaldos manuales.

**RF-010.4** - El sistema debe mantener registro de todos los accesos e intentos fallidos de autenticación.