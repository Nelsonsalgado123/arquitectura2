const bd = require('./bd');

class CiudadRepositorio {
    constructor() {
        this.collectionName = 'paises';
    }

    get _collection() {
        return bd.obtenerBD().collection(this.collectionName);
    }

    /**
     * Lista ciudades de una región específica dentro de un país
     */
    async listar(idPais, nombreRegion) {
        try {
            const id = parseInt(idPais);
            const pipeline = [
                { $match: { id } },
                { $unwind: "$regiones" },
                { $match: { "regiones.nombre": nombreRegion } },
                { $project: { _id: 0, ciudades: "$regiones.ciudades" } }
            ];
            
            const resultado = await this._collection.aggregate(pipeline).toArray();
            return resultado.length > 0 ? (resultado[0].ciudades || []) : [];
        } catch (error) {
            this._handleError('listar', error);
        }
    }

    /**
     * Agrega una ciudad al array de una región específica dentro de un país
     */
    async agregar(idPais, nombreRegion, ciudad) {
        try {
            const id = parseInt(idPais);
            const nuevaCiudad = {
                nombre: ciudad.nombre,
                capitalRegion: Boolean(ciudad.capitalRegion),
                capitalPais: Boolean(ciudad.capitalPais)
            };
            if (ciudad.codigo !== undefined) {
                nuevaCiudad.codigo = ciudad.codigo;
            }

            const resultado = await this._collection.updateOne(
                { id, "regiones.nombre": nombreRegion },
                {
                    $push: { "regiones.$.ciudades": nuevaCiudad }
                }
            );

            if (resultado.matchedCount === 0) throw new Error('País o Región no encontrada');
            return nuevaCiudad;
        } catch (error) {
            this._handleError('agregar', error);
        }
    }

    /**
     * Modifica una ciudad usando arrayFilters para identificar 
     * exactamente qué región y qué ciudad actualizar.
     */
    async modificar(idPais, nombreRegion, ciudad) {
        try {
            const id = parseInt(idPais);
            const updateFields = {};

            if (ciudad.capitalRegion !== undefined) {
                updateFields["regiones.$[reg].ciudades.$[ciu].capitalRegion"] = Boolean(ciudad.capitalRegion);
            }
            if (ciudad.capitalPais !== undefined) {
                updateFields["regiones.$[reg].ciudades.$[ciu].capitalPais"] = Boolean(ciudad.capitalPais);
            }
            if (ciudad.codigo !== undefined) {
                updateFields["regiones.$[reg].ciudades.$[ciu].codigo"] = ciudad.codigo;
            }

            const resultado = await this._collection.updateOne(
                { id },
                { $set: updateFields },
                {
                    arrayFilters: [
                        { "reg.nombre": nombreRegion },
                        { "ciu.nombre": ciudad.nombre }
                    ]
                }
            );

            if (resultado.matchedCount === 0 || resultado.modifiedCount === 0) {
                throw new Error('No se pudo actualizar la ciudad. Verifique país, región y ciudad.');
            }
            return ciudad;
        } catch (error) {
            this._handleError('modificar', error);
        }
    }

    /**
     * Elimina una ciudad del array de ciudades de la región.
     */
    async eliminar(idPais, nombreRegion, nombreCiudad) {
        try {
            const id = parseInt(idPais);
            const resultado = await this._collection.updateOne(
                { id, "regiones.nombre": nombreRegion },
                {
                    $pull: { "regiones.$.ciudades": { nombre: nombreCiudad } }
                }
            );
            return resultado.modifiedCount > 0;
        } catch (error) {
            this._handleError('eliminar', error);
        }
    }

    _handleError(metodo, error) {
        console.error(`Error en CiudadRepositorio.${metodo}:`, error.message);
        throw error;
    }
}

module.exports = new CiudadRepositorio();