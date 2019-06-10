<template>
    <div class="freeCoins">
        <!--loading-->
        <loadingComponent :style="{display: loading}">

        </loadingComponent>
        <div class="limitSlid">
            <GoodsOff :typeStyle="coinsStyle" v-for="(value, index) in storeList" :key="index" :itemList = "value" :itemIndex = "index" @payForGoods = "payOk" />
        </div>
        <p class="sepLine" v-show="storeList"></p>
        <div class="missionList">
            <div v-for="item in taskRewards" @click="taskSelect(item)">
                <div class="itemName">
                    <div v-if="item.imageurl.length > 0">
                        <img v-lazy="item.imageurl" alt="">
                    </div>
                    <div>
                        <p>{{item.rewardName}}</p>
                        <p>{{item.describ}}</p>
                    </div>
                    
                </div>
                <div class="itemBtn">
                    <span>{{item.rewardCoin}} Coins</span>
                </div>
                
            </div>
        </div>
        
    </div>
</template>

<script>
    // import LimitTimeOffer from '../componentHelper/limitTimeOffer'
    // import VipService from '../componentHelper/vipService'
    import dsbridge from '../../helper/swbridge';
    import userhelper from '../../helper/userhelper'
    import nethelper from '../../helper/nethelper'
    let JSONbig = require('json-bigint');

    import loadingComponent from '../componentHelper/loadingComponent'
    import GoodsOff from '../componentHelper/goodsOff'
    import bus from '../../store/bus'

    export default {
        // name: "free-coins",
        data(){
            return {
                show_rate: true,
                iapCoins: false,
                storeList: [],
                taskRewards: [],
                loading: 'none',
                rateItem: '',
                coinsStyle: {
                    color: '#F3AF20',
                    icon: require('../../assets/images/coins.png')
                },
                // downloadAppPackage: '',
                // downloadItem: ''
            }
        },
        components: {
            loadingComponent, GoodsOff
        },
        computed: {
            taskIcon() {

            }
        },
        methods: {
            taskSelect(item) {
                this.$store.commit('setTransition', 'slide-left');
                if (item.rewardTypeId === 0) {
                    // alert('begin rateus, record rate time');
                    // this.turnApp(item);
                    bus.$emit('turnApp', item)
                } 
                else if (item.rewardTypeId === 6){
                    // this.turnApp(item);
                    bus.$emit('turnApp', item)
                } 
                // else if (item.rewardTypeId === 7){
                //     this.$router.push('/inviteFriend')
                // } else if (item.rewardTypeId === 8){
                //     console.log(this.$store.state.config);
                //     dsbridge.call('WatchVideo', function (res) {
                //         console.log(res);
                //     })
                // } 
                else if (item.rewardTypeId === 1) {
                    this.$router.push('/dailyLogin')
                }
            },
            payOk(item) {
                console.log(item);
                if (!nethelper.fakeServer) {
                    let that = this;
                    that.loading = 'block';

                    var puchasedata = nethelper.appname === 'qrcode' ? {productId:{productId:item.goodsId}} : {productId:item.goodsId}
                    dsbridge.call('startPurchaseProduct',puchasedata,function(resStr,ignore){
                        let res = JSONbig.parse(resStr);

                        if (res.data.error != undefined){
                            that.loading = 'none';
                            alert(res.data.error);
                        }
                        else{
                            let receipt = res.data.receipt;
                            let productId = res.data.productId;
                            userhelper.directlogin((res, error) => {
                                that.loading = 'none';
                                console.log('hide loading');
                                if (error) {
                                    alert(error.errorMessage);
                                } else {
                                    let coins = res.coins;
                                    // that.$emit('refreshCoins', coins);
                                    that.$store.commit('updateCoins',coins);
                                    alert('Purchase Success!');
                                }
                            });
                        }
                    });
                }
            },
            handleIapGoods(iapGoods) {
                iapGoods.forEach(function (item) {
                    if (item.paymentType === 0) {
                        if (item.goodsAmount === 0) {
                            this.coinCommentItem = item;
                            this.coinsPrice = item.price;
                        }
                    } else {
                        this.cashPrice = item.price;
                        this.cashCommentItem = item;
                    }
                }.bind(this));
            },
            handleTaskRewards(taskRewards) {
                if (!taskRewards) return;
                let temp = [];
                taskRewards.forEach(value => {
                    if (value.rewardTypeId === 0 || value.rewardTypeId === 1) {
                        temp.push(value)
                    } else if (value.rewardTypeId === 6) {
                        let downloadAppPackage = value.target.slice(value.target.indexOf(';') + 1,value.target.length);
                        if((!/iphone/gi.test(window.navigator.userAgent) && !(dsbridge.call('available', downloadAppPackage)))) {
                            temp.push(value)
                        }
                    } 
                });
                this.taskRewards = temp;
            },
            refershCoinsData() {
                let iapGoods,taskRewards;
                let that = this;
                if(that.$store.state.config) {
                    iapGoods = that.$store.state.config.iapGoods;
                    taskRewards = that.$store.state.config.taskRewards;
                    taskRewards.forEach(value => {
                        if (value.rewardTypeId === 0) {
                            this.rateItem = value;
                        }
                    });
                    that.storeList = iapGoods;
                    if (iapGoods) {
                        that.handleIapGoods(iapGoods);
                        that.iapCoins = true;
                    }
                    that.handleTaskRewards(taskRewards)
                } else {
                    userhelper.directlogin((res, error) => {
                        if (error) {
                            that.$router.push('/login');
                        } else {
                            console.log(userhelper.userconfig);
                            that.$store.commit('getConfig',userhelper.userconfig);
                            iapGoods = that.$store.state.config.iapGoods;
                            taskRewards = that.$store.state.config.taskRewards;
                            that.storeList = iapGoods;
                            if (iapGoods) {
                                that.handleIapGoods(iapGoods);
                                that.iapCoins = true;
                            }
                            that.handleTaskRewards(taskRewards)
                        }
                    });
                }
            },
        },
        activated() {
            this.refershCoinsData();
            console.log(nethelper.deviceid)
        },
        mounted() {
            this.refershCoinsData();
        },
        created() {
            this.refershCoinsData();
        }
    }
</script>

<style scoped>
    @font-face {
        font-family: 'FuturaBT-BookItalic';
        src: url(../../assets/font/futuramediumbt.ttf);
    }

    .freeCoins{
        background: #fff;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }

    .missionList {
        width: 95%;
        margin: 0 auto;
    }

    .missionList > div {
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 60px;
        align-items: center;
    }

    .missionList > div:not(:last-child) {
        border-bottom: 1px solid #ccc;
    }

    .itemName {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-grow: 1;
    }

    .itemName p {
        max-width: 180px;
        font-size: 16px;
        text-indent: 10px;
        font-family: 'FuturaBT-BoldItalic';
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }

    .itemName p:last-child {
        font-size: 12px;
        color: #aaa;
    }

    .itemBtn span{
        display: inline-block;
        width: 108px;
        height: 34px;
        line-height: 34px;
        border-radius: 17px;
        text-align: center;
        color: #fff;
        background: #9013FE;
        border-radius: 15px;
        font-size: 18px;
        margin-right: 3px;
        font-family: 'FuturaBT-BookItalic';
    }

    .missionList img {
        width: 40px;
        height: 40px;
    }

    .sepLine{
        width: 100%;
        height: 15px;
        background: #eee;
    }

    .limitSlid {
        padding: 13px;
    }

    /* .limitSlid ul {
        margin: 10px 20px 0 20px;
    }

    .limitSlid li {
        width: 100%;
        height: 46px;
        border-bottom: 1px solid #edebe9;
        padding: 14px 5px;
        display: flex;
        justify-content: space-between;
    }

    .limitSlid img {
        width: 46px;
        height: 46px;
        margin-right: 5px;
    }

    .limitSlid span {
        color: #666;
    }

    .limitSlid p {
        font-size: 12px;
        color: #bbb;
    }

    li > div:first-child {
        display: flex;
    }

    .coinsAmount{
        font-size: 16px;
    }

    li > div:first-child div {
        margin-top: 5px;
    }

    li > div:last-child {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        margin-top: 8px;
        background: linear-gradient(to right, #6C64FA, #69C0FC);
        border-radius: 5px;
    } */

</style>
