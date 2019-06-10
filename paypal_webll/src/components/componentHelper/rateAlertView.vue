<template>
    <div class="rateAlertView">
        <div class="rateAlertViewBox">
            <h1>Rate us</h1>
            <img src="../../assets/images/rate_us_star.png" alt="">
            <div class="coinDiv">
                <p>Rate us 5 stars for</p>
                <p>200 coin <img src="../../assets/images/coins.png" alt=""></p>
            </div>
            <img class="starImg" src="../../assets/images/rate_us_5star.png" alt="">
            <div class="clickBtn" @click="rateUs">RATE US 5 STAR</div>
            <div class="closeBtn" @click="closeRate"><img src="../../assets/images/top_close_icon.png" alt=""></div>
        </div>
    </div>
</template>
<script>
import bus from '../../store/bus'
export default {
	name: "rateAlertView",
	data() {
		return {};
    },
    methods: {
        rateUs() {
            let rateItem;
            this.$store.state.config.taskRewards.forEach(value => {
                if (value.rewardTypeId === 0) {
                    rateItem = value
                }  
            });
            this.$emit('rateAction', rateItem)
        },
        closeRate() {
            this.$emit('closeRateAlertView')
        }
    }
};
</script>
<style scoped>
@font-face {
        font-family: 'FuturaBT-BoldItalic';
        src: url(../../assets/font/FuturaBoldItalicfont.ttf);
    }

.rateAlertView {
    position: fixed;
    top:0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
}

.rateAlertViewBox {
    width: 318px;
    height: 335px;
    background: #FFFFFF;
    border-radius: 4px;
    border-radius: 4px;
    margin: 50% auto;
    text-align: center;
    padding: 0.1px;
    position: relative;
}

.rateAlertViewBox > img {
    width: 60%;
}

.starImg {
    margin: 10px 0;
}

.rateAlertViewBox h1 {
    font-family: 'FuturaBT-BookItalic';
    font-size: 20px;
    color: #000000;
    margin: 19px 0;
}

.coinDiv > p:first-child {
    font-family: 'Avenir-Medium';
    font-size: 16px;
    color: #686868;
}

.coinDiv > p:last-child {
    font-family: 'Avenir-Black';
    font-size: 16px;
    color: #9013FE;
    display: flex;
    align-items: center;
    justify-content: center;
}

.coinDiv > p:last-child img {
    width: 22px;
    margin-left: 5px;
}

.clickBtn {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #9013FE;
    border-radius: 0 0 4px 4px;
    font-family: 'FuturaBT-BookItalic';
    font-size: 20px;
    color: #FFFFFF;
    position: absolute;
    bottom: 0;
    left: 0;
}

.closeBtn {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 10px;
    top: 10px;
}

.closeBtn img {
    display: block;
    width: 100%;
}
</style>