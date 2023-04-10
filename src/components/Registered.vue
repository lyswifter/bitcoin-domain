<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onBeforeMount, onMounted, reactive } from 'vue';
import useClipboard from "vue-clipboard3";
import SearchInsView from "../components/SearchIns.vue";
import service from "../router/service";
import { DomainInfo, InscriptionItem } from "../router/type";
import { getTime } from "../router/util";

const props = defineProps({
    domainName: String,
    isAvailable: Boolean,
})

let state = reactive({
    info: {} as DomainInfo,
    searchItem: [] as InscriptionItem[],
})

const oridDomain = 'https://ordinals.com/inscription/';

function copyAction() {
    const toClipboard = useClipboard();

    toClipboard.toClipboard(state.info.owner).then((val) => {
        ElMessage.info("copied")
    })
}

function copyLinkAction() {
    const toClipboard = useClipboard();
    toClipboard.toClipboard(state.info.inscriptionId).then((val) => {
        ElMessage.info("copied")
    })
}

onBeforeMount(() => {
    state.info.name = props.domainName!
    state.info.isAvailable = props.isAvailable!
})

onMounted(() => {
    service.queryDomain(state.info.name).then((val) => {
        state.info.expire = getTime(val.data.expire_time, '')
        state.info.create = getTime(val.data.create_time, '')
        state.info.registration = getTime(val.data.create_time, '')
        state.info.inscriptionId = val.data.inscribe_id
        state.info.owner = val.data.owner_address

        service.queryInsWith(state.info.owner).then((val2) => {
            state.searchItem = val2.data.result
        })
    })
})
</script>

<template>
    <div class="registeried-container">
        <div class="state-view">
            <el-row justify="space-between">
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="s-name">NAME</span></el-col>
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="s-name">STATE</span></el-col>
            </el-row>

            <el-row justify="space-between">
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="3"><span class="t-name">{{ state.info.name }}</span></el-col>
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="t-name">{{ state.info.isAvailable ? 'Available'
                    : 'Unavailable' }}</span></el-col>
            </el-row>
        </div>

        <br>
        <br>

        <div class="re-content-view">
            <el-row justify="space-between" style="height: 60px;">
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="3">
                    <div class="domain-name-view">{{ state.info.name }}</div>
                </el-col>
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="3">
                    <div class="detail-view">
                        Details
                    </div>
                </el-col>
            </el-row>

            <div>
                <el-row justify="start">
                    <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2">
                        <span class="list-t-view">Owner</span>
                    </el-col>
                    <el-col :xs="18" :sm="20" :md="20" :lg="22" :xl="22">
                        <span class="owner-view">{{ state.info.owner }}</span>
                        <img src="../assets/icon_copy@2x.png"
                            style="width: 32px;height: 32px;cursor: pointer;vertical-align: middle;" alt=""
                            @click="copyAction">
                    </el-col>
                </el-row>

                <div class="line-view"></div>

                <el-row justify="start">
                    <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4">
                        <span class="list-t-view">Creatdate</span>
                    </el-col>
                    <el-col :xs="12" :sm="14" :md="16" :lg="18" :xl="20" class="t-right">
                        <span class="owner-view">{{ state.info.create }}</span>
                    </el-col>
                </el-row>

                <el-row justify="start">
                    <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4">
                        <span class="list-t-view">Registration Date</span>
                    </el-col>
                    <el-col :xs="12" :sm="14" :md="16" :lg="18" :xl="20" class="t-right">
                        <span class="owner-view">{{ state.info.registration }}</span>
                    </el-col>
                </el-row>

                <el-row justify="start">
                    <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4">
                        <span class="list-t-view">Expiration Date</span>
                    </el-col>
                    <el-col :xs="12" :sm="14" :md="16" :lg="18" :xl="20" class="t-right">
                        <span class="owner-view">{{ state.info.expire }}</span>
                    </el-col>
                </el-row>

                <br>
                <br>
                <br>

                <el-row justify="start">
                    <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4">
                        <span class="list-t-view">Inscription id</span>
                    </el-col>
                    <el-col :xs="12" :sm="14" :md="16" :lg="18" :xl="20">
                        <a :href="oridDomain + state.info.inscriptionId" target="_blank" style="word-break: break-all;">{{
                            state.info.inscriptionId }}</a>
                        <img src="../assets/icon_copy@2x.png"
                            style="width: 32px;height: 32px;cursor: pointer;vertical-align: middle;" alt=""
                            @click="copyLinkAction">
                    </el-col>
                </el-row>

                <br>
                <br>
            </div>

        </div>

        <SearchInsView v-if="state.searchItem.length > 0" :itemss="state.searchItem" />
    </div>
</template>

<style scoped>
.t-right {
    text-align: right;
}

.registeried-container {
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 40px;
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
    border-radius: 20px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 40px;
    text-align: center;
}

.line-view {
    margin-top: 25px;
    margin-bottom: 25px;
    border-bottom: 1px dashed #A7A9BE;
}

.list-t-view {
    color: #2E2F3E;
}

.owner-view {
    color: #2E2F3E;
    word-break: break-all;
}</style>
