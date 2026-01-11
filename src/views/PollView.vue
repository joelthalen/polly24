<template>
  <div class="TESTFÖRBUTTONSATTSTARTAOMMATCHEN"> <!-- ÄNDRA SEN!!!!-->
    <button @click="restartGame()">{{uiLabels.startNewGame}}</button>
    <button @click="returnToHome()">{{uiLabels.returnToStart}}</button>
  </div>
  
  <main>
  <!--<h1>{{ pollId }}</h1> Visst behöver vi inte visa lobby ID i spelet eftersom man inte kan gå tillbaka till lobbyn?-->
  <div v-if="showQuestion">
    <QuestionComponent
    v-bind:title="'Question for ' + this.currentPlayer"
    v-bind:question="question" 
    v-bind:color="currentPlayerColor"
      v-on:answer="submitAnswer($event)"
    />
  </div>

  <div v-if="gameHasBeenWon" style="color: gold; font-size: 36px; font-weight: bold; text-align: center; background-color: black; z-index: 2; width: fit-content; margin: auto;">
    {{uiLabels.congratulations1}}{{ winner }}{{uiLabels.congratulations2}}
  </div> <!-- Vi behöver antaligen ändra dessa taggar, iaf byta till relativa storlekar.-->
  
  <div v-if="hasRestartedGame" style="color: aquamarine; font-size: 24px; font-weight: bold; text-align:center; background-color: black; z-index: 2; width: fit-content; margin: auto;">
    {{uiLabels.newGame}}

  </div>
  
  

  <div class="connection">
    <div style="z-index: 2;" v-if="spectating || wrongAnswer || correctAnswer">
        <div v-if="spectating" style="color: yellow; font-size: 24px; font-weight: bold; text-align: center; width: fit-content; background-color: black; opacity: 0.8; margin: auto;"> 
        {{ uiLabels.spectating }}
        </div>
      <div v-if="wrongAnswer" style="color: red; font-size: 24px; font-weight: bold; text-align: center; background-color: black; width: fit-content; margin: auto;">
        {{ uiLabels.incorrect }}
      </div>
      <div v-else-if="correctAnswer" style="color: green; font-size: 24px; font-weight: bold; text-align: center; background-color: black; width: fit-content; margin: auto;">
        {{uiLabels.correct}}
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
      hasRestartedGame: false,

    };
  },
  created: function () {
    
    socket.on("correctAnswer", () => {
      console.log("correctAnswer")
      this.showQuestion = false;
      this.correctAnswer = true;
      setTimeout(() => {
        this.correctAnswer = false;
      }, 2000);
    });

    socket.on("wrongAnswer", () => {
      console.log("wrongAnswer")
      this.wrongAnswer = true;
      setTimeout(() => {
        this.wrongAnswer = false;
      }, 2000);
    });
    socket.on("showQuestion", () => {
      if (!this.gameHasBeenWon){ 
      this.showQuestion = true;
      }
    });

    socket.on("gameOver", (winner) => {
      //alert("Game over! The winner is: " + winner); // tillfällig lösning: alert för att visa vinnaren
      this.showQuestion = false;  
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

    socket.on("gameHasRestarted", () => {
      this.hasRestartedGame = true;
      this.gameHasBeenWon = false;
      this.showQuestion = true;
      setTimeout(()=>{this.hasRestartedGame=false} , 2000)

    })
      
    


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
    },
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

button {
  background-color: rgba(113, 113, 113, 0.5);
  border: solid 2px rgb(219, 219, 219);
  color: white;
  border-radius: 4px;
  min-height: 3vh;
}

button:hover {
  background-color: rgba(150, 150, 150, 0.7);
  cursor: pointer;
}

</style>
