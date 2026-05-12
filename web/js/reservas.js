import { obtener, crear, eliminar } from './api.js';

// Constantes de reglas de negocio
const FECHA_CIERRE_SEMESTRE = '2026-05-29';
const MAX_DIAS_ANTICIPACION = 7;
const MIN_DURACION_MINUTOS = 30;
const MAX_DURACION_HORAS = 4;
const MAX_RESERVAS_ACTIVAS = 2;

function aDateTime(fecha, hora) {
  return new Date(`${fecha}T${hora}:00`);
}

function obtenerFechaHoy() {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
}

function diferenciaDias(fecha1, fecha2) {
  const d1 = new Date(fecha1);
  const d2 = new Date(fecha2);
  const diffTime = d1.getTime() - d2.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calcularDuracionMinutos(horaInicio, horaFin) {
  const [h1, m1] = horaInicio.split(':').map(Number);
  const [h2, m2] = horaFin.split(':').map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
}

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
    
    // Condición de solapamiento
    const haySolapamiento = !(fin1 <= inicio2 || fin2 <= inicio1);
    
    if (haySolapamiento) {
      return false; // No disponible
    }
  }
  
  return true; // Disponible
}

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

async function obtenerEquiposDisponibles() {
  const equipos = await obtener('equipos');
  return equipos.filter(e => e.activo);
}

async function obtenerReservasDeEquipo(equipo_id, fecha) {
  const reservas = await obtener('reservas');
  
  const reservasEquipo = reservas.filter(r => 
    r.equipo_id === equipo_id && r.fecha === fecha
  );
  
  // Ordenar por hora de inicio
  reservasEquipo.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  
  return reservasEquipo;
}

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

// Exportaciones
export {
  FECHA_CIERRE_SEMESTRE, MAX_DIAS_ANTICIPACION, MIN_DURACION_MINUTOS, MAX_DURACION_HORAS, MAX_RESERVAS_ACTIVAS,
  autenticarUsuario, registrarUsuario,    
  verificarDisponibilidad, obtenerEquiposDisponibles, obtenerReservasDeEquipo,
  crearReserva, cancelarReserva, obtenerReservasDeUsuario,
  aDateTime, obtenerFechaHoy, diferenciaDias, calcularDuracionMinutos
};
