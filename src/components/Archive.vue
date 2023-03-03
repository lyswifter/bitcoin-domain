<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

import data from "../router/data";

let state = reactive({ targetAddr: '', inscribeId: '', hash: '', process: 'NFT is Minting' })

onMounted(() => {
    if (localStorage.getItem("user_info")) {
        let val = JSON.parse(localStorage.getItem("user_info")!)
        state.targetAddr = val.receive_address;
    }

    if (localStorage.getItem('inscribe_id')) {
        state.inscribeId = localStorage.getItem('inscribe_id')!
    }

    // 

    data.queryMintState().then((val) => {
        console.log(val)

        if (val) {
            state.hash = val

            state.process = 'NFT Mint Finished'
        }
    })
})

</script>

<template>
    <div class="addr-container-view">
        <div class="addr-content-view">
            <img src="../assets/icon_success@2x.png" alt="" style="width: 80px;height: 80px;margin-top: 64px;">
            <div class="state-view">{{ state.process }}</div>

            <div class="m-content-view">
                <div class="m-title">
                    Minting to
                </div>
                <div class="m-content">
                    {{ state.targetAddr }}
                </div>

                <div class="m-title">
                    Inscription id
                </div>
                <div class="m-content">
                    {{ state.inscribeId }}
                </div>

                <div class="m-title">
                    Transaction hash
                </div>
                <div class="m-content">
                    {{ state.hash }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.addr-container-view {
    margin: 0 auto;
    width: 1200px;
    background: #1F2335;
    padding-top: 32px;
    height: 565px;
    border-right: 5px solid #32D9FA;
    border-bottom: 5px solid #32D9FA;
}

.addr-content-view {
    margin: 0 auto;
    width: 880px;
    text-align: center;
}

.m-content-view {
    width: 848px;
    padding-top: 16px;
    padding-left: 16px;
    padding-right: 16px;
    text-align: left;
    width: 880px;
    height: 187px;
    background: #161828;
    margin-top: 90px;
}

.state-view {
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 22px;
}

.m-title {
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 20px;
    margin-top: 16px;
}

.m-content {
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 17px;
}
</style>
