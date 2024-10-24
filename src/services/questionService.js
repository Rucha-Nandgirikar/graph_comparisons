const Question = require('../models/Question'); // Adjust the path as necessary

/**
 *  Question Service is in charge of returning main study questions stored in questions database   
 */ 
class QuestionService {

    // Get all questions
    async getAllQuestions() {
        try {
            const questions = await Question.findAll();
            return questions;
        } catch (error) {
            console.error("Error fetching questions:", error);
            throw error; // Rethrow the error to be handled by the caller
        }
    }
    
}

module.exports = new QuestionService();
