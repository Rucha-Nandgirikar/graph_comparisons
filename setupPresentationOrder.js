const FileSystem = require("fs");
const Graph = require('./src/models/Graph');
const Question = require('./src/models/Question');
const Sequelize = require('sequelize');
const GraphQuestionMap = require("./src/models/GraphQuestionMap");
const Op = Sequelize.Op;

const graphFileName = 'graphPresentationOrder.json';
const questionFileName = 'questionPresentationOrder.json';
const MAX_ORDERS = 50;

// Number of questions for each questions type
const MAX_NUM_GRAPH_QUESTIONS = 2
const MAX_NUM_DATA_QUESTIONS = 3
const MAX_NUM_SUBJECTIVE_QUESTIONS = 2

/* https://jsonformatter.org/ */

async function setUpGraphOrder() {
    // get max number of graphs
    const graphIds = await Graph.findAll({
        attributes: ['graph_id']  // Only select the graph_id field
    });

    // create specified num of random combinations of graph ids for order.json
    const orders = [];
    const arr = graphIds.map(graph => graph.graph_id);

    for (let i=0; i<MAX_ORDERS; i++) {
        let order = shuffledCopy(arr);

        while(orders.includes(order)) {
            order = shuffledCopy(arr);
        }
        
        orders.push(order)
    }
    
    const content = {"graphOrders": orders};
    
    FileSystem.writeFile(graphFileName, JSON.stringify(content), { flag: 'wx' }, (error) => {
        if (error) console.log("Graph order already exists, preventing data overide");
        else console.log("Graph order created and written to graphPresentationOrder.json")
    });
}

async function setUpQuestionOrder() {
    const graphIds = await Graph.findAll({
        attributes: ['graph_id']  
    });
    const ids = graphIds.map(graph => graph.graph_id);

    const questionOrders = {}
    
    for(const i of ids) {
        questionOrders[i] = {} // for q-types

        // get number of questions for each graph from mappings table
        const mappings = await GraphQuestionMap.findAll({
            where: {
                graph_id: i,
            }
        })
        const questionIds = mappings.map(map => map.question_id)

        const graph_questions = await Question.findAll({
            attributes: ['question_id'], 
            where: {
                question_id: {
                    [Op.in]: questionIds
                },
                question_type: "graph"
            },
        })

        const data_questions = await Question.findAll({
            attributes: ['question_id'], 
            where: {
                question_id: {
                    [Op.in]: questionIds
                },
                question_type: "data"
            }
        })

        const subjective_questions = await Question.findAll({
            attributes: ['question_id'], 
            where: {
                question_id: {
                    [Op.in]: questionIds
                },
                question_type: "subjective"
            }
        }) 

        if(graph_questions) {
            let graph_questions_ids = graph_questions.map(question => question.question_id); 
            const orders = []
            const num_questions = graph_questions_ids.length
            
            for(let j=0; j<num_questions; j++) {
                const limited_questions = graph_questions_ids.slice(0, MAX_NUM_GRAPH_QUESTIONS);
                const remaining_questions = graph_questions_ids.slice(MAX_NUM_GRAPH_QUESTIONS, num_questions)
                graph_questions_ids = remaining_questions.concat(limited_questions)
                
                let order = shuffledCopy(limited_questions);
                while (orders.some(existingOrder => arraysEqual(existingOrder, order))) {
                    order = shuffledCopy(limited_questions);
                }
                
                orders.push(order)
            }

            questionOrders[i]['graph'] = orders;
        }

        if(data_questions) {
            let data_questions_ids = data_questions.map(question => question.question_id); 
            const orders = []
            const num_questions = data_questions_ids.length
            
            for(let j=0; j<num_questions; j++) {
                const limited_questions = data_questions_ids.slice(0, MAX_NUM_DATA_QUESTIONS);
                const remaining_questions = data_questions_ids.slice(MAX_NUM_DATA_QUESTIONS, num_questions)
                data_questions_ids = remaining_questions.concat(limited_questions)
                
                let order = shuffledCopy(limited_questions);
                while (orders.some(existingOrder => arraysEqual(existingOrder, order))) {
                    order = shuffledCopy(limited_questions);
                }
                
                orders.push(order)
            }

            questionOrders[i]['data'] = orders;
        }

        if(subjective_questions) {
            let subjective_questions_ids = subjective_questions.map(question => question.question_id); 
            const orders = []
            const num_questions = subjective_questions_ids.length
            
            for(let j=0; j<num_questions; j++) {
                const limited_questions = subjective_questions_ids.slice(0, MAX_NUM_SUBJECTIVE_QUESTIONS);
                const remaining_questions = subjective_questions_ids.slice(MAX_NUM_SUBJECTIVE_QUESTIONS, num_questions)
                subjective_questions_ids = remaining_questions.concat(limited_questions)
                
                let order = shuffledCopy(limited_questions);
                while (orders.some(existingOrder => arraysEqual(existingOrder, order))) {
                    order = shuffledCopy(limited_questions);
                }
                
                orders.push(order)
            }

            questionOrders[i]['subjective'] = orders;
        }
    }
    
    // insert orders into presentation orders "questionOrders" into orders.json
    const content = {"questionOrders": questionOrders};
    FileSystem.writeFile(questionFileName, JSON.stringify(content), { flag: 'wx' }, (error) => {
        if (error) console.log("Question order already exists, preventing data overide");
        else console.log("Question order created and written to questionPresentationOrder.json")
    });

}

function shuffledCopy(org_arr) {
    const array = [...org_arr];

    let currentIndex = array.length;
  
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
}

setUpGraphOrder()
setUpQuestionOrder()