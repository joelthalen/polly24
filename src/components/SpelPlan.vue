<template>

<div id="spelPlan">
      <div
        v-on:click="placeBrick(col - 1)"
        v-for="col in size.cols"
        :key="col"
        class="column"
      >
        <div
          v-bind:style="{ 'background-color': boardData[col - 1][row - 1] }"
          v-for="row in size.rows"
          :key="row"
          class="cell"
        ></div>
      </div>
    </div>


</template>


<script>    
export default {
  name: "SpelPlan",
  props: { 
    size: {
      type: Object,
      required: true,
    },
    boardData: {
      type: Array,
      required: true,
    },
    currentPlayer: {
      type: String,
      required: true,
    },
  },
  emits: ["placeBrick"],
  methods: {
    placeBrick: function (col) {
      /*for (let cell = this.size.rows - 1; cell >= 0; cell--) {
        if (this.boardData[col][cell] === "white") {
          this.boardData[col][cell] =
            this.currentPlayer === true ? "red" : "blue";
          break;
        }
      }*/
      this.$emit("placeBrick", col)
    },
  },
};

</script>

<style scoped>

#spelPlan { /* Måste ändra så den skalas med att sidan blir mindre och så att inte en kolumn kastas ned är webpagen blir mindre än vad spelplandens width är */
  width: fit-content;
  margin: auto;
  height: fit-content;
  background-color: var(--light-blue-color);
  border: 1px solid black;
  border-radius: 5%;
  line-height: 0em; /**Spelplan object is too big if not here */
  overflow: hidden;
  
  
}

.cell {
  width: 4em; /* ändra till relativa storlekar */
  height: 4em;
  border: 1px solid black;
  text-align: center;
  line-height: 4em; /* gör så att texten hamnar längre ned i rutan... kanske ändra till relativa storlekar också, kanske storleken av divven/ cellen */
  border-radius: 50%;
  margin: 0.5em;
}

.column {
  display: inline-block; /* ändra till grid eller felx*/
}
.column:hover {
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}




</style>