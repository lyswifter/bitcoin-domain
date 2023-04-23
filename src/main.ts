import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import { createApp } from 'vue';
import App from './App.vue';
import './common.css';
import router from './router/index';
import './style.css';

import { Buffer } from 'buffer';
import VueGtag from "vue-gtag";

import VueQrcode from '@chenfengyuan/vue-qrcode';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App)

app.use(ElementPlus)
app.component(VueQrcode.name, VueQrcode)

app.use(VueGtag, {
    config: { id: "G-9R1F693PB3"}
})

app.use(router)

app.mount('#app')

declare global {
    interface Window {
        ethereum: any,
        provider: any,
        singer: any,
        buffer: any,
    }
}

window.buffer = Buffer
