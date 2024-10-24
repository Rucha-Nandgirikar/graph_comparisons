const Question = require('../models/Question');
const Graph = require('../models/Graph');

/**
 *  Question Service is in charge of returning main study questions stored in questions database   
 */ 
class QuestionService {

    // Get all questions with associated graph_url in Graph table
    async getAllQuestions() {
        try {
            const questions = await Question.findAll({
                include: [{
                    model: Graph,
                    attributes: ['graph_url'] 
                }]
            });
    
            const formattedQuestions = questions.map(question => {
                return {
                    question_id: question.question_id,
                    question_text: question.question_text,
                    options: question.options,
                    correct_ans: question.correct_ans,
                    question_type: question.question_type,
                    answer_type: question.answer_type,
                    graph_id: question.graph_id,
                    graph_url: question.Graph.graph_url
                };
            });
        
            return formattedQuestions;
        } catch (error) {
            console.error("Error fetching questions:", error);
            throw error;
        }
    }
    
}

module.exports = new QuestionService();
