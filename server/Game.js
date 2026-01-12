export class Game {
  constructor(io, lobby, columns, rows, players, data, difficulty, wincondition) {
    this.io = io;
    this.lobby = lobby;
    this.columns = columns;
    this.rows = rows;
    this.players = players;
    this.data = data;
    this.difficulty = difficulty;
    this.wincondition = wincondition; //number of markers in a row needed to win
    this.questions = data.retriveQuestions(lobby.lang)[difficulty].slice();
    this.currentQuestion = null;
    this.placeMarkerAllowed = false;
    this.stopGame = false;
    console.log(this.players.length);
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
    
    
    
  }

  getQuestion() { 
    // Refill questions if "deck" empty
    // TODO: Replace with deck data structure??
    if (this.questions.length < 1) {
      this.questions = this.data.retriveQuestions(this.lobby.lang)[this.difficulty].slice();
    }
    this.currentQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
    return this.currentQuestion;
  }

  removeQuestion(q) {
    this.questions = this.questions.filter((item) => item !== q);
  }

  placeMarker(col) {
    console.log(`Player ${this.players[this.currentPlayer].username} is placing a marker in column ${col}`);
    if (this.stopGame) return;
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
          console.log(this.players[this.currentPlayer].username+" has won the game!");
          this.io.to(this.lobby.ID).emit("gameOver", this.players[this.currentPlayer].username);
          this.stopGame = true;
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
    //let over = row - 1;
    let under = row + 1;
    /*while (over >= 0 && this.gameBoard[col][over] === playerColor) {
      verticalLine += 1;
      over -= 1;
    }*/ //We don't need to check upward right now
    while (under < this.rows && this.gameBoard[col][under] === playerColor) {
      verticalLine += 1;
      under += 1;
    }
    if (verticalLine >= this.wincondition) {
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
    if (horizontalline >= this.wincondition) {
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
    if (firstdiagonalline >= this.wincondition) {
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
    if (seconddiagonalline >= this.wincondition) {
      return true;
    }
  }

  setCurrentPlayer(playerIndex) {
    this.currentPlayer = playerIndex;
    if (!this.players[playerIndex]) {
      console.log(`ERROR: Tried to get username for player with index ${playerIndex}, from list this.players of length ${this.players.length}, only following players exists in list.`)
      for (let p of this.players) {
        console.log(p);
      }
    }
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
    if (this.stopGame) return;
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

  addSpectators(spectators) {
    if (Array.isArray(spectators)) {
      for (const spectator of spectators) {
        spectator.socket.join("spectator" + this.lobby.ID);
      }
    }
  }

  informSpectators() {
    this.io.to("spectator" + this.lobby.ID).emit("youAreSpectating");
  }

  endGame() {
    this.io.to("spectator" + this.lobby.ID).emit("youAreSpectating");


  }

}

// Could replace some question picking code
class QuestionDeck {
  /**
   * Data structure for auto shuffling deck of cards.
   * @param {Array<any>} questions Questions array
   */
  constructor (deck) {
    this.deck = deck.slice();
    this.used = 0;
  }

  len() {
    return this.deck.length - this.used;
  }

  getRandomCard() {
    const randomIndex = Math.floor((Math.random()*this.len()));
    const card = this.deck[randomIndex];
    this.swapCards(randomIndex, this.len()-1);
    this.used = this.used + 1 % this.deck.length;
    return card;
  }

  swapCards(i, j) {
    const a = this.deck[i];
    this.deck[i] = this.deck[j];
    this.deck[j] = a;
  }
}
