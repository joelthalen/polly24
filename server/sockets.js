import { Lobby } from "./lobby.js";

function sockets(io, socket, data) {
  
  
  
  
  
  //här under är alla gamla sockets vi fick från kodsklettet. Kan även vara någon lobby socket också
  console.log(`User connected with ID ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("Client Disconnected");
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

  socket.on("participateInPoll", function (d) {
    data.participateInPoll(d.pollId, d.name);
    io.to(d.pollId).emit("participantsUpdate", data.getParticipants(d.pollId));
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
}
export { sockets };
