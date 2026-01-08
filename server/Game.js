import e from "express";

const COLORS = ["red", "yellow", "blue", "green", "violet"];

export class Game {
  constructor(io, lobby, columns, rows, players, data, difficulty) {
    this.io = io;
    this.lobby = lobby;
    this.columns = columns;
    this.rows = rows;
    this.players = players.filter((participant) => participant.team !== "spectator");
    this.spectators = players.filter((participant) => participant.team === "spectator");
    this.data = data;
    this.questions = data.retriveQuestions(lobby.lang)[difficulty].slice();
    this.currentQuestion = null;
    this.placeMarkerAllowed = false;
    for (let i = 0; i < players.length; i++) {
      players[i]["color"] = COLORS[i % COLORS.length];
    }

    this.setCurrentPlayer(Math.floor(Math.random()*this.players.length)); // Which player's turn is it anyway?
    // Create an gameboard 2d array[cols][rows]
    const gameBoard = new Array(this.columns);
    for (let i = 0; i < this.columns; i++) {
      gameBoard[i] = new Array(this.rows);
      gameBoard[i].fill("white");
    }
    this.gameBoard = gameBoard;
    this.updateGameBoard();
    this.updateQuestion();
    this.informSpectators();
    
    
  }

  getQuestion() { 
    this.currentQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
    return this.currentQuestion;
  }

  removeQuestion(q) {
    this.questions = this.questions.filter((item) => item !== q);
  }

  placeMarker(col) {
    console.log(`Player ${this.players[this.currentPlayer].username} is placing a marker in column ${col}`);
    if (!this.placeMarkerAllowed) return;
      // CHECK IF COL IS VALID
      if (col < 0 || col > this.gameBoard.length) return;

      const emptyCellIndex = this.getIndexOfFirstWhiteInCol(col);
      if (typeof emptyCellIndex === undefined) {
        // Column is full, emit this to the placing player
        //player.emitFullColumn();
      } else {
        const player = this.players[this.currentPlayer];
        this.gameBoard[col][emptyCellIndex] = player.color;
        if(this.checkWinCondition(emptyCellIndex, col, this.players[this.currentPlayer].color)) 
        {
          console.log(this.players[this.currentPlayer].username)
        }
        this.setCurrentPlayer(this.getNextPlayer());
        this.updateGameBoard();
        //lobby.updateLobby(
        //  `${player.username} placed a marker on [${col},${emptyCellIndex}]`
        //);
        this.placeMarkerAllowed = false;
        this.io.to(this.lobby.ID).emit("showQuestion");
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

  /**
   * Walks in all directions from latest placed brick to see if 4 is in a row.
   * @param {*} row row of latest placed marker
   * @param {*} col col of latest placed marker
   * @param {*} playerColor colorOfPlayerWhoPlaced
   */

  //TODO Change from hard coded win condition of 4 brickor
  checkWinCondition(row, col, playerColor) {

    //vertical
    let verticalLine = 1;
    let over = row - 1;
    let under = row + 1;
    /*while (over >= 0 && this.gameBoard[col][over] === playerColor) {
      verticalLine += 1;
      over -= 1;
    }*/ //We don't need to check upward right now
    while (under < this.rows && this.gameBoard[col][under] === playerColor) {
      verticalLine += 1;
      under += 1;
    }
    if (verticalLine >= 4) {
      return true;
    }
    //horizontal
    let horizontalline = 1;
    let left = col - 1;
    let right = col + 1;
    while (left >= 0 && this.gameBoard[left][row] === playerColor) {
      horizontalline += 1;
      left -= 1;
    }
    while (right < this.rows && this.gameBoard[right][row] === playerColor) {
      horizontalline += 1;
      right += 1;
    }
    if (horizontalline >= 4) {
      return true;
    }
    //first diagonal
    let firstdiagonalline = 1;
    let upleft = [col - 1, row - 1];
    let downright = [col + 1, row + 1]

    while (upleft[0] >= 0 && upleft[1] >= 0 && this.gameBoard[upleft[0]][upleft[1]] === playerColor) {
      firstdiagonalline += 1;
      upleft = [upleft[0]-1, upleft[1]-1];
    }
    while (downright[0] < this.rows && downright[1] < this.columns && this.gameBoard[downright[0]][downright[1]] === playerColor) {
      firstdiagonalline += 1;
      downright = [downright[0]+1,downright[1]+1];
    }
    if (firstdiagonalline >= 4) {
      return true;
    }

    let seconddiagonalline = 1;
    let downleft = [col - 1, row + 1]
    let upright = [col + 1, row - 1]
    while (downleft[0] >= 0 && downleft[1] < this.rows && this.gameBoard[downleft[0]][downleft[1]] === playerColor) {
      seconddiagonalline += 1;
      downleft = [downleft[0]-1, downleft[1]+1];
    }
    while (upright[0] < this.rows && upright[1] >= 0 && this.gameBoard[upright[0]][upright[1]] === playerColor) {
      seconddiagonalline += 1;
      upright = [upright[0]+1,upright[1]-1];
    }
    if (seconddiagonalline >= 4) {
      return true;
    }

    console.log(horizontalline, verticalLine, firstdiagonalline, seconddiagonalline);
  }

  setCurrentPlayer(playerIndex) {
    this.currentPlayer = playerIndex;
    this.io.to(this.lobby.ID).emit("currentPlayerUpdate",this.players[playerIndex].username)
  }

  isCurrentPlayer(id) {
    const player = this.players[this.currentPlayer];
    if (player) {
      return player.socket.id === id;
    }
    return false;
  }

  updateQuestion() {
    const question = this.getQuestion();
    this.removeQuestion(question);
    const reducedQuestion = {
      q: question.q,
      a: question.a
    }
    this.io.to(this.lobby.ID).emit("updateQuestion", reducedQuestion)
  }

  checkAnswer(answer) {
    if (this.currentQuestion.correctAnswer === answer) {
      this.io.to(this.lobby.ID).emit("correctAnswer");
      this.placeMarkerAllowed = true;
      this.updateQuestion();
    }
    else {
      this.io.to(this.lobby.ID).emit("wrongAnswer");
      this.setCurrentPlayer(this.getNextPlayer());
    }
  }

  informSpectators() {
    for (const spectator of this.spectators) {
      spectator.socket.join("spectator" + this.lobby.ID);
    }
    this.io.to("spectator" + this.lobby.ID).emit("youAreSpectating");
  }

}
