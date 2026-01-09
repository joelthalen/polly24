<template>
  <main>
  <h1>{{ pollId }}</h1>
  <div v-if="showQuestion">
    <QuestionComponent
      v-bind:question="question" 
      v-on:answer="submitAnswer($event)"
    />
  </div>

  <div v-if="gameHasBeenWon" style="color: gold; font-size: 36px; font-weight: bold; text-align: center; background-color: black;">
    Congratulations {{ winner }}! You have won the game!

  </div>
  
  <div class="TESTFÖRBUTTONSATTSTARTAOMMATCHEN"> <!-- ÄNDRA SEN!!!!-->
    <button @click="restartGame()">Start New Game</button>
    <button @click="returnToHome()">Return to Start</button>
  </div>

  <div class="connection">
    <div>
        <div v-if="spectating" style="color: yellow; font-size: 24px; font-weight: bold; text-align: center;"> 
          You are spectating the game.
        </div>
      <div v-if="wrongAnswer" style="color: red; font-size: 24px; font-weight: bold; text-align: center;">
        Wrong answer! Next player's turn.
      </div>
      <div v-else-if="correctAnswer" style="color: green; font-size: 24px; font-weight: bold; text-align: center;">
        Correct answer! Please place your marker.
      </div>
    </div>
    <SpelPlan
    :bottomMargin="10"
    v-bind:boardData="boardData"
    v-on:placeBrick="placeMarker"
    />
    <h2>
      {{ currentPlayer + "'s: turn" }}
      <!-- ändra så den kan variera -->
    </h2>
  </div>
  <div class="versus">
    <p :class="{current: isCurrent(this.players[0].username), you: isMe(this.players[0].username)}" 
       :style="{color: this.players[0].color}">
          {{ this.players[0].username }}
    </p>
    <template v-for="player in this.players.slice(1)">
      <p>{{ uiLabels.versus || "VS." }}</p>
      <p :class="{current: isCurrent(player.username), you: isMe(player.username)}" :style="{color: player.color, borderColor: player.color}">{{ player.username }}</p>
    </template>
  </div>
  </main>
</template>

<script>
// @ is an alias to /src
import QuestionComponent from "@/components/QuestionComponent.vue";
import SpelPlan from "@/components/SpelPlan.vue"; 
import { socket, state } from "../socket";

export default {
  name: "PollView",
  components: {
    QuestionComponent,
    SpelPlan
  },
  computed: {
    boardData() {
      return state.gameBoard;
    },
    username() {
      return state.username;
    },
    currentPlayer() {
      return state.currentPlayer;
    },
    question() {
      return state.currentQuestion; //ändra så att pollview endast får tillgång till frågan och frågealternativen! inte rätt svar!
    },
    spectating() {
      return state.spectating;
    },
    players() {
      return state.lobby.participants.filter((p) => p.team === "player")
    },
    uiLabels() {
      return state.uiLabels;
    },
    currentPlayerColor() {
      console.log(this.players);
      console.log(this.currentPlayer);
      return this.players.find((p)=>p.username === this.currentPlayer).color;
    }
  },
  data: function () {
    return {
     
      pollId: "inactive poll",
      showQuestion: true,
      wrongAnswer: false,
      correctAnswer: false,
      winner: null,
      gameHasBeenWon: false,
      playerHasleft: false,

    };
  },
  created: function () {
    
    socket.on("correctAnswer", () => {
      this.showQuestion = false;
      this.correctAnswer = true;
      setTimeout(() => {
        this.correctAnswer = false;
      }, 2000);
    });

    socket.on("wrongAnswer", () => {
      this.wrongAnswer = true;
      setTimeout(() => {
        this.wrongAnswer = false;
      }, 2000);
    });
    socket.on("showQuestion", () => {
      this.showQuestion = true;
    });

    socket.on("gameOver", (winner) => {
      alert("Game over! The winner is: " + winner); // tillfällig lösning: alert för att visa vinnaren
      this.winner = winner;
      this.gameHasBeenWon = true;

    });

    socket.on("playerLeft", () => { 
      if (this.playerHasleft === false){
      alert("A player left the game. You you will be rerouted to start page")
      this.$router.push("/");
      this.playerHasleft = true
      }
    }); 
      
    


    //Från kodsklettet
    this.pollId = this.$route.params.id;
    socket.on("questionUpdate", (q) => (this.question = q));
    socket.on(
      "submittedAnswersUpdate",
      (answers) => (this.submittedAnswers = answers)
    );
    socket.on("uiLabels", (labels) => (this.uiLabels = labels));
    socket.emit("getUILabels", this.lang);
    socket.emit("joinPoll", this.pollId);
  },

  methods: {
    submitAnswer: function (ans) {
      socket.emit("submitAnswer", {id: this.pollId, answer: ans });
    },
    placeMarker: function (col) {
      socket.emit("placeMarker", {id: this.pollId, column: col})
    },
    isCurrent(username) {
      return username === this.currentPlayer;
    },
    isMe(username) {
      return this.username === username;
    }
    restartGame: function () {
      socket.emit("startNewGame", this.pollId);
    },
    returnToHome: function () { //just nu så uppdateras inte players i game när någon lämnar så spelet kan inte fortsätta. 
      socket.emit("leaveLobby", this.pollId);
      this.$router.push("/");
      //här kan man ha ett event som säger till alla andra spelare att någon lämnat gamet
    },
  },
}
</script>

<style scoped>
/* verkar som man ändå borde ha scoped. Tolkade som att denna css kan påverka andra komponenter i så fall?? */

main {
  display: flex;
  flex-direction: column;
  background-image: url(/img/AmongUsWallPaper.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  grid-template-columns: 1fr;
}

.connection {
  flex-grow: 1;
  height: auto;
  display: grid;
  grid-template-rows: 15% 75% 10%;
}

.versus {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  height: 8vh;
  font-size: 2.5rem;
  font-weight: bolder;
  justify-items: center;
  padding-bottom: 2vh;

  p {
    margin: 0;
  }

  .current {
    border-bottom: 0.1em solid;
  }

  .you::after {
    content: " (You)";
  }
}
</style>
