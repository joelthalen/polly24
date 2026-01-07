// Based on how to use sockets with Vue 3 according to link below
// https://socket.io/how-to/use-with-vue

import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  lobby: {
    ID: "0",
    gameBoard: [[]],
    participants: [],
  },
  gameBoard: [
    ["white", "white", "white", "white", "white", "white"],
    ["white", "white", "white", "white", "white", "white"],
    ],
  currentQuestion: {q: "test", a: ["a", "b", "c"], correctAnswer: "a"},

  currentPlayer: null,
});

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket = io(URL);

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

/**
 * GAME Sockets
 * <CLIENT> <--> <SERVER>
 * Place marker ->
 *   --  check validity
 *   --  if not valid
 * notValid <-- SendNotValid
 *   --  else
 * onLobbyUpdate <-- Update clients
 *
 *
 */

socket.on("lobbyUpdate", (event) => {
  const {
    announceLevel, // Higher means more important!
    message,
    lobbyState,
  } = event;
  state.lobby = lobbyState;

  console.log(message);
});

socket.on("gameBoardUpdate", (newGameBoard) => {
  state.gameBoard = newGameBoard;
});

socket.on("updateQuestion", (question) => {
  state.currentQuestion = question;
});

/*socket.on("correctAnswer", () => {
  console.log("Correct answer!");
});

socket.on("wrongAnswer", () => {
  console.log("Wrong answer, try again!");
}); */

socket.on("currentPlayerUpdate", (username) => {
  state.currentPlayer = username;
})
