# Taller 2: API REST en ExpressJS con MongoDB
**Instituto Tecnológico Metropolitano (ITM)**  
**Materia:** Arquitectura de Software 2 / Programación Web 2  

---

## 📋 Resumen del Taller

El objetivo de este taller es aplicar los conceptos de **arquitectura por capas**, **orientación a eventos**, desarrollo backend con **Express.js**, y operaciones **CRUD a 3 niveles de profundidad jerárquica** sobre una base de datos NoSQL (**MongoDB**):

1. **Nivel 1 (Documento raíz / Colección):** CRUD de **Países** (`paises`).
2. **Nivel 2 (Subdocumento / Arreglo en documento):** CRUD de **Regiones** dentro de un país (`paises.regiones`).
3. **Nivel 3 (Sub-subdocumento / Arreglo anidado dentro de arreglo):** CRUD de **Ciudades** dentro de una región de un país (`paises.regiones.ciudades`).

Adicionalmente, se incluye el ejercicio inicial **"Hola Mundo"** y la integración de **Swagger UI** para documentación y pruebas interactivas.

---

## 🏛️ Arquitectura del Proyecto

El proyecto está diseñado siguiendo una arquitectura limpia y modular desacoplada:

```
examen 3/
├── Taller 2 - API en ExpressJS.pdf     # Documento guía oficial
├── BD Mongo/
│   └── BDDivisionPolitica.mjs         # Script con dataset de 249 países
├── diagrama-arquitectura-apidivisionpolitica.md
├── diagrama-objetual-bddivisionpolitica.md
└── apiDivisionPolitica/
    ├── .env                           # Variables de entorno (PORT=3030, DB_HOST, DB_NAME)
    ├── package.json                   # Dependencias y scripts npm
    ├── server.js                      # Punto de entrada para arranque del servidor
    ├── app.js                         # Configuración central de Express, rutas y middlewares
    ├── seed.js                        # Script para sembrar/restaurar los 249 países en MongoDB
    ├── test-api.js                    # Batería de pruebas automatizadas
    ├── configuracion/
    │   ├── bd.config.js               # Parámetros y string de conexión a MongoDB
    │   └── swagger.js                 # Configuración de OpenAPI / Swagger UI
    ├── controladores/
    │   ├── pais.controlador.js        # Lógica de respuesta HTTP para Países
    │   ├── region.controlador.js      # Lógica de respuesta HTTP para Regiones
    │   └── ciudad.controlador.js      # Lógica de respuesta HTTP para Ciudades
    ├── repositorios/
    │   ├── bd.js                      # Cliente Singleton de conexión a MongoDB (Driver v6)
    │   ├── pais.repositorio.js        # Operaciones Mongo para Países (find, insertOne, updateOne, deleteOne)
    │   ├── region.repositorio.js      # Operaciones Mongo para Regiones ($push, $pull, positional $)
    │   └── ciudad.repositorio.js      # Operaciones Mongo para Ciudades ($unwind, arrayFilters, $pull)
    ├── rutas/
    │   ├── pais.rutas.js              # Enrutador y documentación Swagger para Países
    │   ├── region.rutas.js            # Enrutador y documentación Swagger para Regiones
    │   └── ciudad.rutas.js            # Enrutador y documentación Swagger para Ciudades
    └── validadores/
        ├── pais.validador.js          # Middlewares de validación de datos de País
        ├── region.validador.js        # Middlewares de validación de datos de Región
        └── ciudad.validador.js        # Middlewares de validación de datos de Ciudad
```

---

## ⚙️ Requisitos Previos

- **Node.js** (v18, v20, v22 o v24)
- **MongoDB** corriendo en `localhost:27017` (Servicio local de Windows o contenedor Docker)

---

## 🚀 Instalación y Puesta en Marcha

1. **Abrir la terminal en la carpeta del proyecto:**
   ```bash
   cd "c:\xampp\htdocs\arquitectura2\examen 3\apiDivisionPolitica"
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Poblar la base de datos MongoDB (Carga los 249 países):**
   ```bash
   npm run seed
   ```

4. **Iniciar el servidor:**
   ```bash
   npm start
   ```
   *(O en modo desarrollo con recarga automática: `npm run dev`)*

5. **Abrir en el navegador:**
   - **Hola Mundo:** [http://localhost:3030/](http://localhost:3030/)
   - **Documentación Swagger UI:** [http://localhost:3030/api-docs](http://localhost:3030/api-docs)

6. **Ejecutar pruebas automáticas:**
   ```bash
   npm test
   ```

---

## 📡 Tabla de Endpoints de la API

La API cuenta con soporte dual: tanto las **rutas exactas del Taller PDF** como las **rutas RESTful con Swagger**:

### 1. Ejercicio 1: Hola Mundo
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/` | Retorna el mensaje de texto `"Hola Mundo"` |

---

### 2. Nivel 1: Países (Documentos raíz)
| Método | Endpoint PDF | Endpoint RESTful (Swagger) | Descripción |
|---|---|---|---|
| `GET` | `/paises` | `/api/paises` | Lista todos los países con campos seleccionados |
| `POST` | `/paises/agregar` | `/api/paises` | Agrega un nuevo país |
| `POST` / `PUT` | `/paises/modificar` | `/api/paises` | Modifica datos de un país por `id` |
| `DELETE` | `/paises/:id` | `/api/paises/:id` | Elimina un país por `id` |
| `GET` | — | `/api/paises/capital/:pais` | Retorna la capital del país especificado |

---

### 3. Nivel 2: Regiones (Vector de objetos `regiones`)
| Método | Endpoint PDF | Endpoint RESTful (Swagger) | Descripción |
|---|---|---|---|
| `GET` | `/regiones/:id` | `/api/paises/:id/regiones` | Lista las regiones del país (`id`) |
| `POST` | `/regiones/agregar/:id` | `/api/paises/:id/regiones` | Agrega una región al país (`id`) usando `$push` |
| `POST` / `PUT` | `/regiones/modificar/:id` | `/api/paises/:id/regiones` | Modifica área/población usando operador posicional `$` |
| `DELETE` | `/regiones/:id/:nombre` | `/api/paises/:id/regiones/:nombre` | Elimina una región del país usando `$pull` |

---

### 4. Nivel 3: Ciudades (Vector anidado `regiones.ciudades`)
| Método | Endpoint PDF | Endpoint RESTful (Swagger) | Descripción |
|---|---|---|---|
| `GET` | `/ciudades/:id/:nombreregion` | `/api/paises/:id/regiones/:region/ciudades` | Lista las ciudades de una región específica |
| `POST` | `/ciudades/agregar/:id/:nombreregion` | `/api/paises/:id/regiones/:region/ciudades` | Agrega una ciudad usando `$push` a `regiones.$.ciudades` |
| `POST` / `PUT` | `/ciudades/modificar/:id/:nombreregion` | `/api/paises/:id/regiones/:region/ciudades` | Modifica ciudad usando `arrayFilters` anidados |
| `DELETE` | `/ciudades/:id/:nombreregion/:nombreciudad` | `/api/paises/:id/regiones/:region/ciudades/:nombreCiudad` | Elimina una ciudad usando `$pull` |

---

## 🧪 Ejemplos de Peticiones (Postman / cURL)

### Agregar País
```http
POST http://localhost:3030/paises/agregar
Content-Type: application/json

{
  "id": 999,
  "nombre": "Chechenia",
  "continente": "ASIA",
  "tipoRegion": "DISTRITO",
  "codigoAlfa2": "CH",
  "codigoAlfa3": "CHE"
}
```

### Agregar Región
```http
POST http://localhost:3030/regiones/agregar/170
Content-Type: application/json

{
  "nombre": "Magdalena Medio",
  "area": 0,
  "poblacion": 0
}
```

### Agregar Ciudad
```http
POST http://localhost:3030/ciudades/agregar/124/Yukon Territory
Content-Type: application/json

{
  "codigo": "867",
  "nombre": "Whitehorse",
  "capitalRegion": true,
  "capitalPais": false
}
```

### Modificar Ciudad
```http
POST http://localhost:3030/ciudades/modificar/76/Acre
Content-Type: application/json

{
  "nombre": "Cruzeiro do Sul",
  "capitalRegion": false,
  "capitalPais": true
}
```

### Eliminar Ciudad
```http
DELETE http://localhost:3030/ciudades/68/Beni/Trinidad
```
