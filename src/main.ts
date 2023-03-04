import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import './style.css'
import './common.css'
import App from './App.vue'

import VueQrcode from '@chenfengyuan/vue-qrcode';
import VueClip from 'vue-clipboard2'

const app = createApp(App)
app.use(ElementPlus)
app.component(VueQrcode.name, VueQrcode)
app.provide('VueClip', VueClip)

app.mount('#app')
