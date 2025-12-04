<template>
    <section id =starViewSection>
        <div id="logo"> <!-- Här ska loggan finnas-->
            Are you smarter than a connect 4th grader
        </div>
        <div> <!--Här finns språkknappen-->
          <button id="languageButton" :on-click="switchLanguage"> </button>
        </div>
        <div> <!--Knappen för att hosta-->
          <button id="hostButton" :on-click="hostGame"></button>
        </div>
        <div> <!--Knappen för att joina-->
          <input type="text" id="roomCode" v-model="roomCode" placeholder="Room code"> 
          <button id="joinButton" :on-click="joinGame"></button>
        </div>
    </section>
</template>

<script>
  export default {
    name: 'StartView',
    compoments: {

    },
    data: function () {
      return {
        roomCode: '',
        lang: localStorage.getItem("lang") || "en"
      }
    },
    methods: {
      switchLanguage: function() {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      else {
        this.lang = "en"
      }
      localStorage.setItem( "lang", this.lang );
      socket.emit( "getUILabels", this.lang );
      },
    }
  }

</script>


<style scoped>
#starViewSection{
    
}

#logo {

}

hostButton {

}

languageButton {
  
}

joinButton {

}

</style>




