// models/Question.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Question = sequelize.define('Question', {
    question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    question_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    options: {
        type: DataTypes.JSON, 
        allowNull: true
    },
    correct_ans: {
        type: DataTypes.STRING, 
        allowNull: true
    },
    question_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    answer_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    graph_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'graphs',  
            key: 'graph_id'   
        }
    }, 
    url_params: {
        type: DataTypes.TEXT, // Use TEXT to store the JSON string
        allowNull: true,
        get() {
            // Deserialize JSON string back to an object
            const value = this.getDataValue('url_params');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            // Serialize object to JSON string before saving
            this.setDataValue('url_params', JSON.stringify(value));
        }
    },
}, {
    tableName: 'test_questions',
    timestamps: true
});

module.exports = Question;
