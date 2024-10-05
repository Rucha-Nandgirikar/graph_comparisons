const mysql = require("mysql2");
require("dotenv").config();
const questions = require('./questions.json');

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

con.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL server");


  /* Define SQL Queries */

  const createGraphsTable = `
    CREATE TABLE IF NOT EXISTS test_graphs (
        graph_id INT PRIMARY KEY AUTO_INCREMENT,
        graph_name VARCHAR(255),
        graph_url VARCHAR(255) NOT NULL
    )
    `;
  const createQuestionsTable = `
    CREATE TABLE IF NOT EXISTS test_questions (
      question_id INT PRIMARY KEY AUTO_INCREMENT,
      question_text VARCHAR(255) NOT NULL,
      options JSON NOT NULL,
      correct_ans VARCHAR(255) NOT NULL,
      question_type VARCHAR(30),
      graph_type VARCHAR(30),
      graph_id INT,
      url_params VARCHAR(700)
    )
  `;
  const createResponsesTable = `
      CREATE TABLE IF NOT EXISTS test_responses (
          response_id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT,
          question_id INT,
          user_response VARCHAR(255),
          is_correct BOOLEAN NOT NULL,
          timestamp DATETIME
      )
`;
  const createMasterTable = `
    CREATE TABLE IF NOT EXISTS master_table (
        user_id VARCHAR(10) NOT NULL,
        button_name VARCHAR(100),
        question_id INT,
        question_text VARCHAR(700),
        user_answer VARCHAR(255),
        timestamp DATETIME
)
`;
  const createPrestudyResponsesTable = `
      CREATE TABLE IF NOT EXISTS prestudy_responses (
        user_id VARCHAR(10) NOT NULL,
        question_text VARCHAR(700),
        user_answer VARCHAR(255),
        timestamp VARCHAR(40))
`;
  const insertDataIntoGraphsTable = `
            INSERT INTO test_graphs (graph_name, graph_url) VALUES 
            ('my-equity-gap', 'https://studentresearch.dashboards.calstate.edu/equity-gaps/my-equity-gaps'),
            ('student-progress-units', 'https://studentresearch.dashboards.calstate.edu/faculty-dashboard/student-progress-units'),
            ('goal-trajectories', 'https://studentresearch.dashboards.calstate.edu/graduation-initiative/goal-trajectories'),
            ('what-paths-do-they-follow', 'https://studentresearch.dashboards.calstate.edu/faculty-dashboard/what-paths-do-they-follow'),
            ('csu-by-the-numbers/enrolling-and-graduating', 'https://studentresearch.dashboards.calstate.edu/csu-by-the-numbers/enrolling-and-graduating ')`;
  
  const graph_questions = questions["graph_questions"];
  const graph_questions_sqlQuery = generateSQLFromJSON(graph_questions);

  const insertDataIntoQuestionsTable = graph_questions_sqlQuery


  /* Execute SQL Queries */

  con.query(createGraphsTable, (err) => {
    if (err) {
      console.error("Error creating master_table:", err);
    } else {
      console.log("graphs table created successfully");
    }
  });

  con.query(createMasterTable, (err) => {
    if (err) {
      console.error("Error creating master_table:", err);
    } else {
      console.log("master table created successfully");
    }
  });

  con.query(createResponsesTable, (err) => {
    if (err) {
      console.error("Error creating master_table:", err);
    } else {
      console.log("responses table created successfully");
    }
  });

  con.query(createPrestudyResponsesTable, (err) => {
    if (err) {
      console.error("Error creating poststudy_questions table:", err);
    } else {
      console.log("prestudy_questions table created successfully");
    }
  });

  con.query(createQuestionsTable, (err) => {
    if (err) {
      console.error("Error creating test_questions table:", err);
    } else {
      console.log("questions table created successfully");
    }
  });

  // insert data after creating the table
  con.query(insertDataIntoQuestionsTable, (err) => {
    if (err) {
      console.error("Error inserting data into test_questions table:", err);
    } else {
      console.log("Data inserted into questions table successfully");
    }
  });

  con.query(insertDataIntoGraphsTable, (err) => {
    if (err) {
      console.error("Error inserting data into test_questions table:", err);
    } else {
      console.log("Data inserted into graphs table successfully");
    }
  });

  // Close the connection
  con.end((error) => {
    if (error) {
      console.error("Error closing MySQL connection:", error);
      return;
    }
    console.log("MySQL connection closed.");
  });

});

/**
 * Helper function for converting test questions from question.json to sql syntax 
 * */ 
function generateSQLFromJSON(questions) {
  let query = `INSERT INTO test_questions (question_text, options, correct_ans, question_type, graph_type, graph_id, url_params) VALUES `
  
  questions.forEach((question, idx, array) => {
    const { question_text, options, correct_ans, question_type, graph_type, graph_id, url_params } = question;
    
    const optionsSQL = `JSON_ARRAY(${options.map(opt => `'${opt}'`).join(", ")})`;
    const urlParamsSQL = `JSON_OBJECT(${Object.entries(url_params).map(([key, value]) => `'${key}', '${value}'`).join(", ")})`;
    
    query += `
      (
        '${question_text}',
        ${optionsSQL},
        '${correct_ans}',
        '${question_type}',
        '${graph_type}',
        ${graph_id},
        ${urlParamsSQL}
      )`;

    if(idx !== array.length - 1) {
      query += `,`
    }

  });

  query += `;`
  return query;
}