<template>
    <div class="loading">
        <div class="loadingBg">
            <div class="loadingcontainer">
                <img src='../../assets/images/loading_icon.gif' alt="">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        // name: "loading-component"
    }
</script>

<style scoped>
    .loadingBg {
        width: 100%;
        /*height: 100%;*/
        position: absolute;
        top: 80px;
        bottom: 60px;
        left: 0;
        background: transparent;
        z-index: 1000;
    }

    /*.loadingcontainer {*/
        /*width: 100px;*/
        /*height: 100px;*/
        /*background: rgba(255, 255, 255, 1);*/
        /*position: fixed;*/
        /*border: 2px solid rgba(0, 0, 0, 0.2);*/
        /*z-index: 900;*/
        /*top: 40%;*/
        /*left: 50%;*/
        /*margin-left: -50px;*/
        /*border-radius: 10px;*/
    /*}*/

    .loadingcontainer img {
        width: 120px;
        height: 80px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -60px;
        margin-top: -50px;
    }


</style>
