'use strict';
import {readFileSync} from "fs";

// Store data in an object to keep the global namespace clean. In an actual implementation this would be interfacing a database...
function Data() {
  this.games = {} // Vi borde ändra så det inte är polls utan spel
  this.questionsEn = JSON.parse(readFileSync("./server/data/questions-en.json"));
  this.questionsSv = JSON.parse(readFileSync("./server/data/questions-sv.json"));

  this.polls = {};
  this.polls['test'] = {
    lang: "en",
    questions: JSON.parse(readFileSync("./server/data/questions-en.json")),
    answers: [],
    currentQuestion: 0,
    participants: []
  }
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/




Data.prototype.retriveQuestions = function(lang) {
  if (lang === "sv") {
    return this.questionsSv;
  }
  return this.questionsEn;
}

/*  Här under är alla datafunktioner som vi fick av kodsklettet */

Data.prototype.pollExists = function (lobbyId) {
  return typeof this.polls[lobbyId] !== "undefined"
}

Data.prototype.getUILabels = function (lang) {
  //check if lang is valid before trying to load the dictionary file
  if (!["en", "sv"].some( el => el === lang))
    lang = "en";
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.createPoll = function(lobbyId, lang="en") {
  if (!this.pollExists(lobbyId)) {
    let poll = {};
    poll.lang = lang;  
    poll.questions = [];
    poll.answers = [];
    poll.participants = [];
    poll.currentQuestion = 0;              
    this.polls[lobbyId] = poll;
    console.log("poll created", lobbyId, poll);
  }
  return this.polls[lobbyId];
}

Data.prototype.getPoll = function(lobbyId) {
  if (this.pollExists(lobbyId)) {
    return this.polls[lobbyId];
  }
  return {};
}

Data.prototype.participateInPoll = function(lobbyId, name) {
  console.log("participant will be added to", lobbyId, name);
  if (this.pollExists(lobbyId)) {
    this.polls[lobbyId].participants.push({name: name, answers: []})
  }
}

Data.prototype.getParticipants = function(lobbyId) {
  const poll = this.polls[lobbyId];
  console.log("participants requested for", lobbyId);
  if (this.pollExists(lobbyId)) { 
    return this.polls[lobbyId].participants
  }
  return [];
}

Data.prototype.addQuestion = function(lobbyId, q) {
  if (this.pollExists(lobbyId)) {
    this.polls[lobbyId].questions.push(q);
  }
}

Data.prototype.activateQuestion = function(lobbyId, qId = null) {
  if (this.pollExists(lobbyId)) {
    const poll = this.polls[lobbyId];
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    return poll.questions[poll.currentQuestion];
  }
  return {}
}

Data.prototype.getSubmittedAnswers = function(lobbyId) {
  if (this.pollExists(lobbyId)) {
    const poll = this.polls[lobbyId];
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return answers;
    }
  }
  return {}
}

Data.prototype.submitAnswer = function(lobbyId, answer) {
  if (this.pollExists(lobbyId)) {
    const poll = this.polls[lobbyId];
    let answers = poll.answers[poll.currentQuestion];
    // create answers object if no answers have yet been submitted
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    // create answer property if that specific answer has not yet been submitted
    else if (typeof answers[answer] === 'undefined') {
      answers[answer] = 1;
    }
    // if the property already exists, increase the number
    else
      answers[answer] += 1
    console.log("answers looks like ", answers, typeof answers);
  }
}

export { Data };



