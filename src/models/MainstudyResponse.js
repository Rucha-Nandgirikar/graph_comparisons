// models/MainStudyResponse.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Your database configuration

const MainStudyResponse = sequelize.define('MainStudyResponse', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    graphId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    questionOrderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    questionName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    question: {
        type: DataTypes.STRING(100), // Limit question text length to 100 characters
        allowNull: false
    },
    userAnswer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    tableName: 'mainstudy_responses',
    timestamps: true // Enables Sequelize's automatic timestamps (createdAt, updatedAt)
});

module.exports = MainStudyResponse;