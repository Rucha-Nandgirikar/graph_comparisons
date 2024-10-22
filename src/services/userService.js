// src/services/userService.js
const User = require('../models/User'); // Adjust the path as necessary

class UserService {
    // Create a new user
    async createUser() {
        try {
            const newUser = await User.create({});
            return newUser;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error; // Rethrow the error to be handled by the caller
        }
    }

    // Get a user by ID
    async getUserById(userId) {
        try {
            const user = await User.findByPk(userId);
            return user;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    }

}

module.exports = new UserService();