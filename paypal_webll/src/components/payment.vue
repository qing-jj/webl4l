<template xmlns="http://www.w3.org/1999/html">
    <div class="feedback">
        <!--loading-->
        <!--<div class="loadingcontainer" :style="{display: loading}">-->
        <!--<img src='../assets/images/loading.gif' alt="">-->
        <!--</div>-->
        <loadingComponent :style="{display: loading}">

        </loadingComponent>
        <div class="pageHeader">
            <span @click="back"></span><span>Payment Issue</span>
        </div>
        <div class="content">
            <header>
                <div>Payment Feedback</div>
            </header>
            <section>
                <div>We are sorry for your unfinished payment,please be patient to fill up the form and submit,we will
                    deliver your coins ASAP
                </div>

                <div><input type="text" placeholder="*UserID" v-model='userid'/></div>
                <div><input type="text" placeholder="*UserName" v-model='username'/></div>
                <div><input type="text" placeholder="*Email" @change="email"/></div>
                <div><input type="text" placeholder="*Payment receipt ID" @change="receipt"/></div>
                <div><span>Google :</span> GPA.3375-8299-6017-08623<br/><span>Paypal :</span>
                    PAY-0K141343W92754119LL6PEYQ
                </div>
                <div>
                    <textarea name="" id="" cols="30" rows="10" placeholder="Message" @input='msgNumber'
                              @blur='count' @click="clearTxt"></textarea>
                    <div><span class="num">{{num}}</span>/50</div>
                </div>
                <div>* are required</div>
                <div><input type="submit" value="OK" class="btn" @click="sendMsg"/></div>
            </section>
        </div>
    </div>

</template>

<script>
    import Cryptojs from 'crypto-js'
    let axios = require('axios');

    import loadingComponent from './componentHelper/loadingComponent'

    export default {
        data() {
            return {
                send_flag: true,
                email_flag: false,
                receipt_flag: false,
                msg_flag: false,
                num: 0,
                appname: '',
                appversion: '',
                userid: '',
                username: '',
                loading: 'none'
            }
        },
        components: {
            loadingComponent
        },
        methods: {
            //确定发送数据
            sendMsg() {
                let inp = document.querySelectorAll('input');
                let txt = document.querySelectorAll('textarea')[0];
                let id = inp[0].value;
                let name = inp[1].value;
                if (this.send_flag && this.email_flag && this.receipt_flag && this.msg_flag) {
                    this.loading = 'block';
                    this.send_flag = false;  //防止再次触发按钮
                    let payload = {
                        userid: id,
                        username: name,
                        email: inp[2].value,   //获取email
                        receptid: inp[3].value, //获取receptid
                        message: txt.value   //获取Message信息
                    };
                    //加密signature
                    let datastr = JSON.stringify(payload);
                    let key = '5094eb729dbbc7159a4085eca914c65d37f5f35801438c6ff3e34bd36a618a4e';
                    let hash = Cryptojs.HmacSHA256(datastr, key).toString();
                    let headers = {
                        headers: {
                            appname: this.appname,
                            appversion: this.appversion,
                            signature: hash
                        }
                    };
                    axios('http://best.ourinsta.com/v1/paymentissue', JSON.stringify(payload), headers).then((response) => {
                        console.log(response.data);
                        this.loading = 'none';
                        this.send_flag = true;  //发送成功后，允许再次点击按钮
                        alert("Send Success！");
                    }, (error) => {
                        this.send_flag = true;  //发送成功后，允许再次点击按钮
                        this.loading = 'none';
                        alert('Failed, please check the network connection！')
                    })
                } else {
                    setTimeout(() => {
                        alert('Please complete the form!')
                    }, 300)
                }
            },
            email(e) {
                //email 邮箱正则
                let reg = /^[a-zA-Z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/;
                if (!reg.test(e.target.value)) {
                    this.email_flag = false;
                    alert('Please input correct email!')
                } else {
                    this.email_flag = true
                }
            },
            receipt(e) {
                //receipt ID正则
                let reg1 = /^GPA\.+\d{4}-\d{4}-\d{4}-\d{5}$/;
                let reg2 = /^PAY-OK+[A-Z0-9]{22}$/;
                if (reg1.test(e.target.value) || reg2.test(e.target.value)) {
                    this.receipt_flag = true
                } else {
                    this.receipt_flag = false;
                    alert('Please input correct receipt ID!')
                }
            },
            clearTxt(e) {  //清空文本域
                e.target.value = '';
            },
            msgNumber(e) {
                //显示文本域字数
                this.num = e.target.value.length;
            },
            count(e) {   //计算文本域字数，超出弹出提示框
                if (e.target.value.length > 50) {
                    this.msg_flag = false;
                    alert('Sorry, A maximum of 50 words')
                } else {
                    this.msg_flag = true
                }
            },
            back() {
                this.$router.push('setting')
            }
        },
        created() {
            let that = this;
            // dsbridge.call('getAppInfo', function (res) {   //获取appname  appversion
            //     that.appname = JSON.parse(res).data.appname;
            //     that.appversion = JSON.parse(res).data.appversion;
            // });
            // dsbridge.call('getUserInfo', function (res) {   //获取userid username
            //     that.userid = JSON.parse(res).data.userId;
            //     that.username = JSON.parse(res).data.username;
            // });
        },
        mounted() {
            const txt = document.querySelectorAll('textarea')[0];
            txt.innerHTML = 'Message'
        }
    }


</script>

<style scoped>

    .feedback {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .content {
        padding-top: 0.1px;
        position: absolute;
        top: 0;
        bottom: -61px;
        overflow: scroll;
    }

    .content::scrollbar {
        width: 0;
        height: 0;
    }

    .pageHeader {
        width: 100%;
        height: 60px;
        line-height: 60px;
        font-size: 20px;
        color: #fff;
        background: #f25d61;
        position: fixed;
        top: 0;
    }

    .pageHeader > span:first-child {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-top: solid 2px #fff;
        border-right: solid 2px #fff;
        -webkit-transform: rotate(-135deg);
        margin-left: 25px;
    }

    .pageHeader > span:last-child {
        margin-left: 80px;
        color: #fff;
    }

    header div {
        color: #ff6766;
        font-size: 24px;
        margin: 20px 0;
        text-align: center;
        font-weight: bold;
    }

    section > div {
        margin: 10px 0;
        color: #c0c0c0;
        font-size: 14px;
        text-align: center;
    }

    section > div:nth-child(1) {
        color: #ff6766;
        font-size: 14px;
        text-align: left;
        font-weight: bold;
        margin-left: 25px;
        margin-top: 0;
    }

    section > div:nth-child(6) {
        text-align: left;
        margin-left: 25px;
        margin-bottom: 10px;
        color: #666666;
    }

    section > div:nth-child(8) {
        color: #ff6766;
        font-size: 14px;
        margin-bottom: 10px;
        margin-top: 0;
        text-align: left;
        margin-left: 40px;
    }

    section > div:nth-child(7) {
        position: relative;
        margin-top: 0;
    }

    section > div:nth-child(7) div {
        position: absolute;
        top: 70px;
        right: 40px;
    }

    section > div:last-child > input {
        background-color: #ff6766;
        text-align: center;
        color: #fff;
        border: none;
        font-size: 16px;
    }

    section > div:last-child > input:active {
        box-shadow: 0 0 4px #333;
    }

    span {
        color: #ff6766;
    }

    input {
        width: 90%;
        height: 50px;
        border-radius: 25px;
        border: 2px solid #c0c0c0;
        text-indent: 20px;
        outline: none;
        box-sizing: border-box;
        font-weight: bold;
    }

    textarea {
        width: 90%;
        height: 100px;
        border-radius: 15px;
        border: 2px solid #c0c0c0;
        text-indent: 20px;
        line-height: 20px;
        outline: none;
        font-weight: bold;
        box-sizing: border-box;
    }

    textarea::placeholder {
        text-indent: 20px;
    }

    /*loading*/
    /*.loadingcontainer {*/
        /*width: 100px;*/
        /*height: 100px;*/
        /*background: rgba(0, 0, 0, 0.3);*/
        /*position: fixed;*/
        /*z-index: 900;*/
        /*top: 40%;*/
        /*left: 50%;*/
        /*margin-left: -50px;*/
        /*border-radius: 10px;*/
    /*}*/

    /*.loadingcontainer img {*/
        /*width: 80px;*/
        /*height: 80px;*/
        /*position: absolute;*/
        /*top: 50%;*/
        /*left: 50%;*/
        /*margin-left: -40px;*/
        /*margin-top: -40px;*/
    /*}*/

</style>
