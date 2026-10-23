const http = require('http');

function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : null;
        const options = {
            hostname: 'localhost',
            port: 3030,
            path: encodeURI(path),
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = data;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {}
                resolve({ status: res.statusCode, body: parsed });
            });
        });

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

async function runTests() {
    console.log('--- INICIANDO BATERÍA DE PRUEBAS DEL TALLER 2 ---\n');

    // 1. Hola Mundo
    const r1 = await request('GET', '/');
    console.log(`1. GET /: Status ${r1.status} - Respuesta: "${r1.body}"`);

    // 2. Listar países
    const r2 = await request('GET', '/paises');
    console.log(`2. GET /paises: Status ${r2.status} - Total países: ${Array.isArray(r2.body) ? r2.body.length : 0}`);

    // 3. Agregar país 999
    const r3 = await request('POST', '/paises/agregar', {
        id: 999,
        nombre: 'Chechenia',
        continente: 'ASIA',
        tipoRegion: 'DISTRITO',
        codigoAlfa2: 'CH',
        codigoAlfa3: 'CHE'
    });
    console.log(`3. POST /paises/agregar (999): Status ${r3.status}`);

    // 4. Modificar país 999
    const r4 = await request('POST', '/paises/modificar', {
        id: 999,
        nombre: 'República de Chechenia',
        continente: 'ASIA',
        tipoRegion: 'DISTRITO',
        codigoAlfa2: 'CH',
        codigoAlfa3: 'CHE'
    });
    console.log(`4. POST /paises/modificar (999): Status ${r4.status}`);

    // 5. Listar regiones Colombia (170)
    const r5 = await request('GET', '/regiones/170');
    console.log(`5. GET /regiones/170: Status ${r5.status} - Regiones encontradas: ${Array.isArray(r5.body) ? r5.body.length : 0}`);

    // 6. Agregar región a Colombia (170)
    const r6 = await request('POST', '/regiones/agregar/170', {
        nombre: 'Magdalena Medio',
        area: 0,
        poblacion: 0
    });
    console.log(`6. POST /regiones/agregar/170 (Magdalena Medio): Status ${r6.status}`);

    // 7. Modificar región Yukon Territory en Canadá (124)
    const r7 = await request('POST', '/regiones/modificar/124', {
        nombre: 'Yukon Territory',
        area: 482443,
        poblacion: 35874
    });
    console.log(`7. POST /regiones/modificar/124 (Yukon Territory): Status ${r7.status}`);

    // 8. Eliminar región Magdalena Medio de Colombia (170)
    const r8 = await request('DELETE', '/regiones/170/Magdalena Medio');
    console.log(`8. DELETE /regiones/170/Magdalena Medio: Status ${r8.status} - Mensaje:`, r8.body);

    // 9. Listar ciudades de Antioquia en Colombia (170)
    const r9 = await request('GET', '/ciudades/170/Antioquia');
    console.log(`9. GET /ciudades/170/Antioquia: Status ${r9.status} - Ciudades encontradas: ${Array.isArray(r9.body) ? r9.body.length : 0}`);

    // 10. Agregar ciudad Whitehorse a Yukon Territory en Canadá (124)
    const r10 = await request('POST', '/ciudades/agregar/124/Yukon Territory', {
        codigo: '867',
        nombre: 'Whitehorse',
        capitalRegion: true,
        capitalPais: false
    });
    console.log(`10. POST /ciudades/agregar/124/Yukon Territory (Whitehorse): Status ${r10.status}`);

    // 11. Agregar y luego Modificar ciudad Cruzeiro do Sul en Acre, Brasil (76)
    await request('POST', '/ciudades/agregar/76/Acre', {
        nombre: 'Cruzeiro do Sul',
        capitalRegion: false,
        capitalPais: false
    });
    const r11 = await request('POST', '/ciudades/modificar/76/Acre', {
        nombre: 'Cruzeiro do Sul',
        capitalRegion: false,
        capitalPais: true
    });
    console.log(`11. POST /ciudades/modificar/76/Acre (Cruzeiro do Sul): Status ${r11.status} -`, r11.body);

    // 12. Eliminar país de prueba 999
    const r12 = await request('DELETE', '/paises/999');
    console.log(`12. DELETE /paises/999: Status ${r12.status}`);

    // 13. Obtener capital por país (Ruta avanzada)
    const r13 = await request('GET', '/api/paises/capital/Colombia');
    console.log(`13. GET /api/paises/capital/Colombia: Status ${r13.status} -`, r13.body);

    // 14. Swagger UI
    const r14 = await request('GET', '/api-docs/');
    console.log(`14. GET /api-docs/ (Swagger UI): Status ${r14.status}`);

    console.log('\n--- PRUEBAS COMPLETADAS EXITOSAMENTE ---');
}

// Iniciar servidor temporal para la prueba
const app = require('./app');
app.app.listen(3030, async () => {
    try {
        await new Promise(r => setTimeout(r, 1000));
        await runTests();
        process.exit(0);
    } catch (err) {
        console.error('Error en pruebas:', err);
        process.exit(1);
    }
});
