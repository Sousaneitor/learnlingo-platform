// server.js - Servidor Simple LearnLingo
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware básico
app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 LearnLingo API funcionando!',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API de prueba
app.get('/api/test', (req, res) => {
  res.json({
    message: '✅ API Test successful!',
    data: {
      users: 1000,
      lessons: 50,
      languages: ['English', 'Spanish', 'French'],
      features: ['Authentication', 'Payments', 'Progress Tracking']
    },
    timestamp: new Date().toISOString()
  });
});

// Simulador de base de datos
app.get('/api/database-test', (req, res) => {
  res.json({
    message: '✅ Base de datos simulada funcionando!',
    stats: {
      users: 1,
      courses: 1,
      lessons: 3
    },
    courses: [
      {
        id: '1',
        name: 'Inglés',
        lessons: [
          { id: '1', title: 'Saludos Básicos', difficulty: 'Principiante' },
          { id: '2', title: 'Familia y Amigos', difficulty: 'Principiante' },
          { id: '3', title: 'Inglés de Negocios', difficulty: 'Avanzado' }
        ]
      }
    ],
    timestamp: new Date().toISOString()
  });
});

// Ruta de usuarios (simulada)
app.get('/api/users/profile', (req, res) => {
  res.json({
    user: {
      id: '1',
      name: 'María González',
      email: 'maria@learnlingo.app',
      level: 15,
      xp: 2450,
      lives: 4,
      streak: 7,
      gems: 150
    }
  });
});

// Manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor LearnLingo ejecutándose en puerto ${PORT}`);
  console.log(`📚 API disponible en: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🗄️ Database test: http://localhost:${PORT}/api/database-test`);
});

module.exports = app;
