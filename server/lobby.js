import { Game } from "./Game.js";

const LOBBIES = {};

class Lobby {
  game;

  constructor(io, ownerSocket, data, lang = "en") {
    this.io = io;
    // TODO: HARDCODED ID LENGTH MOVE TO OTHER SERVER SETTINGS
    const IDLENGTH = 4;
    this.ID = randomCharString(4);
    // could be socket specific authentication ID generated on lobby join
    this.lang = lang;
    this.players = [];
    // TODO: HARDCODED
    this.slots = 2;
    this.playerCount = 0;
    this.data = data;

    this.owner_token = randomCharString(20);
    LOBBIES[this.ID] = this;
  }

  lobbyInfo() {
    return {
      ID: this.ID,
      participants: this.players.map((p) => {
        return { username: p.username, ready: p.ready, team: p.team, isHost: p.isHost };
      }),
      gameBoard: () => {
        if (this.game) return this.game.gameBoard;
        else return undefined;
      },
    };
  }

  addParticipant(playerSocket) {
    this.playerCount = this.playerCount + 1;
    playerSocket.join(this.ID); // Join the socket.io room for this lobby
    const player = {
      username: "Player " + this.playerCount,
      ready: false,
      auth_token: randomCharString(10),
      socket: playerSocket,
      isHost: false, 
      team: "spectator",     
    };
    // TODO: on disconnect remove player from lobby
    // and if host, assign new host
    if (this.players.length === 0) {
      player.isHost = true;
      player.team = "team1";
      player.ready = true;
    };
    if(this.players.length === 1){
      player.team = "team2";
    };
    this.players.push(player);

    // TODO: move or smth idk
    this.registerPlayerSockets(playerSocket);
    playerSocket.on("updateProfile", (p) => {
      player.username = p.username || player.username;
      player.team = p.team || player.team;
      if ("ready" in p) {
        player.ready = p.ready;
        /*this.onPlayerReady(); // checks if everyone is ready*/
      }
      this.updateLobby();
    });
    playerSocket.on("startGame", () => {
      this.createGame();
    });
    playerSocket.emit("joinedLobby", {
      success: "true",
      auth_token: player.auth_token,
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
  removeParticipant(token) {
    for (let i in this.players) {
      if (this.players[i].auth_token === token) {
        this.players.remove(i);
      }
    }
  }

  static getLobby(ID) {
    if (ID in LOBBIES) {
      return LOBBIES[ID];
    } else {
      return undefined;
    }
  }

  static tryJoiningLobby(socket, ID) {
    if (ID in LOBBIES) {
      LOBBIES[ID].addParticipant(socket);
    } else {
      socket.emit("lobbyUpdate", {
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

  createGame() {
    // TODO: Fix hardcoded columns and rows settings
    this.game = new Game(this.io, this, 7, 7, this.players, this.data);
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
