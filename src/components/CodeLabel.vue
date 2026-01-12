<template>
    <div class="wrapper">
        <button class="codeLabel tooltip" @click="copy" @mouseleave="resetTooltip">
            {{ code }}
            <span class="tooltiptext t1">{{ tooltip }}</span>
            <span class="ripple"></span>    
        </button>
        <button class="copy-link tooltip" @click="copyLink" @mouseleave="resetTooltips">
            <svg style="vertical-align: baseline;" viewBox="0 0 64 64" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M35.521,41.288c-3.422,0-6.64-1.333-9.06-3.753c-1.106-1.106-1.106-2.9,0-4.006 c1.106-1.106,2.9-1.106,4.006,0c1.35,1.35,3.145,2.093,5.054,2.093c1.909,0,3.704-0.743,5.054-2.094l7.538-7.538 c2.787-2.787,2.787-7.321,0-10.108c-2.787-2.787-7.321-2.787-10.108,0l-3.227,3.227c-1.106,1.106-2.9,1.106-4.006,0 c-1.106-1.106-1.106-2.9,0-4.006L34,11.877c4.996-4.996,13.124-4.995,18.12,0c4.996,4.996,4.996,13.124,0,18.12l-7.538,7.538 C42.161,39.955,38.944,41.288,35.521,41.288z" style="fill:#ffffff;"></path> </g> <g> <path d="M20.94,55.869c-3.422,0-6.64-1.333-9.06-3.753c-4.996-4.996-4.996-13.124,0-18.12l7.538-7.538 c4.996-4.995,13.124-4.995,18.12,0c1.106,1.106,1.106,2.9,0,4.006c-1.106,1.106-2.9,1.106-4.006,0 c-2.787-2.787-7.321-2.787-10.108,0l-7.538,7.538c-2.787,2.787-2.787,7.321,0,10.108c1.35,1.35,3.145,2.094,5.054,2.094 c1.909,0,3.704-0.743,5.054-2.093l3.227-3.227c1.106-1.106,2.9-1.106,4.006,0c1.106,1.106,1.106,2.9,0,4.006L30,52.117 C27.58,54.536,24.363,55.869,20.94,55.869z" style="fill:#ffffff;"></path> </g> </g> </g></svg>
            <span class="tooltiptext t2">{{ tooltip2 }}</span>
        </button>
    </div>
</template>

<script scoped>
    export default {
        props: ['code'],
        data() {
            return {
                tooltip: "Click to Copy!",
                tooltip2: "Click to copy direct link!",
                beforeCopy: "Click to Copy!",
                beforeCopy2: "Click to copy direct link!",
                onCopy: "✅ Copied!"
            }
        },
        methods: {
            copy(event) {
                this.resetTooltips();
                this.tooltip = this.onCopy;
                navigator.clipboard.writeText(this.code);
            },
            copyLink(event) {
                this.resetTooltips();
                this.tooltip2 = this.onCopy;
                navigator.clipboard.writeText(this.$router.currentRoute.value);
            },
            resetTooltips(event) {
                this.tooltip = this.beforeCopy;
                this.tooltip2 = this.beforeCopy2;
            }
        }
    }
</script>

<style>
    button {
        -webkit-appearance: none;
        border-radius: 0;
        text-align: inherit;
        background: none;
        box-shadow: none;
        padding: 0;
        cursor: pointer;
        border: none;
        color: inherit;
        font: inherit;
    }
    .codeLabel {
        font-size: var(--text-xl);
        padding: 0;
        position: relative;
    }

    .tooltiptext {
        visibility: hidden;
        font-size: var(--text-sm);
        background-color: var(--bg-color2);
        border: 1px solid var(--border-color);
        border-radius: 3px;
        padding: 6px;
    }

    .t1 {
        position: absolute;
        width: 80px;
        left: calc(50% - 45px);
        bottom: -35px;
    }

    .t2 {
        position: absolute;
        width: 140px;
        left: calc(1rem - 70px);
        bottom: -35px;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 600ms linear;
        background-color: rgb(255 255 255 / 0.7);
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .wrapper {
        width: fit-content;
    }

    .wrapper:hover .codeLabel {
        background-color: rgb(100 100 100 / 0.3 );
        border: 1px solid var(--border-color);
        border-radius: 0.5rem 0 0 0.5rem;
    }
    .wrapper:hover .copy-link {
        background-color: rgb(100 100 100 / 0.3 );
        border-radius: 0 0.5rem 0.5rem 0;
        border-top: 1px solid var(--border-color);
        border-right: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);

    }
    .codeLabel:active {
        background-color: rgb(100 100 100 / 0.7) !important;
    }
    .copy-link:active {
        background-color: rgb(100 100 100 / 0.7) !important;
    }

    .tooltip:hover .tooltiptext {
        visibility: visible;
    }

    .copy-link {
        height: auto;
        font-size: var(--text-xl);
        width: var(--text-xl);
        position: relative;
    }

</style>