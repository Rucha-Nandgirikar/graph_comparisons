const express = require('express');

const router = express.Router();
const standardAndNonStandardGraphsController = require('../../controllers/standardAndNonStandardGraphComparisonController.js');

// Define the route for /claim-user-id
router.get('/claim-user-id', standardAndNonStandardGraphsController.claimUserId);
router.get('/test-questions', standardAndNonStandardGraphsController.getAllTestQuestions);
router.get('/get-current-user-id',standardAndNonStandardGraphsController.getCurrentUserId);

// POST Pre Study Response
router.post('/submit-prestudy-response',standardAndNonStandardGraphsController.postPreStudyResponses);
router.post('/submit-user-interaction',standardAndNonStandardGraphsController.postUserInteraction);

// router.post('/insert-user-age',standardAndNonStandardGraphsController.postUserAge);


module.exports = router;
