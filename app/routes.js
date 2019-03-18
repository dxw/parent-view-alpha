const express = require('express')
const router = express.Router()

// imports the contents of questions.json, sets to a variable
var questions = require('./data/questions.json')

function sanitiseText(text) {
  // replaces spaces with hyphens and removes commas and full stops
  return text.replace(/\s+/g, '-').replace(/[.’]/g, '').toLowerCase();
}

// Add your routes here - above the module.exports line

router.get('/leave-feedback/questions/:questionId', function(req, res) {
  // get the question ID from the URL params hash
  var question = req.params.questionId
  // find the text of the question in the 'questions' array whose ID matches the one in the params
  var text = questions.data.find(obj => String(obj.id) === question).text
  // find the hint text of the question in the 'questions' array whose ID matches the one in the params
  var hintText = questions.data.find(obj => String(obj.id) === question).hintText
  // the next question ID is the current one, plus 1
  var nextQuestion = Number(question) + 1
  // the last question ID is the current one, minus 1
  var lastQuestion = Number(question) - 1
  // the question's text, sanitised
  var sanitisedQuestionText = sanitiseText(text)
  // gets the number of questions in questions.json
  var questionCount = questions.data.length
  // checks for the 'edit' parameter in the URL query string
  var editing = req.query.edit
  res.render('leave-feedback/questions/question', {
    'question': question,
    'text': text,
    'hintText': hintText,
    'nextQuestion': nextQuestion,
    'lastQuestion': lastQuestion,
    'sanitisedQuestionText': sanitisedQuestionText,
    'questionCount': questionCount,
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