<template>
  <main>
      <p>
        {{ lobbyState }}
      </p>
    <section class = "topSection">
      <RouterLink to="/">Leave Lobby</RouterLink>
      <div class="logoBox"></div> <!-- Här ska loggan finnas-->
      <div> <!--Här finns språkknappen-->
          <LanguageButton/>
      </div>
    </section>
      <p class="codeBox">
        Lobby Code: {{ pollId }}
      </p>
      <div v-if="!joined">
        <input type="text" v-model="userName">
        <button v-on:click="participateInPoll">
          {{ this.uiLabels.participateInPoll }}
        </button>
      </div>

      <div v-if="joined">
        <div class="wrapper">
          <div class="settingsBox">
            <h3>Settings</h3>

          </div>
          <div class="statusBox">
            <h3>Status</h3>

            <button class="readyButton" @click="changeReady" v-if="!isHost">
              <div v-if="isReady">Un-ready!</div>
              <div v-else>Ready!</div> <!--Vad ska vi skriva här för att man ska fatta vilket läge man är i?-->
              <!-- Kanske ändra till en checkbox? mindre oklart -->
            </button>

            <button class="startButton" v-if="isHost">Start Game</button>

          </div>
        </div>
        <p>Waiting for host to start poll</p>
        {{ participants }}
        

      </div>

  </main>
  <EmojiChatComponent @sendEmoji="sendEmoji()" :counter="emojiCounter" ></EmojiChatComponent>
</template>

<script>
import LanguageButton from '../components/LanguageButton.vue';
import EmojiChatComponent from '@/components/EmojiChatComponent.vue';
import { socket, state } from '../socket';

export default {
  name: 'LobbyView',
  components: {
    EmojiChatComponent,
    LanguageButton,
  },
  computed: {
    lobbyState() {
      return state.lobby;
    }
  },
  data: function () {
    return {
      userName: "",
      pollId: "inactive poll",
      uiLabels: {},
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
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "participantsUpdate", p => this.participants = p );
    socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId) );
    socket.on("lobbyUpdate", (event) => {
      console.log(event.message);
      this.lobbyState = event.lobbyState;
    });
    socket.on("gameStart", () => this.$router.push(`/poll/${this.pollId}`))
    socket.on("sendEmoji", () => {
      this.emojiCounter += 1
    })
    socket.emit( "joinPoll", this.pollId );
    socket.emit("joinLobby", this.pollId);
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    participateInPoll: function () {
      socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName} )
      this.joined = true;
    },
    changeReady: function () {
      this.isReady = !this.isReady;
      socket.emit( "updateProfile", {pollId: this.pollId, username: this.userName, ready: this.isReady})
      console.log("Ready status changed to " + this.isReady);
    },
    sendEmoji: function() {
      socket.emit("sendEmoji");
    },

  }
}
</script>

<style scoped> 
  .logoBox{
    height: 90%;
    width: 90%;
    margin: 5vh;
    background-size: contain; 
    background-position: center;
    background-repeat: no-repeat;
  }

  .topSection {
  height: 20vh;
}


  @media (orientation: landscape){
    .logoBox{
      background-image: url(/img/AmongUs.png);
    }
  }

  @media (orientation: portrait){
    .logoBox{
      background-image: url(/img/AmongUsPortrait.png);
    }
  }

main {
    background-image: url(/img/AmongUsWallPaper.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
}

.codeBox {
    font-size: 2em;
    color: white;
    text-shadow: 2px 2px 4px #000000;
}

.wrapper {
  display: grid;
  grid-template-columns: 35vw 10vw 35vw;
  margin-left: 10vw;
  margin-right: 10vw;
  height: 40vh;
}

.wrapper div {
  box-shadow: 0 0 10px rgb(219, 219, 219);
  background-color: rgb(0,0,0,0.5);
  border-radius: 10px;
  border: solid 4px grey;
}

.settingsBox {
  
  grid-column: 1;
}

.statusBox {

  grid-column: 3;

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
</style>
