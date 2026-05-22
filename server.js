const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();
const PORT = 3000;

// Crear router de json-server con la base de datos
const router = jsonServer.router(path.join(__dirname, 'data', 'db.json'));
const middlewares = jsonServer.defaults();

// Servir archivos estáticos desde web/
app.use(express.static(path.join(__dirname, 'web')));

// Usar middlewares de json-server (logger, cors, etc.)
app.use(middlewares);

// Montar la API en /api
app.use('/api', router);

// Ruta raíz redirige a index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});
