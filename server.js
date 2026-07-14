require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// CORS abierto: pensado para desarrollo local (ej. la consola HTML de pruebas
// que abre un archivo file:// o se sirve desde otro puerto). Si esto se
// despliega en producción, conviene restringir "origin" a los dominios reales.
app.use(cors());
app.use(express.json());

app.use('/auth', require('./auth-module'));
app.use('/sync', require('./sync-module'));
app.use('/config', require('./config-module'));
app.use('/tienda', require('./tienda-module'));


app.get('/health', (req, res) => res.json({ ok: true }));

// Manejador de errores por si algo no capturado llega hasta aquí
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error inesperado' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});