const Question = require('../models/Question');
const Graph = require('../models/Graph');
const User = require('../models/User');
const graphOrdersJSON = require('../../graphPresentationOrder.json');

/**
 *  Question Service is in charge of returning main study questions stored in questions database   
 */ 
class QuestionService {

    // Get all questions with associated graph_url in Graph table, with sorted order from specified order id
    async getAllQuestions(userId) {
        try {
            const currUser = await User.findOne({
                where: {
                    userId: userId
                }
            })

            const order = graphOrdersJSON["graphOrders"][currUser.testOrderId]
            let questions = []
            
            for(let i=0; i<order.length; i++) {
                const currGraphId = order[i];
            
                const questionSet = await Question.findAll({
                    include: [{
                        model: Graph,
                        attributes: ['graph_url'] 
                    }],
                    where: {
                        graph_id: currGraphId
                    }
                });

                questions = questions.concat(questionSet);
            }
    

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
