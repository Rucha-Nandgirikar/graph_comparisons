// models/UserInteraction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); // Your database configuration

const UserInteraction = sequelize.define('UserInteraction', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    buttonName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    graphId: {
        type: DataTypes.INTEGER,
        allowNull: true // Allow null if not part of the study
    },
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: true // Allow null if not part of the study
    },
    question: {
        type: DataTypes.STRING(80), 
        allowNull: true
    },
    userAnswer: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'user_interactions',
    timestamps: true 
});

module.exports = UserInteraction;
