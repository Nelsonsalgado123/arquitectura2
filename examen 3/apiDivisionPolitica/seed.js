const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { MongoClient } = require('mongodb');
const configBD = require('./configuracion/bd.config');

async function poblarBaseDatos() {
    console.log('Iniciando carga de datos en MongoDB...');
    const seedPath = path.resolve(__dirname, '../BD Mongo/BDDivisionPolitica.mjs');

    if (!fs.existsSync(seedPath)) {
        throw new Error(`No se encontró el archivo de datos en: ${seedPath}`);
    }

    const archivoContenido = fs.readFileSync(seedPath, 'utf8');
    const codigoJS = archivoContenido.replace(/use\s+divisionpolitica;?/i, '');

    let documentos = [];
    const sandbox = {
        db: {
            paises: {
                insertMany: (arr) => {
                    documentos = arr;
                }
            }
        }
    };

    vm.createContext(sandbox);
    vm.runInContext(codigoJS, sandbox);

    console.log(`Leídos ${documentos.length} países desde el archivo seed.`);

    const cliente = new MongoClient(configBD.url);
    try {
        await cliente.connect();
        const db = cliente.db(configBD.BASEDATOS);
        const coleccion = db.collection('paises');

        await coleccion.drop().catch(() => {});
        const resultado = await coleccion.insertMany(documentos);

        console.log(`Base de datos '${configBD.BASEDATOS}' poblada exitosamente.`);
        console.log(`Documentos insertados: ${resultado.insertedCount}`);
    } finally {
        await cliente.close();
    }
}

poblarBaseDatos().catch(err => {
    console.error('Error durante la carga de datos:', err);
    process.exit(1);
});
