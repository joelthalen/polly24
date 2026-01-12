import { Socket } from "socket.io";
import { Lobby } from "./lobby.js";
import { Session } from "./Session.js";

/**
 *
 * @param {*} io
 * @param {Socket} socket
 * @param {*} data
 */
function sockets(io, socket, data) {
  new Session(socket.id);
  console.log(`User connected with ID ${socket.id}`);
  //här under är alla gamla sockets vi fick från kodsklettet. Kan även vara någon lobby socket också

  socket.on("disconnect", () => {
    console.log("Client Disconnected");
    const session = Session.getSession(socket.id);
    if (session) session.onDisconnect();
  });

  socket.on("getUILabels", function (lang) {
    socket.emit("uiLabels", data.getUILabels(lang));
  });

  /* Connect4 Game specifig */
  socket.on("createLobby", (e) => {
    console.log("A player has created a lobby");
    const lobby = new Lobby(io, socket, data, e.lang);
    socket.emit("createdLobby", {
      lobbyID: lobby.ID,
      ownerToken: lobby.owner_token,
    });
  });

  socket.on("joinLobby", (id) => {
    console.log("A player is trying to join a lobby", id);
    Lobby.tryJoiningLobby(socket, id);
    const lobby = Lobby.getLobby(id);
    if (lobby) {
      const session = Session.getSession(socket.id);
      if (session) {
        session.joinLobby(lobby);
      }
    }
  });


  // id: this.lobbyId, column: col
  socket.on("placeMarker", (obj) => {
    const lobby = Lobby.getLobby(obj.id);
    if (lobby && lobby.game && lobby.game.isCurrentPlayer(socket.id)) {
      lobby.game.placeMarker(obj.column);
    }
  });

  socket.on("submitAnswer", (obj) => {
    const lobby = Lobby.getLobby(obj.id);
    if (lobby && lobby.game) {
      if (lobby.game.isCurrentPlayer(socket.id)) {
        lobby.game.checkAnswer(obj.answer);
      }
    }
  });

  socket.on("startNewGame", (lobbyID) => {
    const lobby = Lobby.getLobby(lobbyID);
    if (lobby && lobby.game) {
      lobby.createGame();
      lobby.io.to(lobbyID).emit("gameHasRestarted");
    }
  });

  // LOBBYGREJER

  socket.on("lobby:leaveLobby", () => {
    const session = Session.getSession(socket.id);
    if (!session) return;
    session.leaveLobby();
  });
  socket.on("lobby:startGame", (e) => {
    const lobby = Lobby.getLobby(e.lobbyId);
    if (lobby) {
      lobby.createGame(lobby.columns, lobby.rows); //behöver ju inte skicka med colums och rows om de finns som variabler i classen?! change setting ändrar ju this.rows och så
    }
  });
  socket.on("lobby:updateProfile", (e) => {
    const lobby = Lobby.getLobby(e.lobbyId);
    if (lobby && e.profile) {
      lobby.updateProfile(socket.id, e.profile)
    }
  });
  socket.on("lobby:changeColor", (newColor) => {
    const lobby = Lobby.getLobby(e.lobbyId);
    if (lobby) {
      const player = lobby.getPlayerById(socket.id);
      if (player) {
        player.color = lobby.colors.changeColor(player.color, newColor);
      }
    }
  });
  socket.on("lobby:changeSize", (e) => {
    const lobby = Lobby.getLobby(e.lobbyId);
    if (lobby) {
      //kanske behöver ändras
      lobby.columns = e.size.columns;
      lobby.rows = e.size.rows;
      if (lobby.wincondition > Math.max(lobby.columns, lobby.rows)) {
        lobby.wincondition = Math.max(lobby.columns, lobby.rows);
      }
      lobby.updateLobby();
    }
  });
  socket.on("lobby:changeDifficulty", (obj) => {
    const lobby = Lobby.getLobby(obj.lobbyId);
    if (lobby) {
      if (obj.difficulty === 0) {
        lobby.difficulty = 1;
      } else if (obj.difficulty === 1) {
        //kanske ändra till boolean eller int istället
        lobby.difficulty = 0;
      }
      lobby.updateLobby();
    }
  });
  socket.on("lobby:changeWinCondition", (obj) => {
    const lobby = Lobby.getLobby(obj.lobbyId);
    if (lobby) {
      lobby.wincondition = obj.wincondition;
      lobby.updateLobby();
    }
  });
  socket.on("getUnusedColors", (e) => {
    const lobby = Lobby.getLobby(e.lobbyId);
    if (lobby) {
      socket.emit("setUnusedColors", lobby.colors.getUnused());
    }
  });
  socket.on("lobby:updateOtherProfiles", (p) => {
    const lobby = Lobby.getLobby(p.lobbyId);  
    if (lobby) {
      lobby.updateOtherPlayer(p);
    }
  });
  socket.on("lobby:sendEmoji", (e) => {
    if (e.lobbyId)
      io.to(e.lobbyId).emit("sendEmoji");
  });
  
}

export { sockets };
