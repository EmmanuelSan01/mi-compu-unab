import { inicializarAPI } from './api.js';
import { obtenerReservasDeUsuario, cancelarReserva, obtenerFechaHoy } from './reservas.js';

// Usuario activo
let usuarioActivo = null;

// Reserva seleccionada para cancelar
let reservaSeleccionada = null;

// Elementos del DOM
let elementos = {};

// Inicializacion
document.addEventListener('DOMContentLoaded', async () => {
  // Validar sesion activa
  usuarioActivo = JSON.parse(sessionStorage.getItem("usuario_activo"));
  
  if (!usuarioActivo) {
    window.location.href = "login.html";
    return;
  }
  
  // Configurar usuario en navbar
  document.getElementById('nombre-usuario').textContent = usuarioActivo.name || usuarioActivo.nombre || usuarioActivo.email;
  
  // Configurar cierre de sesion
  document.getElementById('btn-cerrar-sesion').addEventListener('click', cerrarSesion);
  
  await inicializarAPI();
  cachearElementos();
  configurarEventos();
  await cargarReservas();
});

function cerrarSesion() {
  sessionStorage.removeItem("usuario_activo");
  window.location.href = "login.html";
}

function cachearElementos() {
  elementos = {
    bookingsContainer: document.getElementById('bookings-container'),
    modal: document.getElementById('modal-confirmacion'),
    modalOverlay: document.querySelector('.modal-overlay'),
    modalDetalle: document.getElementById('modal-detalle-reserva'),
    btnCancelarModal: document.getElementById('btn-cancelar-modal'),
    btnConfirmarCancelar: document.getElementById('btn-confirmar-cancelar')
  };
}

function configurarEventos() {
  // Cerrar modal al hacer clic en overlay o boton cancelar
  elementos.modalOverlay.addEventListener('click', cerrarModal);
  elementos.btnCancelarModal.addEventListener('click', cerrarModal);
  
  // Confirmar cancelacion
  elementos.btnConfirmarCancelar.addEventListener('click', confirmarCancelacion);
}

async function cargarReservas() {
  const reservas = await obtenerReservasDeUsuario(usuarioActivo.id);
  const hoy = obtenerFechaHoy();
  
  // Filtrar solo reservas activas (fecha >= hoy)
  const reservasActivas = reservas.filter(r => r.fecha >= hoy);
  
  if (reservasActivas.length === 0) {
    elementos.bookingsContainer.innerHTML = `
      <div class="empty-state">
        <p>No tienes reservas activas.</p>
        <a href="index.html" class="btn-primario">Crear una reserva</a>
      </div>
    `;
    return;
  }
  
  elementos.bookingsContainer.innerHTML = '';
  
  for (const reserva of reservasActivas) {
    const card = crearTarjetaReserva(reserva);
    elementos.bookingsContainer.appendChild(card);
  }
}

function crearTarjetaReserva(reserva) {
  const card = document.createElement('div');
  card.className = 'booking-card';
  card.dataset.id = reserva.id;
  
  // Formatear fecha para mostrar
  const fechaObj = new Date(reserva.fecha + 'T00:00:00');
  const fechaFormateada = fechaObj.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  card.innerHTML = `
    <h3>Reserva #${reserva.id}</h3>
    <div class="booking-details">
      <div class="booking-detail">
        <strong>Fecha:</strong> ${fechaFormateada}
      </div>
      <div class="booking-detail">
        <strong>Horario:</strong> ${reserva.hora_inicio} - ${reserva.hora_fin}
      </div>
      <div class="booking-detail">
        <strong>Equipo:</strong> #${String(reserva.equipo_id).padStart(2, '0')}
      </div>
    </div>
    <button class="cancel-button" data-id="${reserva.id}">Cancelar reserva</button>
  `;
  
  // Agregar evento al boton de cancelar
  const btnCancelar = card.querySelector('.cancel-button');
  btnCancelar.addEventListener('click', () => abrirModalCancelacion(reserva));
  
  return card;
}

function abrirModalCancelacion(reserva) {
  reservaSeleccionada = reserva;
  
  // Formatear fecha para el modal
  const fechaObj = new Date(reserva.fecha + 'T00:00:00');
  const fechaFormateada = fechaObj.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  elementos.modalDetalle.innerHTML = `
    <strong>Reserva #${reserva.id}</strong><br>
    Fecha: ${fechaFormateada}<br>
    Horario: ${reserva.hora_inicio} - ${reserva.hora_fin}<br>
    Equipo: #${String(reserva.equipo_id).padStart(2, '0')}
  `;
  
  elementos.modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  elementos.modal.hidden = true;
  document.body.style.overflow = '';
  reservaSeleccionada = null;
}

async function confirmarCancelacion() {
  if (!reservaSeleccionada) return;
  
  // Deshabilitar boton mientras se procesa
  elementos.btnConfirmarCancelar.disabled = true;
  elementos.btnConfirmarCancelar.textContent = 'Cancelando...';
  
  const resultado = await cancelarReserva(reservaSeleccionada.id, usuarioActivo.id);
  
  if (resultado.ok) {
    cerrarModal();
    await cargarReservas();
  } else {
    alert(resultado.mensaje || 'Error al cancelar la reserva');
  }
  
  // Restaurar boton
  elementos.btnConfirmarCancelar.disabled = false;
  elementos.btnConfirmarCancelar.textContent = 'Confirmar cancelacion';
}
