const express = require('express')
const router = express.Router()

var questions = require('./data/questions.json')

// Add your routes here - above the module.exports line

router.get('/leave-feedback/questions/:questionId', function(req, res) {
  var question = req.params.questionId
  var text = questions.data.find(obj => String(obj.id) === question).text
  var hintText = questions.data.find(obj => String(obj.id) === question).hintText
  var nextQuestion = Number(question) + 1
  var lastQuestion = Number(question) - 1
  var sanitisedQuestionText = text.replace(/\s+/g, '-').replace(/[.’]/g, '').toLowerCase();
  var questionCount = questions.data.length
  var currentQuestion = Number(question)
  res.render('leave-feedback/questions/question', {
    'question': question,
    'text': text,
    'hintText': hintText,
    'nextQuestion': nextQuestion,
    'lastQuestion': lastQuestion,
    'sanitisedQuestionText': sanitisedQuestionText,
    'questionCount': questionCount,
    'currentQuestion': currentQuestion
  });
});

module.exports = router