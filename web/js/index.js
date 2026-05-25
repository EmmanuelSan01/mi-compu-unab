import { inicializarAPI, obtener } from './api.js';
import {
  FECHA_INICIO_SEMESTRE, FECHA_CIERRE_SEMESTRE,
  MAX_DIAS_ANTICIPACION, DIAS_BLOQUEADOS, FECHAS_BLOQUEADAS,
  BLOQUES_BLOQUEADOS, HORA_APERTURA, HORA_CIERRE,
  HORA_INICIO_ALMUERZO, HORA_FIN_ALMUERZO,
  MIN_DURACION_MINUTOS, MAX_DURACION_HORAS,
  obtenerFechaHoy, crearReserva, verificarDisponibilidad
} from './reservas.js';

// Estado del formulario
const estado = {
  seccionActual: 1,
  fecha: null,
  horaInicio: null,
  horaFin: null,
  equipoId: null,
  usuarioId: 1 // Usuario de prueba
};

// Elementos del DOM
let elementos = {};

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  await inicializarAPI();
  cachearElementos();
  configurarEventos();
  configurarInputFecha();
});

function cachearElementos() {
  elementos = {
    form: document.getElementById('form-reserva'),
    errorGlobal: document.getElementById('error-global'),
    // Sección 1
    seccionFecha: document.getElementById('seccion-fecha'),
    inputFecha: document.getElementById('fecha'),
    errorFecha: document.getElementById('error-fecha'),
    btnSiguiente1: document.getElementById('btn-siguiente-1'),
    // Sección 2
    seccionHorario: document.getElementById('seccion-horario'),
    tbodyHorarios: document.getElementById('tbody-horarios'),
    horarioSeleccionado: document.getElementById('horario-seleccionado'),
    errorHorario: document.getElementById('error-horario'),
    btnAtras2: document.getElementById('btn-atras-2'),
    btnSiguiente2: document.getElementById('btn-siguiente-2'),
    // Sección 3
    seccionEquipo: document.getElementById('seccion-equipo'),
    grillaEquipos: document.getElementById('grilla-equipos'),
    errorEquipo: document.getElementById('error-equipo'),
    btnAtras3: document.getElementById('btn-atras-3'),
    btnCrearReserva: document.getElementById('btn-crear-reserva'),
    // Resultado
    resultadoReserva: document.getElementById('resultado-reserva'),
    detalleReserva: document.getElementById('detalle-reserva'),
    btnNuevaReserva: document.getElementById('btn-nueva-reserva'),
    // Steps
    steps: document.querySelectorAll('.step')
  };
}

function configurarEventos() {
  // Sección 1
  elementos.inputFecha.addEventListener('change', validarFecha);
  elementos.btnSiguiente1.addEventListener('click', () => irASeccion(2));
  
  // Sección 2
  elementos.btnAtras2.addEventListener('click', () => irASeccion(1));
  elementos.btnSiguiente2.addEventListener('click', () => irASeccion(3));
  
  // Sección 3
  elementos.btnAtras3.addEventListener('click', () => irASeccion(2));
  
  // Form submit
  elementos.form.addEventListener('submit', enviarReserva);
  
  // Nueva reserva
  elementos.btnNuevaReserva.addEventListener('click', reiniciarFormulario);
}

function configurarInputFecha() {
  const hoy = obtenerFechaHoy();
  const maxDate = calcularFechaMaxima(hoy);
  
  elementos.inputFecha.min = hoy;
  elementos.inputFecha.max = maxDate;
  elementos.inputFecha.value = '';
}

function calcularFechaMaxima(desde) {
  const fecha = new Date(desde + 'T00:00:00');
  fecha.setDate(fecha.getDate() + MAX_DIAS_ANTICIPACION);
  return fecha.toISOString().split('T')[0];
}

function validarFecha() {
  const fecha = elementos.inputFecha.value;
  elementos.errorFecha.textContent = '';
  elementos.btnSiguiente1.disabled = true;
  
  if (!fecha) return;
  
  const hoy = obtenerFechaHoy();
  const diaSemana = new Date(fecha + 'T00:00:00').getDay();
  
  // Validación 1: No anterior al inicio del semestre
  if (fecha < FECHA_INICIO_SEMESTRE) {
    elementos.errorFecha.textContent = `La fecha no puede ser anterior al ${FECHA_INICIO_SEMESTRE} (inicio del semestre)`;
    return;
  }
  
  // Validación 2: No anterior a hoy
  if (fecha < hoy) {
    elementos.errorFecha.textContent = 'No se permiten reservas en fechas pasadas';
    return;
  }
  
  // Validación 3: No más de 7 días
  const diasAnticipacion = Math.ceil((new Date(fecha) - new Date(hoy)) / (1000 * 60 * 60 * 24));
  if (diasAnticipacion > MAX_DIAS_ANTICIPACION) {
    elementos.errorFecha.textContent = `La reserva no puede exceder ${MAX_DIAS_ANTICIPACION} días de anticipación`;
    return;
  }
  
  // Validación 4: No posterior al cierre del semestre
  if (fecha > FECHA_CIERRE_SEMESTRE) {
    elementos.errorFecha.textContent = `La fecha no puede ser posterior al ${FECHA_CIERRE_SEMESTRE} (cierre del semestre)`;
    return;
  }
  
  // Validación 5: No fines de semana
  if (DIAS_BLOQUEADOS.includes(diaSemana)) {
    elementos.errorFecha.textContent = 'No se permiten reservas en fines de semana';
    return;
  }
  
  // Validación 6: No festivos
  if (FECHAS_BLOQUEADAS.includes(fecha)) {
    elementos.errorFecha.textContent = 'No se permiten reservas en esta fecha (festivo o día no hábil)';
    return;
  }
  
  // Fecha válida
  estado.fecha = fecha;
  elementos.btnSiguiente1.disabled = false;
}

function irASeccion(numero) {
  // Ocultar sección actual
  document.querySelector('.seccion.active')?.classList.remove('active');
  
  // Actualizar steps
  elementos.steps.forEach((step, i) => {
    step.classList.remove('active', 'completed');
    if (i + 1 < numero) step.classList.add('completed');
    if (i + 1 === numero) step.classList.add('active');
  });
  
  estado.seccionActual = numero;
  
  // Mostrar nueva sección
  if (numero === 1) {
    elementos.seccionFecha.classList.add('active');
  } else if (numero === 2) {
    elementos.seccionHorario.classList.add('active');
    renderizarTablaHorarios();
  } else if (numero === 3) {
    elementos.seccionEquipo.classList.add('active');
    renderizarGrillaEquipos();
  }
  
  limpiarErrorGlobal();
}

function generarBloques() {
  const bloques = [];
  const [horaApertura] = HORA_APERTURA.split(':').map(Number);
  const [horaCierre] = HORA_CIERRE.split(':').map(Number);
  
  for (let h = horaApertura; h < horaCierre; h++) {
    bloques.push({ hora: `${String(h).padStart(2, '0')}:00`, minutos: 0 });
    bloques.push({ hora: `${String(h).padStart(2, '0')}:30`, minutos: 30 });
  }
  
  return bloques;
}

function obtenerMotivoBloqueado(hora, diaSemana) {
  // Verificar almuerzo
  if (hora >= HORA_INICIO_ALMUERZO && hora < HORA_FIN_ALMUERZO) {
    return 'Horario de almuerzo';
  }
  
  // Verificar bloques del día
  const bloquesDia = BLOQUES_BLOQUEADOS[diaSemana];
  if (bloquesDia) {
    for (const bloque of bloquesDia) {
      if (hora >= bloque.horaInicio && hora < bloque.horaFin) {
        return bloque.motivo;
      }
    }
  }
  
  return null;
}

function renderizarTablaHorarios() {
  const bloques = generarBloques();
  const diaSemana = new Date(estado.fecha + 'T00:00:00').getDay();
  
  elementos.tbodyHorarios.innerHTML = '';
  estado.horaInicio = null;
  estado.horaFin = null;
  actualizarVisualizacionHorario();
  elementos.btnSiguiente2.disabled = true;
  
  bloques.forEach((bloque, index) => {
    const tr = document.createElement('tr');
    tr.dataset.hora = bloque.hora;
    tr.dataset.index = index;
    
    const tdHora = document.createElement('td');
    tdHora.textContent = bloque.hora;
    
    const tdEstado = document.createElement('td');
    
    const motivo = obtenerMotivoBloqueado(bloque.hora, diaSemana);
    if (motivo) {
      tr.classList.add('bloqueado');
      tdEstado.innerHTML = `<span class="motivo-bloqueo">${motivo}</span>`;
    } else {
      tdEstado.textContent = 'Disponible';
      tr.addEventListener('click', () => seleccionarBloque(bloque.hora, index));
      tr.addEventListener('dblclick', () => seleccionarBloqueDoble(bloque.hora, index));
    }
    
    tr.appendChild(tdHora);
    tr.appendChild(tdEstado);
    elementos.tbodyHorarios.appendChild(tr);
  });
}

function seleccionarBloque(hora, index) {
  const bloques = generarBloques();
  
  if (!estado.horaInicio) {
    // Primer clic: seleccionar inicio
    estado.horaInicio = hora;
    estado.horaFin = null;
  } else if (!estado.horaFin) {
    // Segundo clic: seleccionar fin
    if (hora <= estado.horaInicio) {
      // Si selecciona antes del inicio, reiniciar
      estado.horaInicio = hora;
      estado.horaFin = null;
    } else {
      // Calcular hora de fin (fin del bloque seleccionado)
      const indexFin = index;
      if (indexFin < bloques.length - 1) {
        estado.horaFin = bloques[indexFin + 1].hora;
      } else {
        estado.horaFin = HORA_CIERRE;
      }
      validarRangoHorario();
    }
  } else {
    // Ya hay rango, reiniciar con nuevo inicio
    estado.horaInicio = hora;
    estado.horaFin = null;
  }
  
  actualizarVisualizacionHorario();
}

function seleccionarBloqueDoble(hora, index) {
  const bloques = generarBloques();
  estado.horaInicio = hora;
  
  if (index < bloques.length - 1) {
    estado.horaFin = bloques[index + 1].hora;
  } else {
    estado.horaFin = HORA_CIERRE;
  }
  
  validarRangoHorario();
  actualizarVisualizacionHorario();
}

function validarRangoHorario() {
  elementos.errorHorario.textContent = '';
  elementos.btnSiguiente2.disabled = true;
  
  if (!estado.horaInicio || !estado.horaFin) return;
  
  const diaSemana = new Date(estado.fecha + 'T00:00:00').getDay();
  
  // Validación 7: Hora inicio >= apertura
  if (estado.horaInicio < HORA_APERTURA) {
    elementos.errorHorario.textContent = `La hora de inicio no puede ser anterior a las ${HORA_APERTURA}`;
    return;
  }
  
  // Validación 8: Hora fin <= cierre
  if (estado.horaFin > HORA_CIERRE) {
    elementos.errorHorario.textContent = `La hora de fin no puede ser posterior a las ${HORA_CIERRE}`;
    return;
  }
  
  // Validación 9: Hora fin > hora inicio
  if (estado.horaFin <= estado.horaInicio) {
    elementos.errorHorario.textContent = 'La hora de fin debe ser posterior a la hora de inicio';
    return;
  }
  
  // Validación 10: Duración mínima 30 min
  const duracionMinutos = calcularDuracion(estado.horaInicio, estado.horaFin);
  if (duracionMinutos < MIN_DURACION_MINUTOS) {
    elementos.errorHorario.textContent = `La duración mínima de la reserva es de ${MIN_DURACION_MINUTOS} minutos`;
    return;
  }
  
  // Validación 11: Duración máxima 4 horas
  if (duracionMinutos > MAX_DURACION_HORAS * 60) {
    elementos.errorHorario.textContent = `La duración máxima de la reserva es de ${MAX_DURACION_HORAS} horas`;
    return;
  }
  
  // Validación 12: No solapar almuerzo
  const solapaAlmuerzo = !(estado.horaFin <= HORA_INICIO_ALMUERZO || estado.horaInicio >= HORA_FIN_ALMUERZO);
  if (solapaAlmuerzo) {
    elementos.errorHorario.textContent = `El horario seleccionado solapa con el bloque de almuerzo (${HORA_INICIO_ALMUERZO}-${HORA_FIN_ALMUERZO})`;
    return;
  }
  
  // Validación 13: No solapar bloques bloqueados
  const bloquesDia = BLOQUES_BLOQUEADOS[diaSemana];
  if (bloquesDia) {
    for (const bloque of bloquesDia) {
      const solapaBloque = !(estado.horaFin <= bloque.horaInicio || estado.horaInicio >= bloque.horaFin);
      if (solapaBloque) {
        elementos.errorHorario.textContent = `El horario seleccionado solapa con: ${bloque.motivo} (${bloque.horaInicio}-${bloque.horaFin})`;
        return;
      }
    }
  }
  
  // Rango válido
  elementos.btnSiguiente2.disabled = false;
}

function calcularDuracion(horaInicio, horaFin) {
  const [h1, m1] = horaInicio.split(':').map(Number);
  const [h2, m2] = horaFin.split(':').map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
}

function actualizarVisualizacionHorario() {
  // Limpiar clases
  elementos.tbodyHorarios.querySelectorAll('tr').forEach(tr => {
    tr.classList.remove('inicio-seleccionado', 'fin-seleccionado', 'en-rango', 'seleccionado');
  });
  
  if (!estado.horaInicio) {
    elementos.horarioSeleccionado.textContent = 'Sin seleccionar';
    return;
  }
  
  const filas = elementos.tbodyHorarios.querySelectorAll('tr');
  let enRango = false;
  
  filas.forEach(tr => {
    const hora = tr.dataset.hora;
    
    if (hora === estado.horaInicio) {
      tr.classList.add('inicio-seleccionado');
      enRango = true;
    }
    
    if (estado.horaFin && hora === estado.horaFin) {
      enRango = false;
    }
    
    if (enRango && !tr.classList.contains('bloqueado')) {
      tr.classList.add('en-rango');
    }
    
    // Marcar el bloque anterior al fin como fin-seleccionado
    if (estado.horaFin) {
      const bloques = generarBloques();
      const indexFin = bloques.findIndex(b => b.hora === estado.horaFin);
      if (indexFin > 0 && hora === bloques[indexFin - 1].hora) {
        tr.classList.add('fin-seleccionado');
      }
    }
  });
  
  if (estado.horaInicio && estado.horaFin) {
    elementos.horarioSeleccionado.textContent = `${estado.horaInicio} - ${estado.horaFin}`;
  } else {
    elementos.horarioSeleccionado.textContent = `Inicio: ${estado.horaInicio} (selecciona fin)`;
  }
}

async function renderizarGrillaEquipos() {
  elementos.grillaEquipos.innerHTML = '';
  estado.equipoId = null;
  elementos.btnCrearReserva.disabled = true;
  
  const equipos = await obtener('equipos');
  const reservas = await obtener('reservas');
  
  // Ordenar por ID
  equipos.sort((a, b) => a.id - b.id);
  
  for (const equipo of equipos) {
    const div = document.createElement('div');
    div.classList.add('equipo-item');
    div.textContent = equipo.id;
    div.dataset.id = equipo.id;
    
    // Verificar disponibilidad
    let disponible = equipo.activo;
    
    if (disponible) {
      // Verificar solapamiento con reservas existentes
      disponible = await verificarDisponibilidad(
        equipo.id,
        estado.fecha,
        estado.horaInicio,
        estado.horaFin
      );
    }
    
    if (!disponible) {
      div.classList.add('no-disponible');
    } else {
      div.addEventListener('click', () => seleccionarEquipo(equipo.id, div));
    }
    
    elementos.grillaEquipos.appendChild(div);
  }
}

function seleccionarEquipo(id, elemento) {
  // Deseleccionar anterior
  elementos.grillaEquipos.querySelectorAll('.equipo-item').forEach(el => {
    el.classList.remove('seleccionado');
  });
  
  // Seleccionar nuevo
  elemento.classList.add('seleccionado');
  estado.equipoId = id;
  elementos.btnCrearReserva.disabled = false;
  elementos.errorEquipo.textContent = '';
}

async function enviarReserva(e) {
  e.preventDefault();
  
  limpiarErrorGlobal();
  elementos.btnCrearReserva.disabled = true;
  
  const resultado = await crearReserva(
    estado.usuarioId,
    estado.equipoId,
    estado.fecha,
    estado.horaInicio,
    estado.horaFin
  );
  
  if (resultado.ok) {
    mostrarResultado(resultado.reserva);
  } else {
    mostrarErrorGlobal(resultado.mensaje);
    elementos.btnCrearReserva.disabled = false;
  }
}

function mostrarResultado(reserva) {
  elementos.form.hidden = true;
  elementos.resultadoReserva.hidden = false;
  
  elementos.detalleReserva.innerHTML = `
    <strong>Fecha:</strong> ${estado.fecha}<br>
    <strong>Horario:</strong> ${estado.horaInicio} - ${estado.horaFin}<br>
    <strong>Equipo:</strong> #${estado.equipoId}
  `;
}

function reiniciarFormulario() {
  estado.fecha = null;
  estado.horaInicio = null;
  estado.horaFin = null;
  estado.equipoId = null;
  estado.seccionActual = 1;
  
  elementos.inputFecha.value = '';
  elementos.btnSiguiente1.disabled = true;
  elementos.errorFecha.textContent = '';
  
  elementos.form.hidden = false;
  elementos.resultadoReserva.hidden = true;
  
  irASeccion(1);
}

function mostrarErrorGlobal(mensaje) {
  elementos.errorGlobal.textContent = mensaje;
  elementos.errorGlobal.hidden = false;
}

function limpiarErrorGlobal() {
  elementos.errorGlobal.textContent = '';
  elementos.errorGlobal.hidden = true;
}
