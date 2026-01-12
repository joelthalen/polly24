<template>

<div id="spelPlan" :style="boardStyle">
      <div
        v-on:click="placeBrick(col - 1)"
        :style="{width: columnWidth + 'vmin'}"
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
      height: 1,
      width: 1,
    }
  },
  props: { 
    boardData: {
      type: Array,
      required: true,
    },
    bottomMargin: {
      type: Number,
      required: true
    },
    viewportSizeMax: {
      type: Number,
      required: true
    }
  },
  created() {
    this.height = this.viewportSizeMax;
    this.width = this.viewportSizeMax;
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
    columnWidth() {
      return this.width / this.size.cols;
    },
    cellWidth() {
      return this.height / (this.size.rows);
    },
    boardStyle() {
      return {
        height: this.height+"vmin",
        width: this.width+"vmin",
        marginLeft: "-"+this.width/2+"vmin",
        bottom: this.bottomMargin+"vh"
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
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.column {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cell {
  flex-grow: 1;
  width: 100%;
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

</style>