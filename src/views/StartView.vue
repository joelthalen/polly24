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
      <section id="gameButtons">
        <div class="wrapper"> 

          <button id="hostButton" @click="hostGame">{{ uiLabels.host || "HOST" }}</button>
          <form @submit="joinGame" class="join-form">
            <input id="roomCodeField" 
              type="text" 
              v-model="roomCode" 
              :placeholder="this.uiLabels.roomCode"
              required
              minlength="4" maxlength="4"> 
            <button id="joinButton">{{ uiLabels.join || "Join" }}</button>
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

  button:hover{
      cursor: pointer;
  }

  img {
    max-width: 100%;
  }


.logoBox{
  margin: 5vh;
}

.topSection {
  height: 30vh;
}

#gameButtons {
  height: 70vh;
}

@media (orientation: landscape) {

  /*.logoBox{
    background-image: url(/img/AmongUs.png);
  }*/

  img {
    content:url(/img/AmongUs.png);
    align-self: center;
  }

  /* Det här är den gamla wrapper-cssen
  
  .wrapper {
    grid-template-columns: 5vw 5vw 5vw 5vw 5vw 5vw 5vw ;
    margin-top: 20vh;
    margin-left: 32.5vw ;
    margin-right: 32.5vw ; 
    height: 10vh;
    grid-template-rows: 5vh 5vh ;
  }*/

    .wrapper {
      grid-template-columns: repeat(2, 175px); 
      grid-template-rows: repeat(1, 60px);

      width: 350px; 
      margin: 20vh auto 0 auto; 
      height: 10vh;

    gap: 50px;
  }


  #hostButton {
    grid-column: 1;
    grid-row: 1;
    height: inherit;
  }


  #roomCodeField {
    grid-column: 5 / 7;
    grid-row: 1 / 3;
  }

  #joinButton {
    grid-column: 7;
    grid-row: 1 / 3;
  }
  
  .join-form {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    flex-direction: row;

    input {
      width: 4em;
      flex-grow: 2;
    }
    button {
      flex-grow: 1;
    }
  }
  
}

@media (orientation: portrait) {
  /*.logoBox{
    background-image: url(/img/AmongUsPortrait.png);
  }*/

  img {
    content:url(/img/AmongUsPortrait.png);
    align-self: center;
  }

  
  .wrapper {
    width: 60vw;
    grid-template-columns: 20vw 20vw 20vw  ;
    margin-left: 20vw ;
    margin-right: 20vw ;
    height: 60vh;
    grid-template-rows: 12vh 12vh 12vh 12vh 12vh;
  } 

  /* Försökte göra en liknande "låsning" av knappstorlek som i landscape, men lyckades inte helt
  .wrapper {
    grid-template-columns: repeat(3, 50px); 
    grid-template-rows: repeat(5, 5px);

    width: 350px; 
    margin: 20vh auto 0 auto; 
    height: 150px;
  } 
  */

  #hostButton {
    grid-column: 1 / 4;
    grid-row: 1 / 3;
    border-radius: 100%;
  }


  #roomCodeField {
    grid-column: 1 / 3;
    grid-row: 4 / 6;
  }

  #joinButton {
    grid-column: 3 / 4;
    grid-row:  4 / 6;
  }

}

main {
    background-image: url(/img/connect4wallpaper.png);
    background-position: center;
    background-size: 40%;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    align-items: center;
}
  

.wrapper {
  display: grid;
  align-self: center;
}

.wrapper * {
  color: white;
  font: bold Arial, sans-serif;
}


#hostButton {
  background-color: green;
  font: bold Arial, sans-serif;
  border-radius: 10px;
  border: solid 4px grey;
  font-size: 200%;
}


#roomCodeField {
  color: grey;
  border-radius: 10px 0px 0px 10px;
  border: solid 4px grey;
  border-right: none;
  font-size: 100%;
}


#joinButton {
  background-color: orange;
  border-radius: 0px 10px 10px 0px;
  border: solid 4px grey;
}

</style>


