const mysql = require('mysql2/promise');
const config = require('../config/databaseConfig');

async function query(sql) {
    const connection = await mysql.createConnection(config.db);
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