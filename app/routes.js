const express = require('express')
const router = express.Router()

var questions = require('./data/questions.json')

// Add your routes here - above the module.exports line

router.get('/leave-feedback/questions/:questionId', function(req, res) {
  var question = req.params.questionId
  res.render('leave-feedback/questions/question', {
    'question': question,
    'text': questions.data.find(obj => String(obj.id) === question).text,
    'hintText': questions.data.find(obj => String(obj.id) === question).hintText,
    'nextQuestion': Number(question) + 1,
    'lastQuestion': Number(question) - 1
  });
});

module.exports = router