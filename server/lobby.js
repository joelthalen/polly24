const LOBBIES = {};

class Lobby {
  constructor(io, ownerSocket, lang = "en") {
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

    this.owner_token = randomCharString(10);
    LOBBIES[this.ID] = this;
  }

  lobbyInfo() {
    return {
      ID: this.ID,
      participants: this.players.map((p) => {
        return { username: p.username };
      }),
    };
  }

  addParticipant(playerSocket) {
    this.playerCount = this.playerCount + 1;
    playerSocket.join(this.ID);
    const player = {
      username: "Player " + this.playerCount,
      auth_token: randomCharString(10),
      socket: playerSocket,
    };
    this.players.push(player);

    this.registerPlayerSockets(playerSocket);
    playerSocket.emit("joinedLobby", {
      success: "true",
      auth_token: player.auth_token,
    });
    this.updateLobby(`${player.username} joined the lobby.`, 1);
    return player;
  }

  updateLobby(msg, announceLevel = 0) {
    this.io.to(this.ID).emit("lobbyUpdate", {
      announceLevel: 0, // Higher means more important!
      message: msg,
      lobbyState: this.lobbyInfo()
    })
  }

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
      socket.emit("lobbyUpdate", { announceLevel: 4, message: "Could not find lobby.", lobbyState: {} });
    }
  }

  registerPlayerSockets(socket) {
    socket.on("updateProfile", (p) => {
      player.username = p.username || player.username;
      this.updateLobby();
    });
    socket.on("sendEmoji", (p) => {
      this.io.to(this.ID).emit("sendEmoji");
    });
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
