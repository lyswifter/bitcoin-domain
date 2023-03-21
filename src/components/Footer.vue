<script setup lang="ts">
import { onMounted, reactive } from 'vue';

import 'element-plus/theme-chalk/display.css';

let state = reactive({ input: '', isMintAble: false, isMinting: false, inscriptId: '', targetAddr: '' })

onMounted(() => {
})
</script>

<template>
    <div class="footer-container">

        <el-row>
            <div class="email-view" style="margin-left: 5%;">
                <img src="../assets/邮箱@2x.png" style="width: 40px;height: 40px;vertical-align: middle;" alt="">
                contact@btcdomains.io
            </div>

            <div style="margin-left: 30%;">
                <a href="http://twitter.com/btcdomain_btc" target="_blank">
                    <img src="../assets/twitter@2x.png" style="width: 32px;height: 32px;margin-top: 30px;" alt="">
                </a>
                <a href="http://medium.com/@btcdomain" target="_blank">
                    <img src="../assets/medium@2x.png" style="width: 32px;height: 32px;margin-top: 30px;margin-left: 10px;"
                        alt="">
                </a>
                <a href="https://github.com/btcdomain" target="_blank">
                    <img src="../assets/github@2x.png" style="width: 32px;height: 32px;margin-top: 30px;margin-left: 10px;"
                        alt="">
                </a>
            </div>

            <img class="block-logo-view" src="../assets/logo_footer@2x.png" style="height: 30px;margin-left: 30%;" alt="">
        </el-row>
    </div>
</template>

<style scoped>
.footer-container {
    border-top: 1px solid lightgray;
    width: 100%;
    background: #FFFFFF;
}

.email-view {
    font-size: 14px;
    font-weight: 400;
    color: #222840;
    line-height: 100px;
}

.block-logo-view {
    margin-top: 30px;
}
</style>
