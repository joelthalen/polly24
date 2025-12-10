<template>
    <button @click="sendEmoji()">😂</button>
    <div v-for="value in emojis">
        <div  v-if="value" class="emoji animate">
            😂
        </div>
    </div>
</template>

<script>
export default {
    props: {
        counter: Number,
    },
    emits: ["sendEmoji"],
    watch: {
        counter(n, o) {
            this.recieveEmoji()
        },
    },
    data: function() {
        return {
            emojis: new Array(20),
            nextIndex: 0,
            timeout: Date.now(),
        }
    },
    created: function() {
        this.emojis.fill(false, 0, 19);
    },
    methods: {
        sendEmoji: function() {
            if (this.timeout > Date.now()) return; 
            const indexAfter = (this.nextIndex + 1) % 20;
            this.emojis[indexAfter] = false;
            this.emojis[this.nextIndex] = true;
            this.nextIndex = indexAfter;
            this.timeout = Date.now() + 500;
            this.$emit("sendEmoji");
        },
        recieveEmoji: function() {
            const indexAfter = (this.nextIndex + 1) % 20;
            this.emojis[indexAfter] = false;
            this.emojis[this.nextIndex] = true;
            this.nextIndex = indexAfter;
        }
    }
}

</script>

<style lang="css" scoped>
button {
    position: absolute;
    bottom: 1em;
    right: 1em;
    font-size: 2em;
    padding: 0.5em;
    background-color: rgb(42, 42, 42);
    border: black solid 1px;
    border-radius: 50%;
    transition: 0.2s;
}
button:hover {
        font-size: 2.2em;
        cursor: pointer;
}

.emoji {
    position: absolute;
    bottom: 2.5em;
    right: 1.5em;
    font-size: 2.5em;
    pointer-events: none;
}

.animate {
    animation: show 3s linear 0s 1 forwards;
}

@keyframes show {
    0% {
        opacity: 0;
    }
    99% {
        opacity: 1;
        transform: translateY(-5em);
    }
    100% {
        opacity: 0;
        transform: translateY(-5em);
    }
}
</style>