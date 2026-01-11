<template>
  <main>
      <p>
        {{ lobbyState }}
      </p>
    <section class = "topSection">
      <button @click="leaveLobby">{{ uiLabels.leaveLobby }}</button>
      <div class="logoBox"><img alt="Logo"></div> <!-- Här ska loggan finnas-->
      <div> <!--Här finns språkknappen-->
          <LanguageButton/>
      </div>
    </section>
      <p class="codeBox">
        {{ uiLabels.lobbyCode }}: {{ pollId }}
      </p>
      <div v-if="!joined">
        <div class="usernameBox">
          ️<p>{{ this.uiLabels.chooseUsername }}</p>
          <input type="text" v-model="userName" @keyup.enter="chooseUsername">
          <button v-on:click="chooseUsername">
            {{ this.uiLabels.joinLobby }}
          </button>
        </div>
      </div>

      <div v-if="joined">
        <div class="layoutWrapper">
          <div class="settingsBox">
            <SettingsBox
              :columns="lobbyState.columns"
              :rows="lobbyState.rows"
              :winCondition="lobbyState.wincondition"
              :difficulty="lobbyState.difficulty"
              @columns="changeSize($event, lobbyState.rows)"
              @rows="changeSize(lobbyState.columns, $event)"
              @winCondition="changeWinCondition($event)"
              @difficulty="changeDifficulty($event)"
            />
            <!-- Gamla settingslådan
            <h3>{{ uiLabels.settings }}</h3>
              <div>{{ uiLabels.columns }}: 
                <button class="columnsMinusButton" :disabled="lobbyState.columns<=4" @click="changeSize(lobbyState.columns - 1, lobbyState.rows)">-</button>
                {{ lobbyState.columns }}
                <button class="columnsPlusButton" :disabled="lobbyState.columns>=10" @click="changeSize(lobbyState.columns + 1, lobbyState.rows)">+</button></div>
              <div>{{uiLabels.rows}}: <button class="rowsMinusButton" :disabled="lobbyState.rows<=4" @click="changeSize(lobbyState.columns, lobbyState.rows - 1)">-</button>
                {{ lobbyState.rows }}
                <button class="rowsPlusButton" :disabled="lobbyState.rows>=10" @click="changeSize(lobbyState.columns, lobbyState.rows + 1)">+</button></div>
              <div>{{uiLabels.winCondition}}:
                <button class="winConditionMinusButton" :disabled="(lobbyState.wincondition<=2)" @click="changeWinCondition(lobbyState.wincondition - 1)">-</button>
                {{ lobbyState.wincondition }}
                <button class="winConditionPlusButton" :disabled="lobbyState.wincondition>=Math.max(lobbyState.rows, lobbyState.columns)" @click="changeWinCondition(lobbyState.wincondition + 1)">+</button></div>
              <div>
                {{uiLabels.questionDifficulty}}: 
                <span v-if="lobbyState.difficulty === 0">{{ uiLabels.easy }}</span>
                <span v-else-if="lobbyState.difficulty === 1">{{ uiLabels.hard }}</span>
                <span v-else>{{ uiLabels.unknown }}</span>
                <button class="difficultyButton" @click="changeDifficulty(lobbyState.difficulty)">
                  {{ uiLabels.changeDifficulty }}
                </button>
              
              
              </div>
            -->
          </div>
          <div class="statusBox">
            <h3>{{ uiLabels.status }}</h3>

            <div class="playerList">
              <div class="playerRow" v-for="participant in lobbyState.participants" :key="participant.username">
                <div class="playerStatus"><p>{{ participant.ready ? 'Ready' : 'Not Ready' }}</p></div>
                <div class="playerName"><p>{{ participant.username }}</p></div>
                <div class="playerTeam">
                  <p v-if="!isHost">{{ participant.team }}</p>
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

          </div>
        </div>
        <p>{{ uiLabels.waitingForHost}}</p>
        {{ participants }}
        

      </div>

  </main>
  <EmojiChatComponent @sendEmoji="sendEmoji()" :counter="emojiCounter" ></EmojiChatComponent>
</template>

<script>
import LanguageButton from '../components/LanguageButton.vue';
import EmojiChatComponent from '@/components/EmojiChatComponent.vue';
import SettingsBox from '@/components/SettingsBox.vue';
import { socket, state } from '../socket';

export default {
  name: 'LobbyView',
  components: {
    EmojiChatComponent,
    LanguageButton,
    SettingsBox,
  },
  computed: {
    lobbyState() {
      return state.lobby;
    },
    uiLabels() {
      return state.uiLabels;
    }
  },
  data: function () {
    return {
      userName: "",
      pollId: "inactive poll",
      joined: false,
      lang: localStorage.getItem("lang") || "en",
      participants: [],
      isHost: false,
      isReady: false,
      emojiCounter: 0,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on("lobbyNotFound", () => this.$router.push({path: "/", query: {action: "lobbyNotFound"}}));

    socket.on( "participantsUpdate", p => this.participants = p );
    socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId) );
    socket.on("gameStart", () => this.$router.push(`/poll/${this.pollId}`))
    socket.on("sendEmoji", () => {
      this.emojiCounter += 1
    })
    socket.on("joinedLobby", (e) => {
      this.isHost = e.isHost;
    })
    socket.emit( "joinPoll", this.pollId );
    socket.emit("joinLobby", this.pollId);
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    chooseUsername: function () {
      const playerIsInLobby = this.lobbyState.participants.some(p => p.username === this.userName) 
      if (playerIsInLobby) {
        alert(this.uiLabels.usernameTaken);
        return;
      };
      socket.emit( "updateProfile", {pollId: this.pollId, username: this.userName})
      this.joined = true;
    },
    changeTeam: function (participant) {
      console.log(participant);
      socket.emit( "updateOtherProfiles", {pollId: this.pollId, username: participant.username, team: participant.team})
    },
    changeReady: function () {
      this.isReady = !this.isReady;
      socket.emit( "updateProfile", {pollId: this.pollId, username: this.userName, ready: this.isReady})
      console.log("Ready status changed to " + this.isReady);
    },
    sendEmoji: function() {
      socket.emit("sendEmoji");
    },
    changeSize: function(columns, rows) {
      socket.emit("changeSize", {pollId: this.pollId, columns: columns, rows: rows});
    },
    changeDifficulty: function(difficulty) {
      socket.emit("changeDifficulty", {pollId: this.pollId, difficulty: difficulty});
    },
    changeWinCondition: function(wincondition) {
      socket.emit("changeWinCondition", {pollId: this.pollId, wincondition: wincondition});
    },
    // TODO: Method for everyone being ready to start the game exists, but cant be true
    startGame: function () {
      socket.emit("startGame", this.pollId);
    },
    leaveLobby: function() {
      socket.emit("leaveLobby");
      this.$router.push({path: "/", query: {action: "leftLobby"}})
    }
  }
}
</script>

<style scoped> 
  main {
    background-image: url(/img/AmongUsWallPaper.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
  }

  .logoBox{
  margin: 2vh;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  }

  img {
    max-width: 100%;
    align-self: center;
  }


  @media (orientation: landscape){
    img {
      content:url(/img/AmongUs.png);
    }
  }

  @media (orientation: portrait){
    img {
      content:url(/img/AmongUsPortrait.png);
    }
  }
/*Ovanför är renskrivet*/


  .topSection {
  height: 25vh;
}






.codeBox {
    font-size: 2em;
    color: white;
    text-shadow: 2px 2px 4px #000000;
}

.layoutWrapper {
  display: grid;
  grid-template-columns: 35vw 10vw 35vw;
  margin-left: 10vw;
  margin-right: 10vw;
  height: 40vh;
}

.usernameBox {
  box-shadow: 0 0 10px rgb(219, 219, 219);
  border-radius: 10px;
  border: solid 4px grey;
  margin-left: 35vw;
  margin-right: 35vw;
  height: 20vh;
  background-color: rgba(7, 7, 7, 0.8);
}

.settingsBox {
  box-shadow: 0 0 10px rgb(219, 219, 219);
  border-radius: 10px;
  border: solid 4px grey;
  grid-column: 1;
  background-color: rgba(7, 7, 7, 0.8);
}

.statusBox {
  box-shadow: 0 0 10px rgb(219, 219, 219);
  border-radius: 10px;
  border: solid 4px grey;
  grid-column: 3;
  background-color: rgba(7, 7, 7, 0.8);
}

h3 {
    color: white;
    
}

.lobbyBox {
    height: 20vh;
    width: 50vw;
    margin: 5vh;
    background-color: rgba(255, 255, 255, 0.8);
  }

.readyButton {
    background-color: white;
    height: 5vh;
    width: 10vw;
}

.playerRow {
  display: grid;
  grid-template-columns: 15% 55% 30%;
  margin-bottom: 5px;
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
</style>
