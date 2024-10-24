const mysql = require("mysql2/promise"); // Use promise-based MySQL library
const sequelize = require('./src/config/db'); // Your sequelize instance
const Question = require('./src/models/Question');
const UserInteraction = require('./src/models/UserInteraction');
const PreStudyResponse = require('./src/models/PrestudyResponse');
const MainStudyResponse = require('./src/models/MainstudyResponse');
const User = require('./src/models/User') 
const Graph = require('./src/models/Graph');
const questions = require('./questions.json'); 
require("dotenv").config();

async function setupDatabase() {
    const con = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    try {
        console.log("Connected to MySQL server");

        const dbExistsSQL = `SHOW DATABASES LIKE ?`;
        
        const [results] = await con.query(dbExistsSQL, [process.env.DB_NAME]);

        if (results.length === 0) {
            // Database doesn't exist, create it
            const createDatabaseSQL = 
                `CREATE DATABASE ${process.env.DB_NAME} CHARACTER SET utf8 COLLATE utf8_general_ci`;
            
            await con.query(createDatabaseSQL);
            console.log("Database created successfully");
        } else {
            console.log("Database already exists");
        }

        // After creating or confirming database existence, sync models and insert data
        await syncDatabase();
        await insertData();

    } catch (error) {
        console.error("Error during database setup:", error);
    } finally {
        await con.end();
        console.log("MySQL connection closed.");
    }

    
}

async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log("Database synchronized successfully.");
    } catch (error) {
        console.error("Error synchronizing the database:", error);
    }
}

async function insertData() {
  try {
      // Check if the graphs already exist
      const existingGraphs = await Graph.findAll({
          where: {
              graph_name: [
                  'my-equity-gap',
                  'student-progress-units',
                  'goal-trajectories',
                  'what-paths-do-they-follow',
                  'csu-by-the-numbers/enrolling-and-graduating'
              ]
          }
      });

      // If no graphs exist, insert them
      if (existingGraphs.length === 0) {
          await Graph.bulkCreate([
              { graph_name: 'my-equity-gap', graph_url: 'https://studentresearch.dashboards.calstate.edu/equity-gaps/my-equity-gaps' },
              { graph_name: 'student-progress-units', graph_url: 'https://studentresearch.dashboards.calstate.edu/faculty-dashboard/student-progress-units' },
              { graph_name: 'goal-trajectories', graph_url: 'https://studentresearch.dashboards.calstate.edu/graduation-initiative/goal-trajectories' },
              { graph_name: 'what-paths-do-they-follow', graph_url: 'https://studentresearch.dashboards.calstate.edu/faculty-dashboard/what-paths-do-they-follow' },
              { graph_name: 'csu-by-the-numbers/enrolling-and-graduating', graph_url: 'https://studentresearch.dashboards.calstate.edu/csu-by-the-numbers/enrolling-and-graduating' }
          ]);
          console.log("Data inserted into Graphs successfully.");
      } else {
          console.log("Graphs already exist, skipping insert.");
      }

      // Check if the questions already exist
      const graph_questions = questions["graph_questions"];
      const questionNames = graph_questions.map(q => q.question_text);
      const existingQuestions = await Question.findAll({
          where: {
              question_text: questionNames
          }
      });

      // If no questions exist, insert them
      if (existingQuestions.length === 0) {
          const questionsToInsert = graph_questions.map(question => ({
              question_text: question.question_text,
              options: question.options,
              correct_ans: question.correct_ans,
              question_type: question.question_type,
              answer_type: question.answer_type,
              graph_type: question.graph_type,
              graph_id: question.graph_id,
              url_params: question.url_params
          }));
          await Question.bulkCreate(questionsToInsert);
          console.log("Data inserted into TestQuestion successfully.");
      } else {
          console.log("Questions already exist, skipping insert.");
      }
  } catch (error) {
      console.error("Error inserting data:", error);
  }
}


// Call the setupDatabase function
setupDatabase();
