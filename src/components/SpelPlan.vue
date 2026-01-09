<template>

<div id="spelPlan" :style="boardStyle">
      <div
        v-on:click="placeBrick(col - 1)"
        v-for="col in size.cols"
        :key="col"
        class="column"
      >
        <div
          v-for="row in size.rows"
          :key="row"
          class="cell"
        >
        <div class="slot" :style="{ 'background-color': boardData[col - 1][row - 1] }">

        </div></div>
      </div>
    </div>


</template>


<script>    
export default {
  name: "SpelPlan",
  data() {
    return {
      defaultViewportMax: 80,
      height: 1,
      width: 1,
    }
  },
  props: { 
    boardData: {
      type: Array,
      required: true,
    },
  },
  beforeMount() {
    this.height = this.defaultViewportMax;
    this.width = this.defaultViewportMax;
    if (this.size.rows > this.size.cols) {
      // if more rows than cols
      this.width = Math.floor(this.width * (this.size.cols / this.size.rows));
    } else {
      this.height = Math.floor(this.height * (this.size.rows / this.size.cols));
    }
  },
  computed: {
    size() {
      return {
        rows: this.boardData[0].length,
        cols: this.boardData.length
      }
    },
    cellWidth() {
      return this.height / (this.size.rows);
    },
    cellHeight() {
      return Math.floor(100 / (this.size.rows));
    },
    boardStyle() {
      return {
        height: this.height+"vmin",
        width: this.width+"vmin",
        marginLeft: "-"+this.width/2+"vmin"
      }
    }
  },
  emits: ["placeBrick"],
  methods: {
    placeBrick: function (col) {
      this.$emit("placeBrick", col)
    },
  },
};

</script>

<style scoped>

#spelPlan { /* Måste ändra så den skalas med att sidan blir mindre och så att inte en kolumn kastas ned är webpagen blir mindre än vad spelplandens width är */
  width: 80vmin;
  position: absolute;
  z-index: 0;
  left: 50%;
  bottom: 5vmin;
  background-color: var(--light-blue-color);
  border: 1px solid black;
  border-radius: 1em;
  line-height: 0em; /**Spelplan object is too big if not here */
  overflow: hidden;
}

.column {
  display: inline-block;
  height: 100%;
}

.cell {
  width: auto;
  aspect-ratio: 1;
}

.slot {
  margin: 5%;
  border: 1px solid black;
  aspect-ratio: 1;
  text-align: center;
  line-height: 4em; /* gör så att texten hamnar längre ned i rutan... kanske ändra till relativa storlekar också, kanske storleken av divven/ cellen */
  border-radius: 50%;
}

.column:hover {
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.circle {

}
.cross {

}

</style>