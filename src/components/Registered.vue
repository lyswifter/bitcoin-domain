<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from "element-plus";

import service from "../router/service";

interface DomainInfo {
    name: string;
    owner: string;
    create: string;
    registration: string;
    expire: string;
    inscriptionId: string;
    isAvailable: boolean;
}

let state = reactive({
    info: {
        name: 'BTCDomino.btc',
        owner: '187mGMMjzhBNy4na3hm7AbovTWC9pmVV7c',
        create: '2024.03.16 05:23',
        registration: '2024.03.16 05:23',
        expire: '2024.03.16 05:23',
        inscriptionId: '333e66bad68a967bd98d16dbc03d1d055050fbb856f1d00ca19b2deObf9a96e90',
        isAvailable: false,
    } as DomainInfo
})

function copyAction() {
    // VueClip.$copyText(state.info.owner).then(function(e: string){
    //     ElMessage.info("copied" + e)
    // })
}

onMounted(() => {
})
</script>

<template>
    <div class="registeried-container">
        <div class="state-view">
            <el-row justify="space-between">
                <el-col :span="2">NAME</el-col>
                <el-col :span="2">STATE</el-col>
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
                        <span class="owner-view">{{state.info.owner}}</span>
                        <img src="../assets/icon_copy@2x.png" style="width: 32px;height: 32px;cursor: pointer;vertical-align: middle;" alt="" @click="copyAction">
                    </el-col>
                </el-row>

                <div class="line-view"></div>

                <el-row justify="start">
                    <el-col :span="4">
                        <span class="list-t-view">Creatdate</span>
                    </el-col>
                    <el-col :span="14">
                        <span class="owner-view">{{state.info.create}}</span>
                    </el-col>
                </el-row>

                <el-row justify="start">
                    <el-col :span="4">
                        <span class="list-t-view">Registration Date</span>
                    </el-col>
                    <el-col :span="14">
                        <span class="owner-view">{{state.info.registration}}</span>
                    </el-col>
                </el-row>

                <el-row justify="start">
                    <el-col :span="4">
                        <span class="list-t-view">Expiration Date</span>
                    </el-col>
                    <el-col :span="14">
                        <span class="owner-view">{{state.info.expire}}</span>
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
                        <a class="owner-view" href="https://baidu.com">{{state.info.inscriptionId}}</a>
                        <img src="../assets/icon_link@2x.png" style="width: 32px;height: 32px;cursor: pointer;vertical-align: middle;" alt="">
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
}
</style>
