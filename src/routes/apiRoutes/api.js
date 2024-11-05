const express = require('express');
const router = express.Router();
const controller = require('../../controllers/standardAndNonStandardGraphComparisonController');

// User routes
router.post('/users', controller.createUser);
router.get('/users/:id', controller.getUserById);
router.put('/users/:id', controller.updateUser);

// Question routes
router.get('/test-questions/:id', controller.getAllQuestions);

// Response routes
router.post('/submit-mainstudy-response', controller.postMainStudyResponse);
router.post('/submit-prestudy-response', controller.postPreStudyResponse);
router.post('/submit-user-interaction', controller.postUserInteraction);

module.exports = router;
