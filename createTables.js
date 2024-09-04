const mysql = require("mysql2");
require("dotenv").config();

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
            INSERT INTO test_graphs (graph_name, graph_url) 
            VALUES ('my-equity-gap', 'https://studentresearch.dashboards.calstate.edu/equity-gaps/my-equity-gaps')`;

  const insertDataIntoQuestionsTable = `
          INSERT INTO test_questions (question_text, options, correct_ans, question_type, graph_type, graph_id, url_params) VALUES
          ('Each grad cap is equal to how many students?', JSON_ARRAY('1 student', '100 students', '10 students', 'Not specified'), '10 students', 'graph', 'csu', 1, 
            JSON_OBJECT('campus', 'Bakersfield', 'college', 'School of Arts & Humanities', 'major', '*All Majors', 'student_type', 'freshmen', 'student_type_name', 'Freshmen', 'cohort', 2019, 'persistence', 1, 'year1', 4, 'year2', 6, 'outcome', '6th-Year Graduation', 'gap_type', 'firstgen')),
          ('In the provided graph, what does the yellow line signify?', JSON_ARRAY('Recent First-Generation Rate', 'Recent Not First-Generation Rate', 'Recent Not Pell Rate', 'Recent Not URM Rate'), 'Recent Not First-Generation Rate', 'graph', 'csu', 1, 
            JSON_OBJECT('campus', 'Bakersfield', 'college', 'School of Arts & Humanities', 'major', '*All Majors', 'student_type', 'freshmen', 'student_type_name', 'Freshmen', 'cohort', 2019, 'persistence', 1, 'year1', 4, 'year2', 6, 'outcome', '6th-Year Graduation', 'gap_type', 'firstgen')),
          ('The purple grad caps indicate that the students are first-generation.', JSON_ARRAY('True','False'), 'True', 'graph', 'csu', 1, 
            JSON_OBJECT('campus', 'Bakersfield', 'college', 'School of Arts & Humanities', 'major', '*All Majors', 'student_type', 'freshmen', 'student_type_name', 'Freshmen', 'cohort', 2019, 'persistence', 1, 'year1', 4, 'year2', 6, 'outcome', '6th-Year Graduation', 'gap_type', 'firstgen')),
          ('How many criminal justice students contributed to the graph?', JSON_ARRAY(10, 12, 15, 19), 19, 'data', 'csu', 1, 
            JSON_OBJECT('campus', 'Bakersfield', 'college', 'School of Arts & Humanities', 'major', 'Criminal Justice', 'student_type', 'all', 'student_type_name', 'All Students', 'cohort', 2019, 'persistence', 1, 'year1', 4, 'year2', 6, 'outcome', '6th-Year Graduation', 'gap_type', 'firstgen')),
          ('How many computer engineering students contributed to the graph?', JSON_ARRAY(6, 9, 12, 15), 9, 'data', 'csu', 1, 
            JSON_OBJECT('campus', 'Bakersfield', 'college', 'Engineering', 'major', 'Computer Engineering', 'student_type', 'all', 'student_type_name', 'All Students', 'cohort', 2019, 'persistence', 1, 'year1', 4, 'year2', 6, 'outcome', '6th-Year Graduation', 'gap_type', 'firstgen')),
          ('Which major has the largest gap?', JSON_ARRAY('Criminal Justice', 'Sociology', 'Computer Engineering', 'Political Science'), 'Criminal Justice', 'data', 'csu', 1, 
            JSON_OBJECT('campus', 'Bakersfield', 'college', 'School of Arts & Humanities', 'major', '*All Majors', 'student_type', 'all', 'student_type_name', 'All Students', 'cohort', 2019, 'persistence', 1, 'year1', 4, 'year2', 6, 'outcome', '6th-Year Graduation', 'gap_type', 'firstgen'));`;

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
