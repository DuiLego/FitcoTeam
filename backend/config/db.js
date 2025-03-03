const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql', 
    port: 3306, 
    logging: false,
    define: {
        timestamps: false
    }
});

const connectDB = async () => {
    try{
        await db.authenticate();
        await console.log(`Base de datos conectada`);
    } catch(error){
        await console.log(`Error en conexión a base de datos: ${error}`);
    }
}

module.exports = {
    db, 
    connectDB
};