<template>
    <div class="list_component">
        <div class="zanlist">
            <div class="zanlist_item" v-for="item in templateList" @click="payForCoins(item)">
                <div v-show="item.bestDeal" class="off">
                    <p>{{item.subtitle}}</p>
                    <p>OFF</p>
                </div>
                <div class="zanlist_content">
                    <p>
                        <img :src="choose_img" alt="">
                        <span>x</span>
                        <span>{{item.goodsAmount}}</span>
                    </p>
                    <p>{{item.subtitle}}</p>
                    <p>{{item.backgroundImage}}</p>
                    <p class="paypal">
                        <img src="../../assets/images/follow_btn_coins_icon.png" alt="">
                        <span>{{item.price}}</span>
                    </p>


                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "newfenshi",
        data() {
            return {
                choose_img: '',
                templateList: ''
            }
        },
        props: ['fensList'],
        methods: {
            payForCoins(item) {
                if (window.location.href.indexOf('followers') === -1) {
                    console.log('likes');
                    this.$emit('addLikes', item);
                } else {
                    console.log('followers');
                    this.$emit('addFollower', item);
                }
            }
        },
        watch: {
            fensList() {
                this.templateList = this.fensList;
            }
        },
        activated() {
            this.templateList = this.fensList;
            console.log(this.fensList);
            console.log(this.templateList);
            if (window.location.href.indexOf('likes') === -1) {
                this.choose_img = require('../../assets/images/getfollowers_icon.png');
            } else {
                this.choose_img = require('../../assets/images/getlikes_icon.png');
            }
        },
        created() {
            this.templateList = this.fensList;
            console.log(this.fensList);
            console.log(this.templateList);
            if (window.location.href.indexOf('likes') === -1) {
                this.choose_img = require('../../assets/images/getfollowers_icon.png');
            } else {
                this.choose_img = require('../../assets/images/getlikes_icon.png');
            }
        }

    }
</script>

<style scoped>

    .zanlist {
        width: 100%;
        /*position: absolute;*/
        /*left: 50%;*/
        margin: 11px 0 0 0;
        /*transform: translate(-50%);*/
        /*-webkit-transform: translate(-50%);*/
        display: flex;
        flex-wrap: wrap;
        overflow: scroll;
        /* background: #fff; */
        -webkit-overflow-scrolling: touch;
    }

    .zanlist::-webkit-scrollbar {
        width: 0;
        height: 0;
    }

    .zanlist_item {
        width: 31%;
        height: 109px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-left: 6px;
        margin-bottom: 6px;
        position: relative;
    }

    .off {
        width: 50px;
        height: 50px;
        font-weight: bold;
        background: #ECBD3A;
        position: relative;
        transform: scale(0.6) translate(-10%, 0px);
        font-size: 12px;
        top: -11px;
        left: -7px;
    }

    .off p {
        transform: rotate(-45deg);
        position: absolute;
        top: 2px;
    }

    .off p:last-child {
        text-align: center;
        top: 10px;
        left: 10px
    }

    .off:after {
        display: block;
        content: "";
        width: 0;
        height: 0;
        border: 36px solid #fff;
        border-color: #fff transparent transparent transparent;
        position: absolute;
        top: 16px;
        left: 15px;
        transform: rotate(-45deg);
    }

    .zanlist_content {
        width: 100%;
        margin: 0 auto;
        text-align: center;
        position: absolute;
        top: 10px;
        box-sizing: border-box;
    }

    .zanlist_content p:nth-child(2), .zanlist_content p:nth-child(3) {
        margin: 0 auto;
        text-decoration: line-through;
        height: 15px;
        line-height: 15px;
        color: #aaa;
    }

    .paypal {
        width: 80px;
        height: 32px;
        line-height: 32px;
        background: linear-gradient(to right, #6C64FA, #69C0FC);
        border-radius: 3px;
        color: #fff;
        font-size: 16px;
        z-index: 999;
        margin: 0 auto;
    }

    .paypal span {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        vertical-align: top;
        pointer-events: none;
    }

    .zanlist_content img {
        width: 25px;
        height: 25px;
    }

    .zanlist_content span {
        font-size: 14px;
        vertical-align: super;
    }

</style>
