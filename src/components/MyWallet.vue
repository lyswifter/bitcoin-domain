<script setup lang="ts">
import { ElMessage } from "element-plus";
import { reactive } from 'vue';
import useClipboard from "vue-clipboard3";
import HeaderView from "../components/Header.vue";
import { PersonInfo } from "../router/type";

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

function showQrCodeAction() {
}

</script>

<template>
    <div class="wallet-container">
        <HeaderView class="header-view" />

        <div class="top-information-view">
            <div class="top-inner-view">
                <img class="avatar-view" src="../assets/icon_btc@2x.png" alt="">

                <div class="disconnect-view dis-postion web-hidden">Disconnect</div>

                <div class="info-view">
                    <div class="nickname-view">btcdoamin.btc</div>
                    <div class="addrname-view">bc1puz…344ne0<img src="../assets/icon_copy_white@2x.png"
                            style="width: 24px;height: 24px;cursor: pointer;margin-left: 10px;" alt=""
                            @click="copyAction"><img src="../assets/icon_qrcode@2x.png"
                            style="width: 24px;height: 24px;cursor: pointer;;margin-left: 10px;" alt=""
                            @click="showQrCodeAction"></div>
                </div>

                <div class="line-view"></div>

                <div class="assets-view row">
                    <img class="money-view col-1" src="../assets/icon_btc@2x.png" alt="" width="32" height="32">

                    <div class="nums-view col-6">
                        <div class="btc-view">0.00093834 BTC <img src="../assets/icon_q@2x.png" alt="" width="24"
                                height="24"></div>
                        <div class="usdt-view">≈ 25.4323 USDT</div>
                    </div>

                    <div class="actions-view col-8">
                        <div class="action-view send-one">Send <img src="../assets/icon_send@2x.png" alt="" width="24"
                                height="24"></div>
                        <div class="action-view receive-one">Receive <img src="../assets/icon_receive@2x.png" alt=""
                                width="24" height="24"></div>
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
    background: linear-gradient(180deg, #4540D6 0%, #BFEAFF 100%);
}

.top-inner-view {
    max-width: 1200px;
    margin: 0 auto;
}

.avatar-view {
    width: 140px;
    height: 140px;
    margin-top: 20px;
    margin-left: 20px;
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
}

.money-view {
    width: 32px;
}

.nums-view {
    /* float: right; */
    width: 74%;
    color: white;
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

.send-one {
    width: 126px;
}

.action-view {
    height: 48px;
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
    .info-view {
        margin-top: 10px;
        margin-left: 20px;
    }

    .dis-postion {
        float: right;
        margin-top: 60px;
    }

    .actions-view {
        color: white;
    }

    .receive-one {
        /* float: right; */
        width: 126px;
    }
}

@media screen and (min-width: 768px) {
    .info-view {
        float: right;
        margin-top: 50px;
        margin-right: 30%;
    }

    .dis-postion {
        float: right;
        margin-top: 60px;
    }

    .actions-view {
        /* float: right; */
        width: 22%;
        color: white;
    }

    .receive-one {
        /* float: right; */
        width: 126px;
    }
}
</style>
