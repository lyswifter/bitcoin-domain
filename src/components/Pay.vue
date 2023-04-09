<script setup lang="ts">
import Decimal from 'decimal.js';
import { ElMessage } from "element-plus";
import { ethers } from "ethers";
import { onBeforeMount, onMounted, onUnmounted, reactive } from 'vue';
import useClipboard from "vue-clipboard3";
import { event } from "vue-gtag";
import { useRequest } from 'vue-request';
import { domain } from "../router/domain";
import service from "../router/service";
import { GasInfo, PayParams, PayinParams, PaymentMethod, Types } from "../router/type";

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
        switchAddr: '',
        switchCurr: '',
    } as GasInfo,
    isPaymentVisiable: false,
    payment: {
        methods: [] as PaymentMethod[],
        curIdx: 0,
        exchangeRet: {} as PayinParams,
        countDown: 1200,
        countText: '20:00',
        timer1: 0,
        timer2: 0,
    }
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

async function tiggerMetamaskAction() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts)

    let value = state.payment.exchangeRet.fromAmount.toString();
    console.log(value)

    let weivalue = ethers.parseUnits(value, "ether");
    console.log(weivalue)

    let vvlll = ethers.parseEther(value);
    console.log(vvlll)

    let weiStr = weivalue.toString(16);
    console.log(weiStr)

    let txHash = await window.ethereum
        .request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: accounts[0],
                    to: state.payment.exchangeRet.payinAddress,
                    value: weiStr,
                    gasPrice: '',
                    gas: '',
                },
            ],
        })

    console.log(txHash)

    ElMessage.info("submit transaction: " + txHash)
}

async function switchPayMethod(idx: number) {
    state.payment.curIdx = idx

    if (idx == 0) {
        state.info.switchAddr = state.info.midAddr
        state.info.switchCurr = 'BTC'
        clearInterval(state.payment.timer1)
        clearInterval(state.payment.timer2)
        return
    }

    state.info.switchAddr = ''
    state.info.switchCurr = ''
    state.payment.countText = '20:00'
    state.payment.countDown = 1200

    await startRatio();

    state.payment.timer1 = window.setInterval(
        resetRatio, Types.resetRatioInterval
    )
    state.payment.timer2 = window.setInterval(
        decreaseOne, Types.countDownInterval
    )
}

function decreaseOne() {
    state.payment.countDown--;
    let count = state.payment.countDown
    let minus = count / 60 - 1;
    let seconds = count % 60;
    state.payment.countText = minus.toFixed(0) + ':' + seconds
}

async function startRatio() {
    let params = {
        fromCurrency: 'eth',
        toCurrency: 'btc',
        fromAmount: '0',
        toAmount: state.info.total,
        fromNetwork: 'eth',
        toNetwork: 'btc',
        receive_address: state.info.midAddr,
    } as PayParams;

    let retData = await service.exchangeWith(params)
    state.payment.exchangeRet = JSON.parse(retData.data)
    state.info.switchAddr = state.payment.exchangeRet.payinAddress;
    state.info.switchCurr = state.payment.exchangeRet.fromCurrency.toUpperCase();
    console.log(state.payment.exchangeRet)
}

function resetRatio() {
    let params = {
        fromCurrency: 'eth',
        toCurrency: 'btc',
        fromAmount: '0',
        toAmount: state.info.total,
        fromNetwork: 'eth',
        toNetwork: 'btc',
        receive_address: state.info.midAddr,
    } as PayParams;
    service.exchangeWith(params).then(val => {
        state.payment.exchangeRet = JSON.parse(val.data)
    state.info.switchAddr = state.payment.exchangeRet.payinAddress;
    state.info.switchCurr = state.payment.exchangeRet.fromCurrency.toUpperCase();
    })
}

onBeforeMount(() => {
    state.info = props.gasInfo! as GasInfo
    window.addEventListener('beforeunload', e => unload(e))
})

function unload(e: Event) {
    unloadWallet()
}

onMounted(() => {
    state.payment.methods = [{
        name: 'BTC',
        icon: domain.domainImgUrl + 'assets/icon_btc@2x.png',
        desc: ''
    }, {
        name: 'ETH',
        icon: domain.domainImgUrl + 'assets/eth@2x.png',
        desc: 'About 3% of exchange fees'
    }] as PaymentMethod[]

    state.info.switchAddr = state.info.midAddr
    state.info.switchCurr = 'BTC'

    useRequest(updateBalance, {
        pollingInterval: Types.queryBalInterval,
        pollingWhenHidden: false,
        onSuccess: val1 => {
            let s_fee = new Decimal(state.info.registerFee)
            let b_fee = new Decimal(val1.data.mine.trusted)
            let u_fee = new Decimal(val1.data.mine.untrusted_pending)
            let t_fee = Decimal.add(b_fee, u_fee)
            state.info.balance = t_fee.toPrecision(Types.precision).toString()
            state.info.total = Decimal.sub(s_fee, t_fee).toPrecision(Types.precision).toString();
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
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="t-name">{{ state.info.isAvailable ? 'Available'
                    : 'Unavailable'
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
                <el-col :xs="10" :sm="8" :md="6" :lg="5" :xl="5" class="owner-view">{{ state.info.registerFee + ' BTC'
                }}</el-col>
            </el-row>

            <el-row justify="space-between">
                <el-col :xs="14" :sm="12" :md="10" :lg="10" :xl="10">
                    <div class="list-t-view">Current Balance</div>
                </el-col>
                <el-col :xs="10" :sm="8" :md="6" :lg="5" :xl="5">
                    <div class="owner-view">{{ state.info.balance + " BTC" }}</div>
                </el-col>
            </el-row>

            <div class="dash-line-view"></div>

            <el-row justify="space-between">
                <el-col :xs="14" :sm="12" :md="10" :lg="10" :xl="10">
                    <div class="list-t-view">Final Payment</div>
                    <div class="list-tip-view" style="padding-left: 20px;">Total Register Fee - Current Balance</div>
                </el-col>
                <el-col :xs="10" :sm="8" :md="6" :lg="5" :xl="5">
                    <div class="owner-view">{{ state.info.total + " BTC" }}</div>
                </el-col>
            </el-row>

            <div class="solid-line-view"></div>

            <div class="payment-view">
                <div class="tran-fee-title">Payment Method</div>
                <br>
                <div class="list-t-view">Select transaction currency</div>
                <div class="payway-content-view">
                    <div v-for="(item, index) in state.payment.methods" :key="index" class="pay-item-view pay-item-dif"
                        :class="state.payment.curIdx == index ? 'pay-item-view-selected' : 'pay-item-view-normal'"
                        @click="switchPayMethod(index)">
                        <img :src="item.icon" alt="" width="24" height="24">
                        <div>
                            <div class="pay-tit-view">{{ item.name }}</div>
                            <div class="pay-desc-view">{{ item.desc }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dash-line-view"></div>

            <div class="rate-value-view">
                <div class="thin-title-view">You Will Pay:</div>
                <div v-if="state.payment.curIdx == 0" class="pay-value-view">{{ state.info.total }} <span>BTC</span></div>
                <div v-else class="pay-value-view">{{ state.payment.exchangeRet.fromAmount }}
                    <span>{{ state.info.switchCurr }}</span>
                </div>

                <div v-if="state.payment.curIdx != 0" style="display: flex;margin-top: 10px;">
                    <div class="thin-title-view">The rate will be updated in</div>
                    <div
                        style="background: #A7A9BE;padding-left: 4px;margin-left: 4px;padding-right: 4px;color: white;border-radius: 2px;">
                        <img src="../assets/time@2x.png" alt="" width="15" height="15">{{ state.payment.countText }}
                    </div>
                </div>
            </div>

            <div class="qrcode-view">
                <div>Send the funds to this address</div>
                <div v-if="state.info.switchAddr">
                    <vue-qrcode :value="state.info.switchAddr" :options="{ width: 200 }"></vue-qrcode>
                    <div style="display: flex;justify-content: start;width: 100%;">
                        <div style="color: #2E2F3E;word-wrap: break-word;text-align: left;max-width: 80%;">{{
                            state.info.switchAddr }} </div>
                        <img src="../assets/icon_copy@2x.png" style="width: 32px;height: 32px;cursor: pointer;" alt=""
                            @click="copyAction">
                    </div>
                </div>
            </div>

            <div class="dash-line-view"></div>

            <div class="metamask-view" v-if="state.payment.curIdx != 0">
                <div>OR <span>Pay with wallet connect</span></div>
                <br>
                <div class="metamask-btn" @click="tiggerMetamaskAction">
                    <img src="../assets/MetaMask_Fox@2x.png" alt="" width="26" height="26" style="margin-top: 8px;">
                    <div>Connect Metamask wallet</div>
                </div>
            </div>

            <br>

            <div class="conform-outer-view">
                <div>
                    <img src="../assets/icon_16_tips_red@2x.png" alt="" width="17" height="16">
                </div>
                <div style="color: #FA3232;font-weight: 600;font-size: 16px;height: 22px;line-height: 22px;">Don't forget to
                    click the "Next Step" button!</div>
                <br>
                <div class="note-view">
                    The domain name will belong to the person who has the priority to complete the transfer. If the transfer
                    amount is incorrect, please contact us by email.
                </div>

                <div class="conform-view" @click="conformAction">Next Step</div>
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
    max-width: 800px;
    margin: 0 auto;
    margin-top: 40px;
    padding-left: 10px;
    padding-right: 10px;
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

.dash-line-view {
    margin-top: 20px;
    margin-bottom: 20px;
    border-bottom: 1px dashed #A7A9BE;
}

.solid-line-view {
    margin-top: 40px;
    margin-bottom: 40px;
    border-bottom: 1px solid #A7A9BE;
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
    margin-top: 20px;
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
    width: 100%;
    max-width: 500px;
    font-size: 14px;
    font-weight: 400;
    color: #2E2F3E;
    line-height: 20px;
    text-align: left;
    margin-bottom: 40px;
}
</style>

<style scoped>
.pay-tit-view {
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 20px;
    margin-left: 5px;
}

.pay-desc-view {
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 17px;
    margin-left: 5px;
}

.rate-value-view {
    margin-top: 20px;
}

.thin-title-view {
    height: 20px;
    font-size: 17px;
    font-weight: 400;
    color: #2E2F3E;
    line-height: 20px;
}

.pay-value-view {
    height: 28px;
    font-size: 28px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 28px;
    margin-top: 10px;
}

.pay-value-view span {
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 20px;
}

.pay-item-view {
    display: flex;
    height: 50px;
    padding: 10px;
    margin-top: 5px;
    background: #FFFFFF;
    border-radius: 4px;
    line-height: 50px;
    cursor: pointer;
}

.pay-item-view-normal {
    border: 1px solid #A7A9BE;
}

.pay-item-view-selected {
    border: 2px solid #4540D6;
}

@media screen and (max-width: 767px) {
    .payway-content-view {
        padding-left: 10px;
        padding-right: 10px;
    }
}

@media screen and (min-width: 768px) {
    .payway-content-view {
        padding-left: 10px;
        padding-right: 10px;
        display: flex;
    }

    .pay-item-dif {
        width: 148px;
        height: 66px;
        margin-left: 10px;
    }
}

.metamask-btn {
    display: flex;
    justify-content: space-between;
    max-width: 246px;
    padding-left: 5px;
    padding-right: 5px;
    height: 44px;
    background: rgba(236, 130, 17, 0.1);
    border-radius: 8px;
    line-height: 44px;
    color: #EC8211;
    cursor: pointer;
}

.conform-outer-view {
    text-align: center;
    padding-bottom: 20px;
}
</style>
