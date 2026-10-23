const express = require('express');
const conexionBD = require('./repositorios/bd');
const paisRutas = require('./rutas/pais.rutas');
const regionRutas = require('./rutas/region.rutas');
const ciudadRutas = require('./rutas/ciudad.rutas');
const paisControlador = require('./controladores/pais.controlador');
const regionControlador = require('./controladores/region.controlador');
const ciudadControlador = require('./controladores/ciudad.controlador');
const swaggerConfig = require('./configuracion/swagger');

class App {
    constructor() {
        this.app = express();
        this.puerto = process.env.PORT || 3030;

        this._conectarBaseDatos();
        this._configurarMiddlewares();
        this._configurarDocumentacion();
        this._configurarRutas();
        this._configurarManejoErrores();
    }

    _configurarDocumentacion() {
        swaggerConfig.configurar(this.app);
    }

    async _conectarBaseDatos() {
        try {
            await conexionBD.conectar();
        } catch (error) {
            console.error("Fallo crítico: No se pudo conectar a MongoDB.", error);
            process.exit(1);
        }
    }

    _configurarMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    _configurarRutas() {
        // Ejercicio 1 del Taller: Servicio "Hola Mundo"
        this.app.get('/', (req, res) => res.send('Hola Mundo'));

        // Rutas RESTful principales (documentadas con Swagger)
        this.app.use('/api/paises', paisRutas);
        this.app.use('/api/paises', regionRutas);
        this.app.use('/api/paises', ciudadRutas);

        // Rutas directas especificadas en el documento del Taller 2:
        // Nivel 1: Países
        this.app.get('/paises', (req, res) => paisControlador.listar(req, res));
        this.app.post('/paises/agregar', (req, res) => paisControlador.agregar(req, res));
        this.app.post('/paises/modificar', (req, res) => paisControlador.modificar(req, res));
        this.app.delete('/paises/:id', (req, res) => paisControlador.eliminar(req, res));

        // Nivel 2: Regiones
        this.app.get('/regiones/:id', (req, res) => regionControlador.listar(req, res));
        this.app.post('/regiones/agregar/:id', (req, res) => regionControlador.agregar(req, res));
        this.app.post('/regiones/modificar/:id', (req, res) => regionControlador.modificar(req, res));
        this.app.delete('/regiones/:id/:nombre', (req, res) => regionControlador.eliminar(req, res));

        // Nivel 3: Ciudades
        this.app.get('/ciudades/:id/:nombreregion', (req, res) => ciudadControlador.listar(req, res));
        this.app.post('/ciudades/agregar/:id/:nombreregion', (req, res) => ciudadControlador.agregar(req, res));
        this.app.post('/ciudades/modificar/:id/:nombreregion', (req, res) => ciudadControlador.modificar(req, res));
        this.app.delete('/ciudades/:id/:nombreregion/:nombreciudad', (req, res) => ciudadControlador.eliminar(req, res));
    }

    _configurarManejoErrores() {
        this.app.use((req, res) => {
            res.status(404).json({ mensaje: "Ruta no encontrada" });
        });
    }

    escuchar() {
        this.app.listen(this.puerto, () => {
            console.log(`====================================================`);
            console.log(`Servicio iniciado a través de la url: http://localhost:${this.puerto}`);
            console.log(`Documentación Swagger disponible en: http://localhost:${this.puerto}/api-docs`);
            console.log(`====================================================`);
        });
    }
}

module.exports = new App();
