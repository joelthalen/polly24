<template>
    <button id="LanguageButton" :on-click="switchLanguage"> </button>
</template>

<script>
    export default {
        name: "LanguageButton", 
        props: {

        },
        emits: {

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
    #LanguageButton {
        
        background: red;
        /*background: url("/img/ukflag.png");*/
        height: 32px;
        width: 48px;
        /*background: url('/img/swedenflag.jpg');*/
    }
</style>
