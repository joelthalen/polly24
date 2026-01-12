<template>
    <h3>{{ uiLabels.settings }}</h3>
    <div class="wrapper">
        <div class="columnsSettings">
            <p class="textP">{{ uiLabels.columns }}</p> 
            <button class="minusButton" :disabled="columns<=4" @click="changeColumns(-1)">-</button>
            <p class="amountP">{{ columns }}</p>
            <button class="plusButton" :disabled="columns>=10" @click="changeColumns(+1)">+</button>
        </div>
        <div class="rowsSettings">
            <p class="textP">{{ uiLabels.rows }}</p>
            <button class="minusButton" :disabled="rows<=4" @click="changeRows(-1)">-</button>
            <p class="amountP">{{ rows }}</p>
            <button class="plusButton" :disabled="rows>=10" @click="changeRows(+1)">+</button>
        </div>
        <div class="winConditionSettings">
            <p class="textP">{{ uiLabels.winCondition }}</p>
            <button class="minusButton" :disabled="(winCondition<=2)" @click="changeWinCondition(-1)">-</button>
            <p class="amountP">{{ winCondition }}</p>
            <button class="plusButton" :disabled="winCondition>=Math.max(rows, columns)" @click="changeWinCondition(+1)">+</button>
        </div>
        <div class="difficultySettings">
            <p class="textP">{{ uiLabels.questionDifficulty }}</p>
            <!--<p>
                <span v-if="difficulty === 0">{{ uiLabels.easy }}</span>
                <span v-else-if="difficulty === 1">{{ uiLabels.hard }}</span>
                <span v-else>{{ uiLabels.unknown }}</span>
            </p> This was here when this was just one difficulty button. Leaving here in case we want to change it back-->
            <button class="difficultyButton" :disabled="this.difficulty === 0" @click="changeDifficulty(difficulty)">
                {{ uiLabels.easy }}
            </button>
            <button class="difficultyButton" :disabled="this.difficulty === 1" @click="changeDifficulty(difficulty)">
                {{ uiLabels.hard }}
            </button>
        </div>
    </div>


</template>

<script>
    import { state } from '../socket.js';

export default {
  name: 'SettingsBox',
  props: {
      columns: Number,
      rows: Number,
      winCondition: Number,
      difficulty: Number,
  },
  computed: {
    uiLabels() {
      return state.uiLabels;
    }
  },
  emits: ["columns", "rows", "winCondition", "difficulty"],
  methods: {
    changeColumns: function (change) {
        let newColumn = this.columns+change;
        this.$emit("columns", newColumn);
    },
    changeRows: function (change) {
        let newRows = this.rows+change;
        this.$emit("rows", newRows);
    },
    changeWinCondition: function (change) {
        let newWinCondition = this.winCondition + change;
        this.$emit("winCondition", newWinCondition);
    },
    changeDifficulty: function (difficulty) {
        this.$emit("difficulty", difficulty);
    }
  }
}
</script>

<style scoped>
    h3 {
        text-align: center;
        margin: 2%;
    }

    .columnsSettings{
        grid-column: 1;
        grid-row: 1;
    }

    .rowsSettings{
        grid-column: 2;
        grid-row: 1;
    }

    .winConditionSettings{
        grid-column: 1;
        grid-row: 2;
    }
    
    .difficultySettings{
        grid-column: 2;
        grid-row: 2;
    }

    .columnsSettings, .rowsSettings, .winConditionSettings{
        display: grid;
        grid-template-columns: repeat(3, 30%);
        grid-template-rows: repeat(2, 40%);
        align-items: center;
        justify-content: center;
        column-gap: 10px;
        row-gap: 20%;
    }

    button {
        background-color: rgba(113, 113, 113, 0.5);
        border: solid 2px rgb(219, 219, 219);
        color: white;
        border-radius: 4px;
        height: 90%;
    }

    button:hover {
        background-color: rgba(150, 150, 150, 0.7);
        cursor: pointer;
    }

    .textP {
        grid-column: span 3;
        grid-row: 1;
        justify-self: center;
    }

    .amountP {
        grid-column: 2;
        grid-row: 2;
        justify-self: center;
    }

    .plusButton {
        grid-column: 3;
        grid-row: 2;
        justify-self: center;
        width: 50%;
        
    }
    .minusButton {
        grid-column: 1;
        grid-row: 2;
        justify-self: center;
        width: 50%;
        
    }

    .difficultySettings {
        display: grid;
        grid-template-columns: repeat(2, 50%);
        grid-template-rows: repeat(2, 40%);
        align-items: center;
        justify-content: center;
        row-gap: 20%;
    }

    button:disabled {
        background-color: rgba(113, 113, 113, 0.1);
    }

    @media (orientation: landscape) {
        .wrapper {
        height: 80%;
        width: 95%;
        margin: 5% auto 5% auto;

        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 30%);
        row-gap: 30%;
        column-gap: 10%;

        font-weight: bold;
    }
    }

    @media (orientation: portrait) {
        .wrapper {
        height: 80%;
        width: 95%;
        margin: 5% auto 5% auto;

        display: grid;
        grid-template-columns: 1;
        grid-template-rows: repeat(2, 30%);
        row-gap: 30%;
        column-gap: 10%;

        font-weight: bold;
        }
    }

</style>
