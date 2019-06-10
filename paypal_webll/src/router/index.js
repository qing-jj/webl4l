import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import coins from '@/components/tabPage/coins'
import freeCoins from '@/components/tabPage/freeCoins'
import likes from '@/components/tabPage/likes'
import postLikesView from '@/components/tabPage/postLikesView'
import followers from '@/components/tabPage/followers'
// import followers from '@/components/tabPage/followers'
// import likes from '@/components/tabPage/likes'
import setting from '@/components/tabPage/setting'
// import store from '@/components/tabPage/store'
import tab from '@/components/tab'
import inviteFriend from '@/components/componentHelper/inviteFriends'
import dailyLogin from '@/components/componentHelper/dailyLogin'
// import payment from '@/components/payment'
import order from '@/components/order'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/',
            redirect: 'coins',
            component: tab,
            children: [
                {
                    path: '/coins',
                    name: 'coin',
                    component: coins
                },
                {
                    path: '/freeCoins',
                    name: 'freeCoins',
                    component: freeCoins
                },
                {
                    path: '/likes',
                    name: 'zan',
                    component: likes
                },
                {
                    path: '/postLikesView',
                    name: 'postLikesView',
                    component: postLikesView
                },
                {
                    path: '/followers',
                    name: 'fen',
                    component: followers
                },
                {
                    path: '/setting',
                    name: 'setting',
                    component: setting
                },
                {
                    path: '/order',
                    name: 'order',
                    component: order
                },
                {
                    path: '/inviteFriend',
                    name: 'inviteFriend',
                    component: inviteFriend
                },
                {
                    path: '/dailyLogin',
                    name: 'dailyLogin',
                    component: dailyLogin
                },
            ]
        },


    ]
})
