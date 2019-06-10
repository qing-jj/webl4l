<template>
    <div class="postLikes" :style="{paddingTop: topHigh,paddingBottom:shipeiBottom}" ref="postTiezi">
        <div class="post_top">
            <div class="back_post" @click="leave"><span></span></div>
            <!--<div class="post_title"  v-on:click="deleteDupComment">Boost Post</div>-->
            <div class="post_title">Boost Post</div>
            <div class="userCoins">
                <img src='../../assets/images/coins.png' alt="">
                <span>{{refreshCoins}}</span>
                    <!--<router-link to="/store">-->
                        <!--<span class="toStore"></span>-->
                    <!--</router-link>-->
            </div>
        </div>
        <div class="postPic" :style="{height: tp}">
            <div class="boostImg">
                <div>
                    <img v-lazy=postImg :key=postImg alt=postImg>
                    <div class="likesCount">
                        <div>
                            <span>{{showComputedCount(like_count)}}</span>
                            <img src="../../assets/images/getlikes_icon.png" alt="">
                        </div>
                        <div v-show="video_count">
                            <span>{{showComputedCount(video_count)}}</span>
                            <img src="../../assets/images/post_view_icon.png" alt="">
                        </div>
                        <div>
                            <span>{{showComputedCount(comment_count)}}</span>
                            <img src="../../assets/images/post_comment_icon.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="listPic">
            <!-- <div v-if="startdelete">
                <div class="sep"><i>Deleting duplicate comments</i></div>
                <div @click="stopdelete" class="stopdelete">stop</div>

            </div> -->
            <div class="likeTab">
                <span :class="{active: likes_flag}" @click="likeData">Get Likes</span>
                <span :class="{active: views_flag}" :style="{display:view_show}" @click="viewData">Get Views</span>
                    <!--<span :class="{active: comments_flag}" @click="commentData">Get Comments</span>-->
            </div>
            <div class="postdindanList">
                <div v-show="likes_flag || views_flag">
                    <div class="coinsPay">
                            <!-- <cashDingDanList :cashfensList="cashList" ref="cashChild"/> -->
                        <GoodsOff :typeStyle="paypalStyle" v-for="(value, index) in cashList" :key="value.goodsId" :postItem="''" :itemList = "value" :itemIndex = "index" @payForGoods = "getLikes" />
                    </div>
                    <div class="sepLine" v-show="iapGoods_flag"></div>
                    <div class="cashPay">
                        <!-- <postDingDanList :fensList="getList" @addLikes="getLikes"/> -->
                        <GoodsOff :typeStyle="likeStyle" v-for="(value, index) in getList" :key="value.goodsId" :postItem="selectedItem" :itemList = "value" :itemIndex = "index" @payForGoods = "getLikes" />
                    </div>
                </div>
                    <!-- <PingLunComponent v-show="comments_flag" :commentGoods="selectedItem" @coinsAddComments="getPinLun" /> -->
            </div>
        </div>

        <loadingComponent :style="{display: loading}"></loadingComponent>
    </div>
</template>
<script>
import IIHelper from '../../helper/IIHelper'
import userhelper from '../../helper/userhelper'
import paypalHelper from '../../helper/paypalHelper'
import loadingComponent from '../componentHelper/loadingComponent'
import GoodsOff from '../componentHelper/goodsOff'
export default {
	name: "postLikesView",
	data() {
		return {
            loading: 'none',
            tp: '30%',
            postImg: '',
            view_show: 'none',
            selectedItem: '',
            cashList: '',
            getList: '',
            likes_flag: false,
            views_flag: false,
            like_count: '',
            video_count: 0,
            comment_count: '',
            iapGoods_flag: '',
            likeStyle: {
                color: '#9013FE',
                icon: require('../../assets/images/getlikes_icon.png')
            },
            paypalStyle: {
                color: '#0C5EA6',
                icon: require('../../assets/images/getlikes_icon.png')
            }
        };
    },
    components: {
        GoodsOff, loadingComponent
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
        },
        fitImageVersion() {
            return function (item) {
                return IIHelper.getPostThumbUrl(item);
            }
        },
        refreshCoins() {
            return this.coins = this.$store.state.coins;
        },
    },
    methods: {
        initItemData() {
            if(!this.$route.params.item) {
                this.$router.push('/likes');
                return
            }
            let item = this.$route.params.item;
            this.selectedItem = item;
            this.postImg = this.fitImageVersion(item);
            this.like_count = item.like_count;
            this.video_count = item.view_count;
            if (item.video_versions) {
                this.view_show = 'block';
            } else {
                this.view_show = 'none';
            }
            this.comment_count = item.comment_count;
            this.likeData();
        },
        leave() {
            // this.lf = '100%';
            // this.showPost = false
            this.likeData();
            this.likes_flag = false;
            this.views_flag = false;
            this.$router.push('/likes')
        },
        eachPaypalButton(goodsList,item) {
            console.log(goodsList)
            console.log(document.querySelectorAll('.paypal-button'))
            document.querySelectorAll('.paypal-button').forEach(function (selector, index) {
                selector.innerHTML = '';
                let data;

                if (goodsList[index].goodsType === 2 || goodsList[index].goodsType === 5) {
                    let likePayload = {
                        post: item,
                        goods: goodsList[index],
                    };
                    data = userhelper.zanPayloadTransfer(likePayload).data;
                } else {
                    let followPayload = {
                        user: this.currenUser,
                        goods: goodsList[index],
                    };
                    data = userhelper.fenPayloadTreasfer(followPayload).data;
                }
                paypalHelper.paypalBtn(selector, data)
            }.bind(this));
        },
        likeData() {   //切换get likes 数据
            if(this.likes_flag) return;
            this.tp = '30%';
            this.likes_flag = true;
            this.views_flag = false;
            // this.comments_flag = false;
            this.goods = 'likes';
            let likeGoods = this.$store.state.config.getLikeGoods;
            this.exchangeData(likeGoods);
            setTimeout(() => {
                if (this.iapGoods_flag) {
                    this.eachPaypalButton(this.cashList,this.selectedItem)
                }
            }, 100)
        },
        viewData() {   //切换get views 数据
            if(this.views_flag) return;
            this.tp = '30%';
            this.likes_flag = false;
            this.views_flag = true;
            // this.comments_flag = false;
            this.goods = 'views';
            let viewGoods = this.$store.state.config.getLoopsGoods;
            this.exchangeData(viewGoods);
            setTimeout(() => {
                if (this.iapGoods_flag) {
                    this.eachPaypalButton(this.cashList,this.selectedItem)
                }
            }, 100)
        },
        // commentData() {   //切换get comments 数据
        //     if(this.comments_flag) return;
        //     this.tp = 0;
        //     this.likes_flag = false;
        //     this.views_flag = false;
        //     this.comments_flag = true;
        //     this.goods = 'comments';
        // },
        exchangeData(goods) {
            let coinsLikeGoods = [];
            let cashLikeGoods = [];
            goods.forEach(function (item) {
                if (item.paymentType === 0) {
                    coinsLikeGoods.push(item)
                } else {
                    cashLikeGoods.push(item)
                }
            });
            this.getList = coinsLikeGoods;
            this.cashList = cashLikeGoods;
            if (this.cashList.length > 0) {
                this.iapGoods_flag = true;
            }
        },
        getLikes(item) {   //购买goods
            console.log(item);
            if (this.$store.state.coins < item.price) {
                alert('Not Enought Coins');
                return;
            }
            this.loading = 'block';
                // let that = this;
            let payload = {
                post: this.selectedItem,
                goods: item
            };
            userhelper.tijiaozandingdan(payload, function (res, error) {
                if (error) {
                    alert(error.errorMessage);
                    this.loading = 'none'
                } else {
                    this.loading = 'none';
                    alert(res.status.statusMsg);
                    this.$store.commit('updateCoins', res.data.coinsInAccount);
                }
            }.bind(this));
        },
        getPinLun(bodyData) {
            this.loading = 'block';
            console.log(bodyData.goods.goodsAmount);
            let commentData = {
                post: this.selectedItem,
                goods: bodyData.goods,
                commentArray: bodyData.commentArray
            };

            userhelper.tijiaopinglundingdan(commentData, function (res, error) {
                this.loading = 'none';
                if (error) {
                    alert(error.errorMessage);
                } else {
                    alert(res.status.statusMsg);
                    this.$store.commit('updateCoins', res.data.coinsInAccount);
                    window.localStorage.setItem("commentList", bodyData.commentArray);
                }
            }.bind(this))
        },
    },
    activated() {
        this.initItemData()
    },
    mounted() {
        this.initItemData()
    },
    created() {
        let shipei = userhelper.choosePhoneModel();
        if (shipei.quanping) {
            if (shipei.phoneX) {
                this.topHigh = '40px'
                this.shipeiBottom = '34px'
            } else {
                this.topHigh = '20px'
                this.shipeiBottom = '0'
            }
        } else {
            this.topHigh = 0;
            this.shipeiBottom = 0;
        }
    }
};
</script>
<style scoped>

    .postLikes {
        width: 100%;
        position: fixed !important;
        top: 0;
        bottom: 0;
        -webkit-transition: all 0.2s linear;
        transition: all 0.2s linear;
        background: #F4F4F4;
        z-index: 300;
        overflow: auto;
        display: flex;
        flex-direction: column;
    }

    .postLikes::-webkit-scrollbar {
        width: 0;
        height: 0;
    }

    .post_top {
        width: 100%;
        /*height: 60px;*/
        line-height: 60px;
        /* background: linear-gradient(to right, #F21174, #820091); */
        background: #F4F4F4;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }

    .back_post {
        margin-left: 20px;
    }

    .back_post span {
        display: inline-block;
        width: 10px;
        height: 10px;
        border: 2px solid;
        border-color: #000 #000 transparent transparent;
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
    }

    .post_title {
        height: 60px;
        line-height: 60px;
        font-size: 20px;
        text-align: center;
        /* color: #fff; */
        /* font-weight: bold; */
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
        -webkit-transform: translate(-50%, 0);
    }

    .userCoins {
        width: 85px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        background-color: #fff;
        display: flex;
        justify-content: center;
        /* color: #fff; */
        margin-right: 10px;
    }

    .userCoins img {
        width: 20px;
        height: 20px;
        margin-top: 5px;
        margin-left: 5px;
    }

    .userCoins span {
        font-size: 16px;
        margin-left: 5px;
    }

    .postPic {
        width: 100%;
        /*height: 30%;*/
        padding-top: 0.1px;
        padding-bottom: 0.1px;
        transition: all 0.3s linear;
    }

    .postPic img {
        width: 100%;
        height: 100%;
    }

    .postPic > div:nth-child(1) {
        width: 100%;
        height: 100%;
        /* background: linear-gradient(to right, #F21174, #820091); */
        background: #F4F4F4;
        padding-top: 0.1px;
        padding-bottom: 0.1px;
    }

    .postPic > div:nth-child(1) > div {
        width: 175px;
        height: 175px;
        margin: auto;
        position: relative;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, .5);
        border: 5px solid #fff;
    }

    .likesCount {
        width: 100%;
        height: 30px;
        line-height: 30px;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        bottom: 0;
        text-align: center;
        color: #fff;
        font-size: 16px;
        display: flex;
        justify-content: space-around;
    }

    .likesCount span {
        vertical-align: top;
        font-size: 14px;
    }

    .likesCount img {
        width: 20px;
        height: 20px;
        margin-top: 5px;
    }

    .listPic {
        width: 100%;
        flex-grow: 1;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .stopdelete {
        width: 60px;
        height: 24px;
        line-height: 24px;
        color: #ffffff;
        font-size: 14px;
        text-align: center;
        margin: 0 auto;
        background: linear-gradient(to right, #F21174, #E23D84);
        border-radius: 3px;
    }

    .stopdelete:active {
        box-shadow: 0 0 3px #000000;
    }

    .likeTab {
        height: 44px;
        line-height: 6px;
        border-top: 1px solid #ccc;
        display: flex;
        justify-content: space-around;
        font-size: 16px;
        color: #333;
        /* background: #fff; */
    }

    .likeTab span {
        display: inline-block;
        width: 100%;
        height: 44px;
        line-height: 44px;
        text-align: center;
        /*margin-top: 20px;*/
        background: linear-gradient(to right, #F21174, #E23D84);
        /*border-bottom: 2px solid #f25d61;*/
        box-sizing: border-box;
        color: #fff;
    }

    .active {
        color: #000 !important;
        background: #F4F4F4 !important;
    }

    .postdindanList {
        width: 100%;
        position: absolute;
        bottom: 0;
        top: 44px;
        /*flex-grow: 1;*/
        /* background: #fff; */
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }

    .postdindanList .sepLine {
        width: 100%;
        height: 10px;
        background: #ccc;
    }

    .coinsPay, .cashPay {
        position: relative;
        padding: 0 13px;
    }
</style>