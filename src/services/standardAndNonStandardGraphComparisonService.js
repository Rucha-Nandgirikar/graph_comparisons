const { query } = require('../config/db');

// TODO (Rucha?): Create function to return most recent user_id from database


async function insertDataIntoMasterTable(userId, button, questionId, question, userAnswer, timestamp) {
    const userIdQuery = userId !== null ? `${userId}`: null;
    const buttonQuery = button !== null  ? `'${button}'`: null;
    const questionIdQuery = questionId !== null ? `${questionId}`: null;
    const questionQuery = question !== null ? `'${question}'`: null;
    const userAnswerQuery = userAnswer !== null ? `'${userAnswer}'`: null;
    const timestampQuery = timestamp !== null ? `'${timestamp}'`: null;

    const response = await query(
        `INSERT INTO master_table (user_id, button_name, question_id, question_text, user_answer, timestamp) VALUES (${userIdQuery}, ${buttonQuery}, ${questionIdQuery}, ${questionQuery}, ${userAnswerQuery}, ${timestampQuery})`
    );

    return response;
}

async function insertPrestudyResponseIntoDatabase(userId, question, userAnswer, timestamp) {
    const userIdQuery = userId !== null ? `${userId}`: null;
    const questionQuery = question !== null ? `'${question}'`: null;
    const userAnswerQuery = userAnswer !== null ? `'${userAnswer}'`: null;
    const timestampQuery = timestamp !== null ? `'${timestamp}'`: null;

    const response = await query(
        `INSERT INTO prestudy_responses (user_id, question_text, user_answer, timestamp) VALUES (${userIdQuery}, ${questionQuery}, ${userAnswerQuery}, ${timestampQuery})`
    );

    return response;
}

async function fetchAllTestQuestionsFromDatabase() {
    const response = await query(
        `SELECT questions.question_id, questions.question_text, questions.options, questions.correct_ans, questions.question_type, questions.graph_type, questions.url_params, questions.graph_id, graphs.graph_name, graphs.graph_url FROM test_questions questions INNER JOIN test_graphs graphs ON questions.graph_id = graphs.graph_id`
    );

    return response[0];
}

// async function insertResponseIntoDatabase(userId, questionId, userAnswer, isCorrect, timestamp) {
//     const userIdQuery = userId !== null ? `${userId}`: null;
//     const questionIdQuery = questionId !== null ? `'${questionId}'`: null;
//     const userAnswerQuery = userAnswer !== null ? `'${userAnswer}'`: null;
//     const isCorrectQuery = isCorrect !== null ? `${isCorrect}` : null;
//     const timestampQuery = timestamp !== null ? `'${timestamp}'`: null;

//     const response = await query(
//         `INSERT INTO test_responses (user_id, question_id, user_response, is_correct, timestamp) VALUES (${userIdQuery}, ${questionIdQuery}, ${userAnswerQuery}, ${isCorrectQuery}, ${timestampQuery})`
//     );

//     return response;
// }

// insertDataIntoMasterTable,
//     insertPrestudyResponseIntoDatabase,
//     fetchEntireTableFromDatabase,
//     insertResponseIntoDatabase,

module.exports = {
    insertDataIntoMasterTable,
    insertPrestudyResponseIntoDatabase,
    fetchAllTestQuestionsFromDatabase,
}