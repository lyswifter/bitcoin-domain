<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import useClipboard from "vue-clipboard3";
import FooterView from "../components/Footer.vue";
import HeaderView from "../components/Header.vue";
import HistoryView from "../components/History.vue";
import InscriptionView from "../components/MyInscriptions.vue";
import router from "../router/index";
import service from "../router/service";
import { PersonInfo } from "../router/type";
import { shortenAddr } from "../router/util";

import openapi from "../crypto/openapi";
import { KEYRING_TYPE } from "../shared/constant";
import { Account, BitcoinBalance } from "../shared/types";

import { FeeSummary } from "../shared/types";

const headerRef = ref();
const subSLen = 8;

const defaultAvatar = '../../src/assets/icon_btc@2x.png';

let stat = reactive({
    pinfo: {} as PersonInfo,
    winfo: {} as BitcoinBalance,
    account: {} as Account,
    activeName: 'inscription',
    isReceiveShow: false,
    sendInsOrBtc: {
        target: '',
        isSendInsOrBtcShow: false,
        toAddr: 'bc1pkt5rxgyz9zaydan4qa9fg4fs5kjuzy273czsdvpzr2aztuk9pcgqw6s75d',
        feeSums: {} as FeeSummary,
        customFee: 0,
        curIdx: 2,
        amount: 0,
    }
})

function copyAction() {
    const toClipboard = useClipboard();
    toClipboard.toClipboard(stat.pinfo.address).then((val) => {
        ElMessage.info("copied")
    })
}

async function sendBtcsAction() {
    let addr = localStorage.getItem('bitcoin_address')

    stat.sendInsOrBtc.target = 'BTC'
    // stat.selectedItem = item
    stat.sendInsOrBtc.isSendInsOrBtcShow = true

    openapi.getFeeSummary().then(feeRet => {
        console.log(feeRet)
        stat.sendInsOrBtc.feeSums = feeRet
    })
}

function clickFeeCardAction(idx: any) {
    stat.sendInsOrBtc.curIdx = idx
}

async function submitBtcTxAction() {

}

function receiveAction() {
    stat.isReceiveShow = true
}

function copyReveiveAddr() {
    const toClipboard = useClipboard();
    toClipboard.toClipboard(stat.pinfo.address).then((val) => {
        ElMessage.info("copied")
    })
}

function showQrCodeAction() {
    stat.isReceiveShow = true
}

function handleClick() {
}

function disconnectAction() {
    headerRef.value.doDisconnect()
    router.push({ name: 'home' })
}

onBeforeMount(() => {
})

onMounted(async () => {
    let addr = localStorage.getItem('bitcoin_address')
    let pubKey = localStorage.getItem('public_key')
    if (addr) {
        let avatarRet = await service.avatarGet(addr);
        stat.pinfo = avatarRet.data[0]
        stat.pinfo.short_addr = shortenAddr(stat.pinfo.address, subSLen)

        let balance = await openapi.getAddressBalance(addr);
        stat.winfo = balance

        stat.account = {
            type: KEYRING_TYPE.WalletConnectKeyring,
            pubkey: pubKey,
            address: addr,
        } as Account
    }
})

</script>

<template>
    <div class="wallet-container">
        <HeaderView class="header-view" ref="headerRef" />

        <div class="top-information-view">
            <div class="top-inner-view">
                <div class="info-view">
                    <div class="topwarp-view">
                        <img class="avatar-view" :src="stat.pinfo.content_url ? stat.pinfo.content_url : defaultAvatar"
                            alt="">
                        <div class="nick-addr-view">
                            <div class="nickname-view">{{ stat.pinfo.domain ? stat.pinfo.domain : '' }}</div>
                            <div class="addrname-view">{{ stat.pinfo.short_addr }}<img
                                    src="../assets/icon_copy_white@2x.png"
                                    style="width: 24px;height: 24px;cursor: pointer;margin-left: 10px;" alt=""
                                    @click="copyAction"><img src="../assets/icon_qrcode@2x.png"
                                    style="width: 24px;height: 24px;cursor: pointer;;margin-left: 10px;" alt=""
                                    @click="showQrCodeAction"></div>
                        </div>
                    </div>

                    <div class="disconnect-view dis-postion web-hidden" @click="disconnectAction">Disconnect</div>
                </div>

                <div class="line-view"></div>

                <div class="assets-view">
                    <div class="nums-view">
                        <img class="money-view" src="../assets/icon_btc@2x.png" alt="" width="32" height="32">
                        <div style="margin-left: 10px;">
                            <div class="btc-view">{{ stat.winfo.amount }} BTC <img src="../assets/icon_q@2x.png" alt=""
                                    width="24" height="24"></div>
                            <div class="usdt-view">≈ 25.4323 USDT</div>
                        </div>
                    </div>

                    <div class="actions-view">
                        <div class="action-view send-one" @click="sendBtcsAction">Send <img src="../assets/icon_send@2x.png"
                                alt="" width="24" height="24"></div>
                        <div class="action-view receive-one" @click="receiveAction">Receive <img
                                src="../assets/icon_receive@2x.png" alt="" width="24" height="24"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mid-content-view">
            <el-tabs v-model="stat.activeName" class="mywallet-tabs" @tab-click="handleClick">
                <el-tab-pane label="Inscription" name="inscription">
                    <InscriptionView :ref="stat.pinfo.address" />
                </el-tab-pane>
                <el-tab-pane label="History" name="history">
                    <HistoryView />
                </el-tab-pane>
            </el-tabs>
        </div>

        <FooterView class="footer-view" />

        <el-dialog v-model="stat.isReceiveShow" :show-close="true" :align-center="true" :width="440">
            <template #header="{ close, titleId, titleClass }">
                <div class="my-header">
                    <h4 :id="titleId" :class="titleClass">Receive BTC</h4>
                </div>
            </template>

            <div style="text-align: center;">
                <vue-qrcode :value="stat.pinfo.address" :options="{ width: 200 }"></vue-qrcode>
                <br>
                <div style="display: flex;">
                    <div style="max-width: 356px;word-break: break-all;text-align: left;">{{ stat.pinfo.address }}</div>
                    <img src="../assets/icon_copy_black@2x.png" style="cursor: pointer;" alt="" width="24" height="24"
                        @click="copyReveiveAddr">
                </div>
            </div>
        </el-dialog>

        <el-dialog v-model="stat.sendInsOrBtc.isSendInsOrBtcShow" :show-close="true" :align-center="true" class="send-dialogue-view">
            <template #header="{ close, titleId, titleClass }">
                <div class="my-header">
                    <h4 :id="titleId" :class="titleClass">Send BTC</h4>
                </div>
            </template>

            <div style="padding-left: 30px;padding-right: 30px;">
                <div class="to-view">
                    <div class="fee-tit-view">To</div>
                    <el-input v-model="stat.sendInsOrBtc.toAddr" placeholder="Received Bitcoin address or .btc domain name"
                        class="to-addr-input" />
                </div>
                <div class="amount-view">
                    <div class="fee-tit-view">To</div>
                    <el-input v-model="stat.sendInsOrBtc.amount" placeholder="Received Bitcoin address or .btc domain name"
                        class="to-addr-input" />
                </div>
                <br>
                <div class="fee-tit-view">Select the network fee you want to pay:</div>
                <div class="fee-summary-view">
                    <div class="fee-card-view" v-for="(item, idx) in stat.sendInsOrBtc.feeSums.list" :key="idx"
                        :class="stat.sendInsOrBtc.curIdx == idx ? 'fee-card-view-selected' : 'fee-card-view-normal'"
                        @click="clickFeeCardAction(idx)">
                        <div class="fee-title-view">{{ item.title }}</div>
                        <div class="fee-rate-view">{{ item.feeRate }}sats/vByte</div>
                        <br>
                        <div class="fee-desc-view">{{ item.desc }}</div>
                    </div>
                    <div class="fee-card-view">
                        <div class="fee-title-view">Customize Sats</div>
                        <div class="fee-rate-view">{{ stat.sendInsOrBtc.customFee }}sats/vByte</div>
                        <br>
                        <div>
                            <el-input v-model="stat.sendInsOrBtc.customFee" placeholder="0" class="customize-input"
                                type="number" />
                        </div>
                    </div>
                </div>
                <br>
                <div class="send-btn-view" @click="submitBtcTxAction">Send</div>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.header-view {
    width: 100%;
}

.top-information-view {
    width: 100%;
    padding-bottom: 60px;
    background: linear-gradient(180deg, #513eff 0%, #BFEAFF 100%);
}

.top-inner-view {
    max-width: 1200px;
    margin: 0 auto;
}

.info-view {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
}

.top-left-view {
    display: flex;
}

.avatar-view {
    width: 140px;
    height: 140px;
    margin-top: 20px;
    margin-left: 20px;
}

.nick-addr-view {
    margin-top: 30px;
    margin-left: 10px;
}

.nickname-view {
    height: 48px;
    font-size: 34px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 48px;
}

.addrname-view {
    height: 28px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 20px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 28px;
    border-radius: 24px;
    background: rgba(69, 64, 214, 0.3);
}

.disconnect-view {
    width: 100px;
    height: 36px;
    margin-top: 60px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 24px;
    font-size: 13px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
}

.line-view {
    border-top: #FFFFFF solid 1px;
    margin: 0 auto;
    width: 95%;
    margin-top: 30px;
    margin-bottom: 30px;
}

.assets-view {
    margin: 0 auto;
    width: 95%;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
}

.money-view {
    width: 32px;
    margin-top: 8px;
}

.nums-view {
    color: white;
    display: flex;
}

.btc-view {
    height: 48px;
    font-size: 34px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 48px;
}

.usdt-view {
    height: 28px;
    font-size: 20px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 28px;
}

.action-view {
    height: 48px;
    margin-top: 10px;
    background: #4540D6;
    border-radius: 24px;
    color: white;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    line-height: 48px;
    cursor: pointer;
}

@media screen and (max-width: 767px) {
    .dis-postion {
        position: absolute;
        right: 10px;
        top: 20px;
    }

    .actions-view {
        display: flex;
        justify-content: center;
        margin: 0 auto;
        width: 90%;
    }

    .send-one {
        min-width: 158px;
        margin-left: 19px;
    }

    .receive-one {
        min-width: 158px;
        margin-left: 19px;
    }
}

@media screen and (min-width: 768px) {
    .actions-view {
        display: flex;
        justify-content: center;
    }

    .send-one {
        width: 126px;
    }

    .receive-one {
        width: 126px;
        margin-left: 19px;
    }

    .dis-postion {
        margin-top: 60px;
    }

    .topwarp-view {
        display: flex;
    }
}
</style>

<style scoped>
.mid-content-view {
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 20px;
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

.to-addr-input {
    width: 100%;
    height: 48px;
}

.fee-summary-view {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.fee-card-view {
    padding: 20px;
    width: 180px;
    height: 148px;
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
    height: 25px;
    font-size: 18px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 25px;
}

.fee-rate-view {
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 22px;
}

.fee-desc-view {
    height: 22px;
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
