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
  })

  socket.on("getUILabels", function (lang) {
    socket.emit("uiLabels", data.getUILabels(lang));
  });

  socket.on("createPoll", function (d) {
    data.createPoll(d.lobbyId, d.lang);
    socket.emit("pollData", data.getPoll(d.lobbyId));
  });

   socket.on("addQuestion", function (d) {
    data.addQuestion(d.lobbyId, { q: d.q, a: d.a });
    socket.emit("questionUpdate", data.activateQuestion(d.lobbyId));
  });

  socket.on("joinPoll", function (lobbyId) {
    socket.join(lobbyId);
    socket.emit("questionUpdate", data.activateQuestion(lobbyId));
    socket.emit("submittedAnswersUpdate", data.getSubmittedAnswers(lobbyId));
  });

  socket.on("startPoll", function (lobbyId) {
    io.to(lobbyId).emit("startPoll");
  });
  socket.on("runQuestion", function (d) {
    let question = data.activateQuestion(d.lobbyId, d.questionNumber);
    io.to(d.lobbyId).emit("questionUpdate", question);
    io.to(d.lobbyId).emit(
      "submittedAnswersUpdate",
      data.getSubmittedAnswers(d.lobbyId)
    );
  });

  socket.on("submitAnswer", function (d) {
    data.submitAnswer(d.lobbyId, d.answer);
    io.to(d.lobbyId).emit(
      "submittedAnswersUpdate",
      data.getSubmittedAnswers(d.lobbyId)
    );
  });

  /* Connect4 Game specifig */
  socket.on("createLobby", (e) => {
    console.log("A player has created a lobby");
    const lobby = new Lobby(io, socket, data, e.lang);
    socket.emit("createdLobby", {lobbyID: lobby.ID, ownerToken: lobby.owner_token});
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

  socket.on("leaveLobby", () => {
    const session = Session.getSession(socket.id);
    if (!session) return;
    session.leaveLobby();
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
    lobby.game.checkAnswer(obj.answer,);  
      }
  }
  });

  socket.on("startNewGame", (lobbyID) => { 
    const lobby = Lobby.getLobby(lobbyID);
    if (lobby && lobby.game) {
      lobby.createGame();
      lobby.io.to(lobbyID).emit("gameHasRestarted")
    }
  });


}

function registerLobbyEvents(socket, player, lobby) {

  socket.on("updateProfile", (p) => {
    if ('username' in p && p.username.length > 3) {
      player.username = p.username;
      socket.emit("newUsername", player.username);
    }
    player.team = p.team || player.team;
    if ("ready" in p) {
      player.ready = p.ready;
    }
    lobby.updateLobby();
  });
  socket.on("updateOtherProfiles", (p) => {
    lobby.updateOtherPlayer(p);
  });
  socket.on("changeColor", (newColor) => {
    player.color = lobby.colors.changeColor(player.color, newColor);
  });
  socket.on("getUnusedColors", () => {
    socket.emit("setUnusedColors", lobby.colors.getUnused());
  })
  socket.on("changeSize", (size) => { //kanske behöver ändras
    lobby.columns = size.columns;
    lobby.rows = size.rows;
    if (lobby.wincondition > Math.max(lobby.columns, lobby.rows)) {
      lobby.wincondition = Math.max(lobby.columns, lobby.rows);
    }
    lobby.updateLobby();
  });
  socket.on("changeDifficulty", (obj) => { 
    if (obj.difficulty === 0) {
      lobby.difficulty = 1;
    } else if (obj.difficulty === 1) { //kanske ändra till boolean eller int istället
      lobby.difficulty = 0;
    }
    lobby.updateLobby();
  });
  socket.on("changeWinCondition", (obj) => { 
    lobby.wincondition = obj.wincondition;
    lobby.updateLobby();
  });
  socket.on("startGame", () => {
    lobby.createGame(lobby.columns, lobby.rows); //behöver ju inte skicka med colums och rows om de finns som variabler i classen?! change setting ändrar ju this.rows och så
  });
      socket.on("sendEmoji", (p) => {
      lobby.io.to(lobby.ID).emit("sendEmoji");
    });
}
export { sockets, registerLobbyEvents };
