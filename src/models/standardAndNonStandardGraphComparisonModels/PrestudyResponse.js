// models/PreStudyResponse.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 

const PreStudyResponse = sequelize.define('PreStudyResponse', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question: {
        type: DataTypes.STRING(80), 
        allowNull: false
    },
    userAnswer: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    tableName: 'prestudy_responses',
    timestamps: true
});

module.exports = PreStudyResponse;
