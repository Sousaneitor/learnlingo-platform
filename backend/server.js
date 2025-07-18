// server.js - Servidor Principal LearnLingo
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de seguridad
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://learnlingo.app', 'https://app.learnlingo.com']
    : ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Demasiadas solicitudes, intenta más tarde'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 LearnLingo API funcionando!',
    version: '1.0.0',
    status: 'OK'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Ruta de prueba para usuarios
app.get('/api/test', (req, res) => {
  res.json({
    message: '✅ API Test successful!',
    data: {
      users: 1000,
      lessons: 50,
      languages: ['English', 'Spanish', 'French']
    }
  });
});

// Manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor LearnLingo ejecutándose en puerto ${PORT}`);
  console.log(`📚 API disponible en: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});

module.exports = app;
