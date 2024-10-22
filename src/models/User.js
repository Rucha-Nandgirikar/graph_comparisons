const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path as necessary

class User extends Model {}

User.init({
    userId: {
        type: DataTypes.INTEGER, 
        primaryKey: true,       
        autoIncrement: true,     
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users', 
    timestamps: true    
});

module.exports = User;
