<template>
    <div class="followers">
        <!--loading-->
        <loadingComponent :style="{display: loading}">

        </loadingComponent>
        <!--<header class="header">-->

        <!--<div class="userImage"><img v-bind:src=userImg alt=""></div>-->
        <!--<div class="userId">Get Followers</div>-->
        <!--<div class="userCoins">-->
        <!--<span></span>-->
        <!--<span>{{refreshCoins}}</span>-->
        <!--<router-link to="/store">-->
        <!--<span class="toStore"></span>-->
        <!--</router-link>-->

        <!--</div>-->
        <!--</header>-->
        <div class="followersUser">
            <div class="followersUser_title">
                <p>GET REAL & ROYAL</p>
                <p>FOLLOWERS</p>
            </div>
            <ul>
                <li>
                    <span>{{showComputedCount(photos)}}</span>
                    <p>Photos</p>
                </li>
                <li>
                    <span>{{showComputedCount(followers)}}</span>
                    <p>Followers</p>
                </li>
                <li>
                    <span>{{showComputedCount(followings)}}</span>
                    <p>Following</p>
                </li>
            </ul>
            <span v-for="x in aixin" class="iconfont icon-aixin leftStar"></span>
        </div>
        <div class="fendingdanlist">
            <div class="coinsPay">
                <!-- <cashList :cashfensList='cashFenList' :userinfo="currentuser" ref="cashFollow"/> -->
                <GoodsOff :typeStyle="paypalStyle" v-for="(value, index) in cashFenList" :key="value.id" :userinfo="currentuser" :itemList = "value" :itemIndex = "index" @payForGoods = "payFollower" />
            </div>
            <div class="sepLine" v-show="iap_flag"></div>
            <div class="cashPay">
                <!-- <dingDanList :fensList='fensList' @addFollower="payFollower"/> -->
                <GoodsOff :typeStyle="followersStyle" v-for="(value, index) in fensList" :key="value.id" :itemList = "value" :itemIndex = "index" @payForGoods = "payFollower" />
            </div>
        </div>
    </div>
</template>

<script>
    import IIHelper from '../../helper/IIHelper'
    import userhelper from '../../helper/userhelper'
    import paypalHelper from '../../helper/paypalHelper'

    import loadingComponent from '../componentHelper/loadingComponent'
    // import dingDanList from '../componentHelper/newfenshi'
    import cashList from '../componentHelper/cashNewFenShi'
    import GoodsOff from '../componentHelper/goodsOff'
    export default {
        name: 'fen',
        data() {
            return {
                userImg: require('../../assets/images/top_user_icon.png'),
                fensList: [20, 120, 300, 50, 120, 300],
                cashFenList: [],
                aixin: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                followers: '',
                photos: '',
                followings: '',
                loading: 'none',
                flags: false,
                pay_flag: false,
                currentuser: '',
                iap_flag: false,
                followersStyle: {
                    color: '#FF475E',
                    icon: require('../../assets/images/getfollowers_icon.png')
                },
                paypalStyle: {
                    color: '#0C5EA6',
                    icon: require('../../assets/images/getlikes_icon.png')
                }
            }
        },
        components: {
            loadingComponent,
            // dingDanList,
            cashList,
            GoodsOff
        },
        methods: {
            payFollower(item) {   //购买 Follower
                console.log(this.$store.state.coins);
                if (this.$store.state.coins < item.price) {
                    alert('Not Enought Coins');
                    return;
                }
                this.loading = 'block';
                let payload = {
                    user: this.currentuser,
                    goods: item
                };
                userhelper.tijiaofendingdan(payload, function (res, error) {
                    if (error) {
                        alert(error.errorMessage);
                        this.loading = 'none';
                    } else {
                        this.loading = 'none';
                        // this.$emit('refreshCoins', res.data.coinsInAccount);
                        // userhelper.currentcoins = res.data.coinsInAccount;
                        this.$store.commit('updateCoins', res.data.coinsInAccount);
                        alert('Your followers is coming soon!');

                    }
                }.bind(this));
                // let that = this;
                // dsbridge.call('getFollowers', JSON.stringify(item), function (res) {
                //     alert(JSON.parse(res).status.statusMsg);
                //
                // });
            },
            getUserInfo() {
                // if (loading_flag) {
                //     this.loading = 'block';
                // }
                let userId = userhelper.logged_in_user.pk;
                console.log(userId);
                IIHelper.selfIIinfo(userId, function (res, error) {
                    if (error) {
                        this.loading = 'none';
                        alert(error.errorMessage);
                    } else {
                        this.loading = 'none';
                        console.log(res.data);
                        this.currentuser = res.data.user;
                        this.followers = res.data.user.follower_count;
                        this.followings = res.data.user.following_count;
                        this.photos = res.data.user.media_count;
                        if (this.iap_flag) {
                            this.eachFollowerPaypalButton(this.cashFenList, res.data.user);
                        }
                    }
                }.bind(this));
            },
            exchangeFollowData(goods) {
                let coinsLikeGoods = [];
                let cashLikeGoods = [];
                goods.forEach(function (item) {
                    if (item.paymentType === 0) {
                        coinsLikeGoods.push(item)
                    } else {
                        cashLikeGoods.push(item)
                    }
                });
                console.log(coinsLikeGoods,cashLikeGoods);
                this.fensList = coinsLikeGoods;
                this.cashFenList = cashLikeGoods;
                if (this.cashFenList.length > 0) {
                    this.iap_flag = true;
                    console.log(333)
                }
            },
            eachFollowerPaypalButton(goodsList,item) {
                document.querySelectorAll('.paypal-button').forEach(function (selector, index) {
                    selector.innerHTML = '';
                    
                    let followPayload = {
                        user: item,
                        goods: goodsList[index],
                    };
                    let data = userhelper.fenPayloadTreasfer(followPayload).data;
                    paypalHelper.paypalBtn(selector, data)
                }.bind(this));
            },
        },
        computed: {
            showComputedCount() {
                return function (num) {
                    // let num = 10563000;
                    let result = null;
                    if (num >= 0 && num < 1000) {
                        result = num;
                        return result
                    } else if (num >= 1000 && num < 100000) {
                        result = (num / 1000).toFixed(2) + 'k';
                        return result
                    } else if (num >= 100000 && num < 1000000) {
                        result = (num / 1000).toFixed(1) + 'k';
                        return result
                    } else {
                        result = (num / 1000000).toFixed(1) + 'm';
                        return result
                    }
                }
            }
        },
        created() {
            console.log('followpage created');
            this.userImg = userhelper.logged_in_user.profile_pic_url;
        },
        activated(){
            console.log(111)
            // this.getUserInfo(false);
            let followGoods;
            let that = this;
            if (that.$store.state.config) {
                followGoods = this.$store.state.config.getFollowGoods;
                that.exchangeFollowData(followGoods);
                this.getUserInfo()
            } else {
                userhelper.directlogin((res, error) => {
                    // that.loading = 'none';
                    console.log('hide loading');
                    if (error) {
                        console.log('return to login');
                        that.$router.push('/login');
                    } else {
                        console.log(userhelper.userconfig);
                        that.$store.commit('getConfig',userhelper.userconfig);
                        followGoods = this.$store.state.config.getFollowGoods;
                        that.exchangeFollowData(followGoods);
                    }
                    this.getUserInfo()
                });
            }
        },
        mounted() {
            console.log(222)
            
        }
    }
</script>

<style scoped>
    @import "../../../static/css/iconfont.css";

    .followersUser {
        width: 100%;
        height: 160px;
        position: absolute;
        /* background: linear-gradient(to right, #F21174, #820091); */
    }

    .followersUser_title {
        width: 210px;
        font-size: 18px;
        text-align: center;
        color: #666;
        font-weight: bold;
        margin: 5px auto 0 auto;
        padding: 5px 0;
        /* border: 1px solid #FB8CD3; */
        border: 1px solid #EFCC56;
    }

    .followersUser_title > p:last-child {
        color: #EFCC56;
    }

    .followersUser ul {
        width: 80%;
        height: 60px;
        display: flex;
        justify-content: space-around;
        text-align: center;
        align-items: center;
        color: #666;
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translate(-50%);
        -webkit-transform: translate(-50%);
    }

    .followersUser li {
        width: 80px;
        display: flex;
        flex-direction: column;
        height: 100%;
        text-align: center;
    }

    .followersUser img {
        width: 40px;
        height: 40px;
        margin: 0 auto;
    }

    .followersUser li p {
        font-size: 12px;
        /* color: #FB8CD3; */
        color: #9B9B9B;
    }

    .followersUser li span {
        color: #9013FE;
    }

    .followersUser span {
        font-size: 20px;
    }

    /*star status*/
    .followersUser > span {
        color: #EFCC56;
        position: absolute;
    }

    .followersUser > span:nth-of-type(1) {
        bottom: 10px;
        left: 50px;
        font-size: 12px;
        transform: rotate(-10deg);
        -webkit-transform: rotate(-10deg);
    }

    .followersUser > span:nth-of-type(2) {
        bottom: 20px;
        left: 35px;
        font-size: 14px;
        transform: rotate(-15deg);
        -webkit-transform: rotate(-15deg);
    }

    .followersUser > span:nth-of-type(3) {
        bottom: 35px;
        left: 20px;
        font-size: 18px;
        transform: rotate(-10deg);
        -webkit-transform: rotate(-10deg);
    }

    .followersUser > span:nth-of-type(4) {
        bottom: 35px;
        left: 45px;
        font-size: 14px;
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
    }

    .followersUser > span:nth-of-type(5) {
        bottom: 50px;
        left: 30px;
        font-size: 22px;
        transform: rotate(-5deg);
        -webkit-transform: rotate(-5deg);
    }

    .followersUser > span:nth-of-type(6) {
        bottom: 70px;
        left: 20px;
        font-size: 34px;
        transform: rotate(-15deg);
        -webkit-transform: rotate(-15deg);
    }

    .followersUser > span:nth-of-type(7) {
        bottom: 100px;
        left: 45px;
        font-size: 30px;
        transform: rotate(20deg);
        -webkit-transform: rotate(20deg);
    }

    .followersUser > span:nth-of-type(8) {
        bottom: 130px;
        left: 15px;
        font-size: 32px;
        transform: rotate(-10deg);
        -webkit-transform: rotate(-10deg);
    }

    .followersUser > span:nth-of-type(9) {
        bottom: 10px;
        right: 30px;
        font-size: 12px;
        transform: rotate(10deg);
        -webkit-transform: rotate(10deg);
    }

    .followersUser > span:nth-of-type(10) {
        bottom: 23px;
        right: 25px;
        font-size: 12px;
        transform: rotate(15deg);
        -webkit-transform: rotate(15deg);
    }

    .followersUser > span:nth-of-type(11) {
        bottom: 30px;
        right: 38px;
        font-size: 12px;
        transform: rotate(5deg);
        -webkit-transform: rotate(5deg);
    }

    .followersUser > span:nth-of-type(12) {
        bottom: 40px;
        right: 20px;
        font-size: 16px;
        transform: rotate(5deg);
        -webkit-transform: rotate(5deg);
    }

    .followersUser > span:nth-of-type(13) {
        bottom: 50px;
        right: 35px;
        font-size: 16px;
        transform: rotate(10deg);
        -webkit-transform: rotate(10deg);
    }

    .followersUser > span:nth-of-type(14) {
        bottom: 60px;
        right: 20px;
        font-size: 20px;
        transform: rotate(25deg);
        -webkit-transform: rotate(25deg);
    }

    .followersUser > span:nth-of-type(15) {
        bottom: 80px;
        right: 38px;
        font-size: 20px;
        transform: rotate(-10deg);
        -webkit-transform: rotate(-10deg);
    }

    .followersUser > span:nth-of-type(16) {
        bottom: 100px;
        right: 20px;
        font-size: 20px;
        transform: rotate(10deg);
        -webkit-transform: rotate(10deg);
    }

    .fendingdanlist {
        width: 100%;
        position: absolute;
        top: 160px;
        bottom: 0;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }

    .fendingdanlist .sepLine {
        width: 100%;
        height: 10px;
        background: #ccc;
    }

    .coinsPay, .cashPay {
        padding: 0 13px;
    }


</style>
