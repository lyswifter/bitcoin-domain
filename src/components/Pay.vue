<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from "element-plus";

import service from "../router/service";
import { GasInfo, DomainHistory } from "../router/type";

import useClipboard from "vue-clipboard3";

const props = defineProps({
    domainName: String,
    isAvailable: Boolean,
    gasInfo: {},
})

const emit = defineEmits({
    backAction() { },
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

    toClipboard.toClipboard(state.info.addr).then((val) => {
        ElMessage.info("copied")
    })
}

function conformAction() {
    service.queryConfirm(state.info.name, state.info.addr, state.info.years).then((val) => {
        console.log(val)
        if (val.code == 0) {
            ElMessage.info("I have transfered!");

            let localHistory = localStorage.getItem("domain_history");
            if (!localHistory) {
                return
            }

            let localItems: DomainHistory = JSON.parse(localHistory)
            localItems.records.push(state.info.name)

            localStorage.setItem("domain_history", JSON.stringify(localItems))

            // update local storage finished
            //
            //
        } else if (val.code == 314) {
            state.isPaymentVisiable = true
        }
    })
}

function dismissAction() {
    state.isPaymentVisiable = false
}

onMounted(() => {
    state.info = props.gasInfo as GasInfo
})

</script>

<template>
    <div class="pay-container">
        <div class="state-view">
            <el-row justify="space-between">
                <el-col :span="2"><span class="s-name">NAME</span></el-col>
                <el-col :span="2"><span class="s-name">STATE</span></el-col>
            </el-row>

            <el-row justify="space-between">
                <el-col :span="3">{{ state.info.name }}</el-col>
                <el-col :span="2"> {{ state.info.isAvailable ? 'Available' : 'Unavailable' }} </el-col>
            </el-row>
        </div>

        <br>

        <div class="pay-content-view">
            <div class="back-view" @click="backAction">
                <img src="../assets/icon_back@2x.png" style="width: 24px;height: 24px;" alt="">
                Back
            </div>

            <div class="tran-fee-title">Transaction fee</div>

            <br>

            <el-row justify="space-between">
                <el-col :span="2">支付金额</el-col>
                <el-col :span="4">{{ state.info.total + ' BTC' }}</el-col>
            </el-row>

            <div class="qrcode-view">
                <vue-qrcode :value="state.info.addr" :options="{ width: 200 }"></vue-qrcode>

                <el-row justify="center">
                    <el-col :span="6">
                        <div class="fee-tip-view">Transfer to the specified wallet address</div>
                        <div style="width: 338px;color: #2E2F3E;margin: 0 auto;word-wrap: break-word;text-align: left;">{{
                            state.info.addr }} </div>
                    </el-col>
                    <el-col :span="2">
                        <img src="../assets/icon_copy@2x.png"
                            style="width: 32px;height: 32px;cursor: pointer;margin-top: 20px;" alt="" @click="copyAction">
                    </el-col>
                </el-row>

                <div class="conform-view" @click="conformAction">I have transferred</div>

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

.pay-content-view {}

.back-view {
    height: 28px;
    font-size: 20px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 28px;
    cursor: pointer;
}

.qrcode-view {
    margin-top: 20px;
    text-align: center;
}

.fee-tip-view {
    width: 223px;
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 17px;
    text-align: left;
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
