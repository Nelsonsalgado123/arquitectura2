const express = require('express');
const router = express.Router();
const festivoController = require('../controllers/festivo.controller');

// Rutas según el taller
router.get('/verificar/:year/:month/:day', festivoController.verificarFestivo);
router.get('/obtener/:year', festivoController.obtenerFestivosPorAno);

// Ruta adicional para inicializar la BD con los datos del PDF
router.post('/poblar', festivoController.poblarBaseDatos);

module.exports = router;
