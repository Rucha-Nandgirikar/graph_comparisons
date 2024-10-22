const express = require('express');
const router = express.Router();
const controller = require('./controllers/standardAndNonStandardGraphComparisonController');

// User routes
router.post('/users', controller.createUser);
router.get('/users/:id', controller.getUserById);

// Question routes
router.get('/questions', controller.getAllQuestions);

// Response routes
router.post('/responses/main', controller.addMainStudyResponse);
router.post('/responses/pre', controller.addPreStudyResponse);
router.post('/interactions', controller.addUserInteraction);

module.exports = router;
