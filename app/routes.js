const express = require('express')
const router = express.Router()

var questions = require('./data/questions.json')

function sanitiseText(text) {
  return text.replace(/\s+/g, '-').replace(/[.’]/g, '').toLowerCase();
}

// Add your routes here - above the module.exports line

router.get('/leave-feedback/questions/:questionId', function(req, res) {
  var question = req.params.questionId
  var text = questions.data.find(obj => String(obj.id) === question).text
  var hintText = questions.data.find(obj => String(obj.id) === question).hintText
  var nextQuestion = Number(question) + 1
  var lastQuestion = Number(question) - 1
  var sanitisedQuestionText = sanitiseText(text)
  var questionCount = questions.data.length
  var currentQuestion = Number(question)
  var editing = req.query.edit
  res.render('leave-feedback/questions/question', {
    'question': question,
    'text': text,
    'hintText': hintText,
    'nextQuestion': nextQuestion,
    'lastQuestion': lastQuestion,
    'sanitisedQuestionText': sanitisedQuestionText,
    'questionCount': questionCount,
    'currentQuestion': currentQuestion,
    'editing': editing
  });
});

router.get('/leave-feedback/check-your-answers', function(req, res) {
  res.render('leave-feedback/check-your-answers', {
    'questions': questions,
    'sanitiseText': sanitiseText
  });
});

module.exports = router