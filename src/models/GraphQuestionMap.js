// models/GraphQuestionMap.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GraphQuestionMap = sequelize.define('GraphQuestionMap', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    graph_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'graph_question_map',
    timestamps: false
});

module.exports = GraphQuestionMap;
