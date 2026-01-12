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
Data.prototype.getUILabels = function (lang) {
  //check if lang is valid before trying to load the dictionary file
  if (!["en", "sv"].some( el => el === lang))
    lang = "en";
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

export { Data };



