<template>
<div id="questionCard" 
  :style="{backgroundColor: 'rgb(from ' + color + ' R G B / ' + this.opacity + ')'}">
    <div>
      <p>{{ color }}</p>
      <p>{{ question.q }}</p>
    </div>
    <div class="questionAlternative" v-for="a in question.a" v-on:click="answer(a) " v-bind:key="a">
      <p>{{ a }}</p>
    </div>
</div>


</template>
<script>
export default {
  name: 'QuestionComponent',
  props: {
    question: Object,
    color: String,
  },
  emits: ["answer"],
  methods: {
    answer: function (answer) {
      this.$emit("answer", answer);
    } 
  },
  data() {
    return {
      opacity: 0.7,
    }
  }
}
</script>
<style scoped>
  p {
    color: black;
  }
  #questionCard {
    margin: auto;
    border: 2px solid black;
    width: 40vw;
    height: 40vh;
    position: absolute;
    top: calc(50% - 20vh);
    left: calc(50% - 20vw);
    z-index: 10;
    background-color: rgba(255, 25, 25, 0.80);
    border-radius: 15px;
  }
  .questionAlternative {
    color: black;
  }
  .questionAlternative:hover {
    background-color: lightgray;
    cursor: pointer;
  }
</style>