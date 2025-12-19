const COLORS = ["red", "yellow", "blue", "green", "violet"];

export class Game {
  constructor(io, lobby, columns, rows, players) {
    this.io = io;
    this.lobby = lobby;
    this.columns = columns;
    this.rows = rows;
    this.players = players;
    for (let i = 0; i < players.length; i++) {
      players[i]["color"] = COLORS[i];
    }

    this.currentPlayer = 0;
    // Create an gameboard 2d array[cols][rows]
    const gameBoard = new Array(columns);
    for (let i = 0; i < columns; i++) {
      gameBoard[i] = new Array(rows);
      gameBoard[i].fill("white");
    }
    this.gameBoard = gameBoard;
    this.updateGameBoard();
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
}
