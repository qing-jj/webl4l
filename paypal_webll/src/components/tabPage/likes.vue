<template>
    <div class="likes">
        <!--loading-->
        <loadingComponent :style="{display: loading}"></loadingComponent>
        <!-- <div class="ads_title">
            <div class="txt_title">
                <div class="likesTxt">GET REAL & FAST</div>
                <div class="forPost">LIKES & VIEWS</div>
            </div>
        </div> -->
        <div class="sep"><i>Do not use private account for promotion</i></div>
        <div class="wrapper" ref="wrapper">

            <div class="bscroll-container">
                <!--下拉刷新信息提示-->
                <div class="top-tip">
                    <span class="refresh-hook">{{pulldownMsg}}</span>
                </div>
                <!--内容列表-->
                <div class="likesList">
                    <div v-for="item in likesList" class="listItem" @click="postLikes(item)">
                        <img v-lazy=fitImageVersion(item) :key=fitImageVersion(item)
                             alt=fitImageVersion(item)>
                        <div>
                            <div>
                                <span>{{showComputedCount(item.like_count)}}</span>
                                <img src="../../assets/images/getlikes_icon.png" alt="">
                            </div>
                            <div v-show="item.view_count">
                                <span>{{showComputedCount(item.view_count)}}</span>
                                <img src="../../assets/images/post_view_icon.png" alt="">
                            </div>
                            <div>
                                <span>{{showComputedCount(item.comment_count)}}</span>
                                <img src="../../assets/images/post_comment_icon.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import BScroll from "better-scroll"
    import IIHelper from '../../helper/IIHelper'
    import userhelper from '../../helper/userhelper'

    import loadingComponent from '../componentHelper/loadingComponent'
    // import PingLunComponent from '../componentHelper/pinglun'
    // import postDingDanList from '../componentHelper/newfenshi'
    // import cashDingDanList from '../componentHelper/cashNewFenShi'
    import GoodsOff from '../componentHelper/goodsOff'


    export default {
        name: 'zan',
        data() {
            return {
                likesList: [],
                pulldownMsg: 'pull down refresh',
                // pullupMsg: 'to load more',
                alertHook: 'none',
                // loadBottom: 'none',
                getList: [],
                cashList: [],
                // lf: '100%',
                // tp: '30%',
                // showPost: false,
                // postImg: '',
                like_count: '',
                video_count: 0,
                comment_count: '',
                selectedItem: '',
                loading: 'none',
                // likes_flag: true,
                // views_flag: false,
                // comments_flag: false,
                alldata: '',   //userinfo所有数据
                goods: 'likes',
                view_show: 'none',  //是否显示get views tab项
                more_available: '',     //是否可以加载更多
                user_id: '',
                max_id: '',
                // aixin: [0, 1, 2, 3, 4, 5, 6],
                startdelete: false,
                deletedlist:[],
                uniqcomments:null,
                checkedCommentsPk:[],
                ongoingtask:0,
            }
        },
        // props: ['coins'],
        components: {
            loadingComponent,
            // postDingDanList,
            // PingLunComponent,
            // cashDingDanList,
            GoodsOff
        },
        methods: {
            // stopdelete(){
            //     this.startdelete = false;
            //     clearInterval(this.ongoingtask);
            // },
            // checkThenRemoveComments(){
            //     if (!this.startdelete){
            //         return;
            //     }
            //     var newcomments = [];
            //     let that = this;
            //     IIHelper.getMediaComments(this.selectedItem,50,this.checkedCommentsPk,newcomments,null,function (res, err) {
            //         if (err){
            //             alert(err.errorMessage)
            //         }
            //         else{
            //             // alert("reach end "+that.checkedCommentsPk.length)
            //             for (var c of newcomments){
            //                 if (!that.checkedCommentsPk.includes(c.pk.toString())) {
            //                     if (that.uniqcomments.has(c.text)){
            //                         IIHelper.deleteMediaComment(that.selectedItem,c);
            //                     }
            //                     else{
            //                         that.uniqcomments.add(c.text);
            //                     }
            //                 }

            //                 that.checkedCommentsPk.push(c.pk.toString());
            //             }

            //         }
            //     })
            // },
            // deleteDupComment(){
            //     if (this.startdelete){return;}

            //     this.startdelete = true;
            //     this.checkThenRemoveComments();
            //     let that = this;
            //     this.ongoingtask = setInterval(function () {
            //         that.checkThenRemoveComments();
            //     },30000)
            // },
            postLikes(item) {
                this.$router.push({
                    name:'postLikesView',
                    params: {
                        item: item
                    }
                })
            },
            getMore() {   //上拉获取的更多数据
                if (this.more_available) {
                    return new Promise(resolve => {
                        let moreArg = {
                            userId: this.user_id,
                            max_id: this.max_id
                        };
                        IIHelper.selfIIpostMore(moreArg, function (res, error) {
                            if (error) {
                                alert(error.errorMessage);
                            } else {
                                console.log(res);
                                resolve(res);
                            }
                        })
                    })
                } else {
                    alert('no more post');
                }
            },
            refreshData() {    //下拉刷新的数据
                return new Promise(resolve => {
                    this.loading = 'block';
                    IIHelper.selfIIpost(this.user_id, function (res, error) {
                        if (error) {
                            alert(error.errorMessage);
                            this.$router.push("/login")
                        } else {
                            // console.log(11);
                            resolve(res)
                        }
                    }.bind(this));
                });
            },
            onPullingDown() {   //刷新数据
                this.loading = 'block';
                this.refreshData().then(res => {
                    this.loading = 'none';
                    this.likesList = res.data.items;
                    console.log(this.likesList[0]);
                    // IIHelper.getTieZiData("https://www.instagram.com/p/BsXQQltnrQb/?__a=1");


                    if (this.likesList.length === 0) {
                        alert("No post");
                        return;
                    }
                    this.more_available = res.data.more_available;
                    this.max_id = res.data.next_max_id;
                    // this.$store.commit('changePostList', res.data.items)
                })
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
            },
            fitImageVersion() {
                return function (item) {
                    return IIHelper.getPostThumbUrl(item);
                }
            },
            // refreshCoins() {
            //     return this.coins = this.$store.state.coins;
            // },
        },
        mounted() {
            let likeGoods;
            let that = this;
            that.loading = 'block';
            if(that.$store.state.config) {
                likeGoods = that.$store.state.config.getLikeGoods;
                // that.exchangeData(likeGoods);
                that.user_id = userhelper.logged_in_user.pk;
                that.onPullingDown();
            } else {
                console.log("no data");
                userhelper.directlogin((res, error) => {
                    // that.loading = 'none';
                    console.log('hide loading');
                    if (error) {
                        console.log('return to login');
                        that.$router.push('/login');
                    } else {
                        console.log(userhelper.userconfig);
                        that.$store.commit('getConfig',userhelper.userconfig);
                        likeGoods = that.$store.state.config.getLikeGoods;
                        // that.exchangeData(likeGoods);
                        that.user_id = userhelper.logged_in_user.pk;
                        that.onPullingDown();
                    }
                });
            }
        },
        created() {
            console.log('likepage created');
            this.uniqcomments = new Set();
            this.$nextTick(() => {
                this.scroll = new BScroll(this.$refs.wrapper, {
                    probeType: 1,
                    click: true
                });
                // 滑动中事件
                this.scroll.on('scroll', (pos) => {
                    if (pos.y > 30) {
                        this.pulldownMsg = 'release to refresh'
                    }
                });
                //滑动结束松开事件
                this.scroll.on('touchEnd', (pos) => {  //上拉刷新
                    if (pos.y > 40) {
                        this.loading = 'block';
                        this.refreshData().then((res) => {
                            console.log(res);
                            //刷新数据
                            setTimeout(function () {
                                this.likesList = res.data.items;
                                console.log(this.likesList);
                                this.loading = 'none';
                                this.more_available = res.data.more_available;
                                //恢复刷新提示文本值
                                this.pulldownMsg = 'pull down refresh';
                                //刷新列表后，重新计算滚动区域高度
                                this.scroll.refresh();
                            }.bind(this), 500)
                        })
                    }
                    else if (pos.y < (this.scroll.maxScrollY - 40)) {   //下拉加载
                        this.loading = 'block';
                        if (this.more_available) {
                            this.getMore().then((res) => {
                                setTimeout(function () {
                                    this.loading = 'none';
                                    let arr = this.likesList;
                                    for (let i = 0; i < res.data.items.length; i++) {
                                        arr.push(res.data.items[i]);
                                    }
                                    this.likesList = arr;
                                    this.more_available = res.data.more_available;
                                    this.scroll.refresh();
                                }.bind(this), 500)
                            })
                        } else {
                            setTimeout(function () {
                                this.loading = 'none';
                                alert('no more post');
                                this.scroll.refresh();
                            }.bind(this), 1500)
                        }

                    }
                })
            });
            // let shipei = userhelper.choosePhoneModel();
            // if (shipei.quanping) {
            //     this.xiaodi = shipei.phoneX;
            //     if (shipei.phoneX) {
            //         this.topHigh = '40px'
            //         this.shipeiBottom = '34px'
            //     } else {
            //         this.topHigh = '20px'
            //         this.shipeiBottom = '0'
            //     }
            // } else {
            //     this.topHigh = 0;
            //     this.xiaodi = false;
            //     this.shipeiBottom = 0;
            // }

        }

    }
</script>

<style scoped>
    @import "../../../static/css/iconfont.css";

    .likes .star {
        color: #EFCC56;
        position: absolute;
    }

    .likes > .star:nth-of-type(1) {
        top: 60px;
        left: 40px;
        transform: rotate(20deg);
        -webkit-transform: rotate(20deg);
    }

    .likes > .star:nth-of-type(2) {
        top: 35px;
        left: 50px;
        font-size: 20px;
        transform: rotate(10deg);
        -webkit-transform: rotate(10deg);
    }

    .likes > .star:nth-of-type(3) {
        top: 5px;
        left: 30px;
        font-size: 20px;
        transform: rotate(-20deg);
        -webkit-transform: rotate(-20deg);
    }

    .likes > .star:nth-of-type(4) {
        top: 40px;
        right: 40px;
        transform: rotate(10deg);
        -webkit-transform: rotate(10deg);
    }

    .likes > .star:nth-of-type(5) {
        top: 30px;
        right: 25px;
        font-size: 16px;
        transform: rotate(25deg);
        -webkit-transform: rotate(25deg);
    }

    .likes > .star:nth-of-type(6) {
        top: 10px;
        right: 40px;
        font-size: 20px;
        transform: rotate(-20deg);
        -webkit-transform: rotate(-20deg);
    }

    .likes > .star:nth-of-type(7) {
        top: 0px;
        right: 15px;
        font-size: 22px;
        transform: rotate(20deg);
        -webkit-transform: rotate(20deg);
    }

    .likes {
        width: 100%;
        height: 100%;
        padding-top: 0.1px;
        overflow: hidden;
        position: relative;
        /* background: #fff; */
    }

    /* .post_top {
        width: 100%;
        height: 60px;
        line-height: 60px;
        background: linear-gradient(to right, #F21174, #820091);
        background: #F4F4F4;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
    } */

    /* .back_post {
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
        color: #fff;
        font-weight: bold;
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
        -webkit-transform: translate(-50%, 0);
    } */

    /* .ads_title {
        background: linear-gradient(to right, #F21174, #820091);
        width: 100%;
        height: 80px;
        position: relative;
    }

    .txt_title {
        width: 210px;
        height: 60px;
        margin: 0 auto;
        border: 1px solid #FB8CD3;
        position: absolute;
        top: 5px;
        left: 50%;
        transform: translate(-50%);
        -webkit-transform: translate(-50%);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .likesTxt {
        width: 100%;
        font-size: 18px;
        color: #fff;
        text-align: center;
        font-weight: bold;

    } */

    /* .forPost {
        width: 100%;
        font-size: 18px;
        color: #EFCC56;
        text-align: center;
        font-weight: bold;

    } */

    /* .userCoins {
        width: 85px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        background-color: #fff;
        display: flex;
        justify-content: center;
        color: #fff;
        margin-right: 10px;
    }

    .userCoins > span:first-child {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        vertical-align: middle;
        background: url(../../assets/images/top_coins_icon.png) no-repeat center;
        margin-top: 5px;
        margin-left: 5px;
    }

    .userCoins span:nth-of-type(2) {
        font-size: 16px;
        font-weight: bold;
        margin-left: 5px;
    } */


    .sep {
        width: 100%;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #666;
        font-size: 12px;
        /* background: #fff; */
    }

    .wrapper {
        width: 100%;
        position: relative;
        height: 96%;
        overflow: auto;
    }

    /* 下拉、上拉提示信息 */
    .top-tip {
        position: absolute;
        top: -40px;
        left: 0;
        /*z-index: 1;*/
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #555;
    }

    .likesList {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin: 10px auto;
        overflow: auto;
    }

    .listItem {
        width: 31%;
        height: 109px;
        margin-bottom: 6.5px;
        margin-left: 6px;
        background: #ccc;
        text-align: center;
        position: relative;
    }

    .listItem > img[lazy=loading] {
        width: 50px;
        height: 50px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .listItem > img[lazy=loaded], .listItem > img[lazy=error] {
        width: 100%;
        height: 100%;
    }

    .listItem > div {
        width: 100%;
        height: 20px;
        line-height: 20px;
        color: #fff;
        font-size: 8px;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        justify-content: space-around;
    }

    .listItem div span {
        vertical-align: top;
        /*margin-right: 5px;*/
        font-size: 10px;
    }

    .listItem div img {
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-top: 3px;
    }

    .postLikes {
        width: 100%;
        position: fixed;
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

    /* .coinsPay, .cashPay {
        position: relative;
        padding: 13px;
    } */


</style>
