<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onBeforeMount, onMounted, reactive } from 'vue';
import useClipboard from "vue-clipboard3";
import SearchInsView from "../components/SearchIns.vue";
import { LoadingSvg } from "../router/domain";
import service from "../router/service";
import { Domain, InscriptionItem } from "../router/type";
import { getTime, shortenInsId } from "../router/util";

const emit = defineEmits({
    connectParentAction(addr: string) { },
})

const props = defineProps({
    domainName: String,
    isAvailable: Boolean,
})

let state = reactive({
    isPhone: false,
    info: {} as Domain,
    searchItem: [] as InscriptionItem[],
    loading: true,
    blockchainLink: 'https://www.blockchain.com/explorer/transactions/btc/'
})

const oridDomain = 'https://ordinals.com/inscription/';

function copyAction() {
    const toClipboard = useClipboard();
    toClipboard.toClipboard(state.info.owner_address).then((val) => {
        ElMessage.info("copied")
    })
}

function copyLinkAction() {
    const toClipboard = useClipboard();
    toClipboard.toClipboard(state.info.inscribe_id).then((val) => {
        ElMessage.info("copied")
    })
}

function viewAllAction() {
    emit('connectParentAction', state.info.owner_address)
}

onBeforeMount(() => {
    state.info.dom_name = props.domainName!
    state.info.is_available = props.isAvailable!
})

onMounted(() => {
    if (window.innerWidth < 767) {
        state.isPhone = true
    }

    service.queryDomain(state.info.dom_name).then((val) => {
        state.info = val.data as Domain
        state.info.expire_time = getTime(state.info.expire_time, '')
        state.info.create_date = getTime(state.info.create_date, '')
        state.info.register_date = getTime(state.info.register_date, '')
        state.info.short_ins_id = shortenInsId(state.info.inscribe_id, 8),
        state.info.short_owner_addr = shortenInsId(state.info.owner_address, 8),
        state.blockchainLink = state.blockchainLink + state.info.inscribe_id.substring(0, state.info.inscribe_id.length -2)

        state.loading = true
        service.queryInsWith(state.info.owner_address).then((val2) => {
            state.searchItem = val2.data.result
            state.loading = false
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
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="3"><span class="t-name">{{ state.info.dom_name
                }}</span></el-col>
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="t-name">{{ state.info.is_available ?
                    'Available'
                    : 'Unavailable' }}</span></el-col>
            </el-row>
        </div>

        <br>
        <br>

        <div class="re-content-view">
            <div class="domain-pic-view">
                <img :src="state.info.img_url" alt="">
            </div>

            <div class="domain-content-view">
                <div class="row-view owner-view">
                    <div class="list-t-view">Owner</div>
                    <div class="owner-view owner-addr-view">{{ state.isPhone ? state.info.short_owner_addr :
                        state.info.owner_address }}
                        <img src="../assets/icon_copy@2x.png"
                            style="width: 32px;height: 32px;cursor: pointer;vertical-align: middle;" alt=""
                            @click="copyAction">
                    </div>
                </div>

                <div class="line-view"></div>

                <div class="row-view">
                    <div class="list-t-view">Inscription id</div>
                    <div>
                        <a :href="oridDomain + state.info.inscribe_id" target="_blank" style="word-break: break-all;">{{
                            state.info.short_ins_id }}</a>
                        <img src="../assets/icon_copy@2x.png"
                            style="width: 32px;height: 32px;cursor: pointer;vertical-align: middle;" alt=""
                            @click="copyLinkAction">
                    </div>
                </div>

                <div class="row-view">
                    <div class="list-t-view">Create date</div>
                    <div class="owner-view">{{ state.info.create_date }}</div>
                </div>

                <div class="row-view">
                    <div class="list-t-view">Registration date</div>
                    <div class="owner-view">{{ state.info.register_date }}</div>
                </div>

                <div class="row-view">
                    <div class="list-t-view">Expiration date</div>
                    <div class="owner-view">{{ state.info.expire_time }}</div>
                </div>

                <br>
                <br>
                <br>

                <div class="row-view">
                    <div></div>
                    <div>
                        <a :href="state.blockchainLink" target="_blank">View On Bitcoin Mainnet</a>
                    </div>
                </div>

                <br>
                <br>
            </div>
        </div>

        <div class="row-view">
            <div class="ins-title-view">Inscription From This Owner</div>
            <!-- <div class="view-all-view" @click="viewAllAction">View All</div> -->
        </div>

        <SearchInsView v-if="state.searchItem.length > 0 && !state.loading" :itemss="state.searchItem"></SearchInsView>
        <div class="loading-view" v-else>
            <img :src="LoadingSvg" width="40" height="40" alt="">
        </div>
    </div>
</template>

<style scoped>
.t-right {
    text-align: right;
}

.loading-view {
    text-align: center;
    min-height: 300px;
}

.registeried-container {
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 40px;
    padding-left: 10px;
    padding-right: 10px;
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
}

.domain-pic-view {
    text-align: center;
}

.row-view {
    display: flex;
    justify-content: space-between;
}

.ins-title-view {
    height: 28px;
    font-size: 20px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 28px;
}

.view-all-view {
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #4540D6;
    line-height: 22px;
    cursor: pointer;
}

@media screen and (max-width: 767px) {
    .domain-content-view {
        margin-top: 20px;
    }

    .domain-pic-view img {
        width: 335px;
        height: 335px;
    }
}

@media screen and (min-width: 768px) {
    .re-content-view {
        display: flex;
        justify-content: space-between;
    }

    .owner-addr-view {
        margin-left: 200px;
    }

    .domain-pic-view img {
        width: 260px;
        height: 260px;
    }
}
</style>
