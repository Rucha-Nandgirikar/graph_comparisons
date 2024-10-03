const express = require('express');
const router = express.Router();
const comparisonTables = require('../services/comparisonTables');

// TODO (Rucha?): Update route to fetch user_id from database


/* GET Table Data */

router.get("/claim-user-id", async (req, res) => {
    try {
        const userId = 0;
        res.json({ userId });
    } 
    catch (error) {
        console.error("Error fetching next question:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/fetch-entire-table", async (req, res) => {
    try {
      const tableData = await comparisonTables.fetchEntireTableFromDatabase();
      res.json({ data: tableData });
    } 
    catch (error) {
        console.error("Error fetching table data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


/* POST Table Data */

router.post("/submit-response", async (req, res) => {
    const { userId, userAnswer, questionNumber, isCorrect } = req.body;
  
    try {
        const timestamp = new Date();
  
        await comparisonTables.insertResponseIntoDatabase(
            userId,
            questionNumber,
            userAnswer,
            isCorrect,
            timestamp
        );
  
        res.json({
            status: "success submitting response to test_responses",
            message: "User response received",
        });
    } 
    catch (error) {
        console.error("Error submitting response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
 });

router.post("/submit-prestudy-response", async (req, res) => {
    const { userId, userAnswer, question } = req.body;

    try {
        const timestamp = new Date();

        await comparisonTables.insertPrestudyResponseIntoDatabase(
            userId,
            question,
            userAnswer,
            timestamp
        );

        res.json({
            status: "success submitting responses to prestudy_responses",
            message: "User response received",
        });
    } 
    catch (error) {
        console.error("Error submitting response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/submit-user-interaction", async (req, res) => {
    const { userId, buttonName, questionId, userAnswer, question } = req.body;
  
    try {
      const timestamp = new Date();
  
      // Insert the response into the database
      await comparisonTables.insertDataIntoMasterTable(
        userId,
        buttonName,
        questionId,
        question,
        userAnswer,
        timestamp
      );
  
      res.json({
        status: "success submitting to master_table",
        message: "User response received",
      });
    } catch (error) {
      console.error("Error submitting response:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;