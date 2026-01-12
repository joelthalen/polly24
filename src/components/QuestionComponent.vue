<template>
<div id="questionCard" 
  :style="{backgroundColor: 'rgb(from ' + color + ' R G B / ' + this.opacity + ')'}">
    <div>
      <p class="title">{{ title }}</p>
      <p class="question">{{ question.q }}</p>
    </div>
      <div class="questionAlternative" v-for="a in question.a" v-on:click="(e) => answer(a, e)" v-bind:key="a">
        <p class="answer">{{ a }}</p>
      </div>
</div>


</template>
<script>
import { socket } from '../socket';

export default {
  name: 'QuestionComponent',
  props: {
    question: Object,
    color: String,
    title: String,
  },
  data() {
    return {
      selectedElement: undefined,
    }
  },
  emits: ["answer"],
  methods: {
    answer: function (answer) {
      this.$emit("answer", answer);
    } 
  },
  data() {
    return {
      opacity: 0.85,
    }
  }
}
</script>
<style scoped>
  p {
    color: black;
    margin: 0;
  }
  .title {
    font-size: 2rem;
  }
  .question {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  #questionCard {
    margin: auto;
    border: 2px solid black;
    width: 40vw;
    min-width: fit-content;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    background-color: rgba(255, 25, 25, 0.80);
    border-radius: 15px;
    overflow: hidden;
  }
  button {
    -webkit-appearance: none;
    border-radius: 0;
    text-align: inherit;
    background: none;
    box-shadow: none;
    padding: 0;
    cursor: pointer;
    border: none;
    color: inherit;
    font: inherit;
}

  .questionAlternative {
    color: black;
    font-size: 1.2rem;
    font-weight: bold;
    padding: 0.5rem 0;
    border-top: 1px solid;
  }
  .questionAlternative:hover {
    background-color: rgb(from lightgray r g b / 0.5);
    cursor: pointer;
  }
</style>