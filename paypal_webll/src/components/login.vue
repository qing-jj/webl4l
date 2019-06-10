<!--suppress ALL -->
<template>
    <div class="login">
        <!--loading-->
        <div class="mo" :style="{display: loading, background: rgba}"></div>
        <div class="loadingcontainer" :style="{display: loading}">
            <!--<img :src=loadImg alt="Loading3...">-->
            <div class="loading">
                <div class="lds-spinner" style="width: 100%;height:100%">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div class="validate">{{validate}}</div>
        </div>
        <div class="bgImg"></div>
        <div class="inp" :style="{display: logOn}">
            <div class="login_div">
                <div class="logImg">Login Instagram</div>
                <div><input @blur="showInput" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" type="text" placeholder="Instagram Username" class="user" v-model=vusername></div>
                <div><input @blur="showInput" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" type="password" placeholder="Password" class="password" v-model=vpassword></div>
                <div>
                    <div class="btn" @click="loginButtonClicked">Log In</div>
                </div>
                <!--<p>Forget your password ？</p>-->
            </div>

        </div>

        <div class="checkPointView"  v-show="show_check_point">
            <div class="check_point_alert">
                <h3>Input Code</h3>
                <div>Please submit code we send to your phone/email</div>
                <div><input @blur="showInput" type="text" ref="code_input" placeholder="Enter code:"></div>
                <div>
                    <button @click.stop='submit_code'>SUBMIT</button>
                </div>
                <button class="hideChechPoint" @click.stop="hideCheckPointView"><img src="../assets/images/top_close_icon.png" alt=""></button>
            </div>
        </div>

    </div>

</template>

<script>
    import userhelper from '../helper/userhelper'
    import IIHelper from '../helper/IIHelper'
    import nethelper from '../helper/nethelper'
    import dsbridge from '../helper/swbridge'
    var url = require('url');


    console.log('loginpage');

    export default {
        data() {
            return {
                loading: 'none',
                success: true,
                logOn: 'block',
                loadImg: require('../assets/images/loading_icon.gif'),
                vusername: '',
                vpassword: '',
                show_check_point: false,
                checkurl: '',
                validate: 'Loading...',
                rgba: 'rgba(0,0,0,0)',
                twoFactorRequired: false,
                twoFactorIdentifier: ''
            }
        },
        methods: {
            showloading() {
                this.loading = 'block';
            },
            hideloading() {
                this.loading = 'none';
            },
            showInput() {
                // setTimeout(() => {
                //     let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                //     window.scrollTo(0, Math.max(scrollHeight - 1, 0));
                // }, 300)
                let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            },
            passedLogin() {
                this.hideloading();
                this.$router.push('/');
            },
            loginButtonClicked() {
                let that = this;
                // let username = document.querySelectorAll('.user')[0].value;
                // let password = document.querySelectorAll('.password')[0].value;
                let username = this.vusername;
                let password = this.vpassword;
                // console.log(username + password);
                if (username === '' || password === '' || username.length < 1 || password.length < 1) {
                    alert('Please input username and password');
                } else {
                    this.showloading();

                    let arg = {
                        username: username,
                        password: password
                    };
                    userhelper.setLastinputUserName(arg);

                    userhelper.login(arg, (res, error) => {
                        this.hideloading();
                        if (error) {
                            let that = this;
                            if (error.errorMessage === 'checkpoint_required' || error.errorMessage === 'challenge_required') {
                                // that.showloading();
                                alert(error.errorMessage);
                                let _this = this;
                                _this.validate = 'Login validate...';

                                console.log(error);
                                let Ores = error.error.userinfo.response;
                                console.log(Ores)
                                let base = 'https://i.instagram.com/api/v1/';
                                if (Ores.challenge) {
                                    if (Ores.challenge.api_path.indexOf('/') === 0){
                                        base = 'https://i.instagram.com/api/v1';
                                    }
                                    _this.checkurl = base + Ores.challenge.api_path;
                                } else if (Ores.checkpoint_url) {
                                    let arr = Ores.checkpoint_url.split('challenge');
                                    console.log(arr[1]);
                                    if (arr.length !== 2) {
                                        alert('Unknown Login Error. Try add phone or email in Instagram.');
                                        return
                                    } else {
                                        _this.checkurl = base + 'challenge' + arr[1];
                                    }
                                } else if (Ores.checkpoint) {

                                    let arr = Ores.checkpoint.url.split('challenge');
                                    console.log(arr);
                                    if (arr.length !== 2) {
                                        alert('Unknown Login Error. Try add phone or email in Instagram.');
                                        return
                                    } else {
                                        _this.checkurl = base + 'challenge' + arr[1];
                                    }
                                }
                                console.log(_this.checkurl);
                                let setting = {
                                    method: 'get',
                                    url: _this.checkurl,
                                    data: {
                                        device_id: nethelper.deviceid
                                    }
                                };
                                IIHelper.sendRequest(setting, (res, err) => {
                                    if (err) {
                                        console.log(err);
                                        alert(err.errorMessage);
                                        alert("You need login Instagram.")
                                    } else {
                                        console.log(res.data);
                                        let that = this;
                                        if(res.data.action === "close") {
                                            nethelper.deviceid = nethelper.generateUUID();
                                            IIHelper.currentIIUser(function (res,err) {
                                                console.log(res);
                                                userhelper.logged_in_user = res.data.user;
                                                userhelper.directlogin(function (res,err) {
                                                    that.passedLogin();
                                                });
                                            })
                                        }
                                        else if (res.data.step_name === 'select_verify_method') {
                                            setting = {
                                                method: 'post',
                                                url: _this.checkurl,
                                                data: IIHelper.formData({
                                                    "choice": res.data.step_data.choice,
                                                    "device_id": nethelper.deviceid
                                                })
                                            }
                                            IIHelper.sendRequest(setting, (res, err) => {
                                                that.rgba = 'rgba(0,0,0,.3)';
                                                that.show_check_point = true;
                                            })
                                        } else if (res.data.step_name === 'delta_login_review') {
                                            alert('You should change your password');
                                            // this.passedLogin();
                                        } else {
                                            that.rgba = 'rgba(0,0,0,.3)';
                                            that.show_check_point = true;
                                        }
                                    }
                                })
                            } else if (error.errorMessage.two_factor_required) {
                                that.twoFactorRequired = error.errorMessage.two_factor_required;
                                that.twoFactorIdentifier = error.errorMessage.two_factor_info.two_factor_identifier;
                                that.rgba = 'rgba(0,0,0,.3)';
                                that.show_check_point = true;
                            } else {
                                console.log(error.errorMessage)
                                alert(error.errorMessage)
                            }
                        }
                        else {
                            // alert(JSON.stringify(res));
                            let IIuserinfo = userhelper.logged_in_user;
                            let is_private = IIuserinfo.is_private;
                            if (is_private) {
                                alert('Your account is private, please set again in instagram')
                                this.$router.push('/login')
                            } else {
                                this.passedLogin();
                            }
                        }
                    });

                }
            },
            submit_code() {
                let code = this.$refs.code_input.value;
                if (!code) {
                    alert('Please, Input code!');
                    this.show_check_point = true;
                    return
                } else {
                    this.$refs.code_input.value = '';
                    let that = this;
                    that.loading = 'block';
                    that.show_check_point = false;
                    console.log(code);
                    let setting;
                    if (that.twoFactorRequired) {
                        setting = {
                            method: 'post',
                            url: 'https://i.instagram.com/api/v1/accounts/two_factor_login/',
                            data: {
                                "device_id": nethelper.deviceid,
                                "verification_code": code,
                                "two_factor_identifier": that.twoFactorIdentifier,
                                "_csrftoken": nethelper.csrftoken,
                                "username": that.vusername,
                                "password": that.vpassword,
                            }
                        }
                    } else {
                        setting = {
                            method: 'post',
                            url: this.checkurl,
                            data: IIHelper.formData({
                                "device_id": nethelper.deviceid,
                                "security_code": code
                            })
                        }
                    }
                    IIHelper.sendRequest(setting, (res, err) => {
                        if (err) {
                            that.validate = err.errorMessage;
                            that.show_check_point = false;
                            setTimeout(function () {
                                that.loading = 'none';
                            }, 1500)
                        } else {
                            IIHelper.currentIIUser(function (res, err) {
                                console.log(res);
                                userhelper.logged_in_user = res.data.user;
                                userhelper.directlogin(function (res, err) {
                                    that.passedLogin();
                                });
                            })
                        }
                    })
                }
            },
            hideCheckPointView() {
                this.show_check_point = false
            }
        },

        created() {
            console.log('loginpage created');

            let jsonobj = userhelper.getLastinputUserName();
            if (jsonobj) {
                this.vusername = jsonobj.username;
                this.vpassword = jsonobj.password;
            }

        }
    }
</script>


<style scoped>
    .login {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        padding-top: 0.1px;
        /*overflow: hidden;*/
    }

    .bgImg {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: url(../assets/images/back@2x.png) no-repeat center;
        z-index: -1;
        overflow: hidden;
        background-size: 100% 100%;
    }

    .logImg {
        width: 100%;
        margin-top: 150px;
        color: #fff;
        font-size: 20px;
        text-align: center;
    }

    p {
        color: #fff;
        font-size: 24px;
        text-align: center;
    }

    .inp {
        width: 100%;
        height: 100%;
    }

    .login_div {
        width: 100%;
        position: absolute;
        bottom: 50px;
    }

    .login_div input {
        display: block;
        width: 75%;
        height: 40px;
        margin: 10px auto;
        background: transparent;
        outline: none;
        border: none;
        border-bottom: 1px solid;
        border-bottom-color: #aaa;
        font-size: 18px;
        color: #fff;
    }

    .login_div input::-webkit-input-placeholder {
        color: #bdbdbd;
        opacity: 0.7;
        font-weight: normal;
    }

    .btn {
        width: 75%;
        height: 40px;
        line-height: 40px;
        /*background: #7028F6;*/
        background: #ffb100;
        color: #fff;
        font-size: 16px;
        text-align: center;
        border-radius: 20px;
        opacity: 1;
        margin: 25px auto 10px auto;
    }

    .inp p:last-of-type {
        font-size: 14px;
        opacity: 0.9;
    }

    .checkPointView {
        width: 100%;
        position: fixed;
        top: 0;
        bottom: 0;
        background: rgba(74, 74, 74, 0.6);
    }

    .check_point_alert {
        width: 80%;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        background: #fff;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
    }

    .check_point_alert h3 {
        margin: 20px 0 20px 0;
        font-size: 18px;
    }

    .check_point_alert div:nth-of-type(1) {
        font-size: 16px;
        margin-bottom: 10px;
        padding: 0 10px;
        word-wrap:break-word;
        color: #4A4A4A;
    }

    .check_point_alert input {
        height: 36px;
        width: 80%;
        border-radius: 18px;
        box-sizing: border-box;
        text-indent: 10px;
        border-radius: 0.5px solid #4A4A4A;
    }

    .check_point_alert > div button {
        width: 100%;
        height: 40px;
        margin-top: 20px;
        font-size: 20px;
        color: #fff;
        background: #9013FE;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        font-weight: bold;
        font-family: 'Avenir-Medium';
    }

    .check_point_alert img {
        width: 30px;
        height: 30px;
    }

    .hideChechPoint {
        
        position: absolute;
        top: 10px;
        right: -10px;
        border: none;
        outline: none;
        font-size: 18px;
        color: #666;
    }

    /*loading*/
    .mo{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 899;
        /*background: rgba(0,0,0,0);*/
    }

    .loadingcontainer {
        width: 60%;
        height: 220px;
        background: rgba(0, 0, 0, 0.6);
        position: absolute;
        z-index: 900;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        border-radius: 12px;
    }

    .validate {
        width: 100%;
        text-align: center;
        font-size: 16px;
        color: #fff;
        margin-top: 150px;
    }

    /*.loadingcontainer img {*/
    /*width: 120px;*/
    /*height: 80px;*/
    /*position: absolute;*/
    /*top: 50%;*/
    /*left: 50%;*/
    /*margin-left: -60px;*/
    /*margin-top: -60px;*/
    /*}*/

    .loading {
        width: 65px;
        height: 65px;
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, 0);
        -webkit-transform: translate(-50%, 0);
    }

    @keyframes lds-spinner {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    @-webkit-keyframes lds-spinner {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    .lds-spinner {
        position: relative;
    }

    .lds-spinner div {
        left: 94px;
        top: 48px;
        position: absolute;
        -webkit-animation: lds-spinner linear 1.2s infinite;
        animation: lds-spinner linear 1.2s infinite;
        background: #fff;
        width: 12px;
        height: 24px;
        border-radius: 40%;
        -webkit-transform-origin: 6px 52px;
        transform-origin: 6px 52px;
    }

    .lds-spinner div:nth-child(1) {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
        -webkit-animation-delay: -1.1s;
        animation-delay: -1.1s;
    }

    .lds-spinner div:nth-child(2) {
        -webkit-transform: rotate(30deg);
        transform: rotate(30deg);
        -webkit-animation-delay: -1s;
        animation-delay: -1s;
    }

    .lds-spinner div:nth-child(3) {
        -webkit-transform: rotate(60deg);
        transform: rotate(60deg);
        -webkit-animation-delay: -0.9s;
        animation-delay: -0.9s;
    }

    .lds-spinner div:nth-child(4) {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
        -webkit-animation-delay: -0.8s;
        animation-delay: -0.8s;
    }

    .lds-spinner div:nth-child(5) {
        -webkit-transform: rotate(120deg);
        transform: rotate(120deg);
        -webkit-animation-delay: -0.7s;
        animation-delay: -0.7s;
    }

    .lds-spinner div:nth-child(6) {
        -webkit-transform: rotate(150deg);
        transform: rotate(150deg);
        -webkit-animation-delay: -0.6s;
        animation-delay: -0.6s;
    }

    .lds-spinner div:nth-child(7) {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
        -webkit-animation-delay: -0.5s;
        animation-delay: -0.5s;
    }

    .lds-spinner div:nth-child(8) {
        -webkit-transform: rotate(210deg);
        transform: rotate(210deg);
        -webkit-animation-delay: -0.4s;
        animation-delay: -0.4s;
    }

    .lds-spinner div:nth-child(9) {
        -webkit-transform: rotate(240deg);
        transform: rotate(240deg);
        -webkit-animation-delay: -0.3s;
        animation-delay: -0.3s;
    }

    .lds-spinner div:nth-child(10) {
        -webkit-transform: rotate(270deg);
        transform: rotate(270deg);
        -webkit-animation-delay: -0.2s;
        animation-delay: -0.2s;
    }

    .lds-spinner div:nth-child(11) {
        -webkit-transform: rotate(300deg);
        transform: rotate(300deg);
        -webkit-animation-delay: -0.1s;
        animation-delay: -0.1s;
    }

    .lds-spinner div:nth-child(12) {
        -webkit-transform: rotate(330deg);
        transform: rotate(330deg);
        -webkit-animation-delay: 0s;
        animation-delay: 0s;
    }

    .lds-spinner {
        width: 64px !important;
        height: 64px !important;
        -webkit-transform: translate(-32px, -32px) scale(0.32) translate(32px, 32px);
        transform: translate(-32px, -32px) scale(0.32) translate(32px, 32px);
    }
</style>
