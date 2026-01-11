<template>
  <div v-if="connected">
    <p>Is not connected till server</p>
  </div>
  <main>
    <section class = "topSection">
      <div class="logoBox">
        <img alt="Logo">
      </div> <!-- Här ska loggan finnas-->
      <div> <!--Här finns språkknappen-->
          <LanguageButton />
      </div>
    </section>
    <section class="gameButtons">
      <div class="wrapper"> 
        <button class="hostButton" @click="hostGame">{{ uiLabels.host || "HOST" }}</button>
        <form @submit.prevent="joinGame" class="join-form" label="test">
          <input class="roomCodeField" 
            type="text" 
            v-model="roomCode" 
            :placeholder="uiLabels.roomCode || 'Room code'"
            required
            minlength="4" maxlength="4"> 
          <button class="joinButton">{{ uiLabels.join || "Join" }}</button>
        </form>

      </div>
    </section>
  </main>
</template>

<script>
  import LanguageButton from '../components/LanguageButton.vue';
  import { socket, state } from '../socket';

  export default {
    name: 'StartView',
    components: { 
      LanguageButton

    },
    data: function () {
      return {
        roomCode: '',
        lang: localStorage.getItem("lang") || "en"
      }
    },
    created: function() {
      socket.on("createdLobby", (e) => this.$router.push(`/lobby/${e.lobbyID}`));
    },
    mounted: function() {
      if (this.$route.query.action) {
        if (this.$route.query.action === "lobbyNotFound")
          console.log("Lobby not found");
      }
    },
    methods: {
      hostGame: function() {
        socket.emit("createLobby");
      },
      joinGame: function() {
        this.$router.push(`/lobby/${this.roomCode}`);
      }
    },
    computed: {
      connected() {
        return !state.connected;
      },
      uiLabels() {
        return state.uiLabels;
      }
    }
  }

</script>


<style scoped>
main {
    background-image: url(/img/connect4wallpaper.png);
    background-position: center;
    background-size: 40%;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    align-items: center;
}

.topSection {
  height: 30vh;
}

.logoBox{
  margin: 5vh;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
}

img {
  max-width: 100%;
  align-self: center;
}

.gameButtons {
  height: 70vh;
}

.wrapper {
  display: grid;
  align-self: center;
}

.wrapper * {
  color: white;
  font-family: Arial, Helvetica, sans-serif;
}

.join-form {
  display: flex;
  flex-direction: row;
  height: inherit;

  input {
    width: 4em;
    flex-grow: 2;
  }
  
  button {
    flex-grow: 1;
  }
}

button:hover{
    cursor: pointer;
}

.hostButton {
  background-color: green;
  border-radius: 10px;
  border: solid 4px grey;
  font-size: 170%;
}

.hostButton:hover {
    background-color: rgb(0, 175, 0);
}

.roomCodeField {
  color: grey;
  border-radius: 10px 0px 0px 10px;
  border: solid 4px grey;
  border-right: none;
  font-size: 100%;
}

.joinButton {
  background-color: rgb(209, 136, 0);
  border-radius: 0px 10px 10px 0px;
  border: solid 4px grey;
  font-size: 80%;
  font-weight: bold;
}

.joinButton:hover {
  background-color: rgb(255, 166, 0);
}

@media (orientation: landscape) {
  img {
    content:url(/img/AmongUs.png);
  }

  .wrapper {
    grid-template-columns: repeat(2, 175px); 
    grid-template-rows: repeat(1, 60px);

    gap: 50px;

    width: 350px; 
    margin: 20vh auto 0 auto; 
    height: 10vh;
  }

  .hostButton {
    grid-column: 1;
    grid-row: 1;
    height: inherit;
  }

  .join-form {
    grid-column: 2;
    grid-row: 1;
  }
}

@media (orientation: portrait) {
  img {
    content:url(/img/AmongUsPortrait.png);
  }

  .wrapper {
    grid-template-columns: repeat(1, 80vw); 
    grid-template-rows: repeat(2, 40%);

    gap: 10%;

    width: 80vw; 
    margin: 0 auto 0 auto; 
    height: 90%;
  }

  .hostButton {
    grid-column: 1;
    grid-row: 1;
    height: 100%;
    width: 100%;
  }

  .join-form {
    grid-column: 1;
    grid-row: 2;
  }
}
</style>


