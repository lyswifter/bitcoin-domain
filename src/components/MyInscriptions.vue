<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onBeforeMount, onMounted, reactive } from "vue";
import openapi from "../crypto/openapi";
import SDK, { ICollectedUTXOResp } from "../crypto/sdk/sdk";
import { generateBitcoinAddr, signAsync } from "../crypto/sign";
import service from "../router/service";
import { InsType, InscriptionItem, SettingItem } from "../router/type";
import { FeeSummary } from "../shared/types";

const props = defineProps({
    address: String,
})

let stat = reactive({
    count: 0,
    items: [] as InscriptionItem[],
    addr: '',
    isSetVisiable: false,
    selectedItem: {} as InscriptionItem,
    setItems: [] as SettingItem[],
    setType: '',
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

function load() {
    service.queryInsWith(stat.addr).then((val) => {
        console.log(val.data.result)

        val.data.result.forEach((element: InscriptionItem) => {
            if (element.domain) {
                element.type = InsType.DOMAIN; // MAINDOMAIN
            } else {
                switch (element.detail.content_type) {
                    case 'image/png' || 'image/webp' || 'image/jpeg' || 'image/jpg': // AVATAR
                        element.type = InsType.IMAGE
                        break;

                    case 'image/gif':
                        element.type = InsType.GIF
                        break;

                    case 'text/plain' || 'application/json':
                        element.type = InsType.TEXT;
                        break;

                    case 'mp3':
                        element.type = InsType.AUDIO;
                        break;

                    case 'mp4':
                        element.type = InsType.VIDEO;
                        break;

                    default:
                        element.type = InsType.OTHER;
                        break;
                }
            }
        });

        stat.items = val.data.result;
    })
}

function setAction(item: InscriptionItem) {
    stat.selectedItem = item
    switch (stat.selectedItem.type) {
        case InsType.DOMAIN:
            stat.setItems[1].isSelected = true
            stat.setItems[0].isSelected = false
            break;

        case InsType.IMAGE:
            stat.setItems[0].isSelected = true
            stat.setItems[1].isSelected = false
            break;

        default:
            break;
    }
    stat.isSetVisiable = true
}

function settingOkAction() {
    let selectAddr = stat.selectedItem.detail.address
    let selectPubKey = localStorage.getItem('public_key');
    if (!selectPubKey) {
        ElMessage.error('public key is not found!')
        return
    }

    signAsync(selectAddr).then(val => {
        switch (stat.selectedItem.type) {
            case InsType.DOMAIN:
                service.avatarSet('', selectAddr, stat.selectedItem.domain, val, selectPubKey!).then(ret => {
                    console.log(ret)
                })
                break;

            case InsType.IMAGE:
                service.avatarSet(stat.selectedItem.number.toString(), selectAddr, '', val, selectPubKey!).then(ret => {
                    console.log(ret)
                })
                break;

            default:
                break;
        }
    })
}

function loadmoreAction() {
}

async function sendInssAction(item: InscriptionItem) {
    stat.sendInsOrBtc.target = 'INS'
    stat.selectedItem = item
    stat.sendInsOrBtc.isSendInsOrBtcShow = true

    openapi.getFeeSummary().then(feeRet => {
        console.log(feeRet)
        stat.sendInsOrBtc.feeSums = feeRet
    })
}

async function submitInsTxAction(item: InscriptionItem) {

    // to address

    if (!stat.sendInsOrBtc.toAddr) {
        ElMessage.warning("to address must not be empty")
        return
    }

    let feeRate = 0
    if (stat.sendInsOrBtc.customFee != 0) {
        feeRate = stat.sendInsOrBtc.customFee
    } else {
        feeRate = stat.sendInsOrBtc.feeSums.list[stat.sendInsOrBtc.curIdx].feeRate
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

    const retOut = await service.queryExtIns(item.detail.address);
    const waltOut: ICollectedUTXOResp = retOut.data;

    let gutxos = SDK.formatUTXOs(waltOut.txrefs);
    let insOutPut = SDK.formatInscriptions(waltOut.inscriptions_by_outputs);

    let sInsResq = {
        privateKey: privKey,
        utxos: gutxos,
        inscriptions: insOutPut,
        inscriptionID: item.id,
        receiver: stat.sendInsOrBtc.toAddr,
        feeRate: feeRate,
    }

    const { txID, txHex } = await SDK.sendInsTransaction(sInsResq);
    console.log('txID: ' + txID)
    console.log('txHex: ' + txHex)

    const subRet = await openapi.pushTx(txHex)
    console.log(subRet)

    ElMessage.info("tx: " + subRet + " has been publiced")
}

function clickFeeCardAction(idx: any) {
    stat.sendInsOrBtc.curIdx = idx
}

function updateInnerValue() {
    load()
}

defineExpose({
    updateInnerValue,
})

onBeforeMount(() => {
    stat.addr = props.address ? props.address : '';
})

onMounted(() => {
    let localAddr = localStorage.getItem('bitcoin_address');
    if (localAddr) {
        stat.addr = localAddr
    }

    stat.setItems = [{
        id: 0,
        title: 'Set as avatar',
        subtitle: 'After setting, your avatar will display as this image.',
        isSelected: false,
    }, {
        id: 1,
        title: 'Set as primary domain name',
        subtitle: 'After setting up, your name will appear as your primary domain name instead of your wallet address.',
        isSelected: false,
    }]

    load()
})
</script>

<template>
    <div class="ins-container-view">
        <ul class="infinite-list">
            <li v-for="(item, i) in stat.items" :key="i" class="infinite-list-item">
                <div class="card-item">
                    <img class="pic-view" v-if="item.type == InsType.IMAGE" :src="item.detail.content" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.TEXT" src="../assets/pic_txt@2x.png" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.AUDIO" src="../assets/pic_mp3@2x.png" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.VIDEO" src="../assets/pic_mp4@2x.png" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.DOMAIN" :src="item.domain_img" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.OTHER" src="" alt="" loading="lazy">

                    <div class="flex-view">
                        <div class="name-view">{{ item.domain }}</div>
                        <div class="id-view">INS #{{ item.number }}</div>
                    </div>

                    <div class="flex-view">
                        <div class="send-view" @click="sendInssAction(item)">Send</div>
                        <div class="set-view" v-if="item.type == InsType.DOMAIN || item.type == InsType.IMAGE"
                            @click="setAction(item)">
                            <img src="../assets/icon_set@2x.png" alt="" width="16" height="16"> Set
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <div class="loadmore-view" @click="loadmoreAction">load more</div>

        <el-dialog v-model="stat.isSetVisiable" :show-close="true" :align-center="true" :width="400">
            <template #header="{ close, titleId, titleClass }">
                <div class="my-header">
                    <h4 :id="titleId" :class="titleClass">Setting</h4>
                </div>
            </template>

            <div>
                <div class="dia-id-view">Inscription #{{ stat.selectedItem.number }}</div>
                <div class="set-as-view" v-for="(item, index) in stat.setItems" :key="index"
                    :class="item.isSelected ? 'isSelect-view' : 'normal-view'">
                    <div>
                        <div class="dia-til-view">{{ item.title }}</div>
                        <div class="dia-sub-view">{{ item.subtitle }}</div>
                    </div>
                    <img v-if="item.isSelected" src="../assets/icon_check_full@2x.png" alt="" width="16" height="16">
                </div>
                <br>
                <div class="ok-btn" @click="settingOkAction">OK</div>
            </div>
        </el-dialog>

        <el-dialog v-model="stat.sendInsOrBtc.isSendInsOrBtcShow" :show-close="true" :align-center="true"
            class="send-dialogue-view">
            <template #header="{ close, titleId, titleClass }">
                <div class="my-header">
                    <h4 :id="titleId" :class="titleClass">Send #{{ stat.selectedItem.number }}</h4>
                </div>
            </template>

            <div style="padding-left: 30px;padding-right: 30px;">
                <div class="to-view">
                    <div class="fee-tit-view">To</div>
                    <el-input v-model="stat.sendInsOrBtc.toAddr" placeholder="Received Bitcoin address or .btc domain name"
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
                    <div class="fee-card-view fee-card-view-normal">
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
                <div class="send-btn-view" @click="submitInsTxAction(stat.selectedItem)">Send</div>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.infinite-list {
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 3;
    padding: 5px;
    margin-bottom: 100px;
    list-style: none;
}

.flex-view {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.pic-view {
    margin: 0 auto;
    width: 100%;
    min-width: 258px;
    min-height: 258px;
}

.id-view {
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 17px;
    cursor: pointer;
    text-decoration: underline;
}

.send-view {
    width: 120px;
    height: 36px;
    background: #090C1D;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
}

.set-view {
    width: 54px;
    height: 36px;
    color: #090C1D;
    background: rgb(9, 12, 29, 0.1);
    border-radius: 24px;
    font-size: 12px;
    font-weight: 400;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
}

.loadmore-view {
    margin: 0 auto;
    margin-bottom: 40px;
    width: 220px;
    height: 44px;
    background: linear-gradient(270deg, #1E5CEF 0%, #628BEC 100%);
    border-radius: 22px;
    border: 1px solid #C3D5FF;
    font-size: 14px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 44px;
    text-align: center;
}

@media screen and (max-width: 767px) {
    .infinite-list-item {
        margin: 0 auto;
        width: 95%;
    }

    .card-item {
        width: 315px;
        padding: 10px;
        margin-left: 5px;
        margin-right: 5px;
        margin-top: 20px;
        background: #FFFFFF;
        border-radius: 10px;
        border: 1px solid #E4E4E4;
    }
}

@media screen and (min-width: 768px) {
    .card-item {
        width: 280px;
        padding: 10px;
        margin-left: 5px;
        margin-right: 5px;
        margin-top: 20px;
        background: #FFFFFF;
        border-radius: 10px;
        border: 1px solid #E4E4E4;
    }
}
</style>

<style scoped>
.dia-id-view {
    width: 153px;
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #090C1D;
    line-height: 22px;
}

.set-as-view {
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    text-align: left;
    padding: 10px 20px;
    margin-top: 10px;
    background: #F6F6FC;
    border-radius: 4px;
}

.dia-til-view {
    width: 80%;
    font-size: 14px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 20px;
}

.dia-sub-view {
    width: 80%;
    word-break: break-all;
    font-size: 12px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 17px;
}

.isSelect-view {
    border: 1px solid #4540D6;
}

.normal-view {
    border: 1px solid #A7A9BE;
}

.ok-btn {
    margin: 0 auto;
    width: 80%;
    height: 50px;
    background: #2E2F3E;
    border-radius: 4px;
    border: 1px solid #2E2F3E;
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
}
</style>

<style scoped>
@media screen and (max-width: 767px) {
    .send-dialogue-view {
        width: 200px;
    }
}

@media screen and (min-width: 768px) {
    .send-dialogue-view {
        width: 550px;
    }
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
    margin-top: 10px;
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
