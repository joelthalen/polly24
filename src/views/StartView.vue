<template>
    <section id =startViewTopSection>
        <div id="logo"> <!-- Här ska loggan finnas-->
            Are you smarter than a connect 4th grader
        </div>
        <div> <!--Här finns språkknappen-->
            <LanguageButton/>
         </div>
      </section>
      <section id="gameButtons">
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
  import LanguageButton from '../components/LanguageButton.vue';
  
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
      
    }
  }

</script>


<style scoped>
#startViewSection{
    
}

#logo {
  color: red;
  font: bold 3em Arial, sans-serif;
  text-align: center;
  
}

#startViewTopSection {
  height: 30vh;
}

#gameButtons {
  height: 70vh;
}


#hostButton {
  height: 100%;
  width: 100%;
}


#joinButton {

}




</style>




