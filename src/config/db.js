// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables from .env

// Add console logs to verify that environment variables are loaded
// console.log("DB Host:", process.env.DB_HOST);
// console.log("DB User:", process.env.DB_USER);
// console.log("DB Password:", process.env.DB_PASSWORD ? '****' : 'No Password Set'); // Hide password for security
// console.log("DB Name:", process.env.DB_NAME);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
});

module.exports = {
    query: (sql, params) => pool.execute(sql, params),
};
