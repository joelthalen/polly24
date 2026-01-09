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
    data.createPoll(d.pollId, d.lang);
    socket.emit("pollData", data.getPoll(d.pollId));
  });

   socket.on("addQuestion", function (d) {
    data.addQuestion(d.pollId, { q: d.q, a: d.a });
    socket.emit("questionUpdate", data.activateQuestion(d.pollId));
  });

  socket.on("joinPoll", function (pollId) {
    socket.join(pollId);
    socket.emit("questionUpdate", data.activateQuestion(pollId));
    socket.emit("submittedAnswersUpdate", data.getSubmittedAnswers(pollId));
  });

  socket.on("startPoll", function (pollId) {
    io.to(pollId).emit("startPoll");
  });
  socket.on("runQuestion", function (d) {
    let question = data.activateQuestion(d.pollId, d.questionNumber);
    io.to(d.pollId).emit("questionUpdate", question);
    io.to(d.pollId).emit(
      "submittedAnswersUpdate",
      data.getSubmittedAnswers(d.pollId)
    );
  });

  socket.on("submitAnswer", function (d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit(
      "submittedAnswersUpdate",
      data.getSubmittedAnswers(d.pollId)
    );
  });

  /* Connect4 Game specifig */
  socket.on("createLobby", (e) => {
    console.log("A player has created a lobby");
    const lobby = new Lobby(io, socket, data);
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

  // id: this.pollId, column: col
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
    }
  });


}
export { sockets };
