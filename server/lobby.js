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

    const owner = this.addParticipant(ownerSocket);
    this.owner_token = owner.auth_token;
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
    playerSocket.join(this.ID);
    const player = {
      username: "",
      auth_token: randomCharString(10),
      socket: playerSocket,
    };
    this.players.push(player);

    playerSocket.on("updateProfile", (p) => {
      player.username = p.username || player.username;
      this.updateLobby();
    });
    playerSocket.emit("joinedLobby", {
      success: "true",
      auth_token: player.auth_token,
    });
    this.io.to(this.ID).emit("lobbyUpdate", this.lobbyInfo());
    return player;
  }

  removeParticipant(token) {
    for (let i in this.players) {
      if (this.players[i].auth_token === token) {
        this.players.remove(i);
      }
    }
  }

  updateLobby() {
    this.io.to(this.ID).emit("lobbyUpdate", this.lobbyInfo());
  }

  static getLobby(ID) {
    if (ID in LOBBIES) {
      return LOBBIES[ID];
    } else {
      return undefined;
    }
  }

  static tryJoiningLobby(socket, ID) {
    console.log(LOBBIES);
    if (ID in LOBBIES) {
      LOBBIES[ID].addParticipant(socket);
    } else {
      socket.emit("joinedLobby", { success: false, msg: "Not a hosted lobby" });
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
