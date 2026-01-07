<template>
  <div>
    <!-- Ta bort denna div senare då den inte tillhör vår kod och lär inte behövas? Någon komponent kanske kan användas?-->
    {{ pollId }}
    <QuestionComponent
      v-bind:question="question"
      v-on:answer="submitAnswer($event)"
    />
    <hr />
    <span style="color: black;">{{ submittedAnswers }}</span>
  </div>
<main>  
  <header>
    <h1>{{ pollId }}</h1>
  </header>
  <section>
    <SpelPlan
      v-bind:size="size"
      v-bind:boardData="boardData"
      v-on:placeBrick="placeMarker"
    />
    <h2>
      {{ currentPlayer + "'s: turn" }}
      <!-- ändra så den kan variera -->
    </h2>
  </section>
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
    size() {
      return {rows: state.gameBoard[0].length, cols: state.gameBoard.length}
    },
    currentPlayer() {
      return state.currentPlayer;
    }
  },
  data: function () {
    return {
      question: {
        q: "",
        a: [],
        correctAnswer: "",
      },
      pollId: "inactive poll",
      submittedAnswers: {},
    };
  },
  created: function () {
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
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", { pollId: this.pollId, answer: answer });
    },
    placeMarker: function (col) {
      
      socket.emit("placeMarker", {id: this.pollId, column: col})
    },
  },
};
</script>

<style scoped>
/* verkar som man ändå borde ha scoped. Tolkade som att denna css kan påverka andra komponenter i så fall?? */

main {
    background-image: url(/img/AmongUsWallPaper.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
}

</style>
