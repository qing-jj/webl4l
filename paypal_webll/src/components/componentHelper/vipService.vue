<template>
    <div class="vipService">
        <div class="vipTitle">Vip Service</div>
        <div class="services">
            <div class="serviceItem" v-for="item in services" @click="payForVip(item)">
                <div class="vip_img"><img :src=item.src alt=""></div>
                <div>{{item.text}}</div>
            </div>
        </div>
        <div class="freeTrail">FREE TRAIL</div>
    </div>
</template>

<script>
    export default {
        // name: "vip-service",
        data() {
            return {
                services: [
                    {src: require('../../assets/images/CampaignProtection@3x.png'), text: 'Campaign Protection'},
                    {src: require('../../assets/images/UnlimitedTrackerData@3x.png'), text: 'Unlimited\nTracker Data'},
                    {src: require('../../assets/images/Adsfree@3x.png'), text: 'Ads Free'},
                    {src: require('../../assets/images/CostomerSupport@3x.png'), text: 'Customer Support'}
                ]
            }
        },
        methods: {
            payForVip(item){
                console.log(item);
            }
        }
    }
</script>

<style scoped>
    .vipService {
        text-align: center;
        color: #fff;
    }

    .vipTitle {
        padding-top: 20px;
        font-size: 14px;
        color: #F21174;
    }

    .vip_img, .vip_img > img {
        width: 45px;
        height: 45px;
    }

    .serviceItem {
        width: 110px;
        height: 100px;
        background: linear-gradient(to bottom, #69BFFC, #6C65FA);
        border-radius: 3px;
        font-size: 12px;
    }

    .serviceItem:not(:last-child) {
        margin-right: 6px;
    }

    .serviceItem > div:last-child {
        height: 35px;
        /*line-height: 20px;*/
    }

    .serviceItem:nth-child(3) >div:last-child{
        line-height: 35px;
    }

    .vip_img {
        margin: 5px auto;
    }

    .services {
        width: 95%;
        margin: 10px auto;
        display: flex;
        justify-content: space-between;
    }

    .freeTrail {
        width: 150px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        background: linear-gradient(to right, #E76D2B, #EBDA6B);
        margin: 20px auto;
        border-radius: 5px;
        box-shadow: 0 5px 20px #aaa;
    }

</style>
