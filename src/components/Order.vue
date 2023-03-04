<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from "element-plus";

import data from "../router/data";

interface GasInfo {
    name: string;
    isAvailable: boolean;
    addr: string;
    gasFee: string;
    serviceFee: string;
    balance: string;
    total: string
}

let state = reactive({
    info: {
        name: "BTCDomino.btc",
        isAvailable: true,
        addr: "tb1p2rvyyezqnxfktlm773rzxglask07j730jar90ql99fpstwwl4uqt88888",
        gasFee: "0.00050400 BTC",
        serviceFee: "0.00050400 BTC",
        balance: "- 0.01467324 BTC",
        total: "0.00050400 BTC",
    } as GasInfo,
    inputAddr: '',
    inputYears: 1,
})

function handleChange(value: number) {
    console.log(value)
}

function continueAction() {
    console.log("continue action")
}

onMounted(() => {
})
</script>

<template>
    <div class="registeried-container">
        <div class="state-view">
            <el-row justify="space-between">
                <el-col :span="2">NAME</el-col>
                <el-col :span="2">STATE</el-col>
            </el-row>

            <el-row justify="space-between">
                <el-col :span="3">{{ state.info.name }}</el-col>
                <el-col :span="2"> {{ state.info.isAvailable ? 'Available' : 'Unavailable' }} </el-col>
            </el-row>
        </div>

        <br>

        <div class="re-content-view">
            <el-row justify="space-between" style="height: 60px;">
                <el-col :span="3">
                    <div class="domain-name-view">{{ state.info.name }}</div>
                </el-col>
                <el-col :span="3">
                    <div class="detail-view">
                        Register
                    </div>
                </el-col>
            </el-row>

            <!-- STEP 1 -->
            <div class="step-title-view">STEP 1: Receive address</div>
            <div style="width: 1120px;margin: 0 auto;">
                <div class="step-desc-view">Type your address to receive the nft here:</div>
                <el-input class="addr-input-view" v-model="state.inputAddr" placeholder="Please input" />
            </div>

            <!-- STEP 2 -->
            <div class="step-title-view">STEP 2: Regist fee</div>
            <div style="width: 1120px;margin: 0 auto;">
                <div class="step-desc-view">Registration Period (In years)</div>

                <el-input-number v-model="state.inputYears" :min="1" :max="5" @change="handleChange" />
                <span class="tip-view"> Maximum 5 years</span>

                <div class="fee-view">
                    <el-row justify="space-between">
                        <el-col :span="4">
                            <div class="list-t-view">Gas Fee</div>
                        </el-col>
                        <el-col :span="4">
                            <div class="owner-view">{{ state.info.gasFee }}</div>
                        </el-col>
                    </el-row>

                    <el-row justify="space-between">
                        <el-col :span="4">
                            <div class="list-t-view">Service Fee</div>
                        </el-col>
                        <el-col :span="4">
                            <div class="owner-view">{{ state.info.serviceFee }}</div>
                        </el-col>
                    </el-row>

                    <el-row justify="space-between">
                        <el-col :span="4">
                            <div class="list-t-view">Current Balance</div>
                        </el-col>
                        <el-col :span="4">
                            <div class="owner-view">{{ state.info.balance }}</div>
                        </el-col>
                    </el-row>

                    <div class="line-view"></div>

                    <el-row justify="space-between">
                        <el-col :span="6">
                            <div class="total-list-t-view" style="padding-left: 20px;">Total Register Fee</div>
                            <div class="list-tip-view" style="padding-left: 20px;">Gas fee + service fee - current balance
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="total-fee-view">{{ state.info.total }}</div>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div style="margin: 0 auto;margin-top: 40px;width: 100%;margin-bottom: 50px;">
                <div class="continue-view" @click="continueAction">Continue</div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.registeried-container {
    width: 1200px;
    margin: 0 auto;
    margin-top: 40px;
}

.state-view {
    padding-top: 5px;
    padding-bottom: 5px;
}

.domain-name-view {
    height: 28px;
    font-size: 20px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 28px;
}

.detail-view {
    height: 40px;
    background: #4540D6;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 40px;
    text-align: center;
}

.line-view {
    margin-top: 25px;
    margin-bottom: 25px;
    border-bottom: 1px dashed #A7A9BE;
}

.addr-input-view {
    margin-top: 5px;
    width: 100%;
}

.step-title-view {
    margin-top: 20px;
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 22px;
}

.step-desc-view {
    margin-top: 20px;
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #A7A9BE;
    line-height: 20px;
}

.tip-view {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 20px;
}

.fee-view {
    margin: 0 auto;
    margin-top: 10px;
    width: 1120px;
    height: 326px;
    background: #FFFFFF;
    box-shadow: 0px 10px 24px 0px rgba(16, 38, 92, 0.1);
    border-radius: 8px;
    border: 1px solid #4540D6;
}

.list-t-view {
    padding: 20px;
}

.list-tip-view {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 20px;
}

.owner-view {
    display: block;
    padding: 20px;
}

.total-fee-view {
    height: 33px;
    font-size: 24px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 33px;
}

.continue-view {
    width: 380px;
    height: 50px;
    background: #4540D6;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 50px;
}
</style>
