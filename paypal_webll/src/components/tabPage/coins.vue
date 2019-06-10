<template>
    <div class="coins">
        <!-- &lt;!&ndash;loading&ndash;&gt;-->
        <loadingComponent :style="{display: loading}">

        </loadingComponent>
        <div class="coinsContent">
            <div class="coinsTab">
                <div :style="{background: active_flag?'#9013FE':'',color:active_flag?'#fff':'#4A4A4A'}" @click.stop="zanTabClicked">Like</div>
                <div :style="{background: !active_flag?'#9013FE':'',color:!active_flag?'#fff':'#4A4A4A'}" @click.stop="fenTabClicked">Follow</div>
            </div>
            <div class="coinImg">
                <div>
                    <img v-lazy=thumbImg :key=thumbImg alt='image'>
                    <div class="postUsername" v-show="username">
                        <span>{{username}}</span>
                    </div>
                </div>
            </div>
            <!--<div class="coinText">Do not,for one repulse,forgo the purpose that you resolved to effort.</div>-->
            <div class="btnAction">
                <div class="btn">
                    <p class="btnhook" :style="{display: btnhook}"></p>
                    <div :class="isSkip ? 'skip':'skip_lock'" @click="skip">SKIP</div>

                    <div :class="isNafen ? 'nafen':'nafen_lock'" @click="action"><span>{{btn}} +{{coinsReward}}</span><img
                        src="../../assets/images/coins.png"
                        alt=""></div>
                </div>
                <div class="free_btn" @click="toFreeCoins" v-show="videoads_flag">
                    <div>
                        <img src="../../assets/images/watch&earn_icon.png" alt="">
                        <span>Watch & Earn</span>
                    </div>
                    <div>
                        <span>+4</span>
                        <img src="../../assets/images/coins.png" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="locked" :style="{display:locked}"></div>
    </div>
</template>

<script>

    console.log('coinpage');

    const dingdankindZan = 0;
    const dingdankindFen = 1;

    import userhelper from '../../helper/userhelper'
    import nethelper from '../../helper/nethelper'
    import dsbridge from '../../helper/swbridge'
    import loadingComponent from '../componentHelper/loadingComponent'

    export default {


        data() {
            return {
                active_flag: true,
                active: 'coinActive',
                btn: 'Like',
                thumbImg: null,
                coinsReward: '',
                username: '',
                zan: 0,
                fen: 0,
                zanDingdan: [],
                fenDingdan: [],
                dingdankind: 0,
                currentList: [],
                locked: 'none',
                loading: 'block',
                btnhook: 'none',
                isSkip: true,
                isNafen: true,
                refresh_flag: false,
            }
        },
        components: {
            loadingComponent
        },
        computed: {
            videoads_flag() {
                return this.$store.state.config.config.videoads === '1'?true:false;
            }
        },
        methods: {
            setdingdankind(kind) {
                if (!this.refresh_flag) {
                    if (this.dingdankind == kind) {
                        return;
                    }
                    else {
                        this.dingdankind = kind;
                        this.active_flag = kind == dingdankindZan ? true : false;
                        this.currentList = kind == dingdankindZan ? this.zanDingdan : this.fenDingdan;
                    }
                }
            },

            zanTabClicked() {
                this.setdingdankind(dingdankindZan);
                this.refillDingdanIfEmpty();
            },
            fenTabClicked() {
                this.setdingdankind(dingdankindFen);
                this.refillDingdanIfEmpty();
            },

            refreshDingdanImage() {
                if (this.currentList.length <= 0) {
                    alert('No order available, come back later.');
                    return;
                }

                let dingdan = this.currentList[0];
                if (dingdan.kind === "follow") {
                    this.thumbImg = dingdan.avatarUrl;
                    this.coinsReward = dingdan.coinsReward;
                    this.username = dingdan.username;
                    this.btn = 'Follow';
                } else {
                    this.thumbImg = dingdan.videoThumbnailUrl;
                    this.coinsReward = dingdan.coinsReward;
                    this.username = dingdan.username;
                    this.btn = 'Like';
                }
            },

            lockActionButton2Seconds(type) {
                this.isSkip = false;
                this.isNafen = false;
                let that = this;
                setTimeout(function () {
                    that.isSkip = true;
                    that.isNafen = true;
                    that.btnhook = 'none';
                }, 2200)
            },

            lockActionButton(it){
                it.isSkip = false;
                it.isNafen = false;
                this.btnhook = 'block';
            },
            unlockActionButton(it){
                it.isSkip = true;
                it.isNafen = true;
                this.btnhook = 'none';

            },
            toFreeCoins(){
                dsbridge.call('videoads', (response) => {
                    if (JSON.parse(response).data.status !== 'ok') {
                        alert(JSON.parse(response).data.message)
                        return
                    }else {
                        setTimeout(() => {
                            userhelper.videoadsServer(JSON.parse(response).data.amount, (res, error) => {
                                if (error) {
                                    alert('video server fail')
                                } else {
                                    this.$store.commit('updateCoins',res.coinsInAccount);
                                }
                            })
                        }, 1000);
                    };
                })
            },

            refillDingdanIfEmpty() {
                if (this.currentList.length <= 0) {
                    // console.log('show loading lock tab');
                    this.locked = 'block';
                    this.refillDingdan();
                }
                else {
                    this.refreshDingdanImage();
                }
            },

            zuodingdan(skipOrDo) {
                let dingdan = this.currentList.shift();
                userhelper.zuodingdan(skipOrDo, dingdan, function (res, error) {
                    if (error) {
                        alert(error.errorMessage);
                        console.log(error);
                    } else {
                        let coins = res.data.coinsInAccount;
                        this.$store.commit('updateCoins', res.data.coinsInAccount);
                        console.log('time to update coins:' + coins);
                    }
                }.bind(this));

                this.refillDingdanIfEmpty();
            },
            skip() {
                this.lockActionButton2Seconds('skip');
                this.btnhook = 'block';
                this.zuodingdan(1);
            },
            action() {
                this.lockActionButton2Seconds('nafen');
                this.btnhook = 'block';
                this.zuodingdan(0);
            },
            refreshDingdan() {
                this.setdingdankind(dingdankindZan);
                if (userhelper.userconfig) {
                    this.refillDingdanIfEmpty();
                }
                else{
                    this.loading = 'block';
                    this.lockActionButton(this);
                    let that = this;
                    let timer = setInterval(function(){
                        // alert((userhelper.userconfig));
                        if (userhelper.userconfig) {
                            that.loading = 'none';
                            that.unlockActionButton(that);
                            clearInterval(timer);
                            that.refillDingdanIfEmpty();
                        }
                        // else {
                        //     clearInterval(timer);
                        //     that.$router.push('/login')
                        // }

                    },1000);

                }
            },
            refillDingdan() {
                this.loading = 'block';
                this.refresh_flag = true;

                userhelper.nadingdan(this.dingdankind, (res, error) => {
                    console.log('unlock tab');
                    this.locked = 'none';
                    this.loading = 'none';

                    if (error) {
                        alert(error.errorMessage);
                    } else {
                        console.log(res);

                        if (this.dingdankind == dingdankindZan) {
                            this.zanDingdan = res.data.boardList;
                            this.currentList = this.zanDingdan;
                        }
                        else {
                            this.fenDingdan = res.data.boardList;
                            this.currentList = this.fenDingdan;
                        }
                        this.refresh_flag = false;
                        this.refreshDingdanImage();
                    }
                });
            }
        },
        created() {
            // console.log('coin page created');
            this.refreshDingdan()
        },
    }
</script>

<style scoped>
    .coins {
        width: 100%;
        height: 100%;
        background: #fff;
    }

    .coinsContent {
        width: 90%;
        height: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .coinsTab {
        width: 100%;
        height: 45px;
        line-height: 45px;
        font-size: 18px;
        /* margin: 20px auto; */
        position: relative;
        color: rgb(74,74,74);
        text-indent: 6px;
        display: flex;
        border-radius: 4px;
        border: 2px solid #9013FE;
        margin-bottom: 10px;
    }

    /*.coinsTab>span{*/
        /*display: inline-block;*/
        /*width: 0;*/
        /*height: 0;*/
        /*border-left: 5px solid transparent;*/
        /*border-right: 5px solid transparent;*/
        /*border-top: 6px solid #6190DE;*/
        /*position: absolute;*/
        /*top: 10px;*/
        /*right: 5px;*/
    /*}*/

    .coinsTab > div {
        flex: 1;
        text-align: center;
    }

    /* .coinsTab > div:nth-child(1) {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }

    .coinsTab > div:nth-child(2) {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    } */

    /*.select_tab{*/
        /*position: absolute;*/
        /*top: 25px;*/
        /*left: 0;*/
    /*}*/

    .coinsTab div:active {
        box-shadow: 0 0 4px #333;
    }

    .coinActive {
        color: #fff;
        background: #9013FE;
    }

    .coinImg {
        width: 100%;
        /*height: 68%;*/
        position: relative;
        border-radius: 5px;
        /*margin: 10px auto;*/
        flex-grow: 1;
    }

    .coinImg > div {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        box-shadow: 0 0 1px #000;
    }

    .coinImg img {
        width: 100%;
        display: block;
        max-height: 44vh;
        min-height: 30vh;
    }

    .postUsername {
        width: 100%;
        height: 43px;
        line-height: 43px;
        position: absolute;
        left: 0;
        bottom: 0;
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
        box-shadow: 0 0 1px #000;
    }

    .coinImg span {
        margin-left: 10px;
        font-size: 18px;
        vertical-align: top;
    }

    .btnAction {
        margin: 10px 0;
    }

    .btn {
        display: flex;
        text-align: center;
        justify-content: space-between;
        color: #fff;
        margin-bottom: 10px;
    }

    .btn div {
        height: 45px;
        line-height: 45px;
        border-radius: 4px;
        font-size: 16px;
        text-transform: capitalize;
    }

    .btn div:active {
        box-shadow: 0 0 4px #333;
    }

    .skip {
        width: 24%;
        background: #ffbe40;
    }

    .skip_lock {
        width: 24%;
        background: #aaa;
        color: #eee;
    }

    .nafen {
        width: 74%;
        background: #9013FE;
    }

    .nafen_lock {
        width: 74%;
        background: #aaa;
        color: #eee;
    }

    .nafen img, .nafen_lock img {
        width: 24px;
        height: 24px;
        margin-top: 10px;
    }

    .nafen span, .nafen_lock span {
        vertical-align: top;
    }

    .locked {
        position: absolute;
        /*height: 100%;*/
        width: 100%;
        background: transparent;
        top: 80px;
        bottom: 60px;
        left: 0;
        z-index: 99999;
    }

    .btn .btnhook{
        position: absolute;
        width: 90%;
        height: 45px;
        background: transparent;
        z-index: 10;
    }

    .free_btn{
        width: 100%;
        height: 45px;
        /* line-height: 45px; */
        background: #32BD94;
        text-align: center;
        color: #fff;
        font-size: 16px;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .free_btn > div {
        display: flex;
        align-items: center;
    }

    .free_btn:active {
        box-shadow: 0 0 4px #333;
    }

    .free_btn > div:first-child {
        margin-left: 12px;
    }

    .free_btn > div:first-child > img{
        width: 34px;
    }

    .free_btn > div:first-child > span {
        margin-left: 8px;
    }

    .free_btn > div:last-child {
        width: 68px;
        height: 30px;
        background: #fff;
        color: #000;
        justify-content: center;
        border-radius: 4px;
        margin-right: 12px;
    }

    .free_btn > div:last-child > img{
        width: 20px;
        margin-left: 5px;
    }

</style>
