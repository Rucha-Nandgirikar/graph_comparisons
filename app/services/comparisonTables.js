const db = require('./db');
const config = require('../config');


// TODO (Rucha?): Create function to return most recent user_id from database


async function insertDataIntoMasterTable(userId, button, questionId, question, userAnswer, timestamp) {
    const response = await db.query(
        `INSERT INTO master_table (user_id, button_name, question_id, question_text, user_answer, timestamp) 
        VALUES (${userId}, ${button}, ${questionId}, ${question}, ${userAnswer}, ${timestamp})`
    );

    return response;
}

async function insertPrestudyResponseIntoDatabase(userId, question, userAnswer, timestamp) {
    const response = await db.query(
        `INSERT INTO prestudy_responses (user_id, question_text, user_answer, timestamp) VALUES (${userId}, ${question}, ${userAnswer}, ${timestamp})`
    );

    return response;
}

async function fetchEntireTableFromDatabase() {
    const response = await db.query(
        `SELECT 
        questions.question_id,
        questions.question_text,
        questions.options,
        questions.correct_ans,
        questions.question_type,
        questions.graph_type,
          questions.url_params,
        questions.graph_id,
        graphs.graph_name,
        graphs.graph_url
      FROM 
        test_questions questions
      INNER JOIN 
        test_graphs graphs ON questions.graph_id = graphs.graph_id`
    );

    return response;
}

async function insertResponseIntoDatabase(userId, questionId, userAnswer, isCorrect, timestamp) {
    const response = await db.query(
        `INSERT INTO test_responses (user_id, question_id, user_response, is_correct, timestamp) VALUES (${userId}, ${questionId}, ${userAnswer}, ${isCorrect}, ${timestamp})`
    );

    return response;
}

module.exports = {
    insertDataIntoMasterTable,
    insertPrestudyResponseIntoDatabase,
    fetchEntireTableFromDatabase,
    insertResponseIntoDatabase,
}