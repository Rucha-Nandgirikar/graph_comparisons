const standardAndNonStandardGraphsService = require('../services/standardAndNonStandardGraphComparisonService');
const questionService = require('../services/questionService'); 
const userService = require('../services/userService');
const responseService = require('../services/responseService'); // Include the ResponseService

class StandardAndNonStandardGraphComparisonController {
    
    // Method to create a new user
    async createUser(req, res) {
        try {
            const user = await userService.createUser();
            return res.status(201).json(user);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Method to get a user by ID
    async getUserById(req, res) {
        const userId = req.params.id; // Assuming the user ID is passed as a URL parameter
        try {
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Method to get all questions
    async getAllQuestions(req, res) {
        try {
            const questions = await questionService.getAllQuestions();
            return res.status(200).json(questions);
        } catch (error) {
            console.error("Error fetching questions:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Method to add a main study response
    async addMainStudyResponse(req, res) {
        const responseData = req.body; // Assuming response data is sent in the request body
        try {
            const response = await responseService.addMainStudyResponse(responseData);
            return res.status(201).json(response);
        } catch (error) {
            console.error("Error adding main study response:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Method to add a pre-study response
    async addPreStudyResponse(req, res) {
        const responseData = req.body; // Assuming response data is sent in the request body
        try {
            const response = await responseService.addPreStudyResponse(responseData);
            return res.status(201).json(response);
        } catch (error) {
            console.error("Error adding pre study response:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Method to add a user interaction
    async addUserInteraction(req, res) {
        const interactionData = req.body; // Assuming interaction data is sent in the request body
        try {
            const interaction = await responseService.addUserInteraction(interactionData);
            return res.status(201).json(interaction);
        } catch (error) {
            console.error("Error adding user interaction:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = new StandardAndNonStandardGraphComparisonController();
