const Festivo = require('../models/Festivo');

const obtenerDomingoPascua = (año) => {
    const a = año % 19;
    const b = año % 4;
    const c = año % 7;
    const d = (19 * a + 24) % 30;
    const dias = d + ((2 * b) + (4 * c) + (6 * d) + 5) % 7;
    
    // Domingo de Pascua es 22 de marzo + dias (15 marzo + 7 días)
    const fechaPascua = new Date(año, 2, 22 + dias); // Mes 2 es Marzo
    return fechaPascua;
};

const moverASiguienteLunes = (fecha) => {
    const day = fecha.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    if (day !== 1) { // Si no es lunes
        let diff = (8 - day) % 7;
        if (diff === 0) diff = 7; // Manejo para que el domingo se mueva 1 día (8-0%7 = 1) - wait, (8-0)%7 = 1. So it's fine.
        fecha.setDate(fecha.getDate() + diff);
    }
    return fecha;
};

const calcularFechaFestivo = (festivo, año) => {
    let fecha = null;

    if (festivo.idTipo === 1 || festivo.idTipo === 2) {
        // Tipos 1 y 2 tienen día y mes fijos en la BD
        // Ojo: en JS los meses van de 0 a 11, pero en la BD guardaremos de 1 a 12
        fecha = new Date(año, festivo.mes - 1, festivo.dia);
    } else if (festivo.idTipo === 3 || festivo.idTipo === 4) {
        // Tipos 3 y 4 se basan en la Pascua
        const pascua = obtenerDomingoPascua(año);
        fecha = new Date(pascua);
        fecha.setDate(pascua.getDate() + festivo.diasPascua);
    }

    // Aplicar Ley de Puente (trasladar a Lunes) si es tipo 2 o 4
    if (festivo.idTipo === 2 || festivo.idTipo === 4) {
        fecha = moverASiguienteLunes(fecha);
    }

    return fecha;
};

exports.verificarFestivo = async (req, res) => {
    try {
        const { year, month, day } = req.params;
        const año = parseInt(year);
        const mes = parseInt(month) - 1; // En JS el mes es 0-11
        const dia = parseInt(day);

        // Validar fecha ingresada
        const fechaConsulta = new Date(año, mes, dia);
        if (fechaConsulta.getFullYear() !== año || fechaConsulta.getMonth() !== mes || fechaConsulta.getDate() !== dia) {
            return res.send("Fecha No valida"); // Según PDF
        }

        // Traer todos los festivos configurados en la BD
        const festivosConfig = await Festivo.find({});
        
        // Calcular fechas para el año dado y comparar
        for (let festivo of festivosConfig) {
            const fechaCalculada = calcularFechaFestivo(festivo, año);
            
            if (fechaCalculada.getTime() === fechaConsulta.getTime()) {
                return res.status(200).send("Es Festivo");
            }
        }

        return res.status(200).send("No es festivo");
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: "Error al verificar festivo", error });
    }
};

exports.obtenerFestivosPorAno = async (req, res) => {
    try {
        const { year } = req.params;
        const año = parseInt(year);
        
        const festivosConfig = await Festivo.find({});
        const listaFestivos = [];

        for (let festivo of festivosConfig) {
            const fechaCalculada = calcularFechaFestivo(festivo, año);
            // Formatear a YYYY-MM-DD
            const yyyy = fechaCalculada.getFullYear();
            const mm = String(fechaCalculada.getMonth() + 1).padStart(2, '0');
            const dd = String(fechaCalculada.getDate()).padStart(2, '0');
            
            listaFestivos.push({
                festivo: festivo.nombre,
                fecha: `${yyyy}-${mm}-${dd}`
            });
        }

        // Ordenar lista por fecha
        listaFestivos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        return res.status(200).json(listaFestivos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: "Error al obtener festivos", error });
    }
};

// Utilidad para inicializar la BD con los datos del taller
exports.poblarBaseDatos = async (req, res) => {
    try {
        const count = await Festivo.countDocuments();
        if (count > 0) return res.status(200).json({ mensaje: "BD ya tiene datos" });

        const data = [
            // Tipo 1: Fijo
            { dia: 1, mes: 1, nombre: "Año nuevo", idTipo: 1 },
            { dia: 1, mes: 5, nombre: "Día del Trabajo", idTipo: 1 },
            { dia: 20, mes: 7, nombre: "Independencia Colombia", idTipo: 1 },
            { dia: 7, mes: 8, nombre: "Batalla de Boyacá", idTipo: 1 },
            { dia: 8, mes: 12, nombre: "Inmaculada Concepción", idTipo: 1 },
            { dia: 25, mes: 12, nombre: "Navidad", idTipo: 1 },
            // Tipo 2: Ley de Puente
            { dia: 6, mes: 1, nombre: "Santos Reyes", idTipo: 2 },
            { dia: 19, mes: 3, nombre: "San José", idTipo: 2 },
            { dia: 29, mes: 6, nombre: "San Pedro y San Pablo", idTipo: 2 },
            { dia: 15, mes: 8, nombre: "Asunción de la Virgen", idTipo: 2 },
            { dia: 12, mes: 10, nombre: "Día de la Raza", idTipo: 2 },
            { dia: 1, mes: 11, nombre: "Todos los santos", idTipo: 2 },
            { dia: 11, mes: 11, nombre: "Independencia de Cartagena", idTipo: 2 },
            // Tipo 3: Basado en Pascua
            { nombre: "Jueves Santo", diasPascua: -3, idTipo: 3 },
            { nombre: "Viernes Santo", diasPascua: -2, idTipo: 3 },
            { nombre: "Domingo de Pascua", diasPascua: 0, idTipo: 3 },
            // Tipo 4: Pascua + Puente
            { nombre: "Ascensión del Señor", diasPascua: 40, idTipo: 4 },
            { nombre: "Corpus Christi", diasPascua: 61, idTipo: 4 },
            { nombre: "Sagrado Corazón de Jesús", diasPascua: 68, idTipo: 4 }
        ];

        await Festivo.insertMany(data);
        return res.status(201).json({ mensaje: "Datos poblados correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: "Error poblando BD", error });
    }
};
