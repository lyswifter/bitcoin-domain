<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from "element-plus";

import data from "../router/data";

let state = reactive({ input: '', isMintAble: false, isMinting: false, inscriptId: '', targetAddr: '' })

function mintAction() {
    if (state.isMintAble) {
        if (state.input.length == 0) {
            ElMessage({
                message: "Address is needed.",
                type: "warning",
            });
            return
        }

        // format check

        state.isMinting = true

        data.mintAction(state.input).then((val) => {
            console.log(val)
            state.isMinting = true
            state.inscriptId = val

            localStorage.setItem("inscribe_id", state.inscriptId)
        })
    } else {
        // no bale to mint
        ElMessage({
            message: "Address is needed.",
            type: "warning",
        });
        return
    }
}

function inputChange(value: string | number) {
    if (value) {
        state.isMintAble = true
    } else {
        state.isMintAble = false
    }
}

onMounted(() => {
    if (localStorage.getItem("user_info")) {
        let val = JSON.parse(localStorage.getItem("user_info")!)
        state.targetAddr = val.receive_address;
        state.input = state.targetAddr
    }

    if (localStorage.getItem('inscribe_id')) {
        state.inscriptId = localStorage.getItem('inscribe_id')!
    }

    // 

    data.queryMintState().then((val) => {
        console.log(val)

        if (!val) {
            state.isMinting = true
        }
    })
})
</script>

<template>
    <div class="addr-container-view">
        <div class="addr-content-view">
            <div class="title-view">Gas fee is received, type your address to receive the nft here:</div>
            <el-input v-model="state.input" placeholder="Please input address" class="input-view" @change="inputChange" />
            <div class="mint-btn-disable" :class="state.isMintAble ? 'mint-btn-able' : 'mint-btn-disable'"
                @click="mintAction">Mint</div>

            <div class="m-info-view" v-if="state.isMinting">
                <div class="m-title-view">After the mint, NFT will be transfered to your provided bc address, <span>don't
                        refresh now</span></div>

                <img src="https://dmaster.com/dcommon/img/loading.svg" alt=""
                    style="width: 32px;height: 32px;margin-top: 24px;margin-bottom: 24px;">

                <div class="m-content-view">
                    <div class="m-to-title">
                        Minting to
                    </div>
                    <div class="m-to-content">
                        {{ state.input ? state.input : state.targetAddr }}
                    </div>

                    <div class="m-insp-title">
                        Inscription id
                    </div>
                    <div class="m-insp-content">
                        {{ state.inscriptId }}
                    </div>
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
}

.title-view {
    width: 533px;
    height: 25px;
    font-size: 18px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 25px;
}

.input-view {
    width: 880px;
    height: 48px;
    border-radius: 4px;
    border: 1px solid #7E86A8;
    margin-top: 16px;
}

.mint-btn-disable {
    width: 880px;
    height: 48px;
    background: #161828;
    border-radius: 4px;
    margin-top: 24px;
    text-align: center;
    line-height: 48px;
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
}

.mint-btn-able {
    width: 880px;
    height: 48px;
    background: #32D9FA;
    border-radius: 4px;
    border: 2px solid #FFFFFF;
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 48px;
}

.m-info-view {
    width: 880px;
    height: 264px;
    background: #161828;
    margin-top: 44px;
    padding: 17px;
    text-align: center;
}

.m-title-view {
    width: 848px;
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 22px;
}

.m-title-view span {
    color: #32D9FA;
}

.m-content-view {
    width: 848px;
    height: 130px;
    background: #1F2335;
    padding-top: 16px;
    padding-left: 16px;
    padding-right: 16px;
    text-align: left;
}

.m-to-title {
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 20px;
}

.m-to-content {
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 17px;
}

.m-insp-title {
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 20px;
    margin-top: 16px;
}

.m-insp-content {
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 17px;
}
</style>
