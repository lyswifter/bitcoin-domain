<script setup lang="ts">
import { ElLoading, ElMessage } from 'element-plus';
import { onMounted, reactive, ref, toRaw } from 'vue';

import service from "../router/service";
import { GasInfo, Types } from "../router/type";

import Decimal from 'decimal.js';
import { useRequest } from 'vue-request';

import { validate } from 'bitcoin-address-validation';

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
        registerFee: '',
        balance: '',
        total: '',
        years: 1,
    } as GasInfo,
    inputYears: 1,
    isAddrVisiable: false,
})

const histories = ref<string[]>([])

function handleChange(value: number) {
    state.info.years = value

    queryAction().then((val1) => {
        let g_fee = new Decimal(val1.data.gas_fee);
        let s_fee = new Decimal(val1.data.service_fee)
        let reg_fee = Decimal.add(g_fee, s_fee);

        state.info.gasFee = g_fee.toPrecision(Types.precision).toString();
        state.info.serviceFee = s_fee.toPrecision(Types.precision).toString();
        state.info.registerFee = reg_fee.toPrecision(Types.precision).toString();
    })
}

function nextStepAction() {
    if (!state.info.addr) {
        ElMessage.error("Receive address must not be empty")
        return
    }

    if (!validate(state.info.addr)) {
        ElMessage.error("Receive bitcoin address is not valid")
        return
    }

    if (state.info.addr.indexOf('bc1p') != -1) {
        if (state.info.addr.length == 62) {
            loadWallet()
        } else {
            ElMessage.error("Check the length of your Ordinals address");
            return
        }
    } else {
        state.isAddrVisiable = true
    }
}

function loadWallet() {
    let loadingInstance = ElLoading.service({ fullscreen: true });

    let localWalletStr = localStorage.getItem(state.info.name);

    if (!localWalletStr) {
        service.queryWallet(state.info.name).then((val1) => {
            state.info.midAddr = val1.data.receive_address;
            state.info.walletId = val1.data.wallet_id;

            localStorage.setItem(state.info.name, JSON.stringify(val1.data));

            lockFeeAndQueryBalance(loadingInstance)
        })
    } else {
        let localWallet = JSON.parse(localWalletStr);

        state.info.midAddr = localWallet.receive_address;
        state.info.walletId = localWallet.wallet_id;

        lockFeeAndQueryBalance(loadingInstance)
    }
}

function lockFeeAndQueryBalance(loadingIns: any) {
    service.lockFee(state.info.name, state.info.years, state.info.walletId).then(val4 => {
        service.queryBalance(state.info.walletId).then((val5) => {
            let g_fee = new Decimal(val4.data.gas_fee);
            let s_fee = new Decimal(val4.data.service_fee)
            let b_fee = new Decimal(val5.data.mine.trusted)

            let reg_fee = Decimal.add(g_fee, s_fee);
            let z = Decimal.sub(reg_fee, b_fee);

            state.info.gasFee = g_fee.toPrecision(Types.precision).toString();
            state.info.serviceFee = s_fee.toPrecision(Types.precision).toString();
            state.info.registerFee = reg_fee.toPrecision(Types.precision).toString();
            state.info.balance = b_fee.equals(0) ? "0" : b_fee.toPrecision(Types.precision).toString();
            state.info.total = z.toPrecision(Types.precision).toString();

            loadingIns.close()

            emit('continueAction', state.info)
        })
    })
}

const queryAction = async function () {
    return service.queryDomainFee(state.info.name, state.info.years)
}

function cancelAction() {
    state.isAddrVisiable = false
}

function confirmAction() {
    state.isAddrVisiable = false
    loadWallet()
}

const createFilter = (queryString: string) => {
    return (history: string) => {
        return (
            history.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
}

const querySearch = (queryString: string, cb: any) => {
    const results = queryString
        ? histories.value.filter(createFilter(queryString))
        : histories.value

    // call callback function to return suggestions

    cb(toRaw(results))
}

function handleSelect(item: string) {
    console.log(item)
}

onMounted(() => {
    state.info.name = props.domainName!
    state.info.isAvailable = props.isAvailable!

    let history = localStorage.getItem('receive_address_history')
    if (history) {
        histories.value = history.split(',')
    }

    let addr = localStorage.getItem('bitcoin_address')
    if (addr) {
        state.info.addr = addr
    }

    useRequest(queryAction, {
        pollingInterval: Types.queryBalInterval,
        pollingWhenHidden: false,
        onSuccess: val1 => {
            state.info.gasFee = val1.data.gas_fee.toPrecision(Types.precision);
            state.info.serviceFee = val1.data.service_fee.toPrecision(Types.precision);
            state.info.origin_service_fee = val1.data.origin_service_fee.toPrecision(Types.precision);

            let g_fee = new Decimal(state.info.gasFee);
            let s_fee = new Decimal(state.info.serviceFee)

            state.info.registerFee = Decimal.add(g_fee, s_fee).toString();
        }
    });
})
</script>

<template>
    <div class="order-container">
        <div class="state-view">
            <el-row justify="space-between">
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="s-name">NAME</span></el-col>
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="s-name">STATE</span></el-col>
            </el-row>

            <el-row justify="space-between">
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="3"><span class="t-name">{{ state.info.name }}</span></el-col>
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="t-name">{{ state.info.isAvailable ? 'Available'
                    : 'Unavailable'
                }}</span></el-col>
            </el-row>
        </div>

        <br>

        <div class="re-content-view">
            <el-row justify="space-between" style="height: 60px;">
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="3">
                    <div class="domain-name-view">{{ state.info.name }}</div>
                </el-col>
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="3">
                    <div class="detail-view">
                        Register
                    </div>
                </el-col>
            </el-row>

            <!-- STEP 1 -->
            <div class="step-title-view">STEP 1: Receive address</div>
            <div style="margin: 0 auto;">
                <div class="step-desc-view">Type your address to receive nft here(Note:this is an <a
                        href="https://ordinals.com" target="_blank">Ordinals</a> address)</div>
                <el-input v-model="state.info.addr"
                    placeholder="Type your address to receive the nft here, like: bc1p..." />

            </div>

            <!-- STEP 2 -->
            <div class="step-title-view">STEP 2: Register fee</div>
            <div style="margin: 0 auto;">
                <div class="step-desc-view">Registration Period (In years)</div>

                <el-input-number v-model="state.info.years" :min="1" :max="5" @change="handleChange" />
                <span class="tip-view"> Maximum 5 years</span>

                <div class="fee-view">
                    <el-row justify="space-between">
                        <el-col :xs="12" :sm="12" :md="10" :lg="10" :xl="10">
                            <div class="list-t-view" style="padding-bottom: 0px;">Gas Fee</div>
                            <div class="list-tip-view" style="padding-left: 20px;">The gas fee fluctuates and is updated
                                every 10 seconds.</div>
                        </el-col>
                        <el-col :xs="12" :sm="10" :md="8" :lg="5" :xl="5" style="text-align: right;">
                            <div class="owner-view">{{ state.info.gasFee + " BTC" }}</div>
                        </el-col>
                    </el-row>

                    <el-row justify="space-between">
                        <el-col :xs="12" :sm="12" :md="10" :lg="10" :xl="10">
                            <div class="list-t-view">Service Fee</div>
                        </el-col>
                        <el-col :xs="12" :sm="10" :md="8" :lg="5" :xl="5" style="text-align: right;">
                            <div class="owner-view" style="text-decoration: line-through;">{{ state.info.origin_service_fee + " BTC" }}</div>
                        </el-col>
                    </el-row>

                    <el-row justify="space-between">
                        <el-col :xs="12" :sm="12" :md="10" :lg="10" :xl="10">
                            <div>
                                <img src="../assets/sale@2x.png" alt="" width="162" height="28" style="margin-left: 20px;margin-top: 15px;">
                            </div>
                        </el-col>
                        <el-col :xs="12" :sm="10" :md="8" :lg="5" :xl="5" style="text-align: right;">
                            <div class="owner-view">{{ state.info.serviceFee + " BTC" }}</div>
                        </el-col>
                    </el-row>

                    <div class="line-view"></div>

                    <el-row justify="space-between">
                        <el-col :xs="12" :sm="12" :md="10" :lg="10" :xl="10">
                            <div class="total-list-t-view" style="padding-left: 20px;">Total Register Fee</div>
                        </el-col>
                        <el-col :xs="12" :sm="10" :md="8" :lg="5" :xl="5" style="text-align: right;padding-right: 10px;">
                            <div class="total-fee-view">{{ state.info.registerFee + " BTC" }}</div>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div style="margin: 0 auto;margin-top: 40px;width: 100%;margin-bottom: 50px;cursor: pointer;">
                <div class="continue-view" @click="nextStepAction">Next Step</div>
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
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 40px;
    padding-left: 10px;
    padding-right: 10px;
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
    width: 100%;
    margin-top: 5px;
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
    margin-top: 20px;
    padding-bottom: 20px;
    background: #FFFFFF;
    box-shadow: 0px 10px 24px 0px rgba(16, 38, 92, 0.1);
    border-radius: 8px;
    border: 1px solid #4540D6;
}

.list-t-view {
    padding: 20px;
    color: #2E2F3E;
}

.list-tip-view {
    font-size: 14px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 20px;
}

.total-list-t-view {
    color: #2E2F3E;
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

<!-- <style scoped>
:deep(.addr-input-view .el-input .el-input__wrapper) {
    max-width: 1120px;
    min-width: 350px;
}
</style> -->
