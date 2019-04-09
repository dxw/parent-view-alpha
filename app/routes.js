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

router.get('/leave-feedback/questions/:question', function(req, res) {
  res.render('leave-feedback/questions/' + req.params.question, {
    'editing': req.query.edit
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

router.post('/leave-feedback/add-child', function(req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  let addChild = req.session.data['add-child'] == "yes"
  let multipleChildren = req.session.data['multiple-children'] == "yes"

  if (addChild) {
    res.redirect('/leave-feedback/questions/my-child-is-happy-2')
  } else if (multipleChildren) {
    res.redirect('/leave-feedback/check-your-answers-2')
  } else {
    res.redirect('/leave-feedback/check-your-answers')
  }
})

router.post('/leave-feedback/check-your-answers', function(req, res) {
  if (req.query.multiple) {
    res.render('leave-feedback/check-your-answers-2', {
      'questions': questions
    });
  } else {
    res.render('leave-feedback/check-your-answers', {
      'questions': questions
    });
  }
});

router.get('/leave-feedback/check-your-answers-2', function(req, res) {
  res.render('leave-feedback/check-your-answers-2', {
    'questions': questions
  })
});

// Todo email sends updated questions

// The URL we POST to when we want to send the confirmation email
router.post('/leave-feedback/confirmation', function(req, res) {

  // create an object that gets each answer from allAnswers and assigns it to a key that matches those in the Notify template
  var personalisation = {
    'answer1': questions.data[0].text + ": " + req.session.data["my-child-is-happy"],
    'answer2': questions.data[1].text + ": " + req.session.data["my-child-feels-safe"],
    'answer3': questions.data[2].text + ": " + req.session.data["my-child-can-reach-potential"],
    'answer4': questions.data[3].text + ": " + req.session.data["school-makes-me-aware"],
    'answer5': questions.data[4].text + ": " + req.session.data["my-child-has-send"],
    'answer6': questions.data[5].text + ": " + req.session.data["school-staff-changes"],
    'answer7': questions.data[6].text + ": " + req.session.data["school-extracurricular-interests"],
    'answer8': questions.data[7].text + ": " + req.session.data["my-child-life-skills"],
    'answer9': questions.data[8].text + ": " + req.session.data["school-good-behaviour"],
    'answer10': questions.data[9].text + ": " + req.session.data["my-child-bullied"],
    'answer11': questions.data[10].text + ": " + req.session.data["school-my-concerns"],
    'answer12': questions.data[11].text + ": " + req.session.data["school-updates-me"],
    'answer13': questions.data[12].text + ": " + req.session.data["my-child-at-boarding-school"],
    'answer14': questions.data[13].text + ": " + req.session.data["school-i-would-recommend"],
    'additional-feedback': req.session.data['additional-feedback'] || "No additional feedback"
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

router.post('/leave-feedback/confirmation-2', function(req, res) {

  var personalisation = {
    'answer1': questions.data[0].text + ": " + req.session.data["my-child-is-happy"],
    'answer2': questions.data[1].text + ": " + req.session.data["my-child-feels-safe"],
    'answer3': questions.data[2].text + ": " + req.session.data["my-child-can-reach-potential"],
    'answer4': questions.data[3].text + ": " + req.session.data["school-makes-me-aware"],
    'answer5': questions.data[4].text + ": " + req.session.data["my-child-has-send"],
    'answer6': questions.data[5].text + ": " + req.session.data["school-staff-changes"],
    'answer7': questions.data[6].text + ": " + req.session.data["school-extracurricular-interests"],
    'answer8': questions.data[7].text + ": " + req.session.data["my-child-life-skills"],
    'answer9': questions.data[8].text + ": " + req.session.data["school-good-behaviour"],
    'answer10': questions.data[9].text + ": " + req.session.data["my-child-bullied"],
    'answer11': questions.data[10].text + ": " + req.session.data["school-my-concerns"],
    'answer12': questions.data[11].text + ": " + req.session.data["school-updates-me"],
    'answer13': questions.data[12].text + ": " + req.session.data["my-child-at-boarding-school"],
    'answer14': questions.data[13].text + ": " + req.session.data["school-i-would-recommend"],
    'additional-feedback': req.session.data['additional-feedback'] || "No additional feedback",
    'answer1-2': questions.data[0].text + ": " + req.session.data["my-child-is-happy-2"],
    'answer2-2': questions.data[1].text + ": " + req.session.data["my-child-feels-safe-2"],
    'answer3-2': questions.data[2].text + ": " + req.session.data["my-child-can-reach-potential-2"],
    'answer4-2': questions.data[3].text + ": " + req.session.data["school-makes-me-aware-2"],
    'answer5-2': questions.data[4].text + ": " + req.session.data["my-child-has-send-2"],
    'answer6-2': questions.data[5].text + ": " + req.session.data["school-staff-changes-2"],
    'answer7-2': questions.data[6].text + ": " + req.session.data["school-extracurricular-interests-2"],
    'answer8-2': questions.data[7].text + ": " + req.session.data["my-child-life-skills-2"],
    'answer9-2': questions.data[8].text + ": " + req.session.data["school-good-behaviour-2"],
    'answer10-2': questions.data[9].text + ": " + req.session.data["my-child-bullied-2"],
    'answer11-2': questions.data[10].text + ": " + req.session.data["school-my-concerns-2"],
    'answer12-2': questions.data[11].text + ": " + req.session.data["school-updates-me-2"],
    'answer13-2': questions.data[12].text + ": " + req.session.data["my-child-at-boarding-school-2"],
    'answer14-2': questions.data[13].text + ": " + req.session.data["school-i-would-recommend-2"],
    'additional-feedback-2': req.session.data['additional-feedback-2'] || "No additional feedback"
  }

  notify.sendEmail(
    '47ea4cc9-af1a-4492-8937-b04d29f4fa86',
    req.session.data['email'], {
      personalisation: personalisation
    }
  );

  res.redirect('/leave-feedback/confirmation');

});

module.exports = router
