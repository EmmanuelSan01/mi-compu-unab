# 🖥️ Mi Compu UNAB

Plataforma web para la gestión de reservas de equipos en la sala de cómputo **CSU 22** de la Universidad Autónoma de Bucaramanga (UNAB).

> Proyecto académico desarrollado en el curso **Lógica y Algoritmos** — Tecnología en Desarrollo de Software, UNAB.  
> Semestre 2026-A · Bucaramanga, Santander.

#### **Autores:** Carlos González Aguilera · Emmanuel Sánchez Estepa · Joseph Sneider Villamizar Patiño  
#### **Docente:** Antonio José Rodríguez Linares
---

## 📋 Descripción

Mi Compu UNAB reemplaza el proceso manual e informal de asignación de equipos en la sala CSU 22 (24 computadores de escritorio) por una plataforma web automatizada. Los estudiantes pueden consultar disponibilidad en tiempo real, crear reservas y cancelarlas desde el navegador, sin necesidad de presentarse físicamente para reclamar un puesto.

El núcleo del proyecto es un **algoritmo de detección de conflictos por solapamiento de intervalos**, implementado en Python, que garantiza la integridad de todas las reservas antes de que el servidor arranque y durante cada solicitud de creación.

---

## ✨ Funcionalidades

| ID | Función |
|---|---|
| F-01 | **Registro de usuario** — alta con nombre, correo institucional y contraseña |
| F-02 | **Autenticación** — inicio de sesión con correo y contraseña |
| F-03 | **Consulta de disponibilidad** — grilla de los 24 equipos para cualquier fecha del semestre |
| F-04 | **Creación de reserva** — reserva de equipo con validación de 15 reglas de negocio |
| F-05 | **Cancelación de reserva** — eliminación definitiva de una reserva propia |
| F-06 | **Mis reservas** — listado de reservas activas ordenadas por fecha y hora |
| F-07 | **Validación de integridad (Python)** — detección de conflictos al arrancar el sistema |
| F-08 | **Inicialización de BD (Python)** — generación automática de `db.json` si no existe |

---

## 🏗️ Arquitectura

El sistema opera en **dos modos** de forma transparente para el usuario:

```
[Navegador Web]
      │  HTTP fetch()
      ▼
[json-server : localhost:3000]  ←→  [data/db.json]
      │
      │  (fallback automático si json-server no responde)
      ▼
[data/db.json estático]  +  [localStorage del navegador]
```

**Modo local:** el frontend consume la API REST servida por `json-server` en `localhost:3000`. Todas las operaciones CRUD se persisten en `db.json`.

**Modo remoto:** si `json-server` no está disponible (p. ej. despliegue en GitHub Pages), el frontend lee `db.json` estático y persiste las escrituras en `localStorage`. La conmutación es automática; no requiere intervención del usuario.

### Estructura de módulos

```
mi-compu-unab/
│
├── python/
│   ├── run.py               # Orquestador — punto de entrada único del sistema
│   ├── setup.py             # Inicialización de data/db.json
│   └── validar_reservas.py  # Algoritmo de detección de conflictos O(n²)
│
├── web/
│   ├── index.html           # Dashboard — grilla de disponibilidad
│   ├── register.html        # Registro de nuevo usuario
│   ├── login.html           # Inicio de sesión
│   ├── reservas.html        # Gestión de reservas
│   └── js/
│       ├── api.js           # Capa de transporte y persistencia dual
│       └── reservas.js      # Lógica de negocio (sin referencias al DOM)
│
└── data/
    └── db.json              # Base de datos (generada automáticamente)
```

---

## ⚙️ Requisitos previos

| Componente | Versión mínima |
|---|---|
| Python | 3.12 |
| Node.js | 18 LTS |
| `json-server` | 0.17.x |
| Navegador | Chrome 120 / Firefox 121 / Edge 120 |
| SO | Windows 10+, macOS 13+, Ubuntu 22.04+ |

### Hardware mínimo recomendado

- Procesador: dual-core 1.6 GHz
- RAM: 4 GB
- Almacenamiento libre: 200 MB
- Resolución: 1280 × 720 px

---

## 🚀 Instalación y ejecución

**1. Clonar el repositorio**

```bash
git clone https://github.com/<usuario>/mi-compu-unab.git
cd mi-compu-unab
```

**2. Instalar `json-server`** (requiere Node.js 18+)

```bash
npm install -g json-server@0.17
```

**3. Iniciar el sistema**

```bash
python python/run.py
```

`run.py` realiza automáticamente los siguientes pasos:

1. Si `data/db.json` no existe, ejecuta `setup.py` para generarlo con 24 equipos activos.
2. Valida la estructura del JSON (claves `equipos`, `usuarios`, `reservas`).
3. Ejecuta `validar_reservas.py` y muestra el resumen de integridad en consola.
4. Lanza `json-server` en `localhost:3000`.

**4. Abrir la aplicación**

Abre `web/index.html` en el navegador. La aplicación detectará automáticamente si `json-server` está disponible y elegirá el modo de operación correspondiente.

---

## 📐 Modelo de datos

`data/db.json` contiene tres colecciones:

```json
{  
  "equipos": [  
    { "id": 1,  "activo": true },  
    { "id": 2,  "activo": true },  
    "...",  
    { "id": 24, "activo": true }  
  ],  
  "usuarios": [  
    {  
      "id": 1,  
      "nombre": "string",  
      "email": "string (único)",  
      "password": "string (texto plano)"  
    }  
  ],  
  "reservas": [  
    {  
      "id": 1,  
      "usuario_id": "integer",  
      "equipo_id": "integer",  
      "fecha": "YYYY-MM-DD",  
      "hora_inicio": "HH:MM",  
      "hora_fin": "HH:MM"  
    }  
  ]  
}
```

### Reglas de integridad

- `equipo_id` debe referenciar un equipo con `activo: true`.
- `usuario_id` debe referenciar un usuario existente.
- No pueden existir dos reservas con el mismo `equipo_id` y `fecha` con franjas horarias solapadas.
- Un usuario no puede tener más de **2 reservas activas** simultáneamente.
- La duración de una reserva debe estar entre **30 minutos** y **4 horas**.

---

## 📏 Reglas de negocio

Cada solicitud de creación de reserva pasa por **15 validaciones** en orden. Las primeras 12 son locales (sin llamadas a la API); las últimas 3 requieren consultar la base de datos.

| # | Validación |
|---|---|
| 1 | `fecha` ≥ inicio del semestre (`2026-02-02`) |
| 2 | `fecha` ≥ hoy (no se permiten reservas en el pasado) |
| 3 | `fecha` ≤ hoy + 7 días (anticipación máxima) |
| 4 | `fecha` ≤ cierre del semestre (`2026-05-29`) |
| 5 | `fecha` no es sábado ni domingo |
| 6 | `fecha` no está en la lista de días festivos (`FECHAS_BLOQUEADAS`) |
| 7 | `hora_inicio` ≥ `08:00` |
| 8 | `hora_fin` ≤ `20:00` |
| 9 | Duración ≥ 30 minutos |
| 10 | Duración ≤ 4 horas |
| 11 | La franja no solapa el bloque de almuerzo `13:00–14:00` |
| 12 | La franja no solapa ningún bloque de clase programado (`BLOQUES_BLOQUEADOS`) |
| 13 | El equipo existe y tiene `activo: true` |
| 14 | El usuario tiene menos de 2 reservas activas |
| 15 | No hay solapamiento con reservas existentes en ese equipo y fecha |

La detección de solapamiento usa la condición formal: hay conflicto si `NOT (fin1 ≤ inicio2 OR fin2 ≤ inicio1)`.

---

## 🌐 API REST (modo local)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/equipos` | Lista todos los equipos |
| `GET` | `/equipos/:id` | Obtiene un equipo por ID |
| `GET` | `/usuarios` | Lista todos los usuarios |
| `POST` | `/usuarios` | Crea un nuevo usuario |
| `GET` | `/reservas` | Lista todas las reservas |
| `POST` | `/reservas` | Crea una nueva reserva |
| `DELETE` | `/reservas/:id` | Elimina una reserva por ID |

---

## 🔒 Consideraciones de seguridad

Este proyecto es un **prototipo académico**. Las siguientes limitaciones son conocidas e intencionales:

- Las contraseñas se almacenan en **texto plano**. No usar contraseñas reales.
- No se implementa hashing, tokens de sesión, CSRF ni protección contra XSS.
- La sesión se mantiene en memoria o `sessionStorage`.
- La cancelación de reservas valida autoría por `usuario_id`, pero no mediante tokens seguros.

> ⚠️ **No desplegar en producción** con datos reales sin implementar medidas de seguridad adicionales.

---

## 🔧 Adaptación a nuevos semestres

Todos los parámetros configurables están centralizados en la cabecera de `web/js/reservas.js`:

```js
const FECHA_INICIO_SEMESTRE = '2026-02-02';
const FECHA_CIERRE_SEMESTRE = '2026-05-29';
const HORA_APERTURA         = '08:00';
const HORA_CIERRE           = '20:00';
const MAX_DIAS_ANTICIPACION = 7;
const MAX_RESERVAS_ACTIVAS  = 2;
const MIN_DURACION_MINUTOS  = 30;
const MAX_DURACION_HORAS    = 4;
const DIAS_BLOQUEADOS       = [0, 6]; // domingo, sábado
const FECHAS_BLOQUEADAS     = [...];  // días festivos
const BLOQUES_BLOQUEADOS    = {...};  // bloques de clase por día
```

Para cambiar la capacidad de la sala, actualizar `python/setup.py` y regenerar `db.json`.

---

## 📚 Referencias

- Cabrera Pinilla et al. — *Sistema de préstamos y reservas de equipos tecnológicos (SIPRE-UEB)*.
- Ruiz Castelblanco, C. S. — *Sistema para controlar el préstamo de equipos de laboratorio — Universitaria Agustiniana*.
- Yepes Lopes, L. A. — *Sistema de información para préstamo de equipos tecnológicos de uso investigativo y académico*.
- [`json-server` — documentación oficial](https://github.com/typicode/json-server)
- MDN Web Docs — Fetch API, localStorage API, Date API.
- ISO/IEC 20000 / ITIL 4 — Estándares para optimización de recursos.

---

## 📄 Licencia

Proyecto académico desarrollado para la Universidad Autónoma de Bucaramanga (UNAB). Todos los derechos reservados por sus autores.
