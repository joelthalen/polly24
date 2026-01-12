<template>
    <button id="LanguageButton" :class="this.lang" @click="switchLanguage">
        {{ lang }}
    </button>
</template>

<script>
    import { socket } from "../socket";
    export default {
        name: "LanguageButton",
        emits: {

        },
        data() {
            return {
                lang: localStorage.getItem("lang") || "en",
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
    #LanguageButton {
        color: black;
        font-weight: bold;
        /*background: red;
        /*background: url("/img/ukflag.png");*/
        height: 32px;
        width: 48px;
        /*background: url('/img/swedenflag.jpg');*/
        background-size: cover;
    }
    .sv {
        background-image: url("/img/swedenflag.jpg");
    }
    .en {
        background-image: url("/img/ukflag.png");
    }
</style>
