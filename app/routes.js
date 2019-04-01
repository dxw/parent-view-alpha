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
  // returns true if the current question is the first in the questions.data array
  var isFirstQuestion = questionId == questions.data[0].id ? true : false
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
    'isFirstQuestion': isFirstQuestion,
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

  // make an empty array to hold the answers from the session
  var allAnswers = []

  // loop through questions.data to get the text for each question,
  // use the sanitised version of it to get the matching answer from the session,
  // push each to the allAnswers array
  for (i = 0; i < questions.data.length; ++i) {
    allAnswers.push(req.session.data[utilities.sanitiseText(questions.data[i].text)] || "No answer")
  }

  // create an object that gets each answer from allAnswers and assigns it to a key that matches those in the Notify template
  var personalisation = {
    'answer1': questions.data[0].text + ": " + allAnswers[0],
    'answer2': questions.data[1].text + ": " + allAnswers[1],
    'answer3': questions.data[2].text + ": " + allAnswers[2],
    'answer4': questions.data[3].text + ": " + allAnswers[3],
    'answer5': questions.data[4].text + ": " + allAnswers[4],
    'answer6': questions.data[5].text + ": " + allAnswers[5],
    'answer7': questions.data[6].text + ": " + allAnswers[6],
    'answer8': questions.data[7].text + ": " + allAnswers[7],
    'answer9': questions.data[8].text + ": " + allAnswers[8],
    'answer10': questions.data[9].text + ": " + allAnswers[9],
    'answer11': questions.data[10].text + ": " + allAnswers[10],
    'answer12': questions.data[11].text + ": " + allAnswers[11],
    'answer13': questions.data[12].text + ": " + allAnswers[12],
    'answer14': questions.data[13].text + ": " + allAnswers[13],
    'additional-feedback': req.session.data['additional-feedback']
  }

  // trigger Notify to send an email
  notify.sendEmail(
    // this long string is the template ID, copy it from the template
    // page in GOV.UK Notify. It’s not a secret so it’s fine to put it
    // in your code.
    'f026a570-1359-4e09-8767-7736a32f3aa0',
    // get the given email address from the session
    req.session.data['email'],
    {
      personalisation: personalisation
    }
  );

  // This is the URL the users will be redirected to once the email
  // has been sent
  res.redirect('/leave-feedback/confirmation');

});

module.exports = router