<template>
    <div class="inviteFriends">
        <div class="header" :style="{paddingTop: topHigh,height:hg}">
            <div class="back_btn" @click="back_btn"><span></span></div>
            <div class="title">Invite Friends</div>
            <CoinsAmount class="coinsAmount"/>
        </div>
        <div class="codeInput firstInput">
            <p>Tap to copy the referral code</p>
            <div class="copyCode"><input type="text" :value="referCode" id="copyInput"><span @click="copyCode">Copy</span></div>
        </div>
        <div class="codeInput">
            <p>Please, input your invitation code</p>
            <div class="copyCode"><input type="text" ref="codeInput"><span @click="getCoinsByReferCode">Get Coins</span></div>
        </div>
        <Loading v-show="loading"/>
    </div>
</template>

<script>
    import CoinsAmount from './coinsAmount'
    import Loading from './loadingComponent'
    import userhelper from '../../helper/userhelper'

    export default {
        // name: "invite-friends",
        data() {
            return {
                referCode: '245835846',
                loading: false,
                topHigh: 0,
                hg: '80px',
            }
        },
        components: {
            CoinsAmount, Loading
        },
        methods: {
            back_btn() {
                this.$router.go(-1)
            },
            copyCode() {
                let copyInput = document.getElementById('copyInput');
                copyInput.setAttribute('readonly', 'readonly');
                copyInput.setSelectionRange(0, copyInput.value.length);
                if (document.execCommand("copy")) {
                    document.execCommand("copy");
                    alert('success')
                }
            },
            getCoinsByReferCode() {
                let code = this.$refs.codeInput.value;
                if (code === '') {
                    alert('Please input invitation code!');
                } else {
                    this.loading = true;
                    userhelper.invitereward(code, function (res, err) {
                        if (err){
                            alert(err.errorMessage);
                        } else {
                            alert('success');
                            this.$store.commit('updateCoins', res.coins);
                        }
                        this.loading = false;
                    }.bind(this))
                }
            }
        },
        created() {
            this.referCode = this.$store.state.config.referCode;
            console.log(this.$store.state.config);
            let shipei = userhelper.choosePhoneModel();
            if (shipei.quanping) {
                if (shipei.phoneX) {
                    this.xiaodi = true;
                    this.topHigh = '40px';
                    this.hg = '109px';
                } else {
                    this.topHigh = '20px';
                    this.hg = '80px';
                    this.xiaodi = false;
                }
            } else {
                this.topHigh = 0;
                this.hg = '80px';
                this.xiaodi = false;
            }
        }
    }
</script>

<style scoped>
    .inviteFriends {
        width: 100%;
        background: #fff;
        position: fixed !important;
        top: 0;
        bottom: 0;
        z-index: 1000;
    }

    .header {
        width: 100%;
        height: 80px;
        text-align: center;
        /* color: #fff; */
        font-size: 16px;
        /* font-weight: 200; */
        display: flex;
        justify-content: space-between;
        align-items: center;
        /*padding-top: 20px;*/
        /* background: linear-gradient(to right, #F21174, #820091); */
        position: relative;
    }

    .back_btn {
        position: absolute;
        width: 30px;
        height: 30px;
        /*top: 20px;*/
        /*left: 20px;*/
        margin-left: 20px;
    }

    .back_btn span {
        display: inline-block;
        width: 10px;
        height: 10px;
        border: 2px solid;
        border-color: #000 #000 transparent transparent;
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
    }

    .title {
        position: absolute;
        font-size: 20px;
        /* font-weight: bold; */
        left: 50%;
        transform: translate(-50%);
        -webkit-transform: translate(-50%);
    }

    .coinsAmount {
        position: absolute;
        right: 0;
    }

    .codeInput {
        width: 95%;
        margin: 20px auto;
    }

    .firstInput {
        margin-top: 60px;
    }

    .codeInput p {
        margin: 10px 0;
        color: #808080;
        font-size: 14px;
    }

    .codeInput input {
        border: 1px solid #6190DE;
        height: 28px;
        border-radius: 5px;
        background: #ECF9FB;
        color: #6190DE;
        text-indent: 5px;
        box-sizing: border-box;
    }

    .copyCode{
        display: flex;
        justify-content: space-between;
    }

    .copyCode > input {
        width: 70%;
    }

    .copyCode > span {
        display: inline-block;
        width: 28%;
        height: 28px;
        line-height: 28px;
        background: linear-gradient(to right, #6C63FA, #69C1FC);
        text-align: center;
        color: #fff;
        border-radius: 5px;
        font-size: 14px;
    }

    .copyCode > span:active{
        box-shadow: 0 0 4px #333;;
    }

    .inviteCode > input {
        width: 100%;
    }
</style>
