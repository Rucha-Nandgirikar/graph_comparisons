
const standardAndNonStandardGraphsService = require('../services/standardAndNonStandardGraphComparisonService'); // Import the service
const questionService = require('../services/questionService'); // Import the question service
const userService = require('../services/userService');

class StandardAndNonStandardGraphComparisonController {
  
  // user interaction
  async claimUserId(req, res) {
    try {
        // Fetch the latest user ID from the service
        const latestUserId = await userService.getLatestUserId();

        // Fetch the latest user ID from the service
        const newUserId = await userService.getNewUserId(latestUserId);

        // Insert the new user with the incremented ID using the service
        // await userService.insertNewUser(newUserId);

        if (newUserId) {
          // Store user_id in session
          req.session.userId = newUserId;
        }

        // Send the new user ID in the response
        res.json({ userId: newUserId });
    } catch (error) {
        console.error("Error claiming user ID:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // test questions
  async getAllTestQuestions(req, res) {
    try {
      // This method will interact with the service to get data
      // Fetch all questions from the service
    const questions = await questionService.fetchAllQuestions();
    
    // Return the array of questions as a JSON response
    res.json(questions);

    console.log(questions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCurrentUserId(req, res)
  {
    try {

      const currentUserId = await userService.getCurrentUserId(req);
    
    // Return the user ID as a JSON response
    res.json({ userId: currentUserId });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // test pre study responses
  async postPreStudyResponses(req, res) {
    try {
      // Extract data from the request body
      const { userId, userAnswer, question } = req.body;
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // Call the service to insert the responses into the database
      const result = await standardAndNonStandardGraphsService.insertPrestudyResponseIntoDatabase( userId,question,userAnswer,timestamp);
    
      // Return a success response with the inserted data or relevant info
      res.status(201).json({
        message: 'Pre-study responses inserted successfully',
        data: result
      });

    } catch (error) {
      // Handle any errors during the process
      console.error('Error inserting pre-study responses:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // post user interaction
  async postUserInteraction(req, res)
  {
    const { userId, buttonName, questionId, userAnswer, question } = req.body;

    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ') 

      // Insert the response into the database
      await standardAndNonStandardGraphsService.insertDataIntoMasterTable(userId,buttonName,questionId,question,userAnswer,timestamp);
  
      res.json({
        status: "success submitting to master_table",
        message: "User response received",
      });
    } catch (error) {
      console.error("Error submitting response:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

  }

  async postUserAge(req, res){

    const { userId, userAge } = req.body;

    try {
        const result = await userService.postUserAge(userId, userAge);
        res.json(result);
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

  }

  async createComparisonTable(req, res) {
    try {
      // This is an example of another method that uses the service for data creation
      const createdData = await comparisonTablesService.createSomeData(req.body);
      res.status(201).json(createdData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new StandardAndNonStandardGraphComparisonController();  // Export an instance of the controller
