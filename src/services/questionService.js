const Question = require('../models/questionModel');
const standardAndNonStandardGraphsService = require('../services/standardAndNonStandardGraphComparisonService'); // Assuming this is the service for fetching data

class QuestionService {
  // Method to fetch questions from the database and return them as Question instances
  async fetchAllQuestions() {
    try {
      // Fetch data from the database using the existing service
      const data = await standardAndNonStandardGraphsService.fetchAllTestQuestionsFromDatabase();
      // Initialize an array to hold the Question instances
      const questionsArray = [];

      // Iterate through the fetched data and create Question instances
      data.forEach(questionData => {
        const question = new Question(questionData); // Create a new Question object
        questionsArray.push(question); // Add to the questions array
      });

      // Return the array of questions
      return questionsArray;

    } catch (error) {
      console.error('Error fetching test questions:', error);
      throw new Error('Failed to fetch test questions');
    }
  }
}

module.exports = new QuestionService(); // Export an instance of the service
