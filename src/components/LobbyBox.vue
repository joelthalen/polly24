<template>
    <h3>{{ uiLabels.status }}</h3>
    
    <div class="playerList">
        <div class="playerRow" v-for="participant in participants" :key="participant.username">
            <div class="playerStatus">
                <p v-if="participant.isHost">{{ uiLabels.isHost }}</p>
                <p v-if="!participant.isHost">{{ participant.ready ? uiLabels.ready : uiLabels.notReady }}</p>
            </div>
            <div class="playerName"><p>{{ participant.username }}</p></div>
            <div class="playerTeam">
                <p v-if="!isHost">{{ participant.team === 'player' ? uiLabels.player : uiLabels.spectator }}</p>
                <select v-model="participant.team" v-if="isHost" @change="changeTeam(participant)">
                    <option value="player">{{ uiLabels.player }}</option>
                    <option value="spectator">{{ uiLabels.spectator }}</option>
                </select>
            </div>     
        </div>
    </div>

    <button class="readyButton" @click="changeReady" v-if="!isHost">
              <!-- TODO -->
        <div v-if="isReady">Un-ready!</div>
        <div v-else>Ready!</div> <!--Vad ska vi skriva här för att man ska fatta vilket läge man är i?-->
              <!-- Kanske ändra till en checkbox? mindre oklart -->
    </button>
            
    <button class="startButton" @click="startGame" v-if="isHost">{{ uiLabels.startGame }}</button>


</template>

<script>
    import { state } from '../socket.js';

export default {
  name: 'LobbyBox',
  props: {
      participants: Array,
      isHost: Boolean,
      isReady: Boolean,
  },
  computed: {
    uiLabels() {
      return state.uiLabels;
    }
  },
  emits: ["changeTeam", "changeReady", "startGame"],
  methods: {
    changeTeam: function (participant) {
        this.$emit("changeTeam", participant);
    },
    changeReady: function () {
        this.$emit("changeReady");
    },
    startGame: function () {
        this.$emit("startGame");
    }
    
  }
}
</script>

<style scoped>
    h3 {
        text-align: center;
        margin: 2%;
    }

    .playerRow {
        display: grid;
        grid-template-columns: 15% 55% 30%;
        margin-bottom: 5px;
        align-items: center
    }

    .playerStatus {
        grid-column: 1;
    }

    .playerName {
        grid-column: 2;
    }

    .playerTeam {
        grid-column: 3;
    }

    select {
        background-color: rgba(113, 113, 113, 0.5);
        border: solid 2px rgb(219, 219, 219);
        color: white;
        border-radius: 4px;
        min-height: 4vh;
    }

    select:hover {
        background-color: rgba(150, 150, 150, 0.7);
        cursor: pointer;
    }

    button {
        background-color: rgba(113, 113, 113, 0.5);
        border: solid 2px rgb(219, 219, 219);
        color: white;
        border-radius: 4px;
        min-height: 4vh;
    }

    button:hover {
        background-color: rgba(150, 150, 150, 0.7);
        cursor: pointer;
    }

    .readyButton {
        height: 5vh;
        width: 10vw;
    }

    .startButton {
        height: 5vh;
        width: 10vw;  
    }
</style>
