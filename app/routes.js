const express = require('express')
const router = express.Router()

// create an instance of the Notify client, and set to a variable
var NotifyClient = require('notifications-node-client').NotifyClient,
  notify = new NotifyClient(process.env.NOTIFYAPIKEY);

// imports the contents of questions.json, sets to a variable
var questions = require('./data/questions.json')

// import utility functions
var utilities = require('./utilities');

// Add your routes here - above the module.exports line

router.get('/leave-feedback/sharing-information-consent', function(req, res) {
  // returns true if the 'edit' parameter is in the URL query string, so we can make 'back' links work as expected when editing
  var editing = req.query.edit
  res.render('leave-feedback/sharing-information-consent', {
    'editing': editing
  });
});

router.get('/leave-feedback/questions/:questionId', function(req, res) {
  // get the question ID from the URL params hash
  var questionId = req.params.questionId
  // get the question object, from the questions.data array, for the current ID
  var question = questions.data.find(obj => String(obj.id) === questionId)
  // the next question ID is the current one, plus 1
  var nextQuestion = Number(questionId) + 1
  // the previous question ID is the current one, minus 1
  var previousQuestion = Number(questionId) - 1
  // gets the number of questions in the questions.data array
  var questionCount = questions.data.length
  // returns true if the current question is the last in the questions.data array
  var isFinalQuestion = questionId == questions.data.length ? true : false
  // returns true if the 'edit' parameter is in the URL query string, we use this in the view to make 'back' links work as expected when editing
  var editing = req.query.edit
  res.render('leave-feedback/questions/question', {
    'questionId': questionId,
    'question': question,
    'nextQuestion': nextQuestion,
    'previousQuestion': previousQuestion,
    'sanitise': utilities.sanitiseText,
    'questionCount': questionCount,
    'isFinalQuestion': isFinalQuestion,
    'editing': editing
  });
});

router.get('/leave-feedback/additional-feedback', function(req, res) {
  // gets the final question in the questions.data array
  var finalQuestionUrl = "questions/" + questions.data.length
  // returns true if the 'edit' parameter is in the URL query string, so we can make 'back' links work as expected when editing
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

// The URL we POST to when we want to send the confirmation email
router.post('/leave-feedback/confirmation', function(req, res) {

  // trigger Notify to send an email
  notify.sendEmail(
    // this long string is the template ID, copy it from the template
    // page in GOV.UK Notify. It’s not a secret so it’s fine to put it
    // in your code.
    'f437f4a4-34c7-42b1-9072-acbe8fd729d5',
    // get the given email address from the session
    req.session.data['email']
  );

  // This is the URL the users will be redirected to once the email
  // has been sent
  res.redirect('/leave-feedback/confirmation');

});

module.exports = router