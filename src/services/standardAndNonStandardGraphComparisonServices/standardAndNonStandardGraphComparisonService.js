const PreStudyResponse = require('../../models/standardAndNonStandardGraphComparisonModels/PrestudyResponse');
const MainStudyResponse = require('../../models/standardAndNonStandardGraphComparisonModels/MainstudyResponse');
const UserInteraction = require('../../models/standardAndNonStandardGraphComparisonModels/UserInteraction');

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
        console.log(data);
        try {
            const interaction = await UserInteraction.create(data);
            // alert("Added record!!");
            return interaction;
        } catch (error) {
            console.error("Error adding user interaction:", error);
            throw error;
        }
    }
}

module.exports = new ResponseService();
