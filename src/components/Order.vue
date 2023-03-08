<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted, reactive } from 'vue';

import service from "../router/service";
import { GasInfo } from "../router/type";

import Decimal from 'decimal.js';

const props = defineProps({
    domainName: String,
    isAvailable: Boolean,
})

const emit = defineEmits({
    continueAction(info: GasInfo) { },
})

let state = reactive({
    info: {
        name: '',
        isAvailable: false,
        addr: '',
        midAddr: '',
        gasFee: '',
        serviceFee: '',
        balance: '',
        total: '',
        years: 1,
    } as GasInfo,
    inputYears: 1,
    isAddrVisiable: false,
})

function handleChange(value: number) {
    state.inputYears = value
    queryAction()
}

function continueAction() {
    if (!state.info.addr) {
        ElMessage.error("Receive address must not be empty")
        return
    }

    if (state.info.addr.indexOf(" ") != -1) {
        ElMessage.error("Receive address format is not correct")
        return
    }

    if (state.info.addr.indexOf('bc1p') != -1) {
        if (state.info.addr.length == 62) {
            state.info.years = state.inputYears
            emit('continueAction', state.info)
        } else {
            ElMessage.error("Check the length of your Ordinals address");
            return
        }
    } else {
        state.isAddrVisiable = true
    }
}

function queryAction() {
    service.queryDomainFee(state.info.name, state.inputYears).then((val1) => {
        state.info.gasFee = val1.data.gas_fee.toPrecision(4);
        state.info.serviceFee = val1.data.service_fee.toPrecision(4);

        let o = new Decimal(state.info.gasFee);
        let y = new Decimal('0.0001');
        let g_fee = Decimal.add(o, y);
        let s_fee = new Decimal(state.info.serviceFee)

        state.info.gasFee = g_fee.toString();
        state.info.total = Decimal.add(g_fee, s_fee).toString();

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
}

function queryBal(walletId: string) {
    service.queryBalance(walletId).then((val3) => {
        state.info.balance = val3.data.mine.trusted > 0 ? val3.data.mine.trusted : "0"

        let x = new Decimal(state.info.total ? state.info.total : 0)
        let y = new Decimal(state.info.balance ? state.info.balance : 0)
        let z = Decimal.sub(x, y);
        state.info.total = z.toString();
    })
}

onMounted(() => {
    state.info.name = props.domainName!
    state.info.isAvailable = props.isAvailable!

    queryAction()
})

function cancelAction() {
    state.isAddrVisiable = false
}

function confirmAction() {
    state.isAddrVisiable = false

    state.info.years = state.inputYears

    emit('continueAction', state.info)
}
</script>

<template>
    <div class="order-container">
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
                <div class="step-desc-view">Type your address to receive nft here (Note: this is an <a
                        href="https://ordinals.com" target="_blank">Ordinals</a> address)</div>
                <el-input class="addr-input-view" v-model="state.info.addr"
                    placeholder="Type your address to receive the nft here, like: bc1p..." clearable="true" size="large" />
            </div>

            <!-- STEP 2 -->
            <div class="step-title-view">STEP 2: Register fee</div>
            <div style="width: 1120px;margin: 0 auto;">
                <div class="step-desc-view">Registration Period (In years)</div>

                <el-input-number v-model="state.inputYears" :min="1" :max="5" @change="handleChange" />
                <span class="tip-view"> Maximum 5 years</span>

                <div class="fee-view">
                    <el-row justify="space-between">
                        <el-col :span="4">
                            <div class="list-t-view">Gas Fee</div>
                        </el-col>
                        <el-col :span="5">
                            <div class="owner-view">{{ state.info.gasFee + " BTC" }}</div>
                        </el-col>
                    </el-row>

                    <el-row justify="space-between">
                        <el-col :span="4">
                            <div class="list-t-view">Service Fee</div>
                        </el-col>
                        <el-col :span="5">
                            <div class="owner-view">{{ state.info.serviceFee + " BTC" }}</div>
                        </el-col>
                    </el-row>

                    <el-row justify="space-between">
                        <el-col :span="15">
                            <div class="list-t-view" style="padding-bottom: 0px;">Current Balance</div>
                            <div class="list-tip-view" style="padding-left: 20px;">Please do not send us more BTC than the
                                displayed amount. If you accidentally send a larger amount, submit a request for a refund by
                                email.</div>
                        </el-col>
                        <el-col :span="5">
                            <div class="owner-view">{{ state.info.balance + " BTC" }}</div>
                        </el-col>
                    </el-row>

                    <div class="line-view"></div>

                    <el-row justify="space-between">
                        <el-col :span="6">
                            <div class="total-list-t-view" style="padding-left: 20px;">Total Register Fee</div>
                            <div class="list-tip-view" style="padding-left: 20px;">Gas fee + service fee - current balance
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div class="total-fee-view">{{ state.info.total + " BTC" }}</div>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div style="margin: 0 auto;margin-top: 40px;width: 100%;margin-bottom: 50px;cursor: pointer;">
                <div class="continue-view" @click="continueAction">Continue</div>
            </div>

        </div>

        <el-dialog v-model="state.isAddrVisiable" :show-close="true" align-center="true" :width="440">
            <div style="text-align: center;">
                <div style="font-size: 18px;font-weight: 600;color: #A7A9BE;line-height: 25px;text-align: left;">This seems
                    not an Ordinals NFT address, do you want to continue?</div>
                <br>
                <el-row gutter="20">
                    <el-col :span="12">
                        <div style="height: 49px;background: white;border-radius: 8px;border: 1px solid blueviolet; font-size: 16px;font-weight: 600;color: blueviolet;line-height: 50px;text-align: center;cursor: pointer;"
                            @click="cancelAction">Cancel</div>
                    </el-col>
                    <el-col :span="12">
                        <div style="height: 50px;background: #2E2F3E;border-radius: 8px;font-size: 16px;border: 1px solid #2E2F3E;font-weight: 600;color: white;line-height: 50px;text-align: center;cursor: pointer;"
                            @click="confirmAction">OK</div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.order-container {
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
    color: white;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 600;
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
    color: #2E2F3E;
}

.total-list-t-view {
    color: #2E2F3E;
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
    color: #2E2F3E;
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
