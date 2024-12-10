// src/services/userService.js
const User = require('../models/User'); // Adjust the path as necessary
const graphOrdersJSON = require('../../graphPresentationOrder.json');
require("dotenv").config();

/**
 * User Service is in charge of creating new users and updating user data (age, major)
 */
class UserService {
    // Create a new user and sets testOrderId
    async createUser() {
        try {
            const MAX_ORDERS = graphOrdersJSON["graphOrders"].length;
            let prevId;

            const user = await User.findOne({
                order: [ [ 'createdAt', 'DESC' ]],
            });

            if (user === null){
                prevId = 0;
            } else {
                prevId = user.testOrderId;
            }

            const localDbId = process.env.LOCAL_DB_ID;
            console.log(localDbId);
            const nextId = (prevId === null || prevId === undefined) ? 0 : (prevId + 1) % MAX_ORDERS;

            const newUser = await User.create({testOrderId: nextId, localDbId: localDbId});
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