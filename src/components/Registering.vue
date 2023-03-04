<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from "element-plus";

import { DomainInfo } from "../router/type";

import service from "../router/service";

const props = defineProps({
    domainName: String,
    isAvailable: Boolean,
})

let state = reactive({
    info: {} as DomainInfo
})

onMounted(() => {
    state.info.name = props.domainName!
    state.info.isAvailable = props.isAvailable!
})
</script>

<template>
    <div class="registering-container">
        <div class="state-view">
            <el-row justify="space-between">
                <el-col :span="2">NAME</el-col>
                <el-col :span="2">STATE</el-col>
            </el-row>

            <el-row justify="space-between">
                <el-col :span="3">{{ state.info.name }}</el-col>
                <el-col :span="2"> {{ state.info.isAvailable ? 'Available' : 'Registering...' }} </el-col>
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
                        Register
                    </div>
                </el-col>
            </el-row>

            <div class="title-view">Mint state</div>
            <div class="process-c-view">

                <!-- state 1 -->
                <el-row justify="start" class="h-72">
                    <el-col :span="1">
                        <img src="../assets/icon_processing_ok@2x.png" style="width: 32px;height: 32px;" alt="">
                    </el-col>
                    <el-col :span="15">
                        <div class="s-title">Fund Transfer Pending</div>
                        <div class="s-sub-title">This may take 20 minutes</div>
                    </el-col>
                </el-row>

                <!-- state 2 -->
                <el-row justify="start" class="h-72">
                    <el-col :span="1">
                        <img src="../assets/icon_processing_ok@2x.png" style="width: 32px;height: 32px;" alt="">
                    </el-col>
                    <el-col :span="15">
                        <div class="s-title">Locked the dominate</div>
                        <div class="s-sub-title">Your domain name is locked. Don't worry about being preempted.</div>
                    </el-col>
                </el-row>

                <!-- state 3 -->
                <el-row justify="start" class="h-72">
                    <el-col :span="1">
                        <img src="https://dmaster.com/dcommon/img/loading.svg" style="width: 32px;height: 32px;" alt="">
                    </el-col>
                    <el-col :span="15">
                        <div class="s-title">Inscripting</div>
                        <div class="s-sub-title">This may take 20 minutes</div>
                    </el-col>
                </el-row>

                <!-- state 4 -->
                <el-row justify="start" class="h-72">
                    <el-col :span="1">
                        <img src="../assets/icon_processing_waiting@2x.png" style="width: 32px;height: 32px;" alt="">
                    </el-col>
                    <el-col :span="15">
                        <div class="s-title">Inscription Transfer Panding</div>
                        <div class="s-sub-title">This may take 20 minutes</div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<style scoped>
.registering-container {
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

.title-view {
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 22px;
}

.process-c-view {
    width: 1060px;
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
