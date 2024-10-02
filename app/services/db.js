const mysql = require('mysql2');
const config = require('../config/databaseConfig.js');

async function query(sql, params) {
    const connection = await mysql.createConnection(config.db);
    const [results, ] = await connection.execute(sql, params);
  
    return results;
}
  
module.exports = {
    query
}