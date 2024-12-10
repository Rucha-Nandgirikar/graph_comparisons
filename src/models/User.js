const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path as necessary

class User extends Model {}

User.init({
    userId: {
        type: DataTypes.INTEGER, 
        primaryKey: true,       
        autoIncrement: true,     
        allowNull: false
    },
    localDbId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    major: {
        type: DataTypes.STRING,
        allowNull: true
    },
    testOrderId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        defaultValue: 0
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users', 
    timestamps: true    
});

module.exports = User;
