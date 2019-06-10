<template>
    <div class="pinglun">
        <div class="input">
            <input type="text" placeholder="Write your own comments" v-model="inputText">
            <span @click="addPingLun">+</span>
        </div>
        <div class="pinglunList">
            <div v-for="(item, index) in pinglunDingdanList" class="pinglunItem">
                <div class="itemText">{{item.content}}</div>
                <div class="itemCount">
                    <span @click="jianCount(index)">-</span>
                    <span>{{item.count}}</span>
                    <span @click="addCount(index)">+</span>
                </div>
            </div>
        </div>
        <div class="coinsPay" v-show="coinsView&&!iapCoins_flag" :class="xiaodi?'liuhaiHome':'yibanHome'">
            <div class="pingLunTotal">{{pingLunTotal}}</div>
            <div class="coinsTotal payAction"><span>{{coinsTotal}}</span> coins</div>
            <div class="getCoins" @click="coinsPay">GET</div>
        </div>
        <div class="cashPay" v-show="coinsView&&iapCoins_flag" :class="xiaodi?'liuhaiHome':'yibanHome'">
            <div class="pingLunTotal">{{pingLunTotal}}</div>
            <div class="coinsTotal payAction" @click="coinsPay">{{coinsTotal}} coins</div>
            <div>or</div>
            <div class="cashGet payAction">{{cashTotal}} dollar</div>
            <div class="comment-paypal-button" ref="paypalButton">
            </div>
        </div>
    </div>
</template>

<script>
    import userHelper from '../../helper/userhelper'
    import paypalHelper from '../../helper/paypalHelper'

    export default {
        name: "pinglun",
        data() {
            return {
                inputText: '',
                pinglunDingdanList: [],
                pingLunTotal: '',
                coinsTotal: '',
                cashTotal: '',
                coinsView: false,
                coinCommentItem: '',
                cashCommentItem: '',
                commentList: [],
                coinsPrice: '',
                cashPrice: '',
                xiaodi: true,
                iapCoins_flag: false
            }
        },
        props: ['commentGoods'],
        methods: {
            checkExistPinglun() {
                for (let i = 0; i < this.pinglunDingdanList.length; i++) {
                    if (this.pinglunDingdanList[i].content === this.inputText) {
                        return true;
                    }
                }
            },
            addPingLun() {
                if (this.inputText) {
                    if (this.checkExistPinglun()) {
                        alert('Comments Exist')
                    } else {
                        this.pinglunDingdanList.push({
                            content: this.inputText,
                            count: 1
                        })
                        this.inputText = "";
                    }
                    this.pingLunTotalCount()
                } else {
                    alert('Enter your own comments')
                }

            },
            jianCount(index) {
                if (this.pinglunDingdanList[index].count <= 0) {
                    this.pinglunDingdanList.splice(index, 1);
                } else {
                    this.pinglunDingdanList[index].count--;
                }
                this.pingLunTotalCount()
            },
            addCount(index) {
                this.pinglunDingdanList[index].count++;
                this.pingLunTotalCount()
            },
            pingLunTotalCount() {
                let total = 0;
                for (let i = 0; i < this.pinglunDingdanList.length; i++) {
                    total += this.pinglunDingdanList[i].count;
                }
                console.log(this.pinglunDingdanList);
                this.pingLunTotal = total;
                let coins = this.coinsPrice * total;
                let cash = this.cashPrice * total;
                this.coinsTotal = coins;
                this.cashTotal = cash.toFixed(2);
                this.coinsView = this.pingLunTotal !== 0;
                if (this.iapCoins_flag) {
                    this.commentPaypalButton();
                }
            },
            coinsPay() {
                let bodyData = {
                    commentArray: this.pinglunDingdanList,
                    goods: this.coinCommentItem,
                };
                this.$emit('coinsAddComments', bodyData);

            },
            commentPaypalButton() {
                this.$refs.paypalButton.innerHTML = '';
                let paypal_button = document.querySelector('.comment-paypal-button');
                let payload = {
                    post: this.commentGoods,
                    goods: this.cashCommentItem,
                    commentArray: this.pinglunDingdanList
                };
                let data = userHelper.pinglunpaloadTransform(payload).data;
                console.log(data);
                paypalHelper.paypalBtn(paypal_button, data)
            },
            handleCommentGoods(commentGoods) {
                commentGoods.forEach(function (item) {
                    if (item.paymentType === 0) {
                        if (item.goodsAmount === 0) {
                            this.coinCommentItem = item;
                            this.coinsPrice = item.price;
                        }
                    } else {
                        this.cashPrice = item.price;
                        this.cashCommentItem = item;
                        this.iapCoins_flag = true;
                    }
                }.bind(this));
            }
        },
        created() {
            window.localStorage.getItem("commentList")?this.pinglunDingdanList = window.localStorage.getItem("commentList"):this.pinglunDingdanList = [];
            this.pinglunDingdanList = [];
            if (this.$store.state.config) {
                this.commentList = this.$store.state.config.getCommentGoods;
                this.handleCommentGoods(this.commentList);
            } else {
                let that = this;
                userHelper.directlogin((res, error) => {
                    if (error) {
                        console.log('return to login');
                        that.$router.push('/login');
                    } else {
                        that.$store.commit('getConfig',userHelper.userconfig);
                        that.commentList = this.$store.state.config.getCommentGoods;
                        that.handleCommentGoods(that.commentList);
                    }
                });
            }
            let shipei = userHelper.choosePhoneModel();
            if (shipei.quanping) {
                this.xiaodi = shipei.phoneX;
            } else {
                this.xiaodi = false;
            }
        }
    }
</script>

<style scoped>

    .pinglun {
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
    }

    .input {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        position: relative;
    }

    .input input {
        width: 95%;
        height: 38px;
        box-sizing: border-box;
        border-radius: 19px;
        text-indent: 10px;
        font-size: 10px;
    }

    .input span {
        position: absolute;
        display: inline-block;
        width: 38px;
        height: 38px;
        line-height: 38px;
        background: #F21174;
        color: #fff;
        font-size: 28px;
        text-align: center;
        border-radius: 50%;
        right: 2.5%;
        top: 6.5px;
    }

    .pinglunList {
        width: 100%;
        position: absolute;
        top: 50px;
        bottom: 50px;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }

    .pinglunItem {
        width: 95%;
        height: 40px;
        margin: auto;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
    }

    .itemText {
        width: 82%;
        height: 40px;
        line-height: 40px;
        text-indent: 5px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }

    .itemCount {
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        flex-grow: 1;
    }

    .itemCount span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        flex-grow: 1;
        text-align: center;
        font-size: 16px;
        color: #666;
    }

    .coinsPay {
        position: absolute;
        width: 100%;
        height: 40px;
        bottom: 0;
        left: 0;
        display: flex;
        border: 1px solid #ccc;
        background: #fff;
        justify-content: space-between;
        box-sizing: border-box;
    }

    .yibanHome {
        bottom: 0;
    }

    .liuhaiHome {
        bottom: 30px;
    }

    .coinsPay>.payAction {
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        margin-left: 50px;
    }

    .coinsPay>.payAction>span {
        color: #F21174;
    }

    .coinsPay>.getCoins {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background: #F21174;
        text-align: center;
        color: #fff;
        font-size: 12px;
    }

    .pingLunTotal {
        position: absolute;
        height: 12px;
        line-height: 12px;
        padding: 0 5px;
        background: #F21174;
        border-radius: 6px;
        color: #fff;
        top: 5px;
        left: 20px;
    }

    .comment-paypal-button {
        width: 75px;
        position: absolute;
        right: 45px;
        opacity: 0;
    }

    .cashPay {
        position: absolute;
        width: 100%;
        height: 50px;
        bottom: 0;
        left: 0;
        display: flex;
        border-top: 1px solid #ccc;
        background: #fff;
        justify-content: space-around;
        align-items: center;
    }

    .cashPay > .payAction {
        width: 80px;
        height: 36px;
        line-height: 36px;
        background: #F21174;
        color: #ffffff;
        border-radius: 5px;
        text-align: center;
        font-size: 14px;
        margin: 0 30px;
    }


</style>
