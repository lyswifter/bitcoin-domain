<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted, reactive } from 'vue';

import service from "../router/service";
import { GasInfo } from "../router/type";

import Decimal from 'decimal.js';
import useClipboard from "vue-clipboard3";

import { event } from "vue-gtag";

const props = defineProps({
    domainName: String,
    isAvailable: Boolean,
    gasInfo: {},
})

const emit = defineEmits({
    backAction() { },
    toProcessing(info: GasInfo) { },
})

let state = reactive({
    info: {} as GasInfo,
    isPaymentVisiable: false,
})

function backAction() {
    emit('backAction')
}

function copyAction() {
    const toClipboard = useClipboard();
    toClipboard.toClipboard(state.info.midAddr).then((val) => {
        ElMessage.info("copied")
    })
}

function conformAction() {
    service.queryConfirm(state.info.name, state.info.addr, state.info.years, state.info.walletId).then((val) => {
        if (val.code == 0) {
            ElMessage.info("I have transfered!");

            let localHistory = localStorage.getItem("domain_history");
            if (!localHistory) {
                localStorage.setItem("domain_history", state.info.name)
            } else {
                localStorage.setItem("domain_history", localHistory + "," + state.info.name)
            }

            // update local storage finished
            //
            //
            event('payment', { method: 'Google' })

            emit('toProcessing', state.info)
        } else if (val.code == 314) {
            state.isPaymentVisiable = true
        } else if (val.code == 315) {
            emit('toProcessing', state.info)
        }
    })
}

function dismissAction() {
    state.isPaymentVisiable = false
}

onMounted(() => {
    state.info = props.gasInfo as GasInfo

    let localWalletStr = localStorage.getItem(state.info.name);

    if (!localWalletStr) {
        service.queryWallet(state.info.name).then((val2) => {
            state.info.midAddr = val2.data.receive_address;
            state.info.walletId = val2.data.wallet_id;

            localStorage.setItem(state.info.name, JSON.stringify(val2.data));

            queryBal(val2.data.wallet_id)
        })
    } else {
        let localWallet = JSON.parse(localWalletStr);

        state.info.midAddr = localWallet.receive_address;
        state.info.walletId = localWallet.wallet_id;

        queryBal(localWallet.wallet_id)
    }
})

function queryBal(walletId: string) {
    service.queryBalance(walletId).then((val3) => {
        state.info.balance = val3.data.mine.trusted > 0 ? val3.data.mine.trusted : "0"

        let x = new Decimal(state.info.registerFee ? state.info.registerFee : 0)
        let y = new Decimal(state.info.balance ? state.info.balance : 0)
        let z = Decimal.sub(x, y);

        state.info.total = z.toString();
    })
}

</script>

<template>
    <div class="pay-container">
        <div class="state-view">
            <el-row justify="space-between">
                <el-col :span="2"><span class="s-name">NAME</span></el-col>
                <el-col :span="2"><span class="s-name">STATE</span></el-col>
            </el-row>

            <el-row justify="space-between">
                <el-col :span="3"><span class="t-name">{{ state.info.name }}</span></el-col>
                <el-col :span="2"><span class="t-name">{{ state.info.isAvailable ? 'Available' : 'Unavailable'
                }}</span></el-col>
            </el-row>
        </div>

        <br>

        <div class="pay-content-view">
            <div class="back-view" @click="backAction">
                <img src="../assets/icon_back@2x.png" style="width: 24px;height: 24px;" alt="">
                Back
            </div>

            <div class="tran-fee-title"><span style="color: #4540D6;">&#9679; </span>Transaction fee</div>

            <br>

            <el-row justify="space-between">
                <el-col :span="4" class="list-t-view">Register Fee</el-col>
                <el-col :span="3">{{ state.info.registerFee + ' BTC' }}</el-col>
            </el-row>

            <el-row justify="space-between">
                <el-col :span="4">
                    <div class="list-t-view">Current Balance</div>
                </el-col>
                <el-col :span="3">
                    <div class="owner-view">{{ state.info.balance + " BTC" }}</div>
                </el-col>
            </el-row>

            <div class="line-view"></div>

            <el-row justify="space-between">
                <el-col :span="6">
                    <div class="list-t-view">Final Payment</div>
                    <div class="list-tip-view" style="padding-left: 20px;">Gas fee + service fee - current balance</div>
                </el-col>
                <el-col :span="3">
                    <div class="owner-view">{{ state.info.total + " BTC" }}</div>
                </el-col>
            </el-row>

            <div class="qrcode-view">
                <vue-qrcode :value="state.info.midAddr" :options="{ width: 200 }"></vue-qrcode>

                <el-row justify="center">
                    <el-col :span="7">
                        <div class="fee-tip-view">Transfer to the specified wallet address</div>
                        <div style="width: 338px;color: #2E2F3E;margin: 0 auto;word-wrap: break-word;text-align: left;">{{
                            state.info.midAddr }} </div>
                    </el-col>
                    <el-col :span="2">
                        <img src="../assets/icon_copy@2x.png"
                            style="width: 32px;height: 32px;cursor: pointer;margin-top: 20px;" alt="" @click="copyAction">
                    </el-col>
                </el-row>

                <div class="conform-view" @click="conformAction">Next Step</div>

                <div class="note-view"><img src="../assets/icon_16_tips@2x.png"
                        style="width: 16px;height: 16px;vertical-align: middle;" alt="">
                    The domain name will belong to the person who has the priority to complete the transfer. If the transfer
                    amount is incorrect, please contact us by email.
                </div>
            </div>
        </div>
    </div>

    <el-dialog v-model="state.isPaymentVisiable" :show-close="true" align-center="true" :width="440">
        <div style="text-align: center;">
            <img src="../assets/icon_oops@2x.png" style="width: 220px;height: 220px;" alt="">
            <div style="font-size: 18px;font-weight: 600;color: #A7A9BE;line-height: 25px;text-align: center;">No payment
                detected</div>
            <br>
            <div style="width: 400px;height: 50px;background: #2E2F3E;border-radius: 8px;font-size: 16px;font-weight: 600;color: white;line-height: 50px;text-align: center;cursor: pointer;"
                @click="dismissAction">OK</div>
        </div>
    </el-dialog>
</template>

<style scoped>
.pay-container {
    width: 1200px;
    margin: 0 auto;
    margin-top: 40px;
}

.state-view {
    padding-top: 5px;
    padding-bottom: 5px;
}

.back-view {
    height: 28px;
    font-size: 20px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 24px;
    cursor: pointer;
    vertical-align: middle;
}

.qrcode-view {
    margin-top: 20px;
    text-align: center;
}

.fee-tip-view {
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 17px;
    text-align: left;
}

.tran-fee-title {
    margin-top: 50px;
}

.line-view {
    margin-top: 20px;
    margin-bottom: 20px;
    border-bottom: 1px dashed #A7A9BE;
}

.list-t-view {
    padding-top: 5px;
    padding-left: 20px;
    font-weight: 600;
    color: #2E2F3E;
}

.list-tip-view {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 20px;
}

.conform-view {
    margin: 0 auto;
    margin-top: 40px;
    width: 380px;
    height: 50px;
    background: #4540D6;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 50px;
    cursor: pointer;
}

.note-view {
    margin: 0 auto;
    margin-top: 40px;
    width: 588px;
    height: 40px;
    font-size: 14px;
    font-weight: 400;
    color: #2E2F3E;
    line-height: 20px;
    text-align: left;
    margin-bottom: 60px;
}
</style>
