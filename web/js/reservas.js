import { obtener, crear, eliminar } from './api.js';

// Constantes de reglas de negocio
const FECHA_INICIO_SEMESTRE = '2026-02-02';
const FECHA_CIERRE_SEMESTRE = '2026-05-29';
const MAX_DIAS_ANTICIPACION = 7;
const MIN_DURACION_MINUTOS = 30;
const MAX_DURACION_HORAS = 4;
const MAX_RESERVAS_ACTIVAS = 2;
const DIAS_BLOQUEADOS = [0, 6]; // 0 = domingo, 6 = sábado
const FECHAS_BLOQUEADAS = ['2026-03-23', '2026-04-02', '2026-04-03', '2026-05-01', '2026-05-18'];
const HORA_APERTURA = '08:00';
const HORA_CIERRE = '20:00';
const HORA_INICIO_ALMUERZO = '13:00';
const HORA_FIN_ALMUERZO = '14:00';
const BLOQUES_BLOQUEADOS = {
  1: [
    { motivo: 'Clase Lógica y Algoritmos', horaInicio: '09:00', horaFin: '12:00' },
    { motivo: 'Clase Álgebra Lineal', horaInicio: '14:00', horaFin: '16:00' },
    { motivo: 'Clase Programación de Computadores', horaInicio: '16:00', horaFin: '18:00' }
  ],
  2: [
    { motivo: 'Clase Ciencia de Datos e Inteligencia Artificial', horaInicio: '08:00', horaFin: '10:00' },
    { motivo: 'Clase Procesos Ágiles de Desarrollo de Software', horaInicio: '14:00', horaFin: '17:00' }
  ],
  3: [
    { motivo: 'Clase Programación de Computadores', horaInicio: '08:00', horaFin: '10:00' },
    { motivo: 'Clase Fundamentos de Programación', horaInicio: '10:00', horaFin: '12:00' },
    { motivo: 'Clase Bases de Datos II', horaInicio: '18:00', horaFin: '20:00' }
  ],
  4: [
    { motivo: 'Clase Arquitectura de Software', horaInicio: '08:00', horaFin: '10:00' },
    { motivo: 'Clase Desarrollo y Arquitectura Backend', horaInicio: '10:00', horaFin: '13:00' },
    { motivo: 'Clase Publicidad Digital', horaInicio: '14:00', horaFin: '16:00' },
    { motivo: 'Clase Big Data y Analítica en el TEI', horaInicio: '16:00', horaFin: '19:00' }
  ],
  5: [
    { motivo: 'Clase Inteligencia de Negocios', horaInicio: '10:00', horaFin: '13:00' }
  ]
};

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
  const diaSemana = new Date(fecha + 'T00:00:00').getDay();
  
  // 1. La fecha no es anterior al inicio del semestre
  if (fecha < FECHA_INICIO_SEMESTRE) {
    return {
      ok: false,
      mensaje: `La fecha no puede ser anterior al ${FECHA_INICIO_SEMESTRE} (inicio del semestre)`
    };
  }
  
  // 2. La fecha no es anterior a hoy
  if (fecha < hoy) {
    return {
      ok: false,
      mensaje: 'No se permiten reservas en fechas pasadas'
    };
  }
  
  // 3. La fecha no supera los 7 días desde hoy
  const diasAnticipacion = diferenciaDias(fecha, hoy);
  if (diasAnticipacion > MAX_DIAS_ANTICIPACION) {
    return {
      ok: false,
      mensaje: `La reserva no puede exceder ${MAX_DIAS_ANTICIPACION} días de anticipación`
    };
  }
  
  // 4. La fecha no es posterior al cierre del semestre
  if (fecha > FECHA_CIERRE_SEMESTRE) {
    return {
      ok: false,
      mensaje: `La fecha no puede ser posterior al ${FECHA_CIERRE_SEMESTRE} (cierre del semestre)`
    };
  }
  
  // 5. La fecha no cae en días bloqueados (fin de semana)
  if (DIAS_BLOQUEADOS.includes(diaSemana)) {
    return {
      ok: false,
      mensaje: 'No se permiten reservas en fines de semana'
    };
  }
  
  // 6. La fecha no está en fechas bloqueadas (festivos)
  if (FECHAS_BLOQUEADAS.includes(fecha)) {
    return {
      ok: false,
      mensaje: 'No se permiten reservas en esta fecha (festivo o día no hábil)'
    };
  }
  
  // 7. La hora de inicio es mayor o igual a la hora de apertura
  if (hora_inicio < HORA_APERTURA) {
    return {
      ok: false,
      mensaje: `La hora de inicio no puede ser anterior a las ${HORA_APERTURA}`
    };
  }
  
  // 8. La hora de fin es menor o igual a la hora de cierre
  if (hora_fin > HORA_CIERRE) {
    return {
      ok: false,
      mensaje: `La hora de fin no puede ser posterior a las ${HORA_CIERRE}`
    };
  }

  // 9. La hora de fin es posterior a hora de inicio
  if (hora_fin <= hora_inicio) {
    return {
      ok: false,
      mensaje: 'La hora de fin debe ser posterior a la hora de inicio'
    };
  }

  // 10. La duración es de al menos 30 minutos
  const duracionMinutos = calcularDuracionMinutos(hora_inicio, hora_fin);
  if (duracionMinutos < MIN_DURACION_MINUTOS) {
    return {
      ok: false,
      mensaje: `La duración mínima de la reserva es de ${MIN_DURACION_MINUTOS} minutos`
    };
  }
  
  // 11. La duración no supera las 4 horas
  const duracionHoras = duracionMinutos / 60;
  if (duracionHoras > MAX_DURACION_HORAS) {
    return {
      ok: false,
      mensaje: `La duración máxima de la reserva es de ${MAX_DURACION_HORAS} horas`
    };
  }
  
  // 12. La franja no solapa con el bloque de almuerzo
  const solapaAlmuerzo = !(hora_fin <= HORA_INICIO_ALMUERZO || hora_inicio >= HORA_FIN_ALMUERZO);
  if (solapaAlmuerzo) {
    return {
      ok: false,
      mensaje: `El horario seleccionado solapa con el bloque de almuerzo (${HORA_INICIO_ALMUERZO}-${HORA_FIN_ALMUERZO})`
    };
  }
  
  // 13. La franja no solapa con bloques bloqueados del día
  const bloquesDia = BLOQUES_BLOQUEADOS[diaSemana];
  if (bloquesDia) {
    for (const bloque of bloquesDia) {
      const solapaBloque = !(hora_fin <= bloque.horaInicio || hora_inicio >= bloque.horaFin);
      if (solapaBloque) {
        return {
          ok: false,
          mensaje: `El horario seleccionado solapa con: ${bloque.motivo} (${bloque.horaInicio}-${bloque.horaFin})`
        };
      }
    }
  }
  
  // 14. El equipo existe y está activo
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
  
  // 15. El usuario no excede el límite de 2 reservas activas
  const reservas = await obtener('reservas');
  const reservasUsuario = reservas.filter(r => r.usuario_id === usuario_id);  
  const reservasActivas = reservasUsuario.filter(r => r.fecha >= hoy);
  
  if (reservasActivas.length >= MAX_RESERVAS_ACTIVAS) {
    return {
      ok: false,
      mensaje: `Has alcanzado el límite de ${MAX_RESERVAS_ACTIVAS} reservas activas`
    };
  }
  
  // 16. El horario no presenta solapamiento con otras reservas
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
  FECHA_INICIO_SEMESTRE, FECHA_CIERRE_SEMESTRE,
  MAX_DIAS_ANTICIPACION, MAX_RESERVAS_ACTIVAS,
  MIN_DURACION_MINUTOS, MAX_DURACION_HORAS,
  DIAS_BLOQUEADOS, FECHAS_BLOQUEADAS, BLOQUES_BLOQUEADOS,
  HORA_APERTURA, HORA_CIERRE,
  autenticarUsuario, registrarUsuario,    
  verificarDisponibilidad, obtenerEquiposDisponibles, obtenerReservasDeEquipo,
  crearReserva, cancelarReserva, obtenerReservasDeUsuario,
  aDateTime, obtenerFechaHoy, diferenciaDias, calcularDuracionMinutos
};
