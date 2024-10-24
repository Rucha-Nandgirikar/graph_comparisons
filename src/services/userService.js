// src/services/userService.js
const User = require('../models/User'); // Adjust the path as necessary

/**
 * User Service is in charge of creating new users and updating user data (age, major)
 */
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

    // Update a user's details by ID
    async updateUser(userId, updateData) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error("User not found");
            }

            const updatedUser = await user.update(updateData);
            return updatedUser;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

}

module.exports = new UserService();