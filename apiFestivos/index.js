const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const festivoRoutes = require('./routes/festivo.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a Base de Datos
connectDB();

// Rutas
app.use('/api/festivos', festivoRoutes);

// Iniciar Servidor
const PORT = 3030; // Usando el puerto común o ajustarlo a 8080 si lo prefieren
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
