<template>
    <div class="limitTimeOffer">
        <div class="limitBox">
            <div>Buy Coins</div>
            <!--<div class="off_img"><img src="../../assets/images/off@3x.png" alt=""></div>-->
            <!--<div class="timer"><span>{{hour}}</span>:<span>{{minute}}</span>:<span>{{second}}</span></div>-->
            <div class="wrapper">
                <div class="limitWrapper">
                    <div class="zanlist_item" v-for="item in limitList">
                        <div v-show="item.bestDeal" class="off">
                            <p>{{item.subtitle}}</p>
                            <p>OFF</p>
                        </div>
                        <div class="zanlist_content">
                            <p>
                                <img src="../../assets/images/coins.png" alt="">
                                <span>x</span>
                                <span>{{item.goodsAmount}}</span>
                            </p>
                            <p>{{item.subtitle}}</p>
                            <p>{{item.backgroundImage}}</p>
                            <p>
                                <!--<img src="../../assets/images/follow_btn_coins_icon.png" alt="">-->
                                <span>$ {{item.price}}</span>
                            </p>
                            <div class="paypal-button"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import limitList from "../componentHelper/newfenshi"
    import userHelper from '../../helper/userhelper'

    export default {
        name: "limit-time-offer",
        data() {
            return {
                limitList: [],
                wrapper_wh: '',
                hour: '',
                minute: '',
                second: '',
            }
        },
        components: {
            limitList
        },
        methods: {
            goTime() {
                let d, h, m, s;
                //获取当前时间，换算成毫秒
                let date = new Date();
                let now = date.getTime();
                //获取截止时间，换算成毫秒
                let endData = new Date('2018/9/23 16:10:00');
                let end = endData.getTime();
                //计算时差毫秒
                let time = end - now;
                if (time > 0) {
                    d = Math.floor(time / 1000 / 60 / 60 / 24);
                    h = Math.floor(time / 1000 / 60 / 60 % 24);
                    m = Math.floor(time / 1000 / 60 % 60);
                    s = Math.floor(time / 1000 % 60);
                    this.hour = h + d * 24 < 10 ? '0' + h : h + d * 24;
                    this.minute = m < 10 ? '0' + m : m;
                    this.second = s < 10 ? '0' + s : s;
                    setTimeout(this.goTime, 1000);
                }
            },
            eachPaypalButton() {
                let goodsList = this.limitList;
                let username = userHelper.logged_in_user.username;
                document.querySelectorAll('.paypal-button').forEach(function (selector, index) {
                    paypal.Button.render({
                        // options
                        env: 'sandbox', // Or 'production'
                        style: {
                            label: 'checkout',  // checkout | credit | pay | buynow | generic
                            size: 'responsive', // small | medium | large | responsive
                            shape: 'rect',   // pill | rect
                            color: 'silver',   // gold | blue | silver | black
                            tagline: true
                        },
                        // Set up the payment:
                        // 1. Add a payment callback
                        payment: function (data, actions) {
                            // 2. Make a request to your server
                            return actions.request.post('http://localhost:9300/createPaypalId/', {
                                goodsId: goodsList[index].goodsId,
                                price: goodsList[index].price,
                                goodsAmount: goodsList[index].goodsAmount,
                                username: username
                            })
                                .then(function (res) {
                                    // 3. Return res.id from the response
                                    console.log(res);
                                    if (res.id) {
                                        return res.id;
                                    } else {
                                        alert(res.message)
                                    }

                                });
                        },
                        // Execute the payment:
                        // 1. Add an onAuthorize callback
                        onAuthorize: function (data, actions) {
                            console.log(data);
                            // 2. Make a request to your server
                            return actions.request.post('http://localhost:9300/excutePaypalId/', {
                                paymentID: data.paymentID,
                                payerID: data.payerID,
                                goodsId: goodsList[index].goodsId,
                            })
                                .then(function (res) {
                                    alert(res.status + "," + res.message);
                                    console.log(res);
                                    // 3. Show the buyer a confirmation message.
                                });
                        },
                        onCancel: function (data, actions) {
                            alert('cancel')
                        },
                        onError: function (err) {
                            alert(err)
                        }
                    }, selector);
                });
            }
        },
        activated() {
            this.eachPaypalButton()
        },
        created() {
            // this.goTime();
            if (this.$store.state.config) {
                this.limitList = this.$store.state.config.iapGoods;
            }
        }
    }
</script>

<style scoped>
    .limitBox {
        position: relative;
    }

    .limitBox > div {
        text-align: center;
    }

    .limitBox > div:nth-child(1) {
        padding-top: 20px;
        font-size: 14px;
        color: #F21174;
    }

    /*.off_img, .off_img>img{*/
    /*width: 50px;*/
    /*height: 50px;*/
    /*position: absolute;*/
    /*top: 10px;*/
    /*right: 35px;*/
    /*}*/

    /*.limitBox>div:nth-child(2){*/
    /*font-size: 12px;*/
    /*padding-top: 10px;*/
    /*}*/

    ::-webkit-scrollbar {
        display: none;
    }

    /*.timer {*/
    /*height: 16px;*/
    /*line-height: 16px;*/
    /*font-size: 12px;*/
    /*margin: 10px 0;*/
    /*}*/

    /*.timer>span {*/
    /*display: inline-block;*/
    /*width: 30px;*/
    /*height: 16px;*/
    /*line-height: 16px;*/
    /*background: #ccc;*/
    /*text-align: center;*/
    /*position: relative;*/
    /*}*/

    .wrapper {
        width: 95%;
        height: 135px;
        white-space: nowrap;
        overflow: hidden;
        overflow-x: scroll;
        -webkit-backface-visibility: hidden;
        -webkit-overflow-scrolling: touch;
        margin: 10px auto;
    }

    .zanlist_item {
        display: inline-block;
        width: 100px;
        height: 135px;
        border: 1px solid #ccc;
        border-radius: 5px;
        position: relative;
    }

    .zanlist_item:not(:last-child) {
        margin-right: 10px;
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
        top: 20px;
        box-sizing: border-box;
    }

    .zanlist_content p:nth-child(2), .zanlist_content p:nth-child(3) {
        margin: 0 auto;
        text-decoration: line-through;
        height: 20px;
        line-height: 20px;
        color: #aaa;
    }

    .zanlist_content p:nth-child(4) {
        width: 80px;
        height: 25px;
        line-height: 25px;
        background: linear-gradient(to right, #6C64FA, #69C0FC);
        border-radius: 3px;
        color: #fff;
        font-size: 16px;
        margin: 10px auto;
    }

    .zanlist_content p:nth-child(4) span {
        display: inline-block;
        height: 25px;
        line-height: 25px;
        vertical-align: top;
    }

    .zanlist_content img {
        width: 25px;
        height: 25px;
    }

    .zanlist_content span {
        font-size: 14px;
        vertical-align: super;
    }

    .paypal-button {
        position: absolute;
        width: 80px;
        height: 32px;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: 0;
        opacity: 0;
    }

</style>
