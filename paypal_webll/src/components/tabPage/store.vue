<template>
    <div class="store">
        <!--loading-->
        <loadingComponent :style="{display: loading}">

        </loadingComponent>
        <!--<div class="store_top">-->
            <!--COINS-->
        <!--</div>-->
        <ul v-show="iapGoods">
            <li v-for="item in storeList" @click="payOk(item)">
                <div>
                    <img src="../../assets/images/follow_btn_coins_icon.png" alt="">
                    <div>
                        <span class="coinsAmount">{{item.goodsAmount}}</span>
                        <p>Save 20%</p>
                    </div>
                </div>
                <div>
                    ${{item.price.toFixed(2)}}
                </div>
            </li>
        </ul>
        <FreeCoins v-show="!iapGoods" />
    </div>
</template>

<script>
    import userhelper from '../../helper/userhelper'
    import loadingComponent from '../componentHelper/loadingComponent'
    import nethelper from '../../helper/nethelper'
    import dsbridge from '../../helper/swbridge'
    import FreeCoins from './freeCoins'
    var JSONbig = require('json-bigint');

    export default {
        data() {
            return {
                storeList: [],
                loading: 'none',
                iapGoods: true
            }
        },
        components:{
            loadingComponent,
            FreeCoins
        },
        methods: {
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
            refreshData() {
                this.loading = 'block';
                let _this = this;
                if(_this.$store.state.config) {
                    _this.loading = 'none';
                    _this.storeList = _this.$store.state.config.iapGoods;
                    this.iapGoods = !!this.$store.state.config.iapGoods;
                } else {
                    userhelper.directlogin((res, error) => {
                        _this.loading = 'none';
                        if (error) {
                            _this.$router.push('/login');
                        } else {
                            console.log(userhelper.userconfig);
                            _this.$store.commit('getConfig',userhelper.userconfig);
                            _this.storeList = _this.$store.state.config.iapGoods;
                            _this.iapGoods = !!this.$store.state.config.iapGoods;
                        }
                    });
                }
            }
        },
        activated() {
            this.refreshData()
        },
        created() {
            this.refreshData()
        }
    }
</script>

<style scoped>

    .store ul {
        margin: 10px 20px 0 20px;
    }

    .store li {
        width: 100%;
        height: 46px;
        border-bottom: 1px solid #edebe9;
        padding: 14px 5px;
        display: flex;
        justify-content: space-between;
    }

    .store img {
        width: 46px;
        height: 46px;
        margin-right: 5px;
    }

    .store span {
        color: #666;
    }

    .store p {
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
    }


</style>
