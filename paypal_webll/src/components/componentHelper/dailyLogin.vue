<template>
    <div class="dailyLogin">
        <!--loading-->
        <loadingComponent :style="{display: loading}" />
        <div class="loginTitle" :style="{paddingTop: topHigh, height:hg}">
            <div class="loginHeader">
                <div class="back_btn" @click="back_btn"><span></span></div>
                <CoinsAmount class="coinsAmount"/>
            </div>
            <div class="moreRewards">
                <div class="dailyLogo"><img src="../../assets/images/bottle@3x.png" alt=""></div>
                <div class="dailyContent">
                    <p>CHECK IN TO</p>
                    <P>GET MORE REWARDS</P>
                    <p @click="getCoins">Checkin + {{dailyCoins}} coins</p>
                </div>
            </div>
        </div>
        <div class="dateList" :class="!xiaodi?'yibanHome':'liuhaiHome'" :style="{top:tp}">
            <div class="date" v-for="(reward, index) in dailyLoginRewardArray">
                <div><img src="../../assets/images/coins.png" alt=""><span>x{{reward.coins}}</span></div>
                <div>Day{{index + 1}}</div>
                <div v-show="reward.check" class="checked"><img src="../../assets/images/dailysuccess.png" alt=""></div>
            </div>
        </div>
    </div>
</template>

<script>
    import CoinsAmount from './coinsAmount'
    import userhelper from '../../helper/userhelper'
    import loadingComponent from './loadingComponent'

    export default {
        name: "daily-login",
        data() {
            return {
                dailyCoins: 15,
                dailyLoginRewardArray: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
                checkArr: [],
                topHigh: 0,
                hg: '160px',
                tp: '220px',
                loading: 'none'
            }
        },
        components: {
            CoinsAmount, loadingComponent
        },
        methods: {
            back_btn(){
                this.$router.go(-1)
            },
            getCoins() {
                let rewards = this.$store.state.config.taskRewards;
                let item;
                rewards.forEach(value => {
                    if (value.rewardTypeId === 1) {
                        item = value;
                    }
                });
                rewards.forEach(value => {
                    if (value.rewardTypeId === 1) {
                        item = value;
                    }
                });
                this.loading = 'block';
                userhelper.getreward(item, function (res, err) {  // 400
                    if (err) {
                        console.log(err);
                        alert(err.errorMessage)
                    } else {
                        console.log(res);
                        if (res.coins === this.$store.state.coins) {
                            alert('You have gotten daily reward!')
                        } else {
                            this.$store.commit('updateCoins', res.coins);
                            this.loginRewardArray();
                            this.checkDaily();
                            alert('success');
                        }
                    }
                    this.loading = 'none';
                }.bind(this));
            },
            checkDaily() {
                console.log(this.dailyLoginRewardArray);
                for (let i = 0; i< this.dailyLoginRewardArray.length; i++){
                    if (!this.dailyLoginRewardArray[i].check) {
                        this.dailyLoginRewardArray[i].check = true;
                        break;
                    }
                }
                console.log(this.dailyLoginRewardArray);
                userhelper.setCheckDaily(this.dailyLoginRewardArray);
            },
            loginRewardArray () {
                // localStorage.removeItem('checkDaily');
                this.dailyCoins = this.$store.state.config.dailyLoginReward;
                let checkDailyList = userhelper.getCheckDaily('checkDaily');
                console.log(checkDailyList);
                if (checkDailyList){
                    if (checkDailyList[checkDailyList.length -1].check) {   // 最后一天签到，签到已满
                        // 刷新checkDailyList
                        for (let i = 0; i< checkDailyList.length; i++){
                            checkDailyList[i].check = false;
                        }
                        this.dailyLoginRewardArray = checkDailyList;
                        userhelper.setCheckDaily(this.dailyLoginRewardArray);
                    } else {
                        this.dailyLoginRewardArray = checkDailyList;
                    }
                } else {
                    let checkArray = this.$store.state.config.dailyLoginRewardArray;
                    if (!checkArray) {
                        checkArray = [10, 15, 20, 25, 30, 20, 30, 40, 50, 60, 40, 55, 70, 85, 100, 80, 100, 120, 140, 160, 160, 185, 210, 235, 260, 320, 350, 380, 410, 440]
                    }
                    this.dailyLoginRewardArray = [];
                    for (let i = 0; i< checkArray.length; i++){
                        this.dailyLoginRewardArray.push({
                            coins: checkArray[i],
                            check: false
                        });
                    }
                    userhelper.setCheckDaily(this.dailyLoginRewardArray);
                }
            }
        },
        created() {
            console.log(this.$store.state.config);
            this.loginRewardArray();
            let shipei = userhelper.choosePhoneModel();
            if (shipei.quanping) {
                if (shipei.phoneX) {
                    this.xiaodi = true;
                    this.topHigh = '40px';
                    this.hg = '32%';
                    this.tp = '32%';
                } else {
                    this.topHigh = '20px';
                    this.hg = '37%';
                    this.tp = '37%';
                    this.xiaodi = false;
                }
            } else {
                this.topHigh = 0;
                this.hg = '38%';
                this.tp = '38%';
                this.xiaodi = false;
            }
        }
    }
</script>

<style scoped>
    .dailyLogin {
        width: 100%;
        position: fixed !important;
        top: 0;
        bottom: 0;
        z-index: 1000;
    }

    .loginTitle {
        width: 100%;
        height: 220px;
        color: #fff;
        background: linear-gradient(to right, #F21174, #820091);
    }

    .loginHeader{
        width: 100%;
        height: 60px;
        text-align: center;
        font-size: 16px;
        /* font-weight: 200; */
        display: flex;
        justify-content: space-between;
        align-items: center;
        /*padding-top: 40px;*/
        position: relative;
    }

    .back_btn {
        position: absolute;
        width: 30px;
        height: 30px;
        /*top: 40px;*/
        left: 20px;
    }

    .back_btn span {
        display: inline-block;
        width: 10px;
        height: 10px;
        border: 2px solid;
        border-color: #fff #fff transparent transparent;
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
    }

    .coinsAmount {
        position: absolute;
        right: 0;
    }

    .moreRewards{
        width: 100%;
        height: 160px;
        display: flex;
        justify-content: space-between;
    }

    .dailyLogo{
        width: 35%;
    }

    .dailyLogo>img{
        width: 85px;
        height: 140px;
        margin-left: 20px;
    }
    .dailyContent{
        width: 65%;
        height: 160px;
        /*line-height: 160px;*/
    }

    .dailyContent>p:first-child{
        font-size: 16px;
        margin-top: 50px;
    }
    .dailyContent>p:nth-child(2){
        font-size: 20px;
    }
    .dailyContent>p:last-child{
        font-size: 16px;
        width: 180px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: linear-gradient(to right, #6C63FA, #69C1FC);
        border-radius: 5px;
        margin-top: 10px;
    }
    .dailyContent>p:last-child:active{
        box-shadow: 0 0 4px #333;
    }
    .dateList{
        width: 100%;
        position: absolute;
        top: 220px;
        bottom: 0;
        background: #F0F0F0;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 20px 10px;
        overflow: hidden;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }
    ::-webkit-scrollbar{
        display: none;
    }
    .yibanHome {
        padding-bottom: 0;
    }

    .liuhaiHome {
        padding-bottom: 25px;
    }
    .date{
        width: 18%;
        border: 1px solid #E4B53E;
        background: #fff;
        text-align: center;
        font-size: 12px;
        margin-bottom: 10px;
        position: relative;
    }

    .date>div:first-child{
        height: 36px;
        line-height: 36px;
        text-align: center;
    }

    .date>div:first-child>img{
        width: 26px;
        height: 26px;
        margin-top: 4px;
    }

    .date>div:first-child>span{
        vertical-align: top;
    }

    .date>div:nth-child(2){
        height: 25px;
        line-height: 25px;
    }

    .checked {
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.6);
        position: absolute;
        top: 0;
        left: 0;
    }

    .checked img{
        margin-top: 12px;
    }
</style>
