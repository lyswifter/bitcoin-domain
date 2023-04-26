<script setup lang="ts">
import { ElMessage } from "element-plus";
import { reactive, ref } from 'vue';
import FooterView from "../components/Footer.vue";
import HeaderView from "../components/Header.vue";
import { signAsync } from "../crypto/sign";
import router from "../router/index";
import { DomainLink, Links } from "../router/type";

const headerRef = ref();
const hellowordLink = 'https://helloworld.btcwallet.network' //https://helloworld.btc.page

let stat = reactive({
    addr: '',
    domainName: '',
    insHash: '',
    outputJson: '',
    isOutVisiable: false,
    steps: [{
        titl: 'STEP 1',
        cont: 'Inscribe the web HTML code and copy the Inscription ID',
    }, {
        titl: 'STEP 2',
        cont: 'Input your domain name, the Inscription ID in step 1, generate signature, and download JSON file.',
    }, {
        titl: 'STEP 3',
        cont: 'Join DC, access .btc channel, and request a ticket for .btc page.',
    }]
})

function backAction() {
    router.go(-1)
}

async function signDomainLink() {
    if (!stat.domainName) {
        ElMessage.warning("domain name not be empty")
        return
    }

    if (!stat.domainName.endsWith('.btc')) {
        ElMessage.warning("domain name is not valid")
        return
    }

    if (!stat.insHash) {
        ElMessage.warning("inscription id not be empty")
        return
    }

    let linkfile = {
        type: 'btcdomain_link',
        domain: stat.domainName,
        obj_ins_id: stat.insHash,
        public_key: localStorage.getItem('public_key'),
    } as DomainLink;

    let linefile_json = JSON.stringify(linkfile)
    let signRet = await signAsync(linefile_json)
    linkfile.sig = signRet

    stat.outputJson = JSON.stringify(linkfile)

    stat.isOutVisiable = true
}

function downloadAction() {
    let blob = new Blob([stat.outputJson]);
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.setAttribute("download", "signature.json");
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
}
</script>

<template>
    <div class="bsite-container">
        <HeaderView class="header-view" ref="headerRef" :avatar-addr="stat.addr" />

        <div class="bsite-content-view">
            <div class="nav-view">
                <img src="../assets/icon_back@2x.png" width="32" height="32" alt="nav-img" @click="backAction">
                <div style="line-height: 32px;">Get your .btc website</div>
            </div>

            <br>

            <div class="tip-view">
                <img src="../assets/icon_16_tips@2x.png" width="16" height="16" alt="">Currently, this feature is only
                available for internal testing users.
            </div>
            <br>

            <div class="step-view">
                <div class="ver-line-view"></div>
                <div class="step-item-view">
                    <div v-for="(item, idx) in stat.steps" :key="idx">
                        <div class="step-titl-out-view">
                            <div class="step-titl-view">{{ item.titl }}</div>
                            <div class="hori-line-view"></div>
                        </div>
                        <div class="step-cont-view">{{ item.cont }} <a v-if="idx == 2" :href="Links.discord">Join our
                                Discoed</a></div>
                    </div>
                </div>
            </div>

            <div class="join-view">
                <a :href="hellowordLink">View .btc website demo</a>
                <img src="../assets/icon_arrow_purple@2x.png" width="24" height="24" alt="">
            </div>

            <br>

            <div class="domain-input-view">
                <div class="titl-prompt">Your Domain Name</div>
                <el-input v-model="stat.domainName" placeholder="Your Domain Name" style="height: 48px;" />
            </div>

            <br>

            <div class="ins-input-view">
                <div class="titl-prompt">Inscription ID</div>
                <el-input v-model="stat.insHash" placeholder="Inscription ID" style="height: 48px;" />
                <div class="titl-tips">* The Inscription ID of your website HTML code inscription.</div>
            </div>

            <br>
            <br>

            <div class="gen-view" @click="signDomainLink">Generate</div>

            <div class="output-view" v-if="stat.isOutVisiable">
                <div class="json-view">{{ stat.outputJson }}</div>
                <div class="download-view">
                    <div></div>
                    <div class="download-btn" @click="downloadAction">Download</div>
                </div>
            </div>
        </div>

        <FooterView class="footer-view" />
    </div>
</template>

<style scoped>
.bsite-content-view {
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

.tip-view {
    margin-top: 10px;
    margin-bottom: 10px;
}

.step-titl-view {
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #4540D6;
    line-height: 20px;
}

.step-cont-view {
    font-size: 12px;
    font-weight: 400;
    color: #626585;
    line-height: 24px;
}

.join-view {
    margin-top: 10px;
    margin-bottom: 10px;
}

.gen-view {
    margin: 0 auto;
    width: 335px;
    height: 50px;
    margin-bottom: 20px;
    background: #4540D6;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
}

.titl-prompt {
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #2E2F3E;
    line-height: 17px;
}

.titl-tips {
    height: 17px;
    font-size: 12px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 17px;
}

.output-view {
    margin: 0 auto;
    max-width: 1160px;
    margin-bottom: 20px;
    background: #FCFCFC;
    border-radius: 4px;
    border: 1px solid #C9CDD4;
}

.json-view {
    padding: 20px;
    min-height: 119px;
    font-size: 12px;
    font-weight: 400;
    color: #2E2F3E;
    line-height: 17px;
    text-align: left;
    line-break: anywhere;
}

.download-view {
    height: 48px;
    background: #EFEFEF;
    border-radius: 4px;
    display: flex;
    justify-content: end;
}

.download-btn {
    width: 120px;
    height: 48px;
    background: #2E2F3E;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 48px;
    text-align: center;
    cursor: pointer;
}

@media screen and (max-width: 767px) {
    .step-view {
        padding: 12px;
        background: #F6F6FC;
        border-radius: 10px;
        border: 1px solid #A7A9BE;
        display: flex;
    }

    .ver-line-view {
        border-right: 1px dashed #4540D6;
    }

    .step-item-view {
        width: 97%;
        margin-left: 10px;
    }
}

@media screen and (min-width: 768px) {
    .step-view {
        padding: 12px;
        background: #F6F6FC;
        border-radius: 10px;
        border: 1px solid #A7A9BE;
        display: flex;
    }

    .ver-line-view {
        display: none;
    }

    .step-item-view {
        width: 97%;
        display: flex;
    }

    .step-titl-out-view {
        display: flex;
    }

    .hori-line-view {
        min-width: 70%;
        height: 10px;
        margin-left: 5%;
        border-bottom: 1px dashed #4540D6;
    }
}
</style>
