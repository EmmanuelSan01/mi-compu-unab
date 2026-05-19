# **Backlog Priorizado del Producto**

### **1\. Configuración del entorno de desarrollo y estructura de carpetas**

* **Módulo:** Backend  
* **Prioridad:** Muy alta  
* **Historia de Usuario:** Como desarrollador, quiero tener un entorno de trabajo estandarizado para asegurar la consistencia del código entre los integrantes del equipo.  
* **Criterios de aceptación:**  
  * Repositorio inicializado con la estructura de carpetas definida.  
  * Entorno de desarrollo configurado con las dependencias necesarias.

### **2\. Diseño e implementación del esquema de datos en formato JSON**

* **Módulo:** Backend  
* **Prioridad:** Muy alta  
* **Historia de Usuario:** Como sistema, necesito una estructura de datos estandarizada para almacenar usuarios y reservas de forma organizada.  
* **Criterios de aceptación:**  
  * Archivos JSON definidos con campos obligatorios (estudiante, equipo, horario).  
  * Esquema validado para evitar redundancias.

### **3\. Desarrollo de la lógica de persistencia local**

* **Módulo:** Backend  
* **Prioridad:** Muy alta  
* **Historia de Usuario:** Como desarrollador, necesito funciones que lean y escriban en el  archivo JSON principal para garantizar que los datos no se pierdan al cerrar la aplicación.  
* **Criterios de aceptación:**  
  * Funciones de lectura (Load) y escritura (Save) operacionales.  
  * Manejo de excepciones si el archivo JSON no existe o está corrupto.

### **4\. Configuración de la arquitectura de archivos del repositorio**

* **Módulo:** Frontend  
* **Prioridad:** Alta  
* **Historia de Usuario:** Como desarrollador, quiero organizar los archivos HTML y CSS para facilitar el mantenimiento de la interfaz.  
* **Criterios de aceptación:**  
  * Estructura de carpetas para estilos y plantillas creada.  
  * Enlace correcto entre los archivos de vista y el backend.

### **5\. Creación del módulo de gestión de usuarios**

* **Módulo:** Backend  
* **Prioridad:** Alta  
* **Historia de Usuario:** Como desarrollador, quiero implementar una lógica robusta para el manejo de perfiles, asegurando que el registro de nuevos estudiantes se procese y almacene correctamente en el sistema de persistencia local.  
* **Criterios de aceptación:**  
  * Validación de los datos de entrada antes de invocar la función de escritura en el JSON.  
  * Verificación de unicidad que impida la creación de usuarios duplicados basándose en un identificador único.

### **6\. Maquetado del formulario de registro de usuarios**

* **Módulo:** Frontend  
* **Prioridad:** Alta  
* **Historia de Usuario:** Como estudiante de la UNAB, quiero un formulario visual para registrarme en la plataforma de reservas.  
* **Criterios de aceptación:**  
  * Formulario HTML con campos de nombre, correo y contraseña.  
  * Validaciones visuales (campos obligatorios) implementadas con CSS.

### **7\. Implementación del sistema de autenticación**

* **Módulo:** Backend  
* **Prioridad:** Alta  
* **Historia de Usuario:** Como usuario registrado, quiero que el sistema valide mis credenciales para proteger mi información de reservas.  
* **Criterios de aceptación:**  
  * Algoritmo que compare el input con los datos del JSON de usuarios.  
  * Generación de sesión o estado de "logueado".

### **8\. Diseño y construcción de la interfaz de inicio de sesión**

* **Módulo:** Frontend  
* **Prioridad:** Alta  
* **Historia de Usuario:** Como estudiante, quiero una pantalla de login clara para acceder a mi panel personal.  
* **Criterios de aceptación:**  
  * Interfaz visual funcional conectada al backend de autenticación.

### **9\. Codificación del algoritmo de control para disponibilidad**

* **Módulo:** Backend  
* **Prioridad:** Muy alta  
* **Historia de Usuario:** Como sistema, necesito validar en tiempo real si hay equipos disponibles en la sala CSU 22 según su capacidad física.  
* **Criterios de aceptación:**  
  * El algoritmo debe impedir reservas que superen la capacidad máxima de la sala.  
  * Validación de disponibilidad de equipos específicos por bloque horario.

### **10\. Desarrollo de las reglas de negocio para asignación de horarios**

* **Módulo:** Backend  
* **Prioridad:** Muy alta  
* **Historia de Usuario:** Como sistema, requiero reglas que prevengan la saturación de la sala y garanticen un acceso equitativo.  
* **Criterios de aceptación:**  
  * Implementación de límites de tiempo por reserva.  
  * Prevención de cruces de horarios para el mismo equipo.

### **11\. Creación de la arquitectura de interfaz (GUI) para el panel de reservas**

* **Módulo:** Frontend  
* **Prioridad:** Media  
* **Historia de Usuario:** Como estudiante, quiero una interfaz donde pueda seleccionar visualmente el equipo que deseo usar.  
* **Criterios de aceptación:**  
  * Panel principal con layout de la sala y selección de recursos.

### **12\. Diseño visual del flujo de horarios para la sala CSU 22**

* **Módulo:** Frontend  
* **Prioridad:** Media  
* **Historia de Usuario:** Como estudiante, quiero ver los bloques horarios disponibles de forma clara para planificar mi estudio.  
* **Criterios de aceptación:**  
  * Selector de fecha y hora integrado en la interfaz.  
  * Diseño responsive para la visualización de horarios.

### **13\. Programación del módulo de consulta de reservas**

* **Módulo:** Backend  
* **Prioridad:** Media  
* **Historia de Usuario:** Como usuario, quiero que el sistema me permita cambiar el estado de mi reserva a "cancelada" para que el equipo quede disponible para otros estudiantes de la UNAB.  
* **Criterios de aceptación:**  
  * Endpoint o función que filtre el JSON por el ID del usuario logueado.

### **14\. Desarrollo del panel de visualización de reservas realizadas**

* **Módulo:** Frontend  
* **Prioridad:** Media  
* **Historia de Usuario:** Como estudiante, quiero ver una lista de mis reservas para tener trazabilidad de mis actividades.  
* **Criterios de aceptación:**  
  * Tabla o lista visual que muestre equipo, fecha y hora de la reserva.

### **15\. Implementación de la lógica de navegación**

* **Módulo:** Frontend  
* **Prioridad:** Baja  
* **Historia de Usuario:** Como usuario, quiero navegar entre el login, el registro y el panel de reservas sin errores.  
* **Criterios de aceptación:**  
  * Enlaces y botones de navegación funcionales en toda la aplicación.

### **16\. Aseguramiento de la interacción intuitiva**

* **Módulo:** Frontend  
* **Prioridad:** Baja  
* **Historia de Usuario:** Como usuario, quiero que el proceso de reserva sea sencillo y no requiera capacitación previa.  
* **Criterios de aceptación:**  
  * Aplicación de principios de UX para reducir clics innecesarios.

### **17\. Validación de la visualización de datos en tiempo real**

* **Módulo:** Frontend  
* **Prioridad:** Media  
* **Historia de Usuario:** Como estudiante, quiero ver inmediatamente si un equipo se desocupa para poder reservarlo.  
* **Criterios de aceptación:**  
  * Actualización de la UI cuando el backend confirme cambios en la disponibilidad.

### **18\. Ejecución de pruebas de consistencia lógica e integridad**

* **Módulo:** Backend  
* **Prioridad:** Media  
* **Historia de Usuario:** Como desarrollador, quiero asegurar que el sistema no guarde datos corruptos ni permita reservas imposibles.  
* **Criterios de aceptación:**  
  * Suite de pruebas que validen la integridad del JSON tras múltiples operaciones.

# **Sprint Backlog**

## **Resumen de Sprints**

| Sprint | Período | Foco principal |
| ----- | ----- | ----- |
| Sprint 1 | 12/04 – 25/04 | Fundamentos: entorno, datos y persistencia |
| Sprint 2 | 26/04 – 09/05 | Usuarios, autenticación y estructura frontend |
| Sprint 3 | 10/05 – 24/05 | Reservas, reglas de negocio y entregable final |

## **Sprint 1: Fundamentos del Sistema**

**Período:** 12 de abril \- 25 de abril de 2026

**Objetivo del Sprint:** Establecer las bases técnicas del proyecto: entorno de desarrollo, modelo de datos y capa de persistencia local operacional.

### **Ítems del Sprint**

#### **\[BE-01\] Configuración del entorno de desarrollo y estructura de carpetas**

* **Prioridad:** Muy alta  
* **Módulo:** Backend  
* **Historia de Usuario:** Como desarrollador, quiero tener un entorno de trabajo estandarizado para asegurar la consistencia del código entre los integrantes del equipo.  
* **Criterios de aceptación:**  
  * Repositorio inicializado con la estructura de carpetas definida.  
  * Entorno de desarrollo configurado con las dependencias necesarias.  
* **Estimación:** 2 días

#### **\[BE-02\] Diseño e implementación del esquema de datos en formato JSON**

* **Prioridad:** Muy alta  
* **Módulo:** Backend  
* **Historia de Usuario:** Como sistema, necesito una estructura de datos estandarizada para almacenar usuarios y reservas de forma organizada.  
* **Criterios de aceptación:**  
  * Archivos JSON definidos con campos obligatorios (estudiante, equipo, horario).  
  * Esquema validado para evitar redundancias.  
* **Estimación:** 2 días  
* **Dependencia:** BE-01

#### **\[BE-03\] Desarrollo de la lógica de persistencia local**

* **Prioridad:** Muy alta  
* **Módulo:** Backend  
* **Historia de Usuario:** Como desarrollador, necesito funciones que lean y escriban en el archivo JSON principal para garantizar que los datos no se pierdan al cerrar la aplicación.  
* **Criterios de aceptación:**  
  * Funciones de lectura (Load) y escritura (Save) operacionales.  
  * Manejo de excepciones si el archivo JSON no existe o está corrupto.  
* **Estimación:** 3 días  
* **Dependencia:** BE-02

#### **\[FE-04\] Configuración de la arquitectura de archivos del repositorio**

* **Prioridad:** Alta  
* **Módulo:** Frontend  
* **Historia de Usuario:** Como desarrollador, quiero organizar los archivos HTML y CSS para facilitar el mantenimiento de la interfaz.  
* **Criterios de aceptación:**  
  * Estructura de carpetas para estilos y plantillas creada.  
  * Enlace correcto entre los archivos de vista y el backend.  
* **Estimación:** 2 días  
* **Dependencia:** BE-01

### **Entregables del Sprint 1**

* Repositorio configurado y accesible para todos los miembros del equipo.  
* Esquema JSON validado con datos de prueba.  
* Funciones `load()` y `save()` probadas manualmente.  
* Estructura de archivos frontend creada y enlazada al backend.

## **Sprint 2: Usuarios, Autenticación e Interfaz Base**

**Período:** 26 de abril \- 9 de mayo de 2026

**Objetivo del Sprint:** Implementar la gestión de usuarios y el sistema de autenticación, junto con las interfaces visuales de registro e inicio de sesión.

### **Ítems del Sprint**

#### **\[BE-05\] Creación del módulo de gestión de usuarios**

* **Prioridad:** Alta  
* **Módulo:** Backend  
* **Historia de Usuario:** Como desarrollador, quiero implementar una lógica robusta para el manejo de perfiles, asegurando que el registro de nuevos estudiantes se procese y almacene correctamente.  
* **Criterios de aceptación:**  
  * Validación de los datos de entrada antes de invocar la función de escritura en el JSON.  
  * Verificación de unicidad que impida la creación de usuarios duplicados basándose en un identificador único.  
* **Estimación:** 3 días  
* **Dependencia:** BE-03

#### **\[BE-07\] Implementación del sistema de autenticación**

* **Prioridad:** Alta  
* **Módulo:** Backend  
* **Historia de Usuario:** Como usuario registrado, quiero que el sistema valide mis credenciales para proteger mi información de reservas.  
* **Criterios de aceptación:**  
  * Algoritmo que compare el input con los datos del JSON de usuarios.  
  * Generación de sesión o estado de "logueado".  
* **Estimación:** 3 días  
* **Dependencia:** BE-05

#### **\[FE-06\] Maquetado del formulario de registro de usuarios**

* **Prioridad:** Alta  
* **Módulo:** Frontend  
* **Historia de Usuario:** Como estudiante de la UNAB, quiero un formulario visual para registrarme en la plataforma de reservas.  
* **Criterios de aceptación:**  
  * Formulario HTML con campos de nombre, correo y contraseña.  
  * Validaciones visuales (campos obligatorios) implementadas con CSS.  
* **Estimación:** 2 días  
* **Dependencia:** FE-04

#### **\[FE-08\] Diseño y construcción de la interfaz de inicio de sesión**

* **Prioridad:** Alta  
* **Módulo:** Frontend  
* **Historia de Usuario:** Como estudiante, quiero una pantalla de login clara para acceder a mi panel personal.  
* **Criterios de aceptación:**  
  * Interfaz visual funcional conectada al backend de autenticación.  
* **Estimación:** 2 días  
* **Dependencia:** FE-06, BE-07

#### **\[FE-15\] Implementación de la lógica de navegación**

* **Prioridad:** Baja  
* **Módulo:** Frontend  
* **Historia de Usuario:** Como usuario, quiero navegar entre el login, el registro y el panel de reservas sin errores.  
* **Criterios de aceptación:**  
  * Enlaces y botones de navegación funcionales en toda la aplicación.  
* **Estimación:** 1 día  
* **Dependencia:** FE-06, FE-08

### **Entregables del Sprint 2**

* Módulo de registro funcional con validación de duplicados.  
* Sistema de login operativo con generación de sesión.  
* Formularios de registro e inicio de sesión visualmente completos y conectados al backend.  
* Navegación básica entre vistas implementada.

## **Sprint 3: Reservas, Reglas de Negocio y Cierre**

**Período:** 10 de mayo \- 24 de mayo de 2026

**Objetivo del Sprint:** Implementar el núcleo del sistema de reservas: algoritmo de disponibilidad, reglas de negocio, interfaces de usuario para consulta y gestión, y pruebas de integridad.

### **Ítems del Sprint**

#### **\[BE-09\] Codificación del algoritmo de control para disponibilidad**

* **Prioridad:** Muy alta  
* **Módulo:** Backend  
* **Historia de Usuario:** Como sistema, necesito validar en tiempo real si hay equipos disponibles en la sala CSU 22 según su capacidad física.  
* **Criterios de aceptación:**  
  * El algoritmo debe impedir reservas que superen la capacidad máxima de la sala.  
  * Validación de disponibilidad de equipos específicos por bloque horario.  
* **Estimación:** 3 días  
* **Dependencia:** BE-03

#### **\[BE-10\] Desarrollo de las reglas de negocio para asignación de horarios**

* **Prioridad:** Muy alta  
* **Módulo:** Backend  
* **Historia de Usuario:** Como sistema, requiero reglas que prevengan la saturación de la sala y garanticen un acceso equitativo.  
* **Criterios de aceptación:**  
  * Implementación de límites de tiempo por reserva.  
  * Prevención de cruces de horarios para el mismo equipo.  
* **Estimación:** 2 días  
* **Dependencia:** BE-09

#### **\[BE-13\] Programación del módulo de consulta y cancelación de reservas**

* **Prioridad:** Media  
* **Módulo:** Backend  
* **Historia de Usuario:** Como usuario, quiero que el sistema me permita cambiar el estado de mi reserva a "cancelada" para que el equipo quede disponible para otros estudiantes.  
* **Criterios de aceptación:**  
  * Función que filtre el JSON por el ID del usuario logueado.  
  * Lógica para actualizar el estado de una reserva a "cancelada".  
* **Estimación:** 2 días  
* **Dependencia:** BE-10

#### **\[FE-11\] Creación de la arquitectura de interfaz (GUI) para el panel de reservas**

* **Prioridad:** Media  
* **Módulo:** Frontend  
* **Historia de Usuario:** Como estudiante, quiero una interfaz donde pueda seleccionar visualmente el equipo que deseo usar.  
* **Criterios de aceptación:**  
  * Panel principal con layout de la sala y selección de recursos.  
* **Estimación:** 2 días  
* **Dependencia:** FE-08

#### **\[FE-12\] Diseño visual del flujo de horarios para la sala CSU 22**

* **Prioridad:** Media  
* **Módulo:** Frontend  
* **Historia de Usuario:** Como estudiante, quiero ver los bloques horarios disponibles de forma clara para planificar mi estudio.  
* **Criterios de aceptación:**  
  * Selector de fecha y hora integrado en la interfaz.  
  * Diseño responsive para la visualización de horarios.  
* **Estimación:** 2 días  
* **Dependencia:** FE-11

#### **\[FE-14\] Desarrollo del panel de visualización de reservas realizadas**

* **Prioridad:** Media  
* **Módulo:** Frontend  
* **Historia de Usuario:** Como estudiante, quiero ver una lista de mis reservas para tener trazabilidad de mis actividades.  
* **Criterios de aceptación:**  
  * Tabla o lista visual que muestre equipo, fecha y hora de la reserva.  
* **Estimación:** 1 día  
* **Dependencia:** BE-13, FE-11

#### **\[FE-17\] Validación de la visualización de datos en tiempo real**

* **Prioridad:** Media  
* **Módulo:** Frontend  
* **Historia de Usuario:** Como estudiante, quiero ver inmediatamente si un equipo se desocupa para poder reservarlo.  
* **Criterios de aceptación:**  
  * Actualización de la UI cuando el backend confirme cambios en la disponibilidad.  
* **Estimación:** 1 día  
* **Dependencia:** FE-12, BE-09

#### **\[FE-16\] Aseguramiento de la interacción intuitiva**

* **Prioridad:** Baja  
* **Módulo:** Frontend  
* **Historia de Usuario:** Como usuario, quiero que el proceso de reserva sea sencillo y no requiera capacitación previa.  
* **Criterios de aceptación:**  
  * Aplicación de principios de UX para reducir clics innecesarios.  
* **Estimación:** 1 día  
* **Dependencia:** FE-14, FE-17

#### **\[BE-18\] Ejecución de pruebas de consistencia lógica e integridad**

* **Prioridad:** Media  
* **Módulo:** Backend  
* **Historia de Usuario:** Como desarrollador, quiero asegurar que el sistema no guarde datos corruptos ni permita reservas imposibles.  
* **Criterios de aceptación:**  
  * Suite de pruebas que validen la integridad del JSON tras múltiples operaciones.  
* **Estimación:** 2 días  
* **Dependencia:** BE-10, BE-13

### **Entregables del Sprint 3**

* Algoritmo de disponibilidad funcional con validación de capacidad y cruces de horario.  
* Panel de reservas con selector de equipo y bloques horarios.  
* Lista de reservas por usuario con opción de cancelación.  
* UI con actualización de disponibilidad en tiempo real.  
* Suite de pruebas ejecutada con resultados documentados.  
* Sistema integrado y listo para demostración.

## **Notas y Convenciones**

* **Prefijos de ID:** `BE-` para ítems de Backend, `FE-` para Frontend.  
* **Reuniones Scrum:**  
  * *Daily stand-up:* 15 minutos cada día hábil.  
  * *Sprint Planning:* al inicio de cada sprint (día 1).  
  * *Sprint Review \+ Retrospectiva:* al cierre de cada sprint (último día).  
* La estimación en días asume una capacidad de trabajo de **2 desarrolladores** trabajando en paralelo (uno Backend, uno Frontend).

