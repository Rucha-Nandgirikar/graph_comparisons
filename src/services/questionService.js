const Question = require('../models/Question');
const Graph = require('../models/Graph');
const User = require('../models/User');
const graphOrdersJSON = require('../../graphPresentationOrder.json');
const questionOrdersJSON = require('../../questionPresentationOrder.json')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

            const graphOrder = graphOrdersJSON["graphOrders"][currUser.testOrderId]
            let questions = []
            
            for(let i=0; i<graphOrder.length; i++) {
                const currGraphId = graphOrder[i];
                const graphQuestionOrders = (userId % 2 == 1)? 
                    questionOrdersJSON["questionOrders"][currGraphId]["firstOrder"] : 
                    questionOrdersJSON["questionOrders"][currGraphId]["secondOrder"];

                const graphQuestionOrderLength = graphQuestionOrders["graph"].length;
                const dataQuestionOrderLength = graphQuestionOrders["data"].length;
                const subjectiveQuestionOrderLength = graphQuestionOrders["subjective"].length;

                const graphQuestionOrder = graphQuestionOrders["graph"][(userId - 1) % graphQuestionOrderLength];
                const dataQuestionOrder = graphQuestionOrders["data"][(userId - 1) % dataQuestionOrderLength];
                const subjectiveQuestionOrder = graphQuestionOrders["subjective"][(userId - 1) % subjectiveQuestionOrderLength];

                const questionOrder = [].concat(dataQuestionOrder, subjectiveQuestionOrder, graphQuestionOrder);
            
                const questionSet = await Question.findAll({
                    where: {
                        question_id: {
                            [Op.in]: questionOrder
                        }
                    }
                });

                const orderedQuestionSet = questionSet.sort((a, b) => {
                    return questionOrder.indexOf(a.question_id) - questionOrder.indexOf(b.question_id);
                });

                console.log(orderedQuestionSet);

                const currGraph = await Graph.findOne({
                    where: {
                        graph_id: currGraphId
                    }
                })
                
                const orderedQuestionSetWithGraph = orderedQuestionSet.map(question => ({
                    ...question.toJSON(),
                    graph_url: currGraph.graph_url,
                    graph_id: currGraphId
                }));
                
                questions = questions.concat(orderedQuestionSetWithGraph);
            }

            const formattedQuestions = questions.map(question => {
                return {
                    question_id: question.question_id,
                    question_name: question.question_name,
                    question_text: question.question_text,
                    options: question.options,
                    correct_ans: question.correct_ans,
                    question_type: question.question_type,
                    answer_type: question.answer_type,
                    graph_url: question.graph_url,
                    graph_id: question.graph_id,
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
