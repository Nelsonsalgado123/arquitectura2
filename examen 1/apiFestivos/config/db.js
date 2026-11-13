const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const host = process.env.DB_HOST || '127.0.0.1';
        const port = process.env.DB_PORT || '27017';
        const dbName = process.env.DB_NAME || 'festivos_db';
        const uri = process.env.MONGO_URI || `mongodb://${host}:${port}/${dbName}`;

        await mongoose.connect(uri);
        console.log(`MongoDB conectado exitosamente a ${uri}`);
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
