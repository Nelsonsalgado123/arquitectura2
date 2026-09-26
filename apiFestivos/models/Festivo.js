const mongoose = require('mongoose');

const festivoSchema = new mongoose.Schema({
    dia: {
        type: Number,
        required: false
    },
    mes: {
        type: Number,
        required: false
    },
    nombre: {
        type: String,
        required: true
    },
    diasPascua: {
        type: Number,
        required: false
    },
    idTipo: {
        type: Number, // 1: Fijo, 2: Ley Puente, 3: Basado Pascua, 4: Pascua + Puente
        required: true
    }
});

module.exports = mongoose.model('Festivo', festivoSchema);
