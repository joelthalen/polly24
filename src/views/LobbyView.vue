<template>
  <main>
      <!--p>
        {{ lobbyState }}
      </p-->
    <section class = "topSection">
      <div class = "leaveBox">
        <button @click="leaveLobby">{{ uiLabels.leaveLobby }}</button>
      </div>
      <div class ="languageBox"> <!--Här finns språkknappen-->
          <LanguageButton/>
      </div>
      <div class="logoBox"><img alt="Logo"></div> <!-- Här ska loggan finnas-->
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
          </div>
          <div class="statusBox">
            <h3>{{ uiLabels.status }}</h3>

            <div class="playerList">
              <div class="playerRow" v-for="participant in lobbyState.participants" :key="participant.username">
                <div class="playerStatus">
                  <p v-if="participant.isHost">{{ uiLabels.isHost }}</p>
                  <p v-if="!participant.isHost">{{ participant.ready ? uiLabels.ready : uiLabels.notReady }}</p></div>
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

          </div>
        </div>
        <p>{{ uiLabels.waitingForHost}}</p>      

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
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  margin-left: 10vw;
  margin-right: 10vw;
  }

  img {
    max-width: 100%;
    align-self: center;
  }


  @media (orientation: landscape){
    img {
      content:url(/img/AmongUs.png);
    }

    .layoutWrapper {
      display: grid;
      grid-template-columns: 35vw 10vw 35vw;
      margin-left: 10vw;
      margin-right: 10vw;
      height: 40vh;
    }

    .settingsBox {
      grid-column: 1;
      }

    .statusBox {
      grid-column: 3;
    }
  }

  @media (orientation: portrait){
    
    main  {
    overflow-y: auto;
    }

    img {
      content:url(/img/AmongUsPortrait.png);
    }

    .layoutWrapper {
      display: grid;
      grid-template-columns: 80vw;
      grid-template-rows: auto 5vw auto;
      margin-left: 10vw;
      margin-right: 10vw;
      height: auto;
    }

    .settingsBox {
      grid-row: 1
    }
    .statusBox {
      grid-row: 3
    }
  }
/*Ovanför är (var /Valdemar) renskrivet*/


  .topSection {
  height: 25vh;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  gap: 0.75rem;
  align-items: center;
}

.leaveBox {
justify-self: end;
}

.languageBox {
justify-self: start;
}

.codeBox {
    font-size: 2em;
    color: white;
    text-shadow: 2px 2px 4px #000000;
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
  background-color: rgba(7, 7, 7, 0.8);
}

.statusBox {
  box-shadow: 0 0 10px rgb(219, 219, 219);
  border-radius: 10px;
  border: solid 4px grey;
  background-color: rgba(7, 7, 7, 0.8);
}

h3 {
    color: white;
}

.readyButton {
    height: 5vh;
    width: 10vw;
}

.startButton {
    height: 5vh;
    width: 10vw;  
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

input {
 min-height: 3.4vh; 
}

.playerRow {
  display: grid;
  grid-template-columns: 25% 50% 25%;
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
</style>
