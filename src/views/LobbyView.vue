<template>
  <main>
    <section class = "topSection">
      <div class="logoBox"></div> <!-- Här ska loggan finnas-->
      <div> <!--Här finns språkknappen-->
          <LanguageButton/>
      </div>
    </section>
      Joining lobby {{pollId}}
      <div v-if="!joined">
        <input type="text" v-model="userName">
        <button v-on:click="participateInPoll">
          {{ this.uiLabels.participateInPoll }}
        </button>
      </div>
      <div v-if="joined">
        <p>Waiting for host to start poll</p>
        {{ participants }}
      </div>
  </main>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'LobbyView',
  data: function () {
    return {
      userName: "",
      pollId: "inactive poll",
      uiLabels: {},
      joined: false,
      lang: localStorage.getItem("lang") || "en",
      participants: [],
      isHost: false
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "participantsUpdate", p => this.participants = p );
    socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId) );
    socket.emit( "joinPoll", this.pollId );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    participateInPoll: function () {
      socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName} )
      this.joined = true;
    }
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
  height: 30vh;
}


  @media (orientation: landscape){
    .logoBox{
      background-image: url(/public/img/AmongUs.png);
    }
  }

  @media (orientation: portrait){
    .logoBox{
      background-image: url(/public/img/AmongUsPortrait.png);
    }
  }

main {
    background-image: url(/public/img/AmongUsWallPaper.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
}

.lobbyBox {
    height: 20vh;
    width: 50vw;
    margin: 5vh;
    background-color: rgba(255, 255, 255, 0.8);
  }
  


</style>
