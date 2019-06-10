<template>
    <div class="content">
        <!--loading-->
        <loadingComponent :style="{display: loading}" />
        <!-- <div class="bgImg" :style="{display: loading}"></div> -->
        <header class="header">
            <div class="userImage" @click="userAction" v-show="!(title === 'Settings')"><img v-bind:src=userImg alt=""></div>
            <!--<div class="free" @click="toFree"><img src="../assets/images/gift@3x.png" alt=""></div>-->
            <div class="userId">{{title}}</div>
            <CoinsAmount v-show="!(title === 'Settings')" />
            <div class="userActionBox" :style="{display: userClick_flag?'none': 'block'}">
                <div @click="refreshDataCount"><img src="../assets/images/top_refresh_icon.png" alt=""><span>Refresh</span></div>
                <!-- <div @click="toOrderStatus"><img src="../assets/images/top_orderstatus_icon.png" alt=""><span>OrderStatus</span></div>
                <div @click="logOut"><img src="../assets/images/top_log_out_icon.png" alt=""><span>Log Out</span></div>
                <div @click="toMail"><img src="../assets/images/top_contact_icon.png" alt=""><span>Contact Us</span></div> -->
            </div>
        </header>
        <!--<div class="userClick" v-show="userClick_flag">-->
            <!--<p></p>-->
            <!--<div @click="refreshDataCount">refresh</div>-->
            <!--<div @click="logOut">Logout</div>-->
        <!--</div>-->
        <div class="container">
            <transition :name="routerTransition">
                <keep-alive>
                    <router-view ref="child" class="child-view">

                    </router-view>
                </keep-alive>
            </transition>
        </div>

        <footer class="footer">
            <router-link class="my-bar-item" to="/coins">
                <div>
                    <p></p>
                    <p>Coins</p>
                </div>
            </router-link>
            <router-link class="my-bar-item" to="/likes">
                <div>
                    <p></p>
                    <p>Likes</p>
                </div>
            </router-link>
            <router-link class="my-bar-item" to="/followers">
                <div>
                    <p></p>
                    <p>Followers</p>
                </div>
            </router-link>
            <router-link class="my-bar-item" to="/freeCoins">
                <div>
                    <p></p>
                    <p>Store</p>
                </div>
            </router-link>
            <router-link class="my-bar-item" to="/setting">
                <div>
                    <p></p>
                    <p>Settings</p>
                </div>
            </router-link>
        </footer>

        <div class="confirm_log" v-show="logout_flag">
            <p>{{alertTitle}}</p>
            <p>{{alertMessage}}</p>
            <div>
                <p @click="cancel_logout">Cancel</p>
                <p @click="ok_logout">Ok</p>
            </div>
        </div>

        <!--<div class="menuBtn" :style="{top: menuTop + 'px', left: menuLeft + 'px'}" @touchstart="ontouchstart($event)" @touchmove="ontouchmove($event)">-->
            <!--<div :class="showMenu?'orderStatus':''" @click="toOrderStatus"></div>-->
            <!--<div :class="showMenu?'logout':''" @click="logOut"></div>-->
            <!--<div :class="showMenu?'refresh':''" @click="refreshDataCount"></div>-->
        <!--</div>-->
        <RateAlertView v-if="rate_flag" @closeRateAlertView="closeRate" @rateAction="turnApp" />

    </div>
</template>

<script>
    console.log('tabpage');
    import nethelper from '../helper/nethelper';
    import userhelper from '../helper/userhelper';
    import dsbridge from '../helper/swbridge';
    import iihelper from '../helper/IIHelper';
    import CoinsAmount from './componentHelper/coinsAmount'
    import RateAlertView from './componentHelper/rateAlertView'
    import loadingComponent from './componentHelper/loadingComponent'
    import bus from '../store/bus'

    export default {
        data() {
            return {
                userImg: require('../assets/images/top_user_icon.png'),
                userName: '',
                loading: 'none',
                loadImg: require('../assets/images/newTenor.gif'),
                title: 'Get Coins',
                show_logout: true,
                logout_flag: false,
                userClick_flag: true,
                phoneX: true,
                xiaodi: true,
                menuTop: "100",
                menuLeft: "100",
                showMenu: false,
                alertTitle: 'Warn',
                alertMessage: 'Log out?',
                routerTransition: '',
                rate_flag: false,
                rateItem: '',
                downloadAppPackage: '',
                downloadItem: ''
            }
        },
        components: {
            CoinsAmount, RateAlertView, loadingComponent
        },
        methods: {
            getUserInfo() {
                // this.coins = userhelper.userconfig.coins;

                if (userhelper.logged_in_user.user) {

                    this.userName = userhelper.logged_in_user.user.username;
                    this.userImg = userhelper.logged_in_user.user.profile_pic_url;
                    console.log(this.userName, this.userImg);
                } else {
                    this.userName = userhelper.logged_in_user.username;
                    this.userImg = userhelper.logged_in_user.profile_pic_url;
                }

            },
            toOrderStatus() {
                this.userClick_flag = true;
                this.$router.push('/order');
            },
            refreshDataCount() {
                this.userClick_flag = true;
                if (window.location.href.indexOf('followers') !== -1) {
                    this.$refs.child.getUserInfo(true);
                } else if (window.location.href.indexOf('likes') !== -1){
                    this.$refs.child.onPullingDown();
                } else if (window.location.href.indexOf('coins') !== -1) {
                    this.$refs.child.refillDingdan();
                }
            },
            logOut: function () {
                this.userClick_flag = true;
                this.alertTitle = 'Log Out';
                this.alertMessage = 'Are you sure to logout?';
                this.logout_flag = true;
            },
            // toMail: function() {
            //     let url = "mailto:eirikfu000@gmail.com?body=Instagram%20Username"
            //     dsbridge.call("openUrl", url, function(res) {
            //         console.log(res)
            //     }.bind(this));
            // },
            cancel_logout(){
                this.logout_flag = false;
            },
            ok_logout(){
                if (this.alertTitle === 'Log Out') {
                    let that = this;
                    userhelper.logoutUser(function (res,error) {
                        if (error){
                            alert(error.errorMessage);
                        }
                        else{
                            that.logout_flag = false;
                            that.$router.push('/login');
                        }
                    })
                } else {
                    this.logout_flag = false;
                    let url = "http://www.baidu.com";
                    dsbridge.call('openUrl', url, function (res) {
                        let resData = JSON.parse(res);
                        console.log(resData);
                        if (resData.data.message !== 'success') return;
                        let date = new Date();
                        let seconds = date.getSeconds();
                        console.log(seconds);
                        this.$store.commit('updateRatetime', seconds);
                    }.bind(this));
                }
            },
            userAction(){
                this.userClick_flag = !this.userClick_flag;
            },
            closeRate() {
                this.rate_flag = false;
            },
            getLoginData() {
                if (userhelper.userconfig) {
                    this.loading = 'none';
                    console.log('hide loading');
                    this.$store.commit('getConfig',userhelper.userconfig);
                    this.getUserInfo();
                    this.showRateAlertView()
                }
                else{
                    try {
                        if (nethelper.fakeServer){
                            this.$router.push('/login');
                            return
                        }

                        console.log(userhelper.userconfig);
                        this.loading = 'block';
                        let that = this;
                        let arr = dsbridge.call('cookies',nethelper.HOSTNAME);
                        if (arr.constructor !== Array) {
                            arr = eval(arr)
                        }
                        let ds_user_id=0;
                        for (var i=0; i<arr.length;i++){
                            if (arr[i].name.toLowerCase() === 'ds_user_id') {
                                console.log(ds_user_id);
                                ds_user_id = arr[i].value;
                            }
                        }
                        if (ds_user_id!=0) {
                            console.log(ds_user_id);
                            iihelper.selfIIinfo(ds_user_id,function(res,error){
                                if (error) {
                                    console.log(error);
                                    if (error.errorMessage === 'checkpoint_required' || error.errorMessage === 'challenge_required'){
                                        alert(error.errorMessage);
                                        that.$router.push('/login');
                                    }
                                }
                                else{

                                    userhelper.logged_in_user = res.data.user;
                                    userhelper.directlogin((res, error) => {
                                        that.loading = 'none';
                                        console.log('hide loading');
                                        if (error) {
                                            console.log('return to login');
                                            that.$router.push('/login');
                                        } else {
                                            console.log(userhelper.userconfig);
                                            that.$store.commit('getConfig',userhelper.userconfig);
                                            that.getUserInfo();
                                            that.showRateAlertView()
                                        }
                                    });
                                }
                            })
                        } else {
                            that.$router.push('/login');
                        }


                    } catch (e) {
                        this.loading = 'none';
                        console.log('exception:'+e);
                    } finally {
                        this.loading = 'none';
                    }

                }
            },
            turnApp(item) {
                let bundleId = dsbridge.call('bundleId','1');
                let href = item.target;
                let url;
                if (item.rewardTypeId === 6) {
                    url = item.subtitle;
                    this.downloadAppPackage = item.target.slice(item.target.indexOf(';') + 1,item.target.length);
                    this.downloadItem = item;
                    dsbridge.call('openUrl', url, function (res) {
                        this.$store.commit('updateRewardType', 'downloadApp');
                    }.bind(this));
                } else {
                    if (/iphone/gi.test(window.navigator.userAgent)) {
                        url = href.slice(href.indexOf('http'));
                    } else {
                        url = 'https://play.google.com/store/apps/details?id=' + bundleId;
                    }
                    this.rateItem = item;
                    dsbridge.call('openUrl', url, function (res) {
                        let date = new Date();
                        let seconds = date.getSeconds();
                        this.$store.commit('updateRatetime', seconds);
                        this.$store.commit('updateRewardType', 'rate');
                    }.bind(this));
                }
            },
            showRateAlertView () {
                let needRate = this.$store.state.config.config.needrate;
                let rateItem;
                this.$store.state.config.taskRewards.forEach(value => {
                    if (value.rewardTypeId === 0) {
                        rateItem = value
                    }  
                });
                let rateVersion = dsbridge.call('version');
                let lastRateVersion = localStorage.getItem("rateversion");
                console.log(needRate, rateVersion, lastRateVersion, rateItem)
                if (needRate === '1' && lastRateVersion === rateVersion && rateItem){
                    setTimeout(() => {
                        this.rate_flag = true
                    }, 3000);
                } else {
                    this.rate_flag = false
                }
            },
            getRewardServer(item) {
                userhelper.getreward(item, (res, err) => {  // 400
                    this.loading = 'none';
                    if (err) {
                        let rateversion = dsbridge.call('version');
                        localStorage.setItem("rateversion", rateversion)
                        alert(err.errorMessage);
                    } else {
                        alert("success");
                        console.log(res);
                        this.$store.commit('updateCoins',res.coins);
                        let rateversion = dsbridge.call('version');
                        localStorage.setItem("rateversion", rateversion)
                    }
                });
            }
        },
        watch: {
            '$route'(to, from) {
                if (to.path === '/followers') {
                    this.title = 'Get Followers';
                    this.show_logout = false;
                } else if (to.path === '/likes') {
                    this.title = 'Boost Post';
                    this.show_logout = false;
                } else if (to.path === '/coins') {
                    this.title = 'Get Coins';
                    this.show_logout = true;
                } else if (to.path === '/freeCoins') {
                    this.title = 'Buy Coins';
                    this.show_logout = false;
                } else if (to.path === '/setting') {
                    this.title = 'Settings';
                    this.show_logout = false;
                } else {
                    this.routerTransition = 'slide-left'
                }
                if (from.path === '/postLikesView' || from.path === '/order' || from.path === '/inviteFriend' || from.path === '/dailyLogin') {
                    this.routerTransition = 'slide-right'
                }
            }
        },
        mounted() {
            console.log('tabpage created');
            this.getLoginData();
            bus.$on('LogOut', () => {
                this.logOut()
            })
            bus.$on('turnApp', (item) => {
                this.turnApp(item)
            })
        },
        created(){
            dsbridge.call("dictionaryWithDictionary", {username:userhelper.logged_in_user.username,userid:userhelper.logged_in_user.pk});
            
            dsbridge.register('postNotification', function (res) {
                if (res === 'UIApplicationWillEnterForegroundNotification' || res === 'UIApplicationDidBecomeActiveNotification') {
                    if (this.$store.state.rewardType === 'downloadApp') {
                        if (dsbridge.call('available', this.downloadAppPackage)) {
                            this.getRewardServer(this.downloadItem)
                        } else {
                            return
                        }
                    } else if (this.$store.state.rewardType === 'rate') {
                        let date = new Date();
                        let s = date.getSeconds();
                        //@TODO ZZJ
                        if (this.$store.state.ratetime != null){
                            if (s - this.$store.state.ratetime > 7 || (s - this.$store.state.ratetime < 0 && s - this.$store.state.ratetime > -53)){
                                this.loading = 'block';
                                this.getRewardServer(this.rateItem)
                            }
                            else{
                                alert('not a success rate')
                            }
                            this.$store.commit('updateRatetime', null);
                        }
                    } else {
                        this.showRateAlertView()
                    }
                } else {
                    this.loading = 'none';
                }

            }.bind(this));
        },

        beforeDestroy(){
            console.log("tab beforeDestroy");
        }
    }
</script>

<style scoped>
    .content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .confirm_log{
        width: 65%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        background: rgba(255,255,255,1);
        text-align: center;
        border-radius: 10px;
        box-shadow: 0 0 3px #ccc;
    }

    .confirm_log>p{
        height: 25px;
        line-height: 25px;
    }

    .confirm_log>p:nth-of-type(1){
        font-size: 14px;
        margin-top: 10px;
    }

    .confirm_log>p:nth-of-type(2){
        font-size: 12px;
    }

    .confirm_log>div{
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        font-size: 14px;
    }

    .confirm_log>div p{
        width: 50%;
        height: 35px;
        line-height: 35px;
        text-align: center;
        color: cornflowerblue;
    }

    .header {
        width: 100%;
        text-align: center;
        /* color: #fff; */
        font-size: 16px;
        /* font-weight: 200; */
        display: flex;
        justify-content: space-between;
        align-items: center;
        /*background: #f25d61;*/
        height: 60px;
        line-height: 60px;
        /* background: linear-gradient(to right, #F21174, #820091); */
        /*z-index: 100;*/
        position: relative;
    }

    .userId {
        width: 140px;
        /*margin: 0 auto;*/
        font-size: 20px;
        font-weight: 200;
        position: absolute;
        left: 50%;
        margin-left: -70px;
    }

    .userImage {
        width: 44px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        border-radius: 50%;
        margin-left: 20px;
        border: 2px solid #fff;
        transform: scale(0.8);
        position: relative;
    }

    .userImage::after {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 10px solid #9013FE;
        top: 35%;
        right: -20px;
    }

    .userImage img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .free{
        position: absolute;
        width: 40px;
        height: 40px;
        line-height: 40px;
        left: 60px;
    }

    .free img{
        width: 100%;
        height: 100%;
    }

    /*.userClick{*/
        /*width: 80px;*/
        /*text-align: center;*/
        /*background: #ECF9FB;*/
        /*color: #6190DE;*/
        /*position: absolute;*/
        /*top: 75px;*/
        /*left: 10px;*/
        /*border: 1px solid #6190DE;*/
        /*z-index: 105;*/
    /*}*/

    /*.userClick>p{*/
        /*width: 0;*/
        /*height: 0;*/
        /*border-left: 6px solid transparent;*/
        /*border-right: 6px solid transparent;*/
        /*border-bottom: 6px solid #ECF9FB;*/
        /*position: absolute;*/
        /*top: -6px;*/
        /*left: 40%;*/
    /*}*/

    /*.userClick>div{*/
        /*height: 25px;*/
        /*line-height: 25px;*/
    /*}*/

    /*.userClick>div:nth-of-type(1){*/
        /*border-bottom: 1px solid #6190DE;*/
    /*}*/

    .bgImg {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        background: url(../assets/images/login_bg.png) no-repeat center;
        /*z-index: 200;*/
        overflow: hidden;
    }

    /*中间样式*/
    .container {
        width: 100%;
        flex-grow: 1;
        position: relative;
    }

    .container>div{
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        background: #F4F4F4;
    }

    /*底部导航*/
    footer {
        width: 100%;
        height: 64px;
        /* line-height: 60px; */
        display: flex;
        justify-content: space-around;
        text-align: center;
        align-items: center;
        /* position: absolute;
        bottom: 0; */
        background: #fff;
        box-shadow: 0 -2px 20px 0 rgba(0,0,0,0.32);
    }

    footer div {
        display: flex;
        flex-direction: column;
    }

    footer p {
        font-family: 'Avenir-Medium';
        width: 60px;
    }

    footer p:first-child {
        width: 30px;
        height: 30px;
        margin: 0 auto;
    }

    .my-bar-item {
        color: #686868;
    }

    .my-bar-item:first-of-type p:first-child {
        background: url(../assets/images/tab_coins_icon.png) no-repeat center;
        background-size: cover;
    }

    .my-bar-item:nth-of-type(2) p:first-child {
        background: url(../assets/images/tab_likes_icon.png) no-repeat center;
        background-size: cover;
    }

    .my-bar-item:nth-of-type(3) p:first-child {
        background: url(../assets/images/tab_home_icon.png) no-repeat center;
        background-size: cover;
    }

    .my-bar-item:nth-of-type(4) p:first-child {
        background: url(../assets/images/tab_store_icon.png) no-repeat center;
        background-size: cover;
    }

    .my-bar-item:nth-of-type(5) p:first-child {
        background: url(../assets/images/tab_settings_icon.png) no-repeat center;
        background-size: cover;
    }



    .router-link-active {
        color: #9013FE !important;
    }

    .router-link-active:first-of-type p:first-child {
        background: url(../assets/images/tab_coins_hover_icon.png) no-repeat center;
        background-size: cover;
    }

    .router-link-active:nth-of-type(2) p:first-child {
        background: url(../assets/images/tab_likes_hover_icon.png) no-repeat center;
        background-size: cover;
    }

    .router-link-active:nth-of-type(3) p:first-child {
        background: url(../assets/images/tab_home_hover_icon.png) no-repeat center;
        background-size: cover;
    }

    .router-link-active:nth-of-type(4) p:first-child {
        background: url(../assets/images/tab_store_hover_icon.png) no-repeat center;
        background-size: cover;
    }

    .router-link-active:nth-of-type(5) p:first-child {
        background: url(../assets/images/tab_settings_hover_icon.png) no-repeat center;
        background-size: cover;
    }

    .userActionBox {
        position: absolute;
        top: 100%;
        left: 12px;
        background: rgba(255,255,255,1);
        color: #4A4A4A;
        border-radius: 5px;
        transition: all 0.5s ease-in-out;
        -webkit-transition: all 0.5s ease-in-out;
        text-align: left;
        z-index: 10000;
        padding: 8px 0;
    }

    .userActionBox::after {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 12px solid rgba(255,255,255,1);
        top: -10px;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .userActionBox div {
        height: 44px;
        line-height: 44px;
        padding: 0 10px;
    }

    /*.userActionBox div:not(:last-child) {*/
        /*border-bottom: 1px solid #fff;*/
    /*}*/

    .userActionBox div img {
        width: 16px;
        height: 16px;
        margin: 14px 5px;
    }

    .userActionBox div span {
        display: inline-block;
        height: 44px;
        line-height: 44px;
        vertical-align: top;
    }

    /*路由动画*/
    .child-view {
        /*position: absolute;*/
        /*left: 0;*/
        /*top: 0;*/
        /*width: 100%;*/
        /*height: 100%;*/
        transition: transform .5s ease;
        -webkit-transition: transform .5s ease;
    }

    .slide-left-enter {
        transform: translate(100%, 0);
        -webkit-transform: translate(100%, 0);
    }

    .slide-right-leave-to{
        transform: translate(100%, 0);
        -webkit-transform: translate(100%, 0);
    }


</style>
