const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env


// STANDARD AND NON STANDARD GRAPH COMPARISON DB CONFIGURATION
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    logging: false,
});

module.exports = sequelize;
