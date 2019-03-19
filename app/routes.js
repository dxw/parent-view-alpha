const express = require('express')
const router = express.Router()

// imports the contents of questions.json, sets to a variable
var questions = require('./data/questions.json')

// import utility functions
var utilities = require('./utilities');

// Add your routes here - above the module.exports line

router.get('/leave-feedback/questions/:questionId', function(req, res) {
  // get the question ID from the URL params hash
  var questionId = req.params.questionId
  // get the question object for the current ID
  var question = questions.data.find(obj => String(obj.id) === questionId)
  // the next question ID is the current one, plus 1
  var nextQuestion = Number(questionId) + 1
  // the last question ID is the current one, minus 1
  var lastQuestion = Number(questionId) - 1
  // gets the number of questions in questions.json
  var questionCount = questions.data.length
  // returns true if the current question is the last in the questions.data array
  var isFinalQuestion = questionId == questions.data.length ? true : false
  // returns true if the 'edit' parameter is in the URL query string
  var editing = req.query.edit
  res.render('leave-feedback/questions/question', {
    'questionId': questionId,
    'question': question,
    'nextQuestion': nextQuestion,
    'lastQuestion': lastQuestion,
    'sanitise': utilities.sanitiseText,
    'questionCount': questionCount,
    'isFinalQuestion': isFinalQuestion,
    'editing': editing
  });
});

router.get('/leave-feedback/additional-feedback', function(req, res) {
  // gets the last question in the questions.data array
  var finalQuestionUrl = "questions/" + questions.data.length
  // returns true if the 'edit' parameter is in the URL query string
  var editing = req.query.edit
  res.render('leave-feedback/additional-feedback', {
    'editing': editing,
    'finalQuestionUrl': finalQuestionUrl
  });
});

router.get('/leave-feedback/check-your-answers', function(req, res) {
  res.render('leave-feedback/check-your-answers', {
    'questions': questions,
    'sanitise': utilities.sanitiseText
  });
});

module.exports = router