<template>
	<div class="goodsOff">
        <div>
            <img class="icon" :src=goodsStyle.icon alt="">
            <h1 class="freeText" v-if="itemValue.goodsAmount > 1">{{itemValue.goodsAmount}}</h1>
            <input @blur="resetView" autocomplete="off" autocorrect="off" autocapitalize="off" type="text" v-else v-model="unitPrice" class="unitPrice">
            <span>{{goodsType}}</span>
            <img class="hotImg" v-if="itemIndexValue == 0 || goodsType === ''" src="../../assets/images/fire_icon.png" alt="">
        </div>
        <p class="off" v-if="(itemIndexValue == 0 && (goodsType === 'Followers' || goodsType === 'Likes' || goodsType === 'Views')) || goodsType === ''" >80%OFF</p>
        <p v-if="itemValue.paymentType === 4" class="LikesCoins" :style="{background:goodsStyle.color}">
            <img v-if="!(goodsType === '' || itemValue.paymentType === 4)" src="../../assets/images/coins.png" alt="">
            <span>{{goodsType === '' || itemValue.paymentType === 4?'$':'+'}}{{(goodsType === '' || itemValue.paymentType === 4) && itemValue?itemValue.price.toFixed(2):itemValue.goodsAmount === 1?itemValue.price * unitPrice:itemValue.price}}</span>
        </p>
        <!-- <p  class="LikesCoins paypal-button" :style="{background:goodsStyle.color}" ref="paypalButton"></p> -->
        <p v-else class="LikesCoins" :style="{background:goodsStyle.color}" @click="getGoods(itemValue, $event)">
            <img v-if="!(goodsType === '' || itemValue.paymentType === 4)" src="../../assets/images/coins.png" alt="">
            <span>{{goodsType === '' || itemValue.paymentType === 4?'$':'+'}}{{(goodsType === '' || itemValue.paymentType === 4) && itemValue?itemValue.price.toFixed(2):itemValue.goodsAmount === 1?itemValue.price * unitPrice:itemValue.price}}</span>
        </p>
        <div v-if="itemValue.paymentType === 4" ref="paypalButton" class="paypal-button"></div>
	</div>
</template>
<script>

import userhelper from '../../helper/userhelper'
import paypalHelper from '../../helper/paypalHelper'

export default {
	name: "goodsOff",
	data() {
		return {
            unitPrice: 1
        };
    },
    props: ['itemList','itemIndex','typeStyle','postItem','userinfo'],
    computed: {
        itemValue() {
            return this.itemList
        },
        itemIndexValue() {
            return this.itemIndex
        },
        goodsType() {
            if (this.itemList.goodsType === 3) {
                return 'Followers'
            } else if (this.itemList.goodsType === 2 || this.itemList.goodsType === 5) {
                return 'Likes'
            } else {
                return ''
            }
        },
        goodsStyle() {
            return this.typeStyle
        },
        payForPost() {
            return this.postItem
        },
        payforUser() {
            return this.userinfo
        }
    },
    methods: {
        getGoods(item, e) {
            e.preventDefault()
            let autoItem = {};
            autoItem = JSON.parse(JSON.stringify(item));
            if (item.goodsAmount === 1) {
                autoItem.goodsAmount = Number(this.unitPrice);
                autoItem.price = Number(this.unitPrice * item.price)
            }
            console.log(autoItem)
            this.$emit('payForGoods', autoItem)
        },
        resetView() {
            setTimeout(() => {
                let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100) 
        },
        paypalView() {
            if(!this.userinfo) return;
            setTimeout(() => {
                let paypalBtn = this.$refs.paypalButton;
                let followPayload = {
                    user: this.payforUser,
                    goods: this.itemValue,
                };
                let data = userhelper.fenPayloadTreasfer(followPayload).data;
                paypalHelper.paypalBtn(paypalBtn, data)
            }, 500);
        }
    },
    activated() {
        // this.paypalView()
    },
    mounted() {
        // this.paypalView()
    }
};
</script>
<style scoped>
    @font-face {
        font-family: 'FuturaBT-BoldItalic';
        src: url(../../assets/font/FuturaBoldItalicfont.ttf);
    }

    @font-face {
        font-family: 'FuturaBT-Light';
        src: url(../../assets/font/futuralightbt.ttf);
    }

    @font-face {
        font-family: 'FuturaBT-BookItalic';
        src: url(../../assets/font/futuramediumbt.ttf);
    }

    .goodsOff {
        height: 58px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        border-bottom: 0.5px solid #aaa;
    }

    .goodsOff:last-of-type {
        border-bottom: none;
    }

    .goodsOff > div {
        display: flex;
        align-items: center;
    }

    .freeText {
        font-size: 18px;
        margin-left: 5px;
        margin-right: 6px;
        font-family: 'FuturaBT-BoldItalic';
    }

    .icon {
        width: 24px;
        height: 24px;
    }

    .unitPrice {
        width: 75px;
        height: 27px;
        border: 1px solid #D8D8D8;
        border-radius: 13.5px;
        box-sizing: border-box;
        margin: 0 5px;
        text-indent: 5px;
    }

    .goodsOff span {
        font-family: 'FuturaBT-Light';
        font-size: 18px;
        color: #2C2C2C;
        letter-spacing: 0;
        line-height: 21px;
    }

    .hotImg {
        width: 19px;
        height: 22px;
        margin-left: 5px;
    }

    .off {
        width: 64px;
        height: 22px;
        line-height: 24px;
        background: rgba(235, 223, 123, .5);
        border-radius: 11px;
        color: #F3AF20;
        font-size: 12px;
        text-align: center;
        font-weight: bold;
    }

    .LikesCoins {
        width: 108px;
        height: 34px;
        line-height: 34px;
        background: #9013FE;
        color: #fff;
        border-radius: 17px;
        text-align: center;
        font-size: 18px;
        vertical-align: top;
        flex-shrink: 0;
    }

    .LikesCoins img {
        width: 24px;
        height: 24px;
        margin-top: 5px;
        /* margin-right: 3px; */
    }

    .LikesCoins span {
        display: inline-block;
        height: 34px;
        line-height: 34px;
        vertical-align: top;
        color: #fff;
        font-family: 'FuturaBT-BookItalic';
    }

    .paypal-button {
        position: absolute;
        width: 90px;
        height: 34px;
        border-radius: 17px;
        /* left: 50%; */
        right: 4px;
        /* transform: translate(-50%, 0); */
        z-index: 0;
        opacity: 0;
        background: red;
    }
</style>