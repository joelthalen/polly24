import e from "express";

const COLORS = ["red", "yellow", "blue", "green", "violet"];

export class Game {
  constructor(io, lobby, columns, rows, players, data) {
    this.io = io;
    this.lobby = lobby;
    this.columns = columns;
    this.rows = rows;
    this.players = players;
    this.data = data;
    this.questions = data.retriveQuestions(lobby.lang).slice();
    this.currentQuestion = null;
    for (let i = 0; i < players.length; i++) {
      players[i]["color"] = COLORS[i % COLORS.length];
    }

    this.currentPlayer = 0; // Which player's turn is it anyway?
    // Create an gameboard 2d array[cols][rows]
    const gameBoard = new Array(this.columns);
    for (let i = 0; i < this.columns; i++) {
      gameBoard[i] = new Array(this.rows);
      gameBoard[i].fill("white");
    }
    this.gameBoard = gameBoard;
    this.updateGameBoard();
    this.updateQuestion();
    
  }

  getQuestion() { 
    this.currentQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
    return this.currentQuestion;
  }

  removeQuestion(q) {
    this.questions = this.questions.filter((item) => item !== q);
  }

  placeMarker(col) {
    
    // CHECK IF COL IS VALID
    if (col < 0 || col > this.gameBoard.length) return;

    const emptyCellIndex = this.getIndexOfFirstWhiteInCol(col);
    if (typeof emptyCellIndex === undefined) {
      // Column is full, emit this to the placing player
      //player.emitFullColumn();
    } else {
      const player = this.players[this.currentPlayer];
      this.gameBoard[col][emptyCellIndex] = player.color;
      this.currentPlayer = this.getNextPlayer();
      this.updateGameBoard();
      //lobby.updateLobby(
      //  `${player.username} placed a marker on [${col},${emptyCellIndex}]`
      //);
    }
  }

  getNextPlayer() {
    return (this.currentPlayer + 1) % this.players.length;
  }

  getIndexOfFirstWhiteInCol(col) {
    for (let i = this.rows; i > 0; i--) {
      if (this.gameBoard[col][i - 1] === "white") {
        return i - 1;
      }
    }
    return undefined;
  }

  updateGameBoard() {
    this.io.to(this.lobby.ID).emit("gameBoardUpdate", this.gameBoard);
  }

  updateQuestion() {
    const question = this.getQuestion();
    this.removeQuestion(question);
    this.io.to(this.lobby.ID).emit("updateQuestion", question)
  }

  checkAnswer(answer) {
    if (this.currentQuestion.correctAnswer === answer) {
      this.io.to(this.lobby.ID).emit("correctAnswer");
      this.updateQuestion();
    }
    else {
      this.io.to(this.lobby.ID).emit("wrongAnswer");
    }
  }
}
