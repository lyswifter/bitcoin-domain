<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from "element-plus";

import { DomainInfo } from "../router/type";
import service from "../router/service";

import useClipboard from "vue-clipboard3";

import { getTime } from "../router/util";

const props = defineProps({
    domainName: String,
    isAvailable: Boolean,
})

let state = reactive({
    info: {} as DomainInfo
})

function copyAction() {
    const toClipboard = useClipboard();

    toClipboard.toClipboard(state.info.owner).then((val) => {
        ElMessage.info("copied")
    })
}

onMounted(() => {
    state.info.name = props.domainName!
    state.info.isAvailable = props.isAvailable!

    service.queryDomain(state.info.name).then((val) => {
        state.info.expire = getTime(val.data.expire_time, '')
        state.info.create = getTime(val.data.create_time, '')
        state.info.registration = getTime(val.data.create_time, '')
        state.info.inscriptionId = val.data.inscribe_id
        state.info.owner = val.data.owner_address
    })
})
</script>

<template>
    <div class="registeried-container">
        <div class="state-view">
            <el-row justify="space-between">
                <el-col :span="2"><span class="s-name">NAME</span></el-col>
                <el-col :span="2"><span class="s-name">STATE</span></el-col>
            </el-row>

            <el-row justify="space-between">
                <el-col :span="3">{{ state.info.name }}</el-col>
                <el-col :span="2"> {{ state.info.isAvailable ? 'Available' : 'Unavailable' }} </el-col>
            </el-row>
        </div>

        <br>
        <br>

        <div class="re-content-view">
            <el-row justify="space-between" style="height: 60px;">
                <el-col :span="3">
                    <div class="domain-name-view">{{ state.info.name }}</div>
                </el-col>
                <el-col :span="3">
                    <div class="detail-view">
                        Details
                    </div>
                </el-col>
            </el-row>

            <div>
                <el-row justify="start">
                    <el-col :span="4">
                        <span class="list-t-view">Owner</span>
                    </el-col>
                    <el-col :span="14">
                        <span class="owner-view">{{ state.info.owner }}</span>
                        <img src="../assets/icon_copy@2x.png"
                            style="width: 32px;height: 32px;cursor: pointer;vertical-align: middle;" alt=""
                            @click="copyAction">
                    </el-col>
                </el-row>

                <div class="line-view"></div>

                <el-row justify="start">
                    <el-col :span="4">
                        <span class="list-t-view">Creatdate</span>
                    </el-col>
                    <el-col :span="14">
                        <span class="owner-view">{{ state.info.create }}</span>
                    </el-col>
                </el-row>

                <el-row justify="start">
                    <el-col :span="4">
                        <span class="list-t-view">Registration Date</span>
                    </el-col>
                    <el-col :span="14">
                        <span class="owner-view">{{ state.info.registration }}</span>
                    </el-col>
                </el-row>

                <el-row justify="start">
                    <el-col :span="4">
                        <span class="list-t-view">Expiration Date</span>
                    </el-col>
                    <el-col :span="14">
                        <span class="owner-view">{{ state.info.expire }}</span>
                    </el-col>
                </el-row>

                <br>
                <br>
                <br>

                <el-row justify="start">
                    <el-col :span="4">
                        <span class="list-t-view">Inscription id</span>
                    </el-col>
                    <el-col :span="14">
                        <a class="owner-view" href="https://baidu.com">{{ state.info.inscriptionId }}</a>
                        <img src="../assets/icon_link@2x.png"
                            style="width: 32px;height: 32px;cursor: pointer;vertical-align: middle;" alt="">
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<style scoped>
.registeried-container {
    width: 1200px;
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
}</style>
