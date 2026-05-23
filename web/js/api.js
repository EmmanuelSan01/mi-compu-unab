const API_BASE_URL = '/api';
const REMOTE_DB_URL = 'data/db.json';

let modoActivo = null; // 'local' | 'remoto' | null (no inicializado)
let dbCache = null; // Cache de db.json en modo remoto

const tryFetch = async (localUrl) => {
  try {
    const response = await fetch(localUrl);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return { response, isLocal: true };
  } catch (error) {
    console.warn('Servidor local no disponible, cambiando a modo remoto:', error.message);
    const response = await fetch(REMOTE_DB_URL);
    return { response, isLocal: false };
  }
};

async function inicializarAPI() {
  try {
    const { response, isLocal } = await tryFetch(`${API_BASE_URL}/equipos`);
    
    if (!response.ok) {
      throw new Error('Respuesta no válida');
    }
    
    modoActivo = isLocal ? 'local' : 'remoto';
    
    // En modo remoto, cargar db.json en cache
    if (!isLocal) {
      const dbResponse = await fetch(REMOTE_DB_URL);
      if (dbResponse.ok) {
        dbCache = await dbResponse.json();
      }
    }
    
    console.log(`API inicializada en modo: ${modoActivo}`);
    return { ok: true, modo: modoActivo };
    
  } catch (error) {
    console.error('Error al inicializar API:', error);
    modoActivo = null;
    return { ok: false, modo: null };
  }
}

function obtenerModo() {
  return modoActivo;
}

function obtenerDeLocalStorage(recurso) {
  try {
    const data = localStorage.getItem(recurso);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error al leer localStorage[${recurso}]:`, error);
    return [];
  }
}

function guardarEnLocalStorage(recurso, datos) {
  try {
    localStorage.setItem(recurso, JSON.stringify(datos));
  } catch (error) {
    console.error(`Error al escribir localStorage[${recurso}]:`, error);
  }
}

async function obtener(recurso) {
  // Modo no inicializado o fallido
  if (modoActivo === null) {
    const init = await inicializarAPI();
    if (!init.ok) {
      console.warn('API no disponible, retornando colección vacía');
      return [];
    }
  }
  
  // Modo local: fetch directo a json-server
  if (modoActivo === 'local') {
    try {
      const response = await fetch(`${API_BASE_URL}/${recurso}`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error al obtener ${recurso}:`, error);
      // Intentar cambiar a modo remoto
      modoActivo = 'remoto';
      return obtener(recurso);
    }
  }
  
  // Modo remoto: fusionar db.json con localStorage
  if (modoActivo === 'remoto') {
    // Obtener datos base de db.json (cache o fetch)
    let datosBase = [];
    
    if (dbCache && dbCache[recurso]) {
      datosBase = dbCache[recurso];
    } else {
      try {
        const response = await fetch(REMOTE_DB_URL);
        if (response.ok) {
          dbCache = await response.json();
          datosBase = dbCache[recurso] || [];
        }
      } catch (error) {
        console.error('Error al cargar db.json:', error);
      }
    }
    
    // Para equipos, solo retornar datos base (no se modifican)
    if (recurso === 'equipos') {
      return datosBase;
    }
    
    // Fusionar con localStorage para usuarios y reservas
    const datosLocales = obtenerDeLocalStorage(recurso);
    
    // Concatenar datos de db.json con datos de localStorage
    return [...datosBase, ...datosLocales];
  }
  
  return [];
}

async function crear(recurso, datos) {
  // Modo no inicializado
  if (modoActivo === null) {
    await inicializarAPI();
  }
  
  // Modo local: POST a json-server
  if (modoActivo === 'local') {
    try {
      const response = await fetch(`${API_BASE_URL}/${recurso}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return await response.json();
      
    } catch (error) {
      console.error(`Error al crear en ${recurso}:`, error);
      // Cambiar a modo remoto y reintentar
      modoActivo = 'remoto';
      return crear(recurso, datos);
    }
  }
  
  // Modo remoto: guardar en localStorage
  if (modoActivo === 'remoto') {
    // Obtener todos los items para calcular el nuevo ID
    const todosLosItems = await obtener(recurso);
    
    // Calcular nuevo ID: máximo existente + 1
    const maxId = todosLosItems.reduce((max, item) => {
      return Math.max(max, item.id || 0);
    }, 0);
    const newId = maxId + 1;
    
    // Crear nuevo item con ID
    const nuevoItem = { ...datos, id: newId };
    
    // Obtener datos actuales de localStorage y agregar el nuevo
    const datosLocales = obtenerDeLocalStorage(recurso);
    datosLocales.push(nuevoItem);
    guardarEnLocalStorage(recurso, datosLocales);
    
    return nuevoItem;
  }
  
  throw new Error('Modo de API no válido');
}

async function eliminar(recurso, id) {
  // Modo no inicializado
  if (modoActivo === null) {
    await inicializarAPI();
  }
  
  // Modo local: DELETE a json-server
  if (modoActivo === 'local') {
    try {
      const response = await fetch(`${API_BASE_URL}/${recurso}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return { ok: true };
      
    } catch (error) {
      console.error(`Error al eliminar ${recurso}/${id}:`, error);
      // Cambiar a modo remoto y reintentar
      modoActivo = 'remoto';
      return eliminar(recurso, id);
    }
  }
  
  // Modo remoto: eliminar de localStorage
  if (modoActivo === 'remoto') {
    const datosLocales = obtenerDeLocalStorage(recurso);
    const indice = datosLocales.findIndex(item => item.id === id);
    
    if (indice !== -1) {
      datosLocales.splice(indice, 1);
      guardarEnLocalStorage(recurso, datosLocales);
      return { ok: true };
    }
       
    return { ok: false };
  }
  
  throw new Error('Modo de API no válido');
}

// Exportaciones
export {
  API_BASE_URL, REMOTE_DB_URL,
  inicializarAPI, obtenerModo, obtener, crear,eliminar
};
