/**
 * reservas.js - Lógica de negocio para el sistema de reservas
 * 
 * Responsabilidad:
 * - Autenticación de usuarios
 * - Verificación de disponibilidad
 * - Creación y cancelación de reservas
 * - Consulta de reservas por usuario
 * 
 * Este módulo NO contiene lógica de renderizado ni manipulación del DOM.
 * Expone funciones puras que el futuro frontend consumirá.
 */

import { obtener, crear, eliminar } from './api.js';

// Constantes de reglas de negocio
const FECHA_CIERRE_SEMESTRE = '2026-05-29';
const MAX_DIAS_ANTICIPACION = 7;
const MIN_DURACION_MINUTOS = 30;
const MAX_DURACION_HORAS = 4;
const MAX_RESERVAS_ACTIVAS = 2;

/**
 * Convierte fecha y hora en un objeto Date.
 * 
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'
 * @param {string} hora - Hora en formato 'HH:MM'
 * @returns {Date} Objeto Date combinando fecha y hora
 */
function aDateTime(fecha, hora) {
  return new Date(`${fecha}T${hora}:00`);
}

/**
 * Obtiene la fecha actual en formato 'YYYY-MM-DD'.
 * 
 * @returns {string} Fecha actual
 */
function obtenerFechaHoy() {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
}

/**
 * Calcula la diferencia en días entre dos fechas.
 * 
 * @param {string} fecha1 - Primera fecha en formato 'YYYY-MM-DD'
 * @param {string} fecha2 - Segunda fecha en formato 'YYYY-MM-DD'
 * @returns {number} Diferencia en días (positivo si fecha1 > fecha2)
 */
function diferenciaDias(fecha1, fecha2) {
  const d1 = new Date(fecha1);
  const d2 = new Date(fecha2);
  const diffTime = d1.getTime() - d2.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calcula la duración en minutos entre dos horas.
 * 
 * @param {string} horaInicio - Hora de inicio en formato 'HH:MM'
 * @param {string} horaFin - Hora de fin en formato 'HH:MM'
 * @returns {number} Duración en minutos
 */
function calcularDuracionMinutos(horaInicio, horaFin) {
  const [h1, m1] = horaInicio.split(':').map(Number);
  const [h2, m2] = horaFin.split(':').map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
}

// ============================================================================
// 6.1 Autenticación de usuario
// ============================================================================

/**
 * Busca un usuario por email y valida su contraseña.
 * 
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<Object|null>} El objeto usuario si las credenciales son válidas, null si no
 */
async function autenticarUsuario(email, password) {
  const usuarios = await obtener('usuarios');
  
  const usuario = usuarios.find(u => u.email === email);
  
  if (!usuario) {
    return null;
  }
  
  // Comparación en texto plano (sin hashing para el prototipo)
  if (usuario.password !== password) {
    return null;
  }
  
  return usuario;
}

// ============================================================================
// 6.2 Consulta de disponibilidad
// ============================================================================

/**
 * Determina si un equipo está disponible en una franja horaria dada.
 * 
 * Replica la condición de solapamiento del algoritmo Python:
 *   hay conflicto si NOT (fin1 <= inicio2 OR fin2 <= inicio1)
 * 
 * @param {number} equipo_id - ID del equipo
 * @param {string} fecha - Fecha de la reserva en formato 'YYYY-MM-DD'
 * @param {string} hora_inicio - Hora de inicio en formato 'HH:MM'
 * @param {string} hora_fin - Hora de fin en formato 'HH:MM'
 * @returns {Promise<boolean>} true si el equipo está libre, false si hay solapamiento
 */
async function verificarDisponibilidad(equipo_id, fecha, hora_inicio, hora_fin) {
  const reservas = await obtener('reservas');
  
  // Filtrar reservas del mismo equipo y fecha
  const reservasEquipo = reservas.filter(r => 
    r.equipo_id === equipo_id && r.fecha === fecha
  );
  
  // Convertir horarios de la nueva reserva
  const inicio1 = aDateTime(fecha, hora_inicio);
  const fin1 = aDateTime(fecha, hora_fin);
  
  // Verificar solapamiento con cada reserva existente
  for (const reserva of reservasEquipo) {
    const inicio2 = aDateTime(reserva.fecha, reserva.hora_inicio);
    const fin2 = aDateTime(reserva.fecha, reserva.hora_fin);
    
    // Condición de solapamiento (De Morgan sobre NO-solapamiento):
    // Hay solapamiento si NOT (fin1 <= inicio2 OR fin2 <= inicio1)
    const haySolapamiento = !(fin1 <= inicio2 || fin2 <= inicio1);
    
    if (haySolapamiento) {
      return false; // No disponible
    }
  }
  
  return true; // Disponible
}

// ============================================================================
// 6.3 Crear reserva
// ============================================================================

/**
 * Crea una nueva reserva tras validar disponibilidad y reglas de negocio.
 * 
 * Validaciones (en orden):
 * 1. La fecha no es anterior a hoy
 * 2. La fecha no supera los 7 días desde hoy
 * 3. La fecha no es posterior al 2026-05-29
 * 4. El equipo existe y está activo
 * 5. La duración es de al menos 30 minutos
 * 6. La duración no supera las 4 horas
 * 7. El usuario no excede el límite de 2 reservas activas
 * 8. El horario no presenta solapamiento
 * 
 * @param {number} usuario_id - ID del usuario
 * @param {number} equipo_id - ID del equipo
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'
 * @param {string} hora_inicio - Hora de inicio en formato 'HH:MM'
 * @param {string} hora_fin - Hora de fin en formato 'HH:MM'
 * @returns {Promise<{ok: boolean, mensaje: string, reserva?: Object}>}
 */
async function crearReserva(usuario_id, equipo_id, fecha, hora_inicio, hora_fin) {
  const hoy = obtenerFechaHoy();
  
  // 1. La fecha no es anterior a hoy
  if (fecha < hoy) {
    return {
      ok: false,
      mensaje: 'No se permiten reservas en fechas pasadas'
    };
  }
  
  // 2. La fecha no supera los 7 días desde hoy
  const diasAnticipacion = diferenciaDias(fecha, hoy);
  if (diasAnticipacion > MAX_DIAS_ANTICIPACION) {
    return {
      ok: false,
      mensaje: `La reserva no puede exceder ${MAX_DIAS_ANTICIPACION} días de anticipación`
    };
  }
  
  // 3. La fecha no es posterior al cierre del semestre
  if (fecha > FECHA_CIERRE_SEMESTRE) {
    return {
      ok: false,
      mensaje: `La fecha no puede ser posterior al ${FECHA_CIERRE_SEMESTRE} (cierre del semestre)`
    };
  }
  
  // 4. El equipo existe y está activo
  const equipos = await obtener('equipos');
  const equipo = equipos.find(e => e.id === equipo_id);
  
  if (!equipo) {
    return {
      ok: false,
      mensaje: `El equipo ${equipo_id} no existe`
    };
  }
  
  if (!equipo.activo) {
    return {
      ok: false,
      mensaje: `El equipo ${equipo_id} no está disponible`
    };
  }
  
  // 5. La duración es de al menos 30 minutos
  const duracionMinutos = calcularDuracionMinutos(hora_inicio, hora_fin);
  
  if (duracionMinutos < MIN_DURACION_MINUTOS) {
    return {
      ok: false,
      mensaje: `La duración mínima de la reserva es de ${MIN_DURACION_MINUTOS} minutos`
    };
  }
  
  // 6. La duración no supera las 4 horas
  const duracionHoras = duracionMinutos / 60;
  
  if (duracionHoras > MAX_DURACION_HORAS) {
    return {
      ok: false,
      mensaje: `La duración máxima de la reserva es de ${MAX_DURACION_HORAS} horas`
    };
  }
  
  // 7. El usuario no excede el límite de 2 reservas activas
  const reservas = await obtener('reservas');
  const reservasUsuario = reservas.filter(r => r.usuario_id === usuario_id);
  
  // Solo contar reservas futuras o de hoy
  const reservasActivas = reservasUsuario.filter(r => r.fecha >= hoy);
  
  if (reservasActivas.length >= MAX_RESERVAS_ACTIVAS) {
    return {
      ok: false,
      mensaje: `Has alcanzado el límite de ${MAX_RESERVAS_ACTIVAS} reservas activas`
    };
  }
  
  // 8. El horario no presenta solapamiento
  const disponible = await verificarDisponibilidad(equipo_id, fecha, hora_inicio, hora_fin);
  
  if (!disponible) {
    return {
      ok: false,
      mensaje: 'El horario seleccionado no está disponible (conflicto con otra reserva)'
    };
  }
  
  // Todas las validaciones pasaron, crear la reserva
  const nuevaReserva = await crear('reservas', {
    usuario_id,
    equipo_id,
    fecha,
    hora_inicio,
    hora_fin
  });
  
  return {
    ok: true,
    mensaje: 'Reserva creada exitosamente',
    reserva: nuevaReserva
  };
}

// ============================================================================
// 6.4 Eliminar reserva (cancelación)
// ============================================================================

/**
 * Elimina una reserva por su ID, verificando que pertenezca al usuario indicado.
 * 
 * @param {number} reserva_id - ID de la reserva a cancelar
 * @param {number} usuario_id - ID del usuario que solicita la cancelación
 * @returns {Promise<{ok: boolean, mensaje: string}>}
 */
async function cancelarReserva(reserva_id, usuario_id) {
  const reservas = await obtener('reservas');
  const reserva = reservas.find(r => r.id === reserva_id);
  
  if (!reserva) {
    return {
      ok: false,
      mensaje: 'Reserva no encontrada'
    };
  }
  
  // Verificar que la reserva pertenece al usuario
  if (reserva.usuario_id !== usuario_id) {
    return {
      ok: false,
      mensaje: 'No autorizado'
    };
  }
  
  // Eliminar la reserva
  const resultado = await eliminar('reservas', reserva_id);
  
  if (resultado.ok) {
    return {
      ok: true,
      mensaje: 'Reserva cancelada exitosamente'
    };
  }
  
  return {
    ok: false,
    mensaje: 'Error al cancelar la reserva'
  };
}

// ============================================================================
// 6.5 Consultar reservas de un usuario
// ============================================================================

/**
 * Retorna todas las reservas activas de un usuario, enriquecidas con el número de equipo.
 * 
 * @param {number} usuario_id - ID del usuario
 * @returns {Promise<Array<Object>>} Lista de reservas ordenadas por fecha y hora
 */
async function obtenerReservasDeUsuario(usuario_id) {
  const reservas = await obtener('reservas');
  
  // Filtrar por usuario
  const reservasUsuario = reservas.filter(r => r.usuario_id === usuario_id);
  
  // Ordenar por fecha ascendente, luego por hora_inicio ascendente
  reservasUsuario.sort((a, b) => {
    // Comparar fechas
    if (a.fecha !== b.fecha) {
      return a.fecha.localeCompare(b.fecha);
    }
    // Si misma fecha, comparar hora de inicio
    return a.hora_inicio.localeCompare(b.hora_inicio);
  });
  
  return reservasUsuario;
}

// ============================================================================
// Funciones auxiliares adicionales
// ============================================================================

/**
 * Obtiene todos los equipos disponibles.
 * 
 * @returns {Promise<Array<Object>>} Lista de equipos activos
 */
async function obtenerEquiposDisponibles() {
  const equipos = await obtener('equipos');
  return equipos.filter(e => e.activo);
}

/**
 * Obtiene las reservas de un equipo en una fecha específica.
 * 
 * @param {number} equipo_id - ID del equipo
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'
 * @returns {Promise<Array<Object>>} Lista de reservas ordenadas por hora
 */
async function obtenerReservasDeEquipo(equipo_id, fecha) {
  const reservas = await obtener('reservas');
  
  const reservasEquipo = reservas.filter(r => 
    r.equipo_id === equipo_id && r.fecha === fecha
  );
  
  // Ordenar por hora de inicio
  reservasEquipo.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  
  return reservasEquipo;
}

/**
 * Registra un nuevo usuario en el sistema.
 * 
 * @param {string} nombre - Nombre del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<{ok: boolean, mensaje: string, usuario?: Object}>}
 */
async function registrarUsuario(nombre, email, password) {
  // Verificar que el email no esté registrado
  const usuarios = await obtener('usuarios');
  const existente = usuarios.find(u => u.email === email);
  
  if (existente) {
    return {
      ok: false,
      mensaje: 'El email ya está registrado'
    };
  }
  
  // Crear el usuario
  const nuevoUsuario = await crear('usuarios', {
    nombre,
    email,
    password
  });
  
  return {
    ok: true,
    mensaje: 'Usuario registrado exitosamente',
    usuario: nuevoUsuario
  };
}

// Exportar funciones para uso como módulo ES6
export {
  // Autenticación
  autenticarUsuario,
  registrarUsuario,
  
  // Disponibilidad
  verificarDisponibilidad,
  obtenerEquiposDisponibles,
  obtenerReservasDeEquipo,
  
  // Reservas
  crearReserva,
  cancelarReserva,
  obtenerReservasDeUsuario,
  
  // Utilidades
  aDateTime,
  obtenerFechaHoy,
  diferenciaDias,
  calcularDuracionMinutos,
  
  // Constantes
  FECHA_CIERRE_SEMESTRE,
  MAX_DIAS_ANTICIPACION,
  MIN_DURACION_MINUTOS,
  MAX_DURACION_HORAS,
  MAX_RESERVAS_ACTIVAS
};
