class CiudadValidador {
    /**
     * Valida la estructura de la ciudad en el body
     */
    validarCuerpo(solicitud, respuesta, next) {
        const { nombre, capitalRegion, capitalPais, habitantes, esCapital } = solicitud.body;
        const errores = [];

        if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
            errores.push("El 'nombre' de la ciudad es obligatorio.");
        }

        // Compatibilidad: si envían esCapital lo mapeamos a capitalRegion si no viene
        if (solicitud.body.capitalRegion === undefined && esCapital !== undefined) {
            solicitud.body.capitalRegion = Boolean(esCapital);
        }

        if (errores.length > 0) {
            return respuesta.status(400).json({
                mensaje: "Error de validación en la ciudad",
                detalles: errores
            });
        }
        next();
    }

    /**
     * Valida los parámetros de la URL: ID del país y nombre de la región
     */
    validarParams(solicitud, respuesta, next) {
        const id = parseInt(solicitud.params.id);
        const region = solicitud.params.region || solicitud.params.nombreregion || solicitud.params.nombre;

        if (isNaN(id)) {
            return respuesta.status(400).json({ mensaje: "El ID del país debe ser un número válido." });
        }
        if (!region || region.trim().length === 0) {
            return respuesta.status(400).json({ mensaje: "El nombre de la región es obligatorio en la URL." });
        }

        // Normalizamos el parámetro region
        solicitud.params.region = region;
        next();
    }
}

module.exports = new CiudadValidador();