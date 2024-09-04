var mysql = require("mysql2");
require("dotenv").config();

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

con.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL server");

  const createDatabaseSQL =
    "CREATE DATABASE IF NOT EXISTS csu_alternate_graph_comparison CHARACTER SET utf8 COLLATE utf8_general_ci";

  con.query(createDatabaseSQL, (err) => {
    if (err) {
      console.error("Error creating database:", err);
    } else {
      console.log("Database created successfully");
    }
  });

  con.end((error) => {
    if (error) {
      console.error("Error closing MySQL connection:", error);
      return;
    }
    console.log("MySQL connection closed.");
  });
});