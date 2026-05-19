**Especificación de Requisitos de Software \- Mi Compu UNAB**

Carlos Gonzáles Aguilera

Emmanuel Sánchez Estepa

Joseph Sneider Villamizar Patiño

Ingeniera de Sistemas

Juliana Ramírez Arenas

Universidad Autónoma de Bucaramanga

Procesos Ágiles de Desarrollo de Software

19 de mayo de 2026

Bucaramanga \- Santander

## 1\. Propósito

El presente documento constituye la Especificación de Requisitos de Software (SRS) del prototipo funcional de plataforma web para la gestión de reservas de equipos en la sala de cómputo **CSU 22** de la Universidad Autónoma de Bucaramanga (UNAB). Su propósito es definir de manera precisa y verificable el comportamiento esperado del sistema, los límites de su alcance y las restricciones técnicas que condicionan su desarrollo, de modo que sirva como contrato de referencia entre los desarrolladores y los evaluadores académicos del proyecto.

El sistema aborda la ausencia de un mecanismo automatizado para la asignación de equipos en la sala CSU 22, cuya gestión actual se realiza de forma empírica —basada en la llegada física del estudiante—, generando saturación, conflictos de disponibilidad e incertidumbre para los usuarios.

### 1.1 Definiciones

| Término | Definición |
| :---- | :---- |
| **SRS** | Software Requirements Specification. Documento formal que describe los requisitos funcionales y no funcionales de un sistema de software. |
| **Prototipo funcional** | Versión operativa del sistema que implementa los flujos principales de negocio pero puede carecer de características de producción como autenticación robusta o escalabilidad horizontal. |
| **CSU 22** | Sala de cómputo número 22 del Centro de Estudios Universitarios UNAB, con una capacidad de 24 equipos de escritorio. |
| **Equipo** | Computador de escritorio disponible para reserva dentro de la sala CSU 22\. Identificado por un ID entero del 1 al 24\. |
| **Reserva** | Registro que asocia un usuario, un equipo, una fecha y una franja horaria. Su existencia en la base de datos implica actividad; su eliminación equivale a cancelación. |
| **Franja horaria** | Período de tiempo definido por `hora_inicio` y `hora_fin` en formato `HH:MM` (24 h). |
| **Solapamiento** | Condición en que dos franjas horarias se superponen. Formalmente: hay solapamiento si `NOT (fin1 ≤ inicio2 OR fin2 ≤ inicio1)`. |
| **Bloque bloqueado** | Franja horaria reservada para clases programadas que impide la creación de reservas en esa sala durante ese período. |
| **Bloque de almuerzo** | Cierre diario de la sala entre las 13:00 y las 14:00, aplicable a todos los días hábiles. |
| **Día festivo** | Fecha de calendario en la que la sala permanece cerrada. Lista fija definida en `FECHAS_BLOQUEADAS`. |
| **Modo local** | Estado de operación en el que el frontend consume la API REST servida por `json-server` en `localhost:3000`. |
| **Modo remoto** | Estado de operación en el que el frontend no puede alcanzar `localhost` y cae en modo estático, leyendo `db.json` directamente y usando `localStorage` para persistencia de escritura. |
| **json-server** | Herramienta Node.js que genera una API REST completa a partir de un archivo `db.json`. |
| **localStorage** | Mecanismo de persistencia del navegador web, utilizado como almacenamiento de escritura en modo remoto. |
| **Semestre académico** | Período comprendido entre el `2026-02-02` y el `2026-05-29`. |

### 1.2 Antecedentes

La problemática de la gestión manual de laboratorios de cómputo en entornos universitarios ha sido abordada previamente en distintos contextos:

**SIPRE-UEB** *(Cabrera Pinilla, Carreño Pérez y Al-Aaron Romo Sierra)* desarrollaron un sistema de préstamos y reservas de equipos tecnológicos utilizando PHP, Laravel y MariaDB. Su implementación demostró que la transición de procesos manuales a un sistema automatizado reduce los tiempos de ejecución, minimiza riesgos operativos y mejora la trazabilidad de equipos. Aporta al presente proyecto un modelo de arquitectura modular probado en el entorno universitario.

**Sistema de control de préstamos — Universitaria Agustiniana** *(Ruiz Castelblanco, C. S.)* desarrolló un aplicativo web con PHP, HTML, CSS y MySQL. El sistema expuso como problema crítico la falta de comunicación y el desconocimiento de disponibilidad en tiempo real, situación que el presente proyecto aborda explícitamente mediante un algoritmo de detección de conflictos. Aporta una estructura metodológica cualitativa para el diagnóstico de necesidades y una base técnica para el diseño de esquemas de datos aplicados a inventarios.

**Sistema de información para préstamo de equipos académicos** *(Yepes Lopes, L. A.)* implementó un sistema en SQL Server y Windows Azure. Su éxito evidenció brechas funcionales como la ausencia de cancelación de reservas y edición de registros, carencias que el presente proyecto cubre desde el diseño inicial.

Estos antecedentes fundamentan la pertinencia del proyecto y orientan las decisiones de diseño hacia una arquitectura que garantice disponibilidad en tiempo real, trazabilidad de reservas y una interfaz intuitiva.

### 1.3 Descripción general del sistema

El sistema es una plataforma web de página múltiple construida con HTML5, CSS3 y JavaScript ES6 (vanilla), respaldada por un algoritmo central escrito en Python 3.12+ y una API REST local provista por `json-server`. Permite a los estudiantes de la UNAB consultar la disponibilidad de los 24 equipos de la sala CSU 22, registrarse, autenticarse y gestionar sus reservas dentro de las restricciones del semestre académico vigente.

La arquitectura adopta una estrategia de persistencia dual: en condiciones normales opera contra la API REST local (`localhost:3000`); si el servidor no está disponible, conmuta automáticamente a modo remoto, donde lee un archivo `db.json` estático y persiste las escrituras en `localStorage`. Esto permite desplegar el sistema como sitio estático en GitHub Pages sin pérdida de funcionalidad básica.

El núcleo académico del proyecto es el **algoritmo de detección de conflictos por solapamiento de intervalos**, implementado en Python, que valida la integridad de las reservas existentes cruzando franjas horarias sobre el mismo equipo y fecha.

### 1.4 Referencias

| Tipo | Referencia |
| :---- | :---- |
| Metodológica | Hernández Sampieri, R. — Fundamentos del proceso de investigación científica. |
| Epistemológica | Ñaupas Paitán, H. — Metodología de la investigación cuantitativa y cualitativa. |
| Técnica (VDI) | Documentación oficial de Citrix y VMware — Arquitectura de escritorios virtuales para laboratorios. |
| Gestión de servicios | ISO/IEC 20000 / ITIL 4 — Estándares para optimización de recursos y atención al usuario. |
| Antecedente 1 | Cabrera Pinilla, C. A.; Carreño Pérez, D. F.; Al-Aaron Romo Sierra, J. D. — *Sistema de préstamos y reservas de equipos tecnológicos (SIPRE-UEB)*. |
| Antecedente 2 | Ruiz Castelblanco, C. S. — *Desarrollo de un sistema para controlar el préstamo de los equipos de laboratorio de telecomunicaciones de la Universitaria Agustiniana*. |
| Antecedente 3 | Yepes Lopes, L. A. — *Sistema de información para préstamo de equipos tecnológicos de uso investigativo y académico*. |
| Técnica | Documentación oficial de `json-server` — [https://github.com/typicode/json-server](https://github.com/typicode/json-server) |
| Técnica | MDN Web Docs — Fetch API, localStorage API, Date API. |

---

## 2\. Descripción general

### 2.1 Perspectiva del producto

El sistema es un producto nuevo que no reemplaza un sistema automatizado previo, sino que formaliza y automatiza un proceso actualmente manual e informal. Opera de forma independiente, sin integrarse con los sistemas institucionales de la UNAB (Banner, correo institucional, LMS) en esta versión del prototipo.

#### 2.1.1 Interfaces del sistema

El sistema se compone de tres capas que se comunican entre sí:

\[Navegador Web\]

      │  HTTP fetch()

      ▼

\[json-server : localhost:3000\]   ←→   \[data/db.json\]

      │

      │  (fallback si json-server no responde)

      ▼

\[data/db.json estático\]  \+  \[localStorage del navegador\]

El orquestador Python (`run.py`) gestiona el ciclo de vida del servidor antes de que el usuario abra el navegador.

#### 2.1.2 Interfaces de usuario

El sistema expone cuatro vistas HTML accesibles desde el navegador:

| Vista | Archivo | Descripción |
| :---- | :---- | :---- |
| Inicio / Dashboard | `index.html` | Grilla de disponibilidad de los 24 equipos para la fecha seleccionada. |
| Registro | `register.html` | Formulario de alta de nuevo estudiante. |
| Inicio de sesión | `login.html` | Formulario de autenticación por email y contraseña. |
| Gestión de reservas | `reservas.html` | Creación y cancelación de reservas del usuario autenticado. |

#### 2.1.3 Interfaces de hardware

El sistema no requiere hardware especializado. Opera en cualquier computador de escritorio o portátil con un navegador web moderno. El servidor de desarrollo (`json-server`) se ejecuta en el mismo equipo que sirve el frontend.

#### 2.1.4 Interfaces de software

| Componente | Versión mínima | Rol |
| :---- | :---- | :---- |
| Python | 3.12 | Generación de `db.json`, validación de integridad, orquestación. |
| Node.js | 18 LTS | Entorno de ejecución de `json-server`. |
| `json-server` | 0.17.x | API REST local sobre `db.json`. |
| Navegador web | Chrome 120 / Firefox 121 / Edge 120 | Cliente de la interfaz web. |
| Sistema operativo | Windows 10+, macOS 13+, Ubuntu 22.04+ | Entorno de ejecución del servidor. |

#### 2.1.5 Interfaces de comunicación

En modo local, el frontend se comunica con `json-server` a través de HTTP/1.1 sobre `localhost:3000`. No se requiere conexión a internet para el modo local. En modo remoto (GitHub Pages), el frontend hace una solicitud HTTP GET al archivo `db.json` estático alojado en el repositorio; las escrituras no salen de la red y se almacenan en `localStorage`.

#### 2.1.6 Restricciones de memoria

`json-server` opera enteramente en RAM sobre el contenido de `db.json`. Dado que la sala tiene 24 equipos, un máximo de 2 reservas activas por usuario y un semestre de aproximadamente 17 semanas hábiles, el volumen máximo estimado de reservas es del orden de los cientos de registros. El archivo `db.json` no superará 1 MB en condiciones normales de uso del prototipo. `localStorage` tiene un límite típico de 5 MB por origen; el volumen proyectado de datos en modo remoto es significativamente inferior a ese límite.

### 2.2 Restricciones de diseño

#### 2.2.1 Operaciones

- El punto de entrada único del proyecto es `python/run.py`. Ningún componente del sistema debe iniciarse de forma independiente sin pasar por este orquestador.  
- `run.py` importa `detectar_conflictos` directamente desde `validar_reservas.py` como módulo Python. Está prohibido el uso de `subprocess` para esta integración.  
- `json-server` es iniciado por `run.py` mediante `subprocess` exclusivamente para levantar el proceso del servidor Node.js.  
- Toda operación de lectura y escritura de datos del frontend pasa obligatoriamente por `web/js/api.js`. Ningún otro módulo JS accede directamente a `fetch` o a `localStorage`.  
- El módulo `web/js/reservas.js` no contiene referencias al DOM. Expone únicamente funciones de lógica de negocio que el frontend consumirá en una fase posterior.  
- Las contraseñas se almacenan en texto plano en el prototipo. No se implementa hashing ni cifrado en esta versión.

#### 2.2.2 Requisitos de adaptación del sitio

- El sistema está diseñado para la sala CSU 22 de la UNAB con exactamente 24 equipos. Modificar la capacidad requiere actualizar `python/setup.py` y regenerar `db.json`.  
- El semestre académico está fijado entre `2026-02-02` y `2026-05-29`. Las constantes `FECHA_INICIO_SEMESTRE` y `FECHA_CIERRE_SEMESTRE` en `reservas.js` deben actualizarse para semestres futuros.  
- Los bloques de clase (`BLOQUES_BLOQUEADOS`) y los días festivos (`FECHAS_BLOQUEADAS`) están definidos como constantes en `reservas.js` y deben revisarse cada semestre.  
- La ruta relativa `../../data/db.json` desde `web/js/api.js` asume que el repositorio se despliega desde su raíz en GitHub Pages. Modificar la estructura de directorios requiere actualizar `REMOTE_DB_URL`.

### 2.3 Funciones del producto

Las funciones principales del sistema son:

**F-01 Registro de usuario:** Un visitante puede crear una cuenta proporcionando nombre, correo electrónico institucional y contraseña. El sistema verifica que el correo no esté ya registrado antes de persistir el nuevo usuario.

**F-02 Autenticación:** Un usuario registrado puede iniciar sesión con su correo y contraseña. El sistema valida las credenciales y mantiene la sesión activa durante la navegación.

**F-03 Consulta de disponibilidad:** Cualquier visitante puede consultar el estado de los 24 equipos para una fecha dada dentro del semestre, visualizando cuáles están libres y cuáles tienen reservas activas en cada franja horaria.

**F-04 Creación de reserva:** Un usuario autenticado puede reservar un equipo para una fecha y franja horaria específicas, sujeto a la aprobación del algoritmo de validación (15 reglas de negocio detalladas en §3.5).

**F-05 Cancelación de reserva:** Un usuario autenticado puede eliminar una reserva propia. La cancelación es definitiva e irreversible (eliminación del registro, no cambio de estado).

**F-06 Consulta de reservas propias:** Un usuario autenticado puede ver el listado de sus reservas activas, ordenadas por fecha y hora de inicio ascendentes.

**F-07 Validación de integridad (Python):** El script `validar_reservas.py` ejecuta el algoritmo de detección de conflictos por solapamiento sobre todas las reservas existentes y reporta inconsistencias antes de que el servidor arranque.

**F-08 Inicialización de la base de datos (Python):** El script `setup.py` genera el archivo `db.json` con la estructura base (24 equipos activos, colecciones vacías de usuarios y reservas) si el archivo no existe.

### 2.4 Características del usuario

El sistema está diseñado para un único tipo de usuario final:

| Atributo | Descripción |
| :---- | :---- |
| **Perfil** | Estudiante de la UNAB que requiere usar un equipo de la sala CSU 22 para actividades académicas. |
| **Conocimiento técnico** | Básico. Familiarizado con navegadores web y formularios en línea, pero sin conocimientos de programación ni de administración de sistemas. |
| **Frecuencia de uso** | Esporádica a semanal, según su carga académica. |
| **Accesibilidad** | El sistema es comprensible sin capacitación previa. Los mensajes de error son descriptivos y orientados al usuario, no al desarrollador. |

Para efectos de validación del prototipo, se contempla un grupo de control de 10 a 15 estudiantes y al menos 1 evaluador que opere como administrador informal del sistema.

No existe un rol de administrador diferenciado en el modelo de datos de esta versión; todos los usuarios registrados son estudiantes.

### 2.5 Restricciones, suposiciones y dependencias

**Restricciones:**

- El sistema es un prototipo académico; no está diseñado para soportar carga concurrente real ni para desplegarse en producción.  
- La sala CSU 22 tiene exactamente 24 equipos. Esta capacidad es fija para el alcance del proyecto.  
- No se implementa recuperación de contraseña, edición de perfil ni roles de usuario en esta versión.  
- El período de reserva está limitado al semestre académico 2026-A (`2026-02-02` a `2026-05-29`).

**Suposiciones:**

- Se asume que `json-server` y Python 3.12+ están instalados en el equipo de desarrollo.  
- Se asume que el navegador del cliente tiene JavaScript habilitado y soporta la Fetch API y `localStorage`.  
- Se asume que los bloques de clase definidos en `BLOQUES_BLOQUEADOS` son estables durante todo el semestre y no cambian semana a semana.  
- Se asume que el archivo `db.json` no será modificado manualmente por usuarios finales.  
- Se asume que la hora del sistema del cliente es correcta, ya que las validaciones de fecha se basan en `new Date()`.

**Dependencias:**

- `json-server` depende de Node.js ≥ 18\. Sin Node.js instalado, el modo local no está disponible.  
- El modo remoto depende de que el archivo `db.json` sea accesible públicamente (e.g., mediante GitHub Pages). En un entorno puramente local sin servidor, este archivo debe estar en la ruta relativa correcta respecto al HTML.  
- La detección de conflictos en Python depende de que las reservas en `db.json` estén correctamente formateadas (`fecha` en `YYYY-MM-DD`, `hora_inicio` y `hora_fin` en `HH:MM`).

---

## 3\. Requisitos específicos

### 3.1 Requisitos de interfaz externa

**RE-01 — Interfaz de registro (`register.html`):**  
Formulario con campos: `nombre` (texto), `email` (correo electrónico), `password` (contraseña). Muestra un mensaje de error si el correo ya está registrado y un mensaje de éxito con redirección a `login.html` tras el registro exitoso.

**RE-02 — Interfaz de inicio de sesión (`login.html`):**  
Formulario con campos: `email` y `password`. Muestra un mensaje de error genérico ante credenciales inválidas. Tras autenticación exitosa, redirige a `reservas.html`.

**RE-03 — Interfaz de disponibilidad (`index.html`):**  
Grilla visual de los 24 equipos con selector de fecha. Cada celda de la grilla muestra el estado del equipo en la fecha seleccionada: libre (disponible para reserva) u ocupado (con al menos una reserva activa).

**RE-04 — Interfaz de gestión de reservas (`reservas.html`):**  
Panel con listado de reservas activas del usuario con opción de cancelación por reserva.

**RE-05 — API REST local (`json-server`):**  
Expone los siguientes endpoints consumidos por `api.js`:

| Método | Ruta | Descripción |
| :---- | :---- | :---- |
| `GET` | `/equipos` | Lista todos los equipos. |
| `GET` | `/equipos/:id` | Obtiene un equipo por ID. |
| `GET` | `/usuarios` | Lista todos los usuarios. |
| `POST` | `/usuarios` | Crea un nuevo usuario. |
| `GET` | `/reservas` | Lista todas las reservas. |
| `POST` | `/reservas` | Crea una nueva reserva. |
| `DELETE` | `/reservas/:id` | Elimina una reserva por ID. |

**RE-06 — Módulo `api.js` (interfaz interna JS):**  
Expone las siguientes funciones públicas:

async function inicializarAPI()		→ { ok: boolean, modo: 'local'|'remoto'|null }

async function obtener(recurso)	→ Array\<object\>

async function crear(recurso, datos)	→ object (registro creado con id asignado)

async function eliminar(recurso, id)	→ void

### 3.2 Requisitos de rendimiento

**RP-01:** El tiempo de respuesta de `inicializarAPI()` no debe superar 3 segundos en condiciones de red local normales. Si `json-server` no responde en ese período, el sistema debe activar el modo remoto sin que el usuario deba intervenir.

**RP-02:** La carga inicial de la grilla de disponibilidad en `index.html` debe completarse en menos de 2 segundos en modo local, asumiendo que el volumen de reservas no supera 500 registros.

**RP-03:** El algoritmo de detección de conflictos en Python (`validar_reservas.py`) opera en tiempo O(n²) sobre el número de reservas. Para el volumen proyectado del prototipo (\< 500 reservas), la ejecución completa debe finalizar en menos de 1 segundo.

**RP-04:** Las operaciones de escritura en `localStorage` (modo remoto) son síncronas y deben completarse de forma imperceptible para el usuario (\< 50 ms para los volúmenes proyectados).

### 3.3 Requisito de base de datos lógica

La base de datos es un único archivo `data/db.json` con la siguiente estructura. Cada colección es un array de objetos con ID entero autoincremental gestionado por `json-server` en modo local.

{  
  "equipos": \[  
    { "id": 1,  "activo": true },  
    { "id": 2,  "activo": true },  
    "...",  
    { "id": 24, "activo": true }  
  \],  
  "usuarios": \[  
    {  
      "id": 1,  
      "nombre": "string",  
      "email": "string (único)",  
      "password": "string (texto plano)"  
    }  
  \],  
  "reservas": \[  
    {  
      "id": 1,  
      "usuario\_id": "integer",  
      "equipo\_id": "integer",  
      "fecha": "YYYY-MM-DD",  
      "hora\_inicio": "HH:MM",  
      "hora\_fin": "HH:MM"  
    }  
  \]  
}

**Reglas de integridad:**

- `equipo_id` debe referenciar un equipo existente con `activo: true`.  
- `usuario_id` debe referenciar un usuario existente.  
- No pueden existir dos reservas con el mismo `equipo_id` y `fecha` cuyas franjas horarias se solapen.  
- Un mismo `usuario_id` no puede tener más de 2 registros en la colección `reservas` simultáneamente.  
- `hora_fin` debe ser posterior a `hora_inicio` con una diferencia mínima de 30 minutos y máxima de 4 horas.

**Generación de IDs en modo remoto (`localStorage`):**

Cuando `json-server` no está disponible, el ID de cada nuevo registro se genera con: `const newId = Math.max(...allItems.map(item => item.id || 0), 0) + 1;`  
Este cálculo se aplica sobre la colección fusionada (datos de `db.json` \+ datos de `localStorage`) justo antes de insertar. Al hacer merge en `obtener`, los registros de `localStorage` se concatenan después de los de `db.json`.

### 3.4 Atributos del sistema de software

#### 3.4.1 Fiabilidad

El sistema garantiza que no se creen reservas en conflicto. Toda solicitud de creación pasa por 15 validaciones secuenciales antes de persistir el registro. El algoritmo Python ejecuta una verificación de integridad sobre la base de datos completa cada vez que se inicia el sistema, reportando inconsistencias antes de abrir el servidor al tráfico.

En caso de fallo total de red (ni `localhost` ni `db.json` remoto accesibles), `inicializarAPI()` retorna `{ ok: false, modo: null }` y las funciones CRUD operan sobre colecciones vacías sin lanzar excepciones no manejadas.

#### 3.4.2 Disponibilidad

El sistema opera en dos modos que garantizan disponibilidad continua:

- **Modo local:** Disponible siempre que `json-server` esté activo en `localhost:3000`.  
- **Modo remoto:** Disponible siempre que el archivo `db.json` sea accesible (e.g., GitHub Pages). Las escrituras se persisten en `localStorage` del navegador.

La conmutación entre modos es automática y transparente para el usuario. El sistema no requiere intervención manual para cambiar de modo.

#### 3.4.3 Seguridad

Dado que se trata de un prototipo académico, la seguridad implementada es básica:

- Las contraseñas se almacenan en texto plano. **No se recomienda usar contraseñas reales en el prototipo.**  
- No se implementa control de sesión con tokens ni cookies seguras. La sesión se mantiene mediante variables en memoria o `sessionStorage`.  
- La verificación de autoría en la cancelación de reservas (`cancelarReserva` valida que `usuario_id` coincida) previene la cancelación de reservas ajenas desde la interfaz.  
- No se implementan medidas contra inyección, CSRF ni XSS en esta versión.

#### 3.4.4 Mantenibilidad

- La separación en módulos (`api.js` para transporte, `reservas.js` para lógica de negocio, archivos HTML/CSS para presentación) permite modificar cada capa de forma independiente.  
- Todas las constantes de negocio (`FECHA_INICIO_SEMESTRE`, `FECHA_CIERRE_SEMESTRE`, `BLOQUES_BLOQUEADOS`, `FECHAS_BLOQUEADAS`, `HORA_APERTURA`, `HORA_CIERRE`, etc.) están declaradas en la cabecera de `reservas.js` y son el único punto de modificación para adaptar el sistema a un nuevo semestre.

#### 3.4.5 Portabilidad

- El frontend no tiene dependencias externas de JavaScript (vanilla ES6). No requiere empaquetador ni proceso de build.  
- El modo remoto permite desplegar el sistema como sitio estático en GitHub Pages sin modificaciones de código.  
- Los scripts Python utilizan únicamente módulos de la biblioteca estándar (`json`, `os`, `datetime`, `subprocess`). No requieren instalar paquetes externos.  
- El sistema es compatible con Windows, macOS y Linux, siempre que Python 3.12+ y Node.js 18+ estén instalados.

### 3.5 Requisitos funcionales

#### 3.5.1 Particionamiento funcional

El sistema se divide principalmente en los siguientes módulos funcionales:

mi-compu-unab  
│  
├── Módulo Python  
│   ├── setup.py          — Inicialización de db.json  
│   ├── validar\_reservas.py — Algoritmo de detección de conflictos  
│   └── run.py            — Orquestador del sistema  
│  
└── Módulo Web  
    ├── api.js            — Capa de transporte y persistencia dual  
    └── reservas.js       — Lógica de negocio  
        ├── autenticarUsuario()  
        ├── verificarDisponibilidad()  
        ├── crearReserva()           \[15 validaciones\]  
        ├── cancelarReserva()  
        └── obtenerReservasDeUsuario()

#### 3.5.2 Descripción funcional

---

**RF-01 — Inicialización de la base de datos**  
*Módulo:* `python/setup.py`  
*Descripción:* Genera `data/db.json` con 24 equipos activos (IDs enteros del 1 al 24\) y colecciones vacías de usuarios y reservas. No sobreescribe el archivo si ya existe.  
*Precondición:* El directorio `data/` existe o puede crearse.  
*Postcondición:* `data/db.json` contiene la estructura base válida para `json-server`.

---

**RF-02 — Detección de conflictos**  
*Módulo:* `python/validar_reservas.py`  
*Descripción:* Implementa el algoritmo O(n²) de detección de solapamiento de intervalos sobre el array de reservas. Para cada par de reservas (i, j) con el mismo `equipo_id`, determina si sus franjas horarias se solapan usando la condición: `NOT (fin1 ≤ inicio2 OR fin2 ≤ inicio1)`. Retorna la lista de conflictos encontrados con detalle legible.  
*Precondición:* `data/db.json` existe y contiene una colección `reservas` válida.  
*Postcondición:* Se imprime en consola un resumen de conflictos (o confirmación de integridad si no hay ninguno).

---

**RF-03 — Orquestación del sistema**  
*Módulo:* `python/run.py`  
*Descripción:*

1. Verifica que `data/db.json` exista; si no, importa y ejecuta `setup.py`.  
2. Carga y valida la estructura mínima del JSON (presencia de claves `equipos`, `usuarios`, `reservas`).  
3. Importa `detectar_conflictos` desde `validar_reservas` y muestra el resumen de conflictos.  
4. Lanza `json-server` apuntando a `data/db.json` en el puerto 3000\.  
   *Precondición:* Python 3.12+ y Node.js 18+ están instalados.  
   *Postcondición:* `json-server` está activo en `localhost:3000` y listo para recibir solicitudes.

---

**RF-04 — Inicialización de la API web**  
*Módulo:* `web/js/api.js` → `inicializarAPI()`  
*Descripción:* Intenta conectarse a `localhost:3000`. Si la conexión es exitosa y la respuesta es `ok`, fija `modoActivo = 'local'`. Si falla (error de red o respuesta HTTP de error), intenta obtener `db.json` desde `REMOTE_DB_URL`; si tiene éxito, fija `modoActivo = 'remoto'`. Si ambos fallan, retorna `{ ok: false, modo: null }` y las funciones CRUD operan sobre colecciones vacías.  
*Postcondición:* `modoActivo` está fijado para el resto de la sesión.

---

**RF-05 — Obtención de recursos**  
*Módulo:* `web/js/api.js` → `obtener(recurso)`  
*Modo local:* `GET {API_BASE_URL}/{recurso}` → retorna el array de la respuesta JSON.  
*Modo remoto:* Lee `db.json` estático y fusiona con los registros almacenados en `localStorage[recurso]`. Los registros de `localStorage` se concatenan después de los de `db.json`.

---

**RF-06 — Creación de recursos**  
*Módulo:* `web/js/api.js` → `crear(recurso, datos)`  
*Modo local:* `POST {API_BASE_URL}/{recurso}` con `datos` en el cuerpo JSON. Retorna el objeto creado con su `id` asignado por `json-server`.  
*Modo remoto:* Genera un ID con `Math.max(...allItems.map(item => item.id || 0), 0) + 1`, añade el registro a `localStorage[recurso]` y retorna el objeto creado.

---

**RF-07 — Eliminación de recursos**  
*Módulo:* `web/js/api.js` → `eliminar(recurso, id)`  
*Modo local:* `DELETE {API_BASE_URL}/{recurso}/{id}`.  
*Modo remoto:* Elimina el registro con el `id` indicado de `localStorage['reservas']`.  
*Nota:* Solo se implementa eliminación para la colección `reservas`.

---

**RF-08 — Autenticación de usuario**  
*Módulo:* `web/js/reservas.js` → `autenticarUsuario(email, password)`  
*Descripción:* Obtiene la colección `usuarios` y busca un registro cuyo `email` coincida. Si lo encuentra, compara `password` en texto plano. Retorna el objeto usuario completo si las credenciales son válidas, o `null` si no.

---

**RF-09 — Verificación de disponibilidad**  
*Módulo:* `web/js/reservas.js` → `verificarDisponibilidad(equipo_id, fecha, hora_inicio, hora_fin)`  
*Descripción:* Obtiene todas las reservas, filtra por `equipo_id` y `fecha`, y para cada reserva existente aplica la condición de solapamiento: `NOT (fin1 ≤ inicio2 OR fin2 ≤ inicio1)`. Retorna `true` si el equipo está libre, `false` si hay solapamiento.

---

**RF-10 — Creación de reserva con validación completa**  
*Módulo:* `web/js/reservas.js` → `crearReserva(usuario_id, equipo_id, fecha, hora_inicio, hora_fin)`  
*Descripción:* Ejecuta las siguientes 15 validaciones en orden, retornando `{ ok: false, mensaje }` ante el primer error encontrado:

| \# | Validación | Constante implicada |
| :---- | :---- | :---- |
| 1 | `fecha` ≥ `FECHA_INICIO_SEMESTRE` (`2026-02-02`) | `FECHA_INICIO_SEMESTRE` |
| 2 | `fecha` ≥ hoy (no se permiten reservas en el pasado) | `new Date()` |
| 3 | `fecha` ≤ hoy \+ `MAX_DIAS_ANTICIPACION` (7 días) | `MAX_DIAS_ANTICIPACION` |
| 4 | `fecha` ≤ `FECHA_CIERRE_SEMESTRE` (`2026-05-29`) | `FECHA_CIERRE_SEMESTRE` |
| 5 | `fecha` no es sábado ni domingo | `DIAS_BLOQUEADOS = [0, 6]` |
| 6 | `fecha` no está en `FECHAS_BLOQUEADAS` | `FECHAS_BLOQUEADAS` |
| 7 | `hora_inicio` ≥ `HORA_APERTURA` (`08:00`) | `HORA_APERTURA` |
| 8 | `hora_fin` ≤ `HORA_CIERRE` (`20:00`) | `HORA_CIERRE` |
| 9 | Duración ≥ `MIN_DURACION_MINUTOS` (30 min) | `MIN_DURACION_MINUTOS` |
| 10 | Duración ≤ `MAX_DURACION_HORAS` (4 horas) | `MAX_DURACION_HORAS` |
| 11 | Franja no solapa bloque de almuerzo `13:00–14:00` | Hardcoded |
| 12 | Franja no solapa ningún bloque en `BLOQUES_BLOQUEADOS[diaSemana]` | `BLOQUES_BLOQUEADOS` |
| 13 | Equipo existe y tiene `activo: true` | `obtener('equipos')` |
| 14 | Usuario tiene \< `MAX_RESERVAS_ACTIVAS` (2) reservas activas | `MAX_RESERVAS_ACTIVAS` |
| 15 | Sin solapamiento con reservas existentes | `verificarDisponibilidad()` |

Las validaciones 1–12 son locales (sin llamadas a la API). Las validaciones 13–15 requieren al menos un `await obtener(...)` y van al final para minimizar requests innecesarios.

Para la validación 5, la conversión a día de la semana usa `new Date(fecha + 'T00:00:00').getDay()` para evitar desfases de zona horaria. Para la validación 12, el mensaje de error incluye el campo `motivo` del bloque en conflicto.

Si todas las validaciones pasan, llama a `crear('reservas', { usuario_id, equipo_id, fecha, hora_inicio, hora_fin })` y retorna `{ ok: true, mensaje, reserva }`.

---

**RF-11 — Cancelación de reserva**  
*Módulo:* `web/js/reservas.js` → `cancelarReserva(reserva_id, usuario_id)`  
*Descripción:* Obtiene la reserva con el `reserva_id` indicado. Si `usuario_id` coincide con el del registro, llama a `eliminar('reservas', reserva_id)` y retorna `{ ok: true, mensaje }`. Si no coincide, retorna `{ ok: false, mensaje: 'No autorizado' }`.

---

**RF-12 — Consulta de reservas de un usuario**  
*Módulo:* `web/js/reservas.js` → `obtenerReservasDeUsuario(usuario_id)`  
*Descripción:* Filtra `obtener('reservas')` por `usuario_id`. Ordena el resultado por `fecha` ascendente y luego por `hora_inicio` ascendente. Retorna el array resultante enriquecido con el número de equipo.

#### 3.5.3 Descripción del control

El flujo de control principal del sistema es el siguiente:

**Arranque:**

python run.py

  → ¿db.json existe? → No → setup.py genera db.json

  → Validar estructura de db.json

  → detectar\_conflictos(reservas) → mostrar resumen

  → Lanzar json-server en localhost:3000

  → Usuario abre navegador en index.html

  → inicializarAPI() → fijar modoActivo

**Flujo de reserva:**

Usuario en reservas.html

  → Selecciona equipo, fecha, hora\_inicio, hora\_fin

  → crearReserva()

      → Validaciones 1–12 (locales, síncronas)

      → Validaciones 13–15 (requieren API)

      → Si todo OK → crear('reservas', datos)

          → Modo local: POST /reservas

          → Modo remoto: localStorage

      → Mostrar mensaje de éxito o error descriptivo

**Flujo de cancelación:**

Usuario en reservas.html → ver mis reservas

  → obtenerReservasDeUsuario(usuario\_id)

  → Usuario selecciona reserva a cancelar

  → cancelarReserva(reserva\_id, usuario\_id)

      → Verificar autoría

      → eliminar('reservas', reserva\_id)

          → Modo local: DELETE /reservas/{id}

          → Modo remoto: eliminar de localStorage

      → Refrescar listado

### 3.6 Características del entorno

#### 3.6.1 Hardware

El sistema se ejecuta en el hardware estándar disponible en la sala CSU 22 y en los equipos personales de los desarrolladores. No impone requisitos de hardware específicos más allá de los necesarios para ejecutar un navegador web moderno con Node.js y Python 3.12+.

| Componente | Mínimo recomendado |
| :---- | :---- |
| Procesador | Dual-core 1.6 GHz |
| RAM | 4 GB |
| Almacenamiento libre | 200 MB (Node.js \+ dependencias \+ archivos del proyecto) |
| Resolución de pantalla | 1280 × 720 px |
| Conectividad | Red local (para modo local); ninguna (para modo remoto offline) |

#### 3.6.2 Periféricos

El sistema requiere únicamente los periféricos estándar de un computador de escritorio:

- Teclado y ratón para la interacción con la interfaz web.  
- Monitor con soporte para resolución mínima de 1280 × 720 px.

No se requieren periféricos especializados (impresoras, escáneres, lectores biométricos, etc.).

#### 3.6.3 Usuarios

Como se describe en §2.4, el único perfil de usuario final es el **estudiante de la UNAB**. No existe perfil de administrador en el modelo de datos del prototipo.

Para la fase de validación, el grupo de prueba estará conformado por 10 a 15 estudiantes voluntarios y al menos 1 evaluador académico que ejercerá el rol de observador del sistema. Las pruebas incluirán escenarios de creación exitosa de reservas, intentos de creación con reglas de negocio violadas, cancelación de reservas propias e intento de cancelación de reservas ajenas.