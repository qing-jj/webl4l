<template>
    <div>
        <div class="userCoins" @click="toBuyCoins">
            <!-- <span></span> -->
            <img src='../../assets/images/coins.png' alt="">
            <span>{{refreshCoins}}</span>
            <!--<span class="toStore"></span>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: "coins-amount",
        data() {
            return {
                coins: ''
            }
        },
        computed: {
            refreshCoins() {
                return this.$store.state.coins
            }
        },
        methods: {
            toBuyCoins() {
                this.$router.push('/freeCoins')
            }
        }
    }
</script>

<style scoped>
    .userCoins {
        width: 85px;
        height: 30px;
        margin-right: 10px;
        line-height: 30px;
        border-radius: 15px;
        background-color: #fff;
        display: flex;
        justify-content: center;
    }

    .userCoins img {
        width: 20px;
        height: 20px;
        margin-top: 5px;
        margin-left: 5px;
    }

    /* .userCoins .toStore {
        display: inline-block;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        text-align: center;
        margin-right: 5px;
        margin-top: 4px;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
        background: url(../../assets/images/top_addcoins_icon..png) no-repeat center;
        background-size: 100% 100%;
    } */

    .userCoins span {
        display: inline-block;
        font-size: 16px;
        margin: 0 3px;
        color: #000;
    }
</style>
