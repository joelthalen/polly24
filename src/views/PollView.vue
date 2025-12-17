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
      v-bind:currentPlayer="currentPlayer"
      v-on:placeBrick="changePlayer()"
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
import io from "socket.io-client";
const socket = io("localhost:3000");

export default {
  name: "PollView",
  components: {
    QuestionComponent,
    SpelPlan
  },
  data: function () {
    return {
      question: {
        q: "",
        a: [],
        correctAnswer: "",
      },
      pollId: "inactive poll",
      size: { rows: 7, cols: 7 }, //ändra senare
      submittedAnswers: {},
      boardData: [[], [], [], [], [], [], []], //ändra senare
      currentPlayer: true, //ändra senare
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
    for (let col in this.boardData) {
      for (let row = 0; row < this.size.rows; row++) {
        this.boardData[col][row] = "white"; //initialisera brädets färger och ändrar beroende på vem
      }
    }
  },
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", { pollId: this.pollId, answer: answer });
    },
    changePlayer: function () {
      this.currentPlayer = !this.currentPlayer; //ändra senare så det blir spelarnamn och att serven hanterar detta
    },
  },
};
</script>

<style scoped>
/* verkar som man ändå borde ha scoped. Tolkade som att denna css kan påverka andra komponenter i så fall?? */

main {
    background-image: url(/public/img/AmongUsWallPaper.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
}

</style>
