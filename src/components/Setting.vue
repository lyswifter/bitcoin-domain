<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus';
import { ElMessage } from "element-plus";
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import useClipboard from "vue-clipboard3";
import FooterView from "../components/Footer.vue";
import HeaderView from "../components/Header.vue";
import router from "../router/index";

const headerRef = ref();

let stat = reactive({
    addr: '',
    privateKey: '',
    activeName: 'wallet',
    isExtVisiable: false,
    receiveddiaW: '20%',
})

const handleClick = (tab: TabsPaneContext, event: Event) => {
    switch (tab.paneName) {
        case 'wallet':
            break;

        default:
            break;
    }
}

function backAction() {
    router.go(-1)
}

function copyAction() {
    const toClipboard = useClipboard();
    toClipboard.toClipboard(stat.addr).then((val) => {
        ElMessage.info("copied")
    })
}

function copyPrivateAction() {
    const toClipboard = useClipboard();
    toClipboard.toClipboard(stat.privateKey).then((val) => {
        ElMessage.info("copied")
        stat.isExtVisiable = false
        stat.privateKey = ''
    })
}

function disconnectAction() {
    headerRef.value.doDisconnect()
    router.push({ name: 'home' })
}

function exportPrivateKey() {
    headerRef.value.exportPrivateKey().then((priKey: string) => {
        stat.privateKey = priKey
        stat.isExtVisiable = true
    })
}

onBeforeMount(() => {
})

onMounted(() => {
    let addr = localStorage.getItem('bitcoin_address')
    if (addr) {
        stat.addr = addr
    }

    if (window.innerWidth < 767) {
        stat.receiveddiaW = '96%';
    } else {
        stat.receiveddiaW = '30%';
    }
})

</script>

<template>
    <div class="setting-container">
        <HeaderView class="header-view" ref="headerRef" :avatar-addr="stat.addr" />

        <div class="setting-content-view">
            <div class="nav-view">
                <img src="../assets/icon_back@2x.png" width="32" height="32" alt="nav-img" @click="backAction">
                <div style="line-height: 32px;">Setting</div>
            </div>

            <div class="tab-view">
                <el-tabs v-model="stat.activeName" class="setting-tabs-view" @tab-click="handleClick">
                    <el-tab-pane label="Wallet" name="wallet">
                        <div class="wallet-addr-view">
                            <div>{{ stat.addr }}</div>
                            <img src="../assets/icon_copy_black@2x.png" width="32" height="32" alt="copy-addr"
                                @click="copyAction">
                        </div>

                        <div class="row-view" @click="exportPrivateKey">
                            <div>Export private key</div>
                            <img src="../assets/icon_right_black@2x.png" width="24" height="24" alt="">
                        </div>

                        <div class="row-view" @click="disconnectAction">
                            <div>Disconnect wallet</div>
                            <img src="../assets/icon_right_black@2x.png" width="24" height="24" alt="">
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>

        <FooterView class="footer-view" />

        <el-dialog v-model="stat.isExtVisiable" :show-close="true" :align-center="true" :width="400">
            <template #header="{ close, titleId, titleClass }">
                <div class="my-header">
                    <h4 :id="titleId" :class="titleClass">Export private key</h4>
                </div>
            </template>

            <div>
                <div>Private Key</div>
                <div class="wallet-private-view">
                    <div>{{ stat.privateKey }}</div>
                    <img src="../assets/icon_copy_black@2x.png" width="32" height="32" alt="copy-addr"
                        @click="copyPrivateAction">
                </div>

                <div class="pri-tip-view">* Anyone who has the private key can take control your account. Please manage it
                    properly.</div>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.setting-content-view {
    min-height: 800px;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
}

.nav-view {
    margin-top: 20px;
    display: flex;
}

.nav-view img {
    cursor: pointer;
}

.tab-view {
    margin-top: 10px;
}

@media screen and (max-width: 767px) {
    .wallet-addr-view {
        display: flex;
        justify-content: space-between;
        word-break: break-all;
        padding-left: 20px;
        padding-right: 20px;
        background: #F6F6FC;
        border: 1px solid #A7A9BE;
        padding-top: 10px;
        padding-bottom: 10px;
    }
}

@media screen and (min-width: 768px) {
    .wallet-addr-view {
        display: flex;
        justify-content: space-between;
        word-break: break-all;
        height: 60px;
        padding-left: 20px;
        padding-right: 20px;
        background: #F6F6FC;
        border: 1px solid #A7A9BE;
        line-height: 60px;
    }
}

.wallet-addr-view img {
    margin-top: 15px;
    cursor: pointer;
}

.row-view {
    display: flex;
    justify-content: space-between;
    height: 44px;
    font-size: 14px;
    font-weight: 400;
    color: #2E2F3E;
    line-height: 44px;
    cursor: pointer;
    border-bottom: 1px solid;
    border-bottom-color: #A7A9BE;
}

.row-view img {
    margin-top: 5px;
}

.wallet-private-view {
    display: flex;
    justify-content: space-between;
    word-break: break-all;
    padding-left: 10px;
    padding-right: 10px;
    height: 60px;
    background: #F6F6FC;
    border: 1px solid #A7A9BE;
    font-size: 14px;
    font-weight: 400;
    color: #090C1D;
    line-height: 30px;
}

.wallet-private-view img {
    margin-top: 10px;
    cursor: pointer;
}

.pri-tip-view {
    margin-top: 20px;
    height: 40px;
    font-size: 14px;
    font-weight: 600;
    color: #A7A9BE;
    line-height: 20px;
}
</style>
