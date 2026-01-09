import { Game } from "./Game.js";

/** @type {Map<string, Lobby>} */
const LOBBIES = new Map();

// TODO: HARDCODED ID LENGTH MOVE TO OTHER SERVER SETTINGS
const ID_LENGTH = 4;
const MIN_PLAYERS = 1;
const MAX_PLAYERS = 99;

const TEAMS = {
  PLAYER: "player",
  SPECTATOR: "spectator"
}

class Lobby {
  game; 

  constructor(io, ownerSocket, data, lang = "en") {
    this.colors = new Colors();
    this.io = io;
    this.ID = randomCharString(ID_LENGTH);
    // could be socket specific authentication ID generated on lobby join
    this.lang = lang;
    this.players = [];
    // TODO: HARDCODED
    this.slots = 2;
    this.playerCount = 0;
    this.data = data;

    LOBBIES.set(this.ID, this);
    this.columns = 7;
    this.rows = 7;
    this.difficulty = 0; //kanske ändra till boolean eller int istället
    this.wincondition = 4; //number of markers in a row needed to win
  }

  lobbyInfo() {
    return {
      ID: this.ID,
      participants: this.players.map((p) => {
        return { username: p.username, ready: p.ready, team: p.team, isHost: p.isHost, color: p.color };
      }),
      columns: this.columns, //Lite fult kanske att ha det här här, men det behövs innan gamet har skapats
      rows: this.rows,
      difficulty: this.difficulty, 
      wincondition: this.wincondition,
      gameBoard: () => {
        if (this.game) return this.game.gameBoard;
        else return undefined;
      },
    };
  }

  addParticipant(playerSocket) { //kan behövas delas upp så inte addParticipant gör allt i lobby
    this.playerCount = this.playerCount + 1;
    playerSocket.join(this.ID); // Join the socket.io room for this lobby
    const player = {
      username: "Player " + this.playerCount,
      ready: false,
      socket: playerSocket,
      isHost: false, 
      team: "spectator",
      color: this.colors.useColor()
    };
    playerSocket.emit("newUsername", player.username);
    if (this.players.length === 0) {
      player.isHost = true;
      player.team = "player";
      player.ready = true;
    };
    if(this.players.length === 1){
      player.team = "player";
    };
    this.players.push(player);

    // TODO: move or smth idk
    this.registerPlayerSockets(playerSocket);
    playerSocket.on("updateProfile", (p) => {
      if ('username' in p && p.username.length > 3) {
        player.username = p.username;
        playerSocket.emit("newUsername", player.username);
      }
      player.team = p.team || player.team;
      if ("ready" in p) {
        player.ready = p.ready;
      }
      this.updateLobby();
    });
    playerSocket.on("updateOtherProfiles", (p) => {
      this.updateOtherPlayer(p);
    });
    playerSocket.on("changeColor", (newColor) => {
      player.color = this.colors.changeColor(player.color, newColor);
    });
    playerSocket.on("getUnusedColors", () => {
      playerSocket.emit("setUnusedColors", this.colors.getUnused());
    })
    playerSocket.on("changeSize", (size) => { //kanske behöver ändras
      this.columns = size.columns;
      this.rows = size.rows;
      if (this.wincondition > Math.max(this.columns, this.rows)) {
        this.wincondition = Math.max(this.columns, this.rows);
      }
      this.updateLobby();
    });
    playerSocket.on("changeDifficulty", (obj) => { 
      if (obj.difficulty === 0) {
        this.difficulty = 1;
      } else if (obj.difficulty === 1) { //kanske ändra till boolean eller int istället
        this.difficulty = 0;
      }
      this.updateLobby();
    });
    playerSocket.on("changeWinCondition", (obj) => { 
      this.wincondition = obj.wincondition;
      this.updateLobby();
    });
    playerSocket.on("startGame", () => {
      this.createGame(this.columns, this.rows); //behöver ju inte skicka med colums och rows om de finns som variabler i classen?! change setting ändrar ju this.rows och så
    });
    playerSocket.emit("joinedLobby", {
      success: "true",
      isHost: player.isHost,
    });
    this.updateLobby(`${player.username} joined the lobby.`, 1);
    return player;
  }

  updateLobby(msg, announceLevel = 0) {
    this.io.to(this.ID).emit("lobbyUpdate", {
      announceLevel: 0, // Higher means more important!
      message: msg,
      lobbyState: this.lobbyInfo(),
    });
  }

  // TODO: REDO
  removeParticipant(id) { //just nu funkar det inte riktigt buggar när man ska enda gamet om gamest är igång     
    for (let i in this.players) {
      if (this.players[i].socket.id === id) {
        if(this.game){
          if (this.players[i].team === "player") {  
            this.io.to(this.ID).emit("playerLeft")
            for(let i in this.players){ this.players[i].socket.leave()}
            LOBBIES.delete(this.ID)
          }
        }
        const removedPlayerArray = this.players.splice(i, 1);
        if (this.players.length < 1) {this.remove();}
        else if (removedPlayerArray[0].isHost) {
          this.players[0].isHost = true;
        }
        removedPlayerArray[0].socket.leave(this.ID)
      }
    }
  }

  remove() {
    this.io.to(this.ID).emit("lobbyClosed", this.ID);
    LOBBIES.delete(this.ID);
  }

  static getLobby(ID) {
    if (LOBBIES.has(ID)) {
      return LOBBIES.get(ID);
    } else {
      return undefined;
    }
  }

  static tryJoiningLobby(socket, ID) {
    if (LOBBIES.has(ID)) {
      LOBBIES.get(ID).addParticipant(socket);
    } else {
      socket.emit("lobbyNotFound", {
        announceLevel: 4,
        message: "Could not find lobby.",
        lobbyState: {},
      });
    }
  }

  registerPlayerSockets(socket) {
    socket.on("sendEmoji", (p) => {
      this.io.to(this.ID).emit("sendEmoji");
    });
  }

  onPlayerReady() {
    for (const p of this.players) {
      if (!p.ready) {
        return;
      }
    }
    this.createGame();
    console.log(`Created Game on lobby ${this.ID}`);
  }

  updateOtherPlayer(p) {
    this.players.find((player) => player.username === p.username).team = p.team;
    this.updateLobby();
    
  }

  createGame() {
    // Split lobby into players and participants.
    const {spectators, players} = Object.groupBy(this.players, 
      (p) => p.team === TEAMS.SPECTATOR ? "spectators" : "players");
    // Check min and max player count
    if (!players || players.length < MIN_PLAYERS || players.length > MAX_PLAYERS) return;
    this.game = new Game(this.io, this, this.columns, this.rows, players, this.data, this.difficulty, this.wincondition);
    this.game.addSpectators(spectators);
    this.updateLobby("Created Game");
    this.io.to(this.ID).emit("gameStart");
  }

  getGameBoard() {
    if (this.game) {
      return this.game.gameBoard;
    } else {
      return undefined;
    }
  }
}

function randomCharString(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export { Lobby };

class Colors {
  constructor() {
    this.COLORS = ["red", "yellow", "blue", "green", "violet"].reverse();
    console.log(this.COLORS);
    this.used = 0;
    this.swap(0);
  }

  useColor(index = 0) {
    // Get first color
    const color = this.COLORS[index];
    this.swap(index);
    this.used += 1 % this.COLORS.length;
    return color;
  }

  changeColor(oldColor, newColor) {
    const newIndex = this.COLORS.findIndex((color) => color === newColor);
    const oldIndex = this.COLORS.findIndex((color) => color === oldColor);
    const color = this.COLORS[newIndex];
    this.swap(newIndex, oldIndex);
    return color;
  }

  getUnused() {
    return this.COLORS.slice(0, this.COLORS.length - this.used);
  }

  /**
   * Swaps position of two elements, if other index is undefined then it swaps index with last unused element.
   * @param {number} index 
   * @param {number} otherIndex 
   */
  swap(index, otherIndex = undefined) {
    if (!otherIndex) otherIndex = this.COLORS.length - this.used - 1;
    const a = this.COLORS[index];
    this.COLORS[index] = this.COLORS[otherIndex];
    this.COLORS[otherIndex] = a;
  }
}