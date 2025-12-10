<template>
  <main>
    <section id =startViewTopSection>
      <div id="logoBox"></div> <!-- Här ska loggan finnas-->
      
      <div> <!--Här finns språkknappen-->
          <LanguageButton/>
      </div>
    </section>
      <section id="gameButtons">
        <div class="wrapper"> 

          <button id="hostButton" @click="hostGame">HOST</button>
          <input id="roomCodeField" type="text" v-model="roomCode" placeholder="Room code"> 
          <button id="joinButton" @click="joinGame">JOIN</button>

        </div>
    </section>
  </main>
</template>

<script>
  import LanguageButton from '../components/LanguageButton.vue';
  import io from 'socket.io-client';
  const socket = io("localhost:3000");  
  
  export default {
    name: 'StartView',
    compoments: { 
      LanguageButton

    },
    data: function () {
      return {
        roomCode: '',
        lang: localStorage.getItem("lang") || "en"
      }
    },
    methods: {
      hostGame: function() {
        socket.emit("createLobby")
        console.log("hostGame clicked")
      },
      joinGame: function() {
        socket.emit("joinLobby",{id: this.roomCode})
        console.log("joinGame clicked")
      }

    }
  }

</script>


<style scoped>

  button:hover{
      cursor: pointer;
  }



#logoBox{
  height: 90%;
  width: 90%;
  margin: 5vh;
}

#startViewTopSection {
  height: 30vh;
}

#gameButtons {
  height: 70vh;
}

@media (orientation: landscape) {
main {
    background-image: url(/public/img/AmongUsWallPaper.png);
    background-position: center;
   background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
}

  #logoBox{
    background-image: url(/public/img/AmongUs.png);
    background-position: center;
    background-repeat: no-repeat;
  }

  .wrapper {
    width: 35vw;
    grid-template-columns: 5vw 5vw 5vw 5vw 5vw 5vw 5vw ;
    margin-top: 20vh;
    margin-left: 32.5vw ;
    margin-right: 32.5vw ; 
    height: 10vh;
    grid-template-rows: 5vh 5vh ;
  }

  #hostButton {
    grid-column: 1 / 4;
    grid-row: 1 / 3;
  }


  #roomCodeField {
    grid-column: 5 / 7;
    grid-row: 1 / 3;
  }

  #joinButton {
    grid-column: 7;
    grid-row: 1 / 3;
  }
  
}

@media (orientation: portrait) {
  .wrapper {
    width: 60vw;
    grid-template-columns: 20vw 20vw 20vw  ;
    margin-left: 20vw ;
    margin-right: 20vw ;
    height: 60vh;
    grid-template-rows: 12vh 12vh 12vh 12vh 12vh;
  } 

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
  

.wrapper {
  display: grid;
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
}


#joinButton {
  background-color: orange;
  border-radius: 0px 10px 10px 0px;
  border: solid 4px grey;
}

</style>


