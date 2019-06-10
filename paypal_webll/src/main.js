// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'   //引入图片懒加载插件
import 'lib-flexible'
// import startTest from './helper/testBot'

Vue.config.productionTip = false;

Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require('@/assets/images/loadingfailed_icon.png'),
    loading: require('@/assets/images/loadingfailed_icon.png'),
    attempt: 1
});

window.eventBus = new Vue();
console.log('mainjs');
// startTest();

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: {App},
    template: '<App/>'
});
