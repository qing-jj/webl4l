<template>
    <div class="changedPage">
        <div class="pageHeader" :style="{paddingTop: topHigh, height: hg}">
            <span @click="leave"></span><span>Order Status</span>
        </div>
        <div class="pageContent" :style="{top: contentTop, bottom: contentBottom}">
            <div class="orderItem" v-for="(item,index) in orderStatus">
                <div class="itemInfo">
                    <img :src=item.thumbnailUrl alt="">
                    <div>
                        <p><img :src=imgKindArr[index] alt=""><span>{{item.state}}</span></p>
                        <p>{{item.createTime}}</p>
                    </div>
                </div>
                <div class="countBar">
                    <div>{{item.finishedCount}}/{{item.totalCount}}</div>
                    <div><p :style="{width: item.per}"></p></div>
                </div>
            </div>
        </div>
        <img src="../assets/images/loading_icon.gif" v-show="showLoading" alt="">
    </div>
</template>

<script>
    import userhelper from '../helper/userhelper'

    export default {
        data() {
            return {
                url: '',
                topHigh: '',
                hg: '',
                contentTop: '',
                contentBottom: '',
                orderStatus: '',
                showLoading: true,
                imgKindArr: []
            }
        },
        methods: {
            leave() {
                this.$router.go(-1)
            },
            orderStatusServer () {
                userhelper.orderStatus(function (res, err) {
                    this.showLoading = false;
                    if (err) {
                        alert(err.errorMessage);
                        this.$router.go(-1)
                    } else {
                        let orderStatusData = res.data.orderStatus;
                        this.imgKindArr = [];
                        orderStatusData.forEach(item => {
                            let finishedCount = item.finishedCount;
                            let totalCount = item.totalCount;
                            let per = finishedCount/totalCount >= 1?'100%':finishedCount/totalCount*100 + '%';
                            item.per = per;
                            let orderKind = item.orderKind;
                            if (orderKind === 'like') {
                                this.imgKindArr.push(require('../assets/images/getlikes_icon.png'))
                            } else if (orderKind === 'view') {
                                this.imgKindArr.push(require('../assets/images/post_view_icon.png'))
                            } else if (orderKind === 'comment') {
                                this.imgKindArr.push(require('../assets/images/post_comment_icon.png'))
                            } else if (orderKind === 'follow') {
                                this.imgKindArr.push(require('../assets/images/getfollowers_icon.png'))
                            }
                        });
                        this.orderStatus = orderStatusData;
                    }
                }.bind(this));
            }
        },
        activated() {
            this.orderStatusServer()
        },
        mounted() {
            this.orderStatusServer();
            let shipei = userhelper.choosePhoneModel();
            if (shipei.quanping) {
                if (shipei.phoneX) {
                    this.topHigh = '40px';
                    this.hg = '100px';
                    this.contentTop = '100px';
                    this.contentBottom = '20px';
                } else {
                    this.topHigh = '20px';
                    this.hg = '80px';
                    this.contentTop = '80px';
                    this.contentBottom = 0;
                }
            } else {
                this.topHigh = 0;
                this.hg = '60px';
                this.contentTop = '60px';
                this.contentBottom = 0;
            }
        }
    }
</script>

<style scoped>
    .changedPage {
        width: 100%;
        position: fixed !important;
        top: 0;
        bottom: 0;
        background: #fff;
        z-index: 300;
        overflow: auto;
    }

    .changedPage::-webkit-scrollbar {
        width: 0;
        height: 0;
    }

    .changedPage > img {
        width: 120px;
        height: 80px;
        position: absolute;
        top: 35%;
        left: 50%;
        margin-left: -60px;
    }

    .pageHeader {
        width: 100%;
        height: 80px;
        line-height: 60px;
        font-size: 20px;
        /* color: #fff; */
        /* background: linear-gradient(to right, #F21174, #820091); */
    }

    .pageHeader > span{
        display: inline-block;
        height: 60px;
        line-height: 60px;
    }

    .pageHeader > span:first-child {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-top: solid 2px #000;
        border-right: solid 2px #000;
        -webkit-transform: rotate(-135deg);
        margin-left: 25px;
    }

    .pageHeader > span:last-child {
        margin-left: 90px;
    }

    .pageContent {
        width: 100%;
        position: absolute;
        overflow: scroll;
    }

    .pageContent>div {
        width: 100%;
        height: 60px;
        border-bottom: 1px solid #ccc;
        padding: 0 12px;
        display: flex;
        justify-content: space-between;
    }

    .itemInfo {
        display: flex;
        justify-content: space-between;
    }

    .itemInfo > img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-top: 10px;
    }

    .itemInfo > div {
        height: 60px;
        margin-left: 8px;
    }

    .itemInfo > div p {
        height: 20px;
        line-height: 20px;
    }

    .itemInfo > div p:first-child {
        font-size: 16px;
        margin-top: 10px;
    }

    .itemInfo > div p:last-child {
        color: #666;
    }

    .itemInfo > div p span {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        vertical-align: top;
        margin-left: 5px;
    }

    .itemInfo > div img {
        width: 20px;
        height: 20px;
    }

    .countBar {
        height: 60px;
    }

    .countBar > div:first-child{
        height: 20px;
        line-height: 20px;
        text-align: center;
        margin-top: 18px;
        font-size: 12px;
    }

    .countBar > div:last-child {
        height: 3px;
        width: 120px;
        background: #aaa;
        border-radius: 1.5px;
        margin-bottom: 18px;
        position: relative;
    }

    .countBar > div:last-child p {
        height: 3px;
        border-radius: 1.5px;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(to right, #F21174, #820091);
    }

</style>
