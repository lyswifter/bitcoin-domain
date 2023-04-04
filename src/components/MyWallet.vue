<script setup lang="ts">
import { ElMessage } from "element-plus";
import { reactive, ref } from 'vue';
import useClipboard from "vue-clipboard3";
import HeaderView from "../components/Header.vue";
import HistoryView from "../components/History.vue";
import InscriptionView from "../components/MyInscriptions.vue";
import { signAsync } from "../crypto/sign";
import router from "../router/index";
import service from "../router/service";
import { PersonInfo } from "../router/type";

const headerRef = ref();

let state = reactive({
    pinfo: {
        id: 1,
        inscribeId: "fasdfsdf",
        address: "bc1puv6k8ht73ddwze0dmm9m8m6k44cnre7lzyxq84qlw9hkcjr5qv6sjqdjnc",
        contentUrl: "xxxx",
        contentType: "json",
        domain: "www.btc.domain",
        createTime: "xxxxx",
        updateTime: "yyyy",
    } as PersonInfo, activeName: 'inscription', isReceiveShow: false,
})

function copyAction() {
    const toClipboard = useClipboard();
    toClipboard.toClipboard(state.pinfo.address).then((val) => {
        ElMessage.info("copied")
    })
}

function sendAction() {
    let addr = localStorage.getItem('bitcoin_address')
    if (addr) {
        signAsync(addr).then((val) => {
            console.log("sign ret: " + val)
            service.avatarSet('01a22903bf8ba76d68edd1d1cd344178591713ffc7ce718a12704e1135da5126i0', addr!, '1111.btc', val).then((ret) => {
                console.log("avatar set: " + ret)
            })
        })
    }
}

function receiveAction() {
    state.isReceiveShow = true
}

function copyReveiveAddr() {
    const toClipboard = useClipboard();
    toClipboard.toClipboard(state.pinfo.address).then((val) => {
        ElMessage.info("copied")
    })
}

function showQrCodeAction() {
    state.isReceiveShow = true
}

function handleClick() {
}

function disconnectAction() {
    headerRef.value.doDisconnect()
    router.push({ name: 'home' })
}

</script>

<template>
    <div class="wallet-container">
        <HeaderView class="header-view" ref="headerRef" />

        <div class="top-information-view">
            <div class="top-inner-view">
                <div class="info-view">
                    <div class="topwarp-view">
                        <img class="avatar-view" src="../assets/icon_btc@2x.png" alt="">
                        <div class="nick-addr-view">
                            <div class="nickname-view">btcdoamin.btc</div>
                            <div class="addrname-view">bc1puz…344ne0<img src="../assets/icon_copy_white@2x.png"
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
                            <div class="btc-view">0.00093834 BTC <img src="../assets/icon_q@2x.png" alt="" width="24"
                                    height="24"></div>
                            <div class="usdt-view">≈ 25.4323 USDT</div>
                        </div>
                    </div>

                    <div class="actions-view">
                        <div class="action-view send-one" @click="sendAction">Send <img src="../assets/icon_send@2x.png"
                                alt="" width="24" height="24"></div>
                        <div class="action-view receive-one" @click="receiveAction">Receive <img
                                src="../assets/icon_receive@2x.png" alt="" width="24" height="24"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mid-content-view">
            <el-tabs v-model="state.activeName" class="mywallet-tabs" @tab-click="handleClick">
                <el-tab-pane label="Inscription" name="inscription">
                    <InscriptionView :ref="state.pinfo.address" />
                </el-tab-pane>
                <el-tab-pane label="History" name="history">
                    <HistoryView />
                </el-tab-pane>
            </el-tabs>
        </div>

        <el-dialog v-model="state.isReceiveShow" :show-close="true" :align-center="true" :width="440">
            <template #header="{ close, titleId, titleClass }">
                <div class="my-header">
                    <h4 :id="titleId" :class="titleClass">Receive BTC</h4>
                </div>
            </template>

            <div style="text-align: center;">
                <vue-qrcode :value="state.pinfo.address" :options="{ width: 200 }"></vue-qrcode>
                <br>
                <div style="display: flex;">
                    <div style="max-width: 356px;word-break: break-all;text-align: left;">{{ state.pinfo.address }}</div>
                    <img src="../assets/icon_copy_black@2x.png" style="cursor: pointer;" alt="" width="24" height="24"
                        @click="copyReveiveAddr">
                </div>
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
    width: 257px;
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
