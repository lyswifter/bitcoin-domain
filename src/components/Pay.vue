<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onBeforeMount, onMounted, onUnmounted, reactive } from 'vue';

import service from "../router/service";
import { GasInfo, Types } from "../router/type";

import Decimal from 'decimal.js';
import useClipboard from "vue-clipboard3";
import { event } from "vue-gtag";
import { useRequest } from 'vue-request';

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
    info: {
        name: '',
        isAvailable: false,
        addr: '',
        midAddr: '',
        gasFee: '',
        serviceFee: '',
        registerFee: '',
        balance: '',
        total: '',
        years: 1,
    } as GasInfo,
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

onBeforeMount(() => {
    state.info = props.gasInfo! as GasInfo
    
    window.addEventListener('beforeunload', e => unload(e) )
})

function unload(e: Event) {
    unloadWallet()
}

onMounted(() => {
    useRequest(updateBalance, {
        pollingInterval: Types.queryBalInterval,
        pollingWhenHidden: false,
        onSuccess: val1 => {
            let s_fee = new Decimal(state.info.registerFee)
            let b_fee = new Decimal(val1.data.mine.trusted)
            state.info.total = Decimal.sub(s_fee, b_fee).toPrecision(Types.precision).toString();
        }
    });
})

onUnmounted(() => {
    unloadWallet()
})

function unloadWallet() {
    let localWalletStr = localStorage.getItem(state.info.name);
    if (localWalletStr) {
        let localWallet = JSON.parse(localWalletStr);
        service.leavePage(localWallet.wallet_id).then(val => {
            console.log(val.data)
        })
    }
}

function updateBalance() {
    return service.queryBalance(state.info.walletId)
}

</script>

<template>
    <div class="pay-container">
        <div class="state-view">
            <el-row justify="space-between">
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="s-name">NAME</span></el-col>
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="s-name">STATE</span></el-col>
            </el-row>

            <el-row justify="space-between">
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="3"><span class="t-name">{{ state.info.name }}</span></el-col>
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="t-name">{{ state.info.isAvailable ? 'Available' : 'Unavailable'
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
                <el-col :xs="14" :sm="12" :md="10" :lg="10" :xl="10" class="list-t-view">Register Fee</el-col>
                <el-col :xs="10" :sm="8" :md="6" :lg="5" :xl="5" class="owner-view">{{ state.info.registerFee + ' BTC' }}</el-col>
            </el-row>

            <el-row justify="space-between">
                <el-col :xs="14" :sm="12" :md="10" :lg="10" :xl="10">
                    <div class="list-t-view">Current Balance</div>
                </el-col>
                <el-col :xs="10" :sm="8" :md="6" :lg="5" :xl="5">
                    <div class="owner-view">{{ state.info.balance + " BTC" }}</div>
                </el-col>
            </el-row>

            <div class="line-view"></div>

            <el-row justify="space-between">
                <el-col :xs="14" :sm="12" :md="10" :lg="10" :xl="10">
                    <div class="list-t-view">Final Payment</div>
                    <div class="list-tip-view" style="padding-left: 20px;">Total Register Fee - Current Balance</div>
                </el-col>
                <el-col :xs="10" :sm="8" :md="6" :lg="5" :xl="5">
                    <div class="owner-view">{{ state.info.total + " BTC" }}</div>
                </el-col>
            </el-row>

            <div class="qrcode-view">
                <vue-qrcode :value="state.info.midAddr" :options="{ width: 200 }"></vue-qrcode>

                <el-row justify="center">
                    <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
                        <div class="fee-tip-view">Transfer to the specified wallet address</div>
                        <div style="color: #2E2F3E;margin: 0 auto;word-wrap: break-word;text-align: left;">{{
                            state.info.midAddr }} </div>
                    </el-col>
                    
                    <el-col :xs="4" :sm="3" :md="2" :lg="2" :xl="2">
                        <img src="../assets/icon_copy@2x.png"
                            style="width: 32px;height: 32px;cursor: pointer;margin-top: 20px;" alt="" @click="copyAction">
                    </el-col>
                </el-row>

                <div class="conform-view" @click="conformAction">Next Step</div>

                <div class="note-view"><img src="../assets/icon_16_tips@2x.png"
                        style="width: 16px;vertical-align: middle;word-wrap: break-word;" alt="">
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
    max-width: 1200px;
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
    color: #2E2F3E;
}

.owner-view {
    color: #2E2F3E;
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
    margin-top: 20px;
    width: 80%;
    max-width: 388px;
    font-size: 14px;
    font-weight: 400;
    color: #2E2F3E;
    line-height: 20px;
    text-align: left;
    margin-bottom: 60px;
}
</style>
