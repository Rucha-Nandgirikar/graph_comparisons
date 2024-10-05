const mysql = require('mysql2/promise');
require("dotenv").config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}

async function query(sql) {
    const connection = await mysql.createConnection(config);
    try {
        const [results] = await connection.execute(sql);
        return results;
    } finally {
        await connection.end(); // Ensure the connection is closed
    }
}
  
module.exports = {
    query
}