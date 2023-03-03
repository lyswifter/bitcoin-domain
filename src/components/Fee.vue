<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

import data from "../router/data";

const emit = defineEmits({
    updateTab(idx: number) {
        return idx >= 0 && idx < 4
    }
})

let state = reactive({
    recommendedFee: 0,
    gasFee: 0,
    address: '',
    bal: 0,
})

function continueAction() {
    emit('updateTab', 2)
}

onMounted(() => {
    data.queryFeeAction().then((val) => {
        state.recommendedFee = val.recommended_fee
        state.gasFee = val.estimate_gas
        state.address = val.receive_address
        state.bal = val.current_balance
    })
})
</script>

<template>
    <div class="fee-container-view">
        <div class="fee-content-view">
            <div class="title-view">
                Current recommended fee {{ state.recommendedFee }}
            </div>

            <div class="tfee-view">
                <div class="title-view">Transaction fee:</div>
                <div class="gas-view">Total gas fee:{{ state.gasFee }} BTC</div>
                <div class="fee-view">{{ state.gasFee }} BTC</div>
                <div class="desc-view">Tranfer {{state.gasFee}} BTC to the following address to mint</div>
            </div>

            <div class="bal-view">
                <div class="addr-view">
                    <img src="../assets/icon_24_trens@2x.png" style="width: 24px;height: 24px;" alt="">
                    <span>{{ state.address }}</span>
                </div>

                <div class="val-view">
                    <div class="cur-bal-view">Current balance <span>{{ state.bal }} BTC</span></div>
                    <div class="cur-desc-view">
                        <img src="../assets/icon_16_tips@2x.png" style="width: 16px;height: 16px;" alt="">
                        Refresh will change the receive address, if you already sent BTC to previous address, balance will
                        change in a few minutes, don't worry.
                    </div>
                </div>
            </div>

            <div class="continue-view" @click="continueAction">
                Continue
            </div>
        </div>
    </div>
</template>

<style scoped>
.fee-container-view {
    margin: 0 auto;
    width: 1200px;
    background: #1F2335;
    padding-top: 32px;
    padding-bottom: 32px;
    height: 565px;
    border-right: 5px solid #32D9FA;
    border-bottom: 5px solid #32D9FA;
}

.fee-content-view {
    margin: 0 auto;
    width: 880px;
}

.title-view {
    width: 100%;
    height: 48px;
    background: #161828;
    font-size: 16px;
    font-weight: 300;
    color: #FFFFFF;
    line-height: 48px;
}

.tfee-view {
    height: 168px;
    background: #161828;
    border: 2px solid #FFFFFF;
    padding-left: 16px;
}

.tfee-view .title-view {
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 22px;
    margin-top: 16px;
}

.tfee-view .gas-view {
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 17px;
    margin-top: 4px;
}

.tfee-view .fee-view {
    height: 45px;
    font-size: 32px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 45px;
    margin-top: 16px;
}

.tfee-view .desc-view {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 20px;
    margin-top: 4px;
}

.bal-view {
    height: 141px;
    background: #161828;
    padding: 16px;
    margin-top: 8px;
}

.addr-view img {
    vertical-align: middle;
}

.addr-view span {
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 22px;
}

.val-view {
    height: 69px;
    background: #1F2335;
    margin-top: 17px;
}

.cur-bal-view {
    height: 20px;
    font-size: 14px;
    font-weight: 300;
    color: #FFFFFF;
    line-height: 20px;
    padding-top:17px;;
    padding-left: 17px;
    padding-right: 17px;
}

.cur-bal-view span {
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 20px;
}

.cur-desc-view {
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 17px;
}

.cur-desc-view img {
    vertical-align: middle;
}
</style>
