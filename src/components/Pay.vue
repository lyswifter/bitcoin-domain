<script setup lang="ts">
import BigNumber from "bignumber.js";
import { validate } from 'bitcoin-address-validation';
import Decimal from 'decimal.js';
import { ElLoading, ElMessage } from "element-plus";
import { ethers } from "ethers";
import { onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, reactive } from 'vue';
import useClipboard from "vue-clipboard3";
import { event } from "vue-gtag";
import { useRequest } from 'vue-request';
import openapi from "../crypto/openapi";
import SDK, { ICollectedUTXOResp, ISendBTCReq } from "../crypto/sdk/sdk";
import { generateBitcoinAddr } from "../crypto/sign";
import { domain } from "../router/domain";
import service from "../router/service";
import { GasInfo, MinSats, PayParams, PayinParams, PaymentMethod, Types, rate } from "../router/type";
import { TimeFormat } from "../router/util";
import { FeeSummary } from "../shared/types";

const resetInterval = 1200
const confirmInterval = 180

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
    payment: {
        methods: [] as PaymentMethod[],
        curIdx: 0,
        exchangeRet: {} as PayinParams,
        isEnough: 0,
        countDown: resetInterval,
        countText: TimeFormat(resetInterval),
        timer2: 0,
        comformSec: confirmInterval,
        conformTimer: 1,
        loadingInstance1: {} as any,
    },
    sendInsOrBtc: {
        dialogueWidth: '50%',
        target: '',
        isSendInsOrBtcShow: false,
        toAddr: '',
        realAddr: '',
        feeSums: {} as FeeSummary,
        customFee: 0,
        curIdx: 2,
        amount: 0,
        availBal: '',
    },
})

onBeforeUnmount(() => {
    clearInterval(state.payment.conformTimer)
    clearInterval(state.payment.timer2)
    window.clearInterval(state.payment.conformTimer)
    window.clearInterval(state.payment.timer2)
})

function backAction() {
    emit('backAction')
}

function copyAction() {
    const toClipboard = useClipboard();
    toClipboard.toClipboard(state.info.switchAddr).then((val) => {
        ElMessage.info("copied")
    })
}

function conformAction() {
    let exchangeId = ''
    if (state.payment.curIdx == 0) {
        exchangeId = ''
    } else {
        exchangeId = state.payment.exchangeRet.id
    }

    service.queryConfirm(state.info.name, state.info.addr, state.info.years, state.info.walletId, exchangeId).then((val) => {
        if (val.code == 0) {
            event('payment', { method: 'Google' })
            state.payment.loadingInstance1.close()
            emit('toProcessing', state.info)
        } else if (val.code == 314) {
        } else if (val.code == 315) {
            state.payment.loadingInstance1.close()
            emit('toProcessing', state.info)
        } else {
            // emit('toProcessing', state.info)
        }
    })
}

async function addressChange() {
    if (state.sendInsOrBtc.toAddr.endsWith('.btc')) {
        let ret = await service.queryDomain(state.sendInsOrBtc.toAddr);
        if (ret.code == 0) {
            let doaminInfo = ret.data;
            state.sendInsOrBtc.realAddr = doaminInfo.owner_address
        }
    } else {
        state.sendInsOrBtc.realAddr = ''
    }
}

async function sendBtcsAction() {

    // from address

    let addr = localStorage.getItem('bitcoin_address')
    if (!addr) {
        ElMessage.warning("from address must not be empty")
        return
    }

    state.sendInsOrBtc.toAddr = state.info.switchAddr
    state.sendInsOrBtc.amount = new BigNumber(state.info.total).toNumber()

    state.sendInsOrBtc.target = 'BTC'
    state.sendInsOrBtc.isSendInsOrBtcShow = true

    // determine how much btc are available to transfer

    let available_sat = await loadBalance();
    let availBtcStr = available_sat.div(rate).toPrecision(8).toString();

    state.sendInsOrBtc.availBal = availBtcStr;

    openapi.getFeeSummary().then(feeRet => {
        state.sendInsOrBtc.feeSums = feeRet
        state.sendInsOrBtc.feeSums.list.push({
            title: 'Customize Sats',
            desc: '',
            feeRate: 0,
        })
    })
}

function clickFeeCardAction(idx: any) {
    state.sendInsOrBtc.curIdx = idx
}

async function submitBtcTxAction() {
    let addr = localStorage.getItem('bitcoin_address')
    if (!addr) {
        ElMessage.warning("from address must not be empty")
        return
    }

    // to address

    let tempAddr = ''
    if (!state.sendInsOrBtc.toAddr) {
        ElMessage.warning("to address must not be empty")
        return
    }

    if (state.sendInsOrBtc.toAddr.endsWith('.btc')) {
        if (!state.sendInsOrBtc.realAddr) {
            ElMessage.warning("to address must not be empty")
            return
        }
        if (!validate(state.sendInsOrBtc.realAddr)) {
            ElMessage.warning("to address is not valid")
            return
        }
        tempAddr = state.sendInsOrBtc.realAddr
    } else {
        if (!validate(state.sendInsOrBtc.toAddr)) {
            ElMessage.warning("to address is not valid")
            return
        }
        tempAddr = state.sendInsOrBtc.toAddr
    }

    if (!tempAddr) {
        ElMessage.warning("to address must not be empty")
        return
    }

    // amount

    if (!state.sendInsOrBtc.amount) {
        ElMessage.warning("amount must not be empty")
        return
    }

    let one = new BigNumber(state.sendInsOrBtc.amount)
    let targetSat = one.multipliedBy(rate)
    if (targetSat.lt(new BigNumber(MinSats))) {
        ElMessage.warning("min sat you must transfer is" + MinSats)
        return
    }

    // availBal

    let avail = new BigNumber(state.sendInsOrBtc.availBal)
    if (one.gte(avail)) {
        ElMessage.warning("max value you must transfer is " + state.sendInsOrBtc.availBal + 'btc')
        return
    }

    // feeRate

    let feeRate = 0
    if (state.sendInsOrBtc.customFee != 0) {
        feeRate = state.sendInsOrBtc.customFee
    } else {
        feeRate = state.sendInsOrBtc.feeSums.list[state.sendInsOrBtc.curIdx].feeRate
    }

    if (feeRate == 0) {
        ElMessage.warning("fee rate must not be empty")
        return
    }

    const privKey = await generateBitcoinAddr()
    if (!privKey) {
        ElMessage.warning("private key must not be empty")
        return
    }

    // assembly

    const retOut = await service.queryExtIns(addr);
    const waltOut: ICollectedUTXOResp = retOut.data;

    let gutxos = SDK.formatUTXOs(waltOut.txrefs);
    let insOutPut = SDK.formatInscriptions(waltOut.inscriptions_by_outputs);

    let sBtcResq = {
        privateKey: privKey,
        utxos: gutxos,
        inscriptions: insOutPut,
        receiver: tempAddr,
        amount: targetSat.toNumber(),
        feeRate: feeRate,
    } as ISendBTCReq

    const { txID, txHex } = await SDK.sendBTCTransaction(sBtcResq)
    console.log('txID: ' + txID)
    console.log('txHex: ' + txHex)

    // submit

    const subRet = await openapi.pushTx(txHex)
    console.log(subRet)

    ElMessage.info("Send BTC tx: " + subRet + " has been publiced")

    state.sendInsOrBtc.isSendInsOrBtcShow = false

    conformAction() // tigger conform
}

function tiggerPaymentAction() {
    if (state.payment.isEnough != 1) {
        return
    }

    if (state.payment.curIdx == 0) {
        tiggerBtcPaymentAction()
    } else {
        tiggerMetamaskAction()
    }
}

async function tiggerBtcPaymentAction() {
    await sendBtcsAction()
}

async function tiggerMetamaskAction() {
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // let value = state.payment.exchangeRet.fromAmount.toString();
    // let weivalue = ethers.parseUnits(value, "ether");
    // let weiStr = weivalue.toString(16);

    // let txHash = await window.ethereum
    //     .request({
    //         method: 'eth_sendTransaction',
    //         params: [
    //             {
    //                 from: accounts[0],
    //                 to: state.payment.exchangeRet.payinAddress,
    //                 value: weiStr,
    //                 gasPrice: '',
    //                 gas: '',
    //             },
    //         ],
    //     })

    // ElMessage.info("Send ETH tx: " + txHash + " has been publiced")

    // clearTimer()

    // conformAction() // tigger conform

    state.payment.loadingInstance1 = ElLoading.service({
        fullscreen: true,
        text: "Do not close this window until confirmation is complete! Payment has been made and is currently being confirmed. It may take 20 minutes to wait.",
        background: "rgba(122, 122, 122, 0.8)",
    })
}

async function switchPayMethod(idx: number) {
    state.payment.curIdx = idx
    state.payment.isEnough = 0

    if (idx == 0) {
        state.info.switchAddr = state.info.midAddr
        state.info.switchCurr = 'BTC'
        clearTimer()

        let available_sat = await loadBalance();

        if (state.payment.curIdx == 1) {
            return
        }

        let needpay_big_total = new BigNumber(state.info.total);
        let needpay_sat = needpay_big_total.multipliedBy(rate);

        if (available_sat.isGreaterThan(needpay_sat)) {
            state.payment.isEnough = 1
        } else {
            state.payment.isEnough = 2
        }
    } else if (idx == 1) {
        state.info.switchAddr = ''
        state.info.switchCurr = ''
        state.payment.comformSec = confirmInterval

        // request ratio
        let retData = await startRatio()
        
        if (state.payment.curIdx == 0) {
            return
        }

        state.payment.exchangeRet = JSON.parse(retData.data)
        state.info.switchAddr = state.payment.exchangeRet.payinAddress;
        state.info.switchCurr = state.payment.exchangeRet.fromCurrency.toUpperCase();

        // exchange rate
        let needpay_wei = state.payment.exchangeRet.fromAmount.toString();
        let needpay_wei_big = new BigNumber(needpay_wei)

        // provider
        let provider = new ethers.BrowserProvider(window.ethereum)

        // ethers
        provider.getBalance(localStorage.getItem('eth_address')!)
        .then(balance => {
            let w_balance = ethers.formatEther(balance);
            let balance_big = new BigNumber(w_balance);

            // set balance
            state.payment.methods[state.payment.curIdx].bal = w_balance;

            if (balance_big.isGreaterThan(needpay_wei_big)) {
                state.payment.isEnough = 1
            } else {
                state.payment.isEnough = 2
            }

            state.payment.timer2 = window.setInterval(
                countDown, Types.countDownInterval
            )
        })
        .catch(err => {
            console.log(err)
        });
    }
}

function clearTimer() {
    clearInterval(state.payment.timer2)
    window.clearInterval(state.payment.timer2)
    state.payment.timer2 = 0
    resetTimer()
}

function resetTimer() {
    state.payment.countText = TimeFormat(resetInterval)
    state.payment.countDown = resetInterval
}

async function countDown() {
    if (state.payment.countDown == 0) {
        resetTimer()
        await startRatio()
    }

    state.payment.countDown--;
    state.payment.countText = TimeFormat(state.payment.countDown)
}

async function loadBalance() {
    let available_ret = new BigNumber(0)
    let addr = localStorage.getItem('bitcoin_address')

    let balance = await openapi.getAddressBalance(addr!);
    let inscriptions = await openapi.getAddressInscriptions(addr!);

    let totalSatoshi = new BigNumber(0)
    inscriptions.forEach(element => {
        if (element.detail) {
            let tmp = new BigNumber(element.detail.output_value)
            totalSatoshi = totalSatoshi.plus(tmp)
        }
    });

    let amout_tmp = new BigNumber(balance.confirm_amount);
    let amount_sat = amout_tmp.multipliedBy(rate);
    available_ret = amount_sat.minus(totalSatoshi);
    state.payment.methods[0].bal = available_ret.div(rate).toPrecision(8).toString();

    return available_ret
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
    return retData
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
        desc: '',
        bal: '',
    }, {
        name: 'ETH',
        icon: domain.domainImgUrl + 'assets/eth@2x.png',
        desc: 'About 3% of exchange fees',
        bal: '',
    }] as PaymentMethod[]

    state.info.switchAddr = state.info.midAddr
    state.info.switchCurr = 'BTC'

    switchPayMethod(0)

    useRequest(updateBalance, {
        pollingInterval: Types.queryBalInterval,
        pollingWhenHidden: false,
        onSuccess: val1 => {
            let s_fee = new Decimal(state.info.registerFee)
            let b_fee = new Decimal(val1.data.mine.trusted)
            let u_fee = new Decimal(val1.data.mine.untrusted_pending)
            let t_fee = Decimal.add(b_fee, u_fee)
            state.info.balance = t_fee.toPrecision(Types.precision).toString();
            state.info.total = Decimal.sub(s_fee, t_fee).toPrecision(Types.precision).toString();
            if (t_fee.greaterThanOrEqualTo(s_fee)) {
                conformAction()
            }
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
                <div class="tran-fee-title"><span style="color: #4540D6;">&#9679; </span>Payment Method</div>
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
                <div class="thin-title-view"><span style="color: #4540D6;">&#9679; </span>You Will Pay:</div>
                <div style="padding-left: 20px;">
                    <div v-if="state.payment.curIdx == 0" class="pay-value-view">{{ state.info.total }} <span>BTC</span>
                    </div>
                    <div v-else class="pay-value-view">{{ state.payment.exchangeRet.fromAmount }}
                        <span>{{ state.info.switchCurr }}</span>
                    </div>

                    <div v-if="state.payment.curIdx != 0" style="display: flex;margin-top: 10px;">
                        <div class="thin-title-view">The rate will be updated in</div>
                        <div
                            style="background: #A7A9BE;padding-left: 4px;margin-left: 4px;padding-right: 4px;color: white;border-radius: 2px;line-height: 24px;">
                            <img src="../assets/time@2x.png" alt="" width="15" height="15"
                                style="vertical-align: text-top;">{{ state.payment.countText }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="enough-view" v-if="state.payment.methods.length > 0">
                <div>Wallet Balance: {{ state.payment.methods[state.payment.curIdx].bal }} {{ state.info.switchCurr }}
                </div>
                <div v-if="state.payment.isEnough > 0">
                    <div v-if="state.payment.isEnough == 1" class="green-color" style="line-height: 24px;">
                        <img src="../assets/icon_16_success@2x.png" width="16" height="16" style="vertical-align: text-top"
                            alt="">The balance is sufficient.
                    </div>
                    <div v-else class="red-color" style="line-height: 24px;">
                        <img src="../assets/icon_16_tips_red@2x.png" width="16" height="16" style="vertical-align: text-top"
                            alt="">Insufficient balance.
                    </div>
                </div>
            </div>

            <div class="metamask-view">
                <div :class="state.payment.isEnough == 1 ? 'metamask-btn' : 'metamask-btn-disable'"
                    @click="tiggerPaymentAction">
                    Pay
                </div>
            </div>

            <div class="dash-line-view"></div>

            <div style="font-weight: bold;"><span style="color: #4540D6;">&#9679; </span>OR <span
                    style="font-weight: normal;">Send the funds to this address</span></div>

            <div class="qrcode-view">
                <div v-if="state.info.switchAddr">
                    <vue-qrcode :value="state.info.switchAddr" :options="{ width: 200 }"></vue-qrcode>
                    <div style="color: #2E2F3E;word-wrap: break-word;">{{
                        state.info.switchAddr }} <img src="../assets/icon_copy@2x.png"
                            style="width: 32px;height: 32px;cursor: pointer;" alt="" @click="copyAction"></div>
                </div>
            </div>

            <div class="conform-outer-view">
                <br>
                <div class="note-view">
                    The domain name will belong to the person who has the priority to complete the transfer. If the transfer
                    amount is incorrect, please contact us by email.
                </div>
            </div>
        </div>
    </div>

    <el-dialog v-model="state.sendInsOrBtc.isSendInsOrBtcShow" :show-close="true" :align-center="true"
        :width="state.sendInsOrBtc.dialogueWidth" class="send-dialogue-view">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <h4 :id="titleId" :class="titleClass">Send BTC</h4>
            </div>
        </template>

        <div style="padding-left: 30px;padding-right: 30px;">
            <div class="to-view">
                <div class="fee-tit-view">To</div>
                <el-input v-model="state.sendInsOrBtc.toAddr" placeholder="Received Bitcoin address or .btc domain name"
                    class="to-addr-input" @input="addressChange" />
                <div v-if="state.sendInsOrBtc.realAddr">{{ state.sendInsOrBtc.realAddr }}</div>
            </div>
            <br>
            <div class="amount-view">
                <div style="display: flex;justify-content: space-between;flex-wrap: wrap;">
                    <div class="fee-tit-view">Amount</div>
                    <div class="cash-tit-view">Available Balance: {{ state.sendInsOrBtc.availBal }}BTC</div>
                </div>
                <el-input v-model="state.sendInsOrBtc.amount" type="number" placeholder="0" class="to-addr-input" />
            </div>
            <br>
            <div class="fee-tit-view">Select the network fee you want to pay:</div>
            <div class="fee-summary-view">
                <div class="fee-card-view fee-card-dif-view" v-for="(item, idx) in state.sendInsOrBtc.feeSums.list"
                    :key="idx" :class="state.sendInsOrBtc.curIdx == idx ? 'fee-card-view-selected' : 'fee-card-view-normal'"
                    @click="clickFeeCardAction(idx)">
                    <div class="fee-title-view">{{ item.title }}</div>
                    <div class="fee-rate-view">{{ item.feeRate }}sats/vByte</div>
                    <br>
                    <div v-if="item.desc" class="fee-desc-view">{{ item.desc }}</div>
                    <div v-else>
                        <el-input v-model="item.feeRate" placeholder="0" class="customize-input" type="number" />
                    </div>
                </div>
            </div>
            <br>
            <div class="send-btn-view" @click="submitBtcTxAction">Send</div>
        </div>
    </el-dialog>

    <!-- <div class="eth-load-view">
        <div>
            <img src="https://dmaster.com/dcommon/img/loading.svg" alt="">
        </div>

        <div class="text-blue">Do not close this window until confirmation is complete !</div>
        <div class="text-block">Payment has been made and is currently being confirmed. It may take 20 minutes to wait</div>
    </div> -->
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
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 50px;
}

.conform-view-disable {
    background: #A7A9BE;
    cursor: not-allowed;
}

.conform-view-able {
    background: #4540D6;
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

    .enough-view {
        margin-top: 20px;
        padding-left: 20px;
    }
}

@media screen and (min-width: 768px) {
    .enough-view {
        margin-top: 20px;
        padding-left: 20px;
        display: flex;
        gap: 10px;
    }

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

.green-color {
    color: #10C953;
}

.red-color {
    color: #FA3232;
}

.metamask-view {
    margin: 0 auto;
    margin-top: 20px;
    width: 50%;
    text-align: center;
}

.metamask-btn {
    height: 44px;
    background: rgba(69, 64, 214, 1);
    border-radius: 8px;
    color: #FFFFFF;
    line-height: 44px;
    cursor: pointer;
}

.metamask-btn-disable {
    height: 44px;
    background: rgba(69, 64, 214, 0.2);
    border-radius: 8px;
    color: #FFFFFF;
    line-height: 44px;
    cursor: not-allowed;
}

.conform-outer-view {
    text-align: center;
    padding-bottom: 20px;
}

.qrcode-view {
    text-align: center;
}
</style>

<style scoped>
.fee-tit-view {
    height: 20px;
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 20px;
}

.cash-tit-view {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #2E2F3E;
    line-height: 20px;
}

.to-addr-input {
    width: 100%;
    height: 48px;
}

.fee-summary-view {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

@media screen and (max-width: 767px) {
    .fee-card-dif-view {
        width: 132px;
    }
}

@media screen and (min-width: 768px) {
    .fee-card-dif-view {
        width: 180px;
    }
}

.fee-card-view {
    padding: 20px;
    margin-top: 10px;
    background: #FFFFFF;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
}

.fee-card-view-normal {
    border: 1px solid #A7A9BE;
}

.fee-card-view-selected {
    border: 2px solid #4540D6;
}

.fee-title-view {
    font-size: 18px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 25px;
}

.fee-rate-view {
    font-size: 16px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 22px;
}

.fee-desc-view {
    font-size: 16px;
    font-weight: 600;
    color: #4540D6;
    line-height: 22px;
}

.customize-input {
    width: 100%;
    height: 48px;
    background: #FFFFFF;
}

.send-btn-view {
    margin: 0 auto;
    width: 80%;
    height: 50px;
    background: #2E2F3E;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
}
</style>

<!-- <style scoped>
.eth-load-view {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style> -->
