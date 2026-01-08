<template>
<div id="questionCard">
    <div>
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
    question: Object
  },
  emits: ["answer"],
  methods: {
    answer: function (answer) {
      this.$emit("answer", answer);
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
    background-color: rgba(255, 25, 25, 0.547);
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