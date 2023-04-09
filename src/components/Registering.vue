<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { domain } from "../router/domain";
import service from "../router/service";
import { DomainInfo, GasInfo } from "../router/type";

const props = defineProps({
    domainName: String,
    isAvailable: Boolean,
    gasInfo: {},
})

interface RowInfo {
    title: string;
    subTitle: string;
    index: number;
    link: string;
}

let state = reactive({
    info: {} as DomainInfo,
    gasInfo: {} as GasInfo,
    current: 0,
    rowInfo: [] as RowInfo[],
})

const waitingUrl = domain.domainImageUrl + 'icon_processing_waiting@2x.png';
const certainUrl = domain.domainImageUrl + 'icon_processing_ok@2x.png';
const loadingUrl = 'https://dmaster.com/dcommon/img/loading.svg';

onMounted(() => {
    state.info.name = props.domainName!
    state.info.isAvailable = props.isAvailable!

    state.rowInfo = [{
        title: 'Locked the dominate',
        subTitle: "Your domain name is locked. Don't worry about being preempted.",
        index: 1,
        link: certainUrl,
    }, {
        title: 'Fund Transfer Pending',
        subTitle: 'This may take 20 minutes',
        index: 2,
        link: waitingUrl,
    }, {
        title: 'Inscribing',
        subTitle: 'This may take 20 minutes',
        index: 3,
        link: waitingUrl,
    }, {
        title: 'Inscription transfer pending',
        subTitle: 'This may take 20 minutes',
        index: 4,
        link: waitingUrl,
    }];

    service.queryDomain(state.info.name).then((val1) => {
        if (val1.code == 0) {
            state.rowInfo.forEach(element => {
                element.link = certainUrl
            });
            state.info.isAvailable = false;
        } else if (val1.code == 311) {
            state.info.isAvailable = true;
            state.current = val1.data.dom_state;

            for (let i = 0; i < state.rowInfo.length; i++) {
                var element = state.rowInfo[i];
                if (i < state.current - 1) {
                    element.link = certainUrl
                } else if (i == state.current - 1) {
                    element.link = loadingUrl
                } else if (i > state.current - 1) {
                    element.link = waitingUrl
                }
            }
        }
    })
})
</script>

<template>
    <div class="registering-container">
        <div class="state-view">
            <el-row justify="space-between">
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="s-name">NAME</span></el-col>
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="s-name">STATE</span></el-col>
            </el-row>

            <el-row justify="space-between">
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="3"><span class="t-name">{{ state.info.name }}</span></el-col>
                <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2"><span class="t-name">{{ state.info.isAvailable ?
                    'Registering...' : 'Registered'
                }}</span></el-col>
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
                        Register
                    </div>
                </el-col>
            </el-row>

            <div class="title-view">Mint state</div>
            <div class="process-c-view">
                <el-row v-for="(item, index) in state.rowInfo" :key="index" justify="start" class="h-72">
                    <el-col :xs="4" :sm="4" :md="4" :lg="2" :xl="1">
                        <img :src="item.link" style="width: 32px;height: 32px;" alt="">
                    </el-col>
                    <el-col :xs="19" :sm="19" :md="19" :lg="21" :xl="22">
                        <div class="s-title">{{ item.title }}</div>
                        <div class="s-sub-title">{{ item.subTitle }}</div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<style scoped>
.registering-container {
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

.title-view {
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 22px;
}

.process-c-view {
    max-width: 1060px;
    margin: 0 auto;
}

.h-72 {
    height: 72px;
    padding: 16px;
}

.s-title {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #2E2F3E;
    line-height: 20px;
}

.s-sub-title {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 20px;
}
</style>
