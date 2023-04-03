<script setup lang="ts">
import { ElMessage } from "element-plus";
import { reactive } from 'vue';
import useClipboard from "vue-clipboard3";
import HeaderView from "../components/Header.vue";
import { signAsync } from "../crypto/sign";
import { PersonInfo } from "../router/type";

import service from "../router/service";

let state = reactive({
    pinfo: {
        id: 1,
        inscribeId: "fasdfsdf",
        address: "lsofj'asdolgn",
        contentUrl: "xxxx",
        contentType: "json",
        domain: "www.btc.domain",
        createTime: "xxxxx",
        updateTime: "yyyy",
    } as PersonInfo
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

}

function showQrCodeAction() {
}

</script>

<template>
    <div class="wallet-container">
        <HeaderView class="header-view" />

        <div class="top-information-view">
            <div class="top-inner-view">

                <div class="info-view">
                    <img class="avatar-view" src="../assets/icon_btc@2x.png" alt="">

                    <div class="nick-addr-view">
                        <div class="nickname-view">btcdoamin.btc</div>
                        <div class="addrname-view">bc1puz…344ne0<img src="../assets/icon_copy_white@2x.png"
                                style="width: 24px;height: 24px;cursor: pointer;margin-left: 10px;" alt=""
                                @click="copyAction"><img src="../assets/icon_qrcode@2x.png"
                                style="width: 24px;height: 24px;cursor: pointer;;margin-left: 10px;" alt=""
                                @click="showQrCodeAction"></div>
                    </div>

                    <div class="disconnect-view dis-postion web-hidden">Disconnect</div>

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
    </div>
</template>

<style scoped>
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
    font-size: 20px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 28px;
    background: rgba(69, 64, 214, 1);
    border-radius: 24px;
    padding-left: 10px;
    padding-right: 10px;
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

.actions-view {
    display: flex;
    justify-content: space-between;
}

.send-one {
    width: 126px;
}

.receive-one {
    width: 126px;
    margin-left: 19px;
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
}

@media screen and (min-width: 768px) {
    .dis-postion {
        margin-top: 60px;
    }
}
</style>
