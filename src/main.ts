import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import './style.css'
import './common.css'
import App from './App.vue'

import VueGtag from "vue-gtag";

import VueQrcode from '@chenfengyuan/vue-qrcode';

const app = createApp(App)
app.use(ElementPlus)
app.component(VueQrcode.name, VueQrcode)

app.use(VueGtag, {
    config: { id: "G-9R1F693PB3"}
})

app.mount('#app')
