// models/index.js
const sequelize = require('../config/db');
const Question = require('./Question');
const UserInteraction = require('./UserInteraction');
const PreStudyResponse = require('./PrestudyResponse');
const MainStudyResponse = require('./MainstudyResponse');
const Graph = require('./Graph');
const User = require('./User') 

const initDB = async () => {
    try {
        // Define model relationships
        Graph.hasMany(Question, { foreignKey: 'graph_id', sourceKey: 'graph_id' });
        Question.belongsTo(Graph, { foreignKey: 'graph_id', targetKey: 'graph_id' });

        // Authenticate and sync the database
        await sequelize.authenticate();
        console.log('Connection established successfully.');
        await sequelize.sync({ alter: true }); // Sync all models
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = {
    sequelize,
    Question,
    UserInteraction,
    PreStudyResponse,
    MainStudyResponse,
    Graph,
    User,
    initDB
};
