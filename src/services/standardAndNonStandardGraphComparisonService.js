const PreStudyResponse = require('../models/PrestudyResponse');
const MainStudyResponse = require('../models/MainstudyResponse');
const UserInteraction = require('../models/UserInteraction');

class ResponseService {
    // Add a Main Study Response
    async addMainStudyResponse(data) {
        try {
            const response = await MainStudyResponse.create(data);
            return response;
        } catch (error) {
            console.error("Error adding main study response:", error);
            throw error; // Rethrow the error to be handled by the caller
        }
    }

    // Add a Pre Study Response
    async addPreStudyResponse(data) {
        try {
            const response = await PreStudyResponse.create(data);
            return response;
        } catch (error) {
            console.error("Error adding pre study response:", error);
            throw error;
        }
    }

    // Add a User Interaction
    async addUserInteraction(data) {
        try {
            const interaction = await UserInteraction.create(data);
            return interaction;
        } catch (error) {
            console.error("Error adding user interaction:", error);
            throw error;
        }
    }
}

module.exports = new ResponseService();
