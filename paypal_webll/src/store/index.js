import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

export default new vuex.Store({
    state: {
        config: null,
        coins: null,
        ratetime: null,
        downloadapp: null,
        rateversion: null,
        routerTransition: '',
        rewardType: null
    },
    mutations: {
        getConfig(state, data) {
            console.log(data);
            state.config = data;
            state.coins = data.coins
        },
        updateCoins(state, coins) {
            console.log(state.config);
            state.coins = coins;
        },
        updateRatetime(state,ratetime){
            state.ratetime = ratetime;
        },
        updateRateversion(state, rateVersion) {
            state.rateversion = rateVersion;
        },
        setTransition(state, transitionName) {
            state.routerTransition = transitionName
        },
        updateRewardType(state, type) {
            state.rewardType = type
        }
    }

})
