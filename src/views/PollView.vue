<template>
  
  
  <div>
    {{pollId}}
    <QuestionComponent v-bind:question="question"
              v-on:answer="submitAnswer($event)"/>
    <hr>
    <span>{{submittedAnswers}}</span>
  </div> 

  <header>
    <h1>{{ pollId }}</h1>
  </header>
  <section>
    <div id="spelPlan">
        <div v-on:click="placeBrick(col-1)"  v-for="col in size.cols" :key="col" class="column">
            <div v-bind:style="{'background-color': boardData[col-1][row-1]}" v-for="row in size.rows" :key="row" class="cell">
            </div>
        </div>
    </div>
    <h2> 
      {{ currentPlayer + "'s: turn" }} <!-- ändra så den kan variera -->

    </h2>
  </section>


</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'PollView',
  components: {
    QuestionComponent
  },
  data: function () {
    return {
      question: {
        q: "",
        a: []
      },
      size : {rows:7, cols:7}, //ändra senare
      pollId: "inactive poll",
      submittedAnswers: {},
      boardData: [[],[],[],[],[],[],[]], //ändra senare
      currentPlayer: true , //ändra senare

    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "questionUpdate", q => this.question = q );
    socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    for (let col in this.boardData) {
      for (let row = 0; row < this.size.rows; row++) {
        this.boardData[col][row] = "white"; //initialisera brädets färger och ändrar beroende på vem
      }
    }
  },
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },
    placeBrick: function (col) {
      for (let cell = this.size.rows - 1 ; cell >= 0; cell--) {
        if (this.boardData[col][cell] === "white") {
          this.boardData[col][cell] = this.currentPlayer === true ? "red" : "blue";
          break;
        }
      }
      this.currentPlayer = !this.currentPlayer; //ändra senare så att surven hanterar skirftet av spalre dvs all spellogik
    }
  }
}
</script>

<style scoped> /* verkar som man ändå borde ha scoped. Tolkade som att denna css kan påverka andra komponenter i så fall?? */

#spelPlan{  
  width: fit-content; 
  margin: auto;
  background-color: rgb(4, 162, 242);
  border: 1px solid black;
  border-radius: 5%;
  
}

.cell{  
  width: 4em;  /* ändra till relativa storlekar */
  height: 4em;  
  border: 1px solid black;   
  text-align: center;  
  line-height: 4em;  /* gör så att texten hamnar längre ned i rutan... kanske ändra till relativa storlekar också, kanske storleken av divven/ cellen */
  border-radius: 50%;
  margin: 0.5em;
}

.column{  
  display: inline-block;  /* ändra till grid eller felx*/ 
   
}

</style>  