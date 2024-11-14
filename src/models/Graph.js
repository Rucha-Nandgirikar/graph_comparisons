// models/Graph.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Graph = sequelize.define('Graph', {
    graph_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    graph_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    graph_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    graph_type: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'graphs',
    timestamps: true
});

module.exports = Graph;
