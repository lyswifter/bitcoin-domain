import { createRouter, createWebHashHistory } from "vue-router";

import Bsite from "../components/Bsite.vue";
import Home from "../components/Home.vue";
import MyWallet from "../components/MyWallet.vue";
import Setting from "../components/Setting.vue";

const routes = [
    {
        path: '/',
        name: "home",
        component: Home,
        props: true,
    },
    {
        path: '/wallet/:addr',
        name: "wallet",
        component: MyWallet,
        props: true,
    },{
        path: '/setting/:addr',
        name: 'setting',
        component: Setting,
        props: true,
    },{
        path: '/bsite',
        name: 'bsite',
        component: Bsite,
        props: true,
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.afterEach((to, from, next) => {
    window.scrollTo(0, 0)
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
})

export default router