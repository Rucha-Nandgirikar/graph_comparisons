const PreStudyResponse = require('../models/PrestudyResponse');
const MainStudyResponse = require('../models/MainstudyResponse');
const UserInteraction = require('../models/UserInteraction');

/**
 *  Response Service is in charge of recording main study and prestudy responses, as well as user interactions  
 */ 
class ResponseService {
    // Add a Main Study Response
    async insertMainstudyResponse(data) {
        try {
            const response = await MainStudyResponse.create(data);
            return response;
        } catch (error) {
            console.error("Error adding main study response:", error);
            throw error;
        }
    }

    // Add a Pre Study Response
    async insertPrestudyResponse(data) {
        try {
            const response = await PreStudyResponse.create(data);
            return response;
        } catch (error) {
            console.error("Error adding pre study response:", error);
            throw error;
        }
    }

    // Add a User Interaction
    async insertUserInteraction(data) {
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
