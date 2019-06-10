<template>
    <div class="setting">
        <ul>
            <li v-for="item in setting" @click="skipPage(item)">
                <img v-bind:src=item.src alt="">
                <span>{{item.txt}}</span><span class="email" v-if="item.txt === 'Contact Us'">(eirikfu000@gmail.com)</span>
                <!-- <span></span> -->
            </li>
        </ul>
    </div>
</template>

<script>
import userhelper from '../../helper/userhelper'
import nethelper from '../../helper/nethelper'
import dsbridge from '../../helper/swbridge';
import bus from '../../store/bus'

    export default {
        data() {
            return {
                setting: [
                    {src: require('../../assets/images/top_contact_icon.png'), txt: 'Contact Us'},
                    {src: require('../../assets/images/top_orderstatus_icon.png'), txt: 'Order Status'},
                    // {src: require('../../assets/images/Teams_Of_Us_icon.png'), txt: 'Teams Of Us'},
                    // {src: require('../../assets/images/privacy_policy_icon.png'), txt: 'Privacy Policy'},
                    // {src: require('../../assets/images/payment_issue_icon.png'), txt: 'Payment Issue'},
                    {src: require('../../assets/images/top_log_out_icon.png'), txt: 'Log Out'}
                ],
            }
        },
        methods: {
            skipPage(item) {
                let that = this;
                if (item.txt === 'Order Status') {
                    this.$router.push('/order');
                } else if (item.txt === 'Log Out') {
                    bus.$emit('LogOut')
                } else if (item.txt === 'Contact Us') {
                    let phoneType = /iphone/gi.test(window.navigator.userAgent)?'ios':'android';
                    let username = JSON.parse(localStorage.getItem("logged_in_user")).username;
                    let uid = JSON.parse(localStorage.getItem("logged_in_user")).pk
                    let mainTitle = `${nethelper.appname}%20${nethelper.appversion}%20${phoneType}%20feedback%20uid%20${uid}%20un%20${username}`
                    console.log(mainTitle)
                    let url = `mailto:eirikfu000@gmail.com?body=Instagram%20Username&subject=${mainTitle}`;
                    dsbridge.call("openUrl", url, function(res) {
                        console.log(res)
                    }.bind(this));
                }
            },
        },
    }
</script>

<style scoped>
    .setting li {
        height: 58px;
        /* line-height: 58px; */
        font-size: 18px;
        /* color: #aaa; */
        background: #fff;
        display: flex;
        align-items: center;
        margin: 10px;
        border-radius: 3px;
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.12);
    }

    li img {
        width: 26px;
        height: 26px;
        margin: 0 10px;
        display: block;
    }

    .email {
        font-size: 14px;
        color: red;
    }

    /* li span:last-child {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-top: solid 2px #aaa;
        border-right: solid 2px #aaa;
        position: absolute;
        top: 20px;
        right: 20px;
        -webkit-transform: rotate(45deg);
    } */


</style>
