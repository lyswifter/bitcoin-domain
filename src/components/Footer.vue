<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from "element-plus";

import data from "../router/data";

let state = reactive({ input: '', isMintAble: false, isMinting: false, inscriptId: '', targetAddr: '' })

onMounted(() => {
})

</script>

<template>
    <div class="footer-container">
        <div class="f-c-view">
            <el-row>
                <el-col :span="1">
                    <img src="../assets/邮箱@2x.png" style="width: 40px;height: 40px;vertical-align: middle;" alt="">
                </el-col>
                <el-col :span="15">
                    <div class="email-view">contact@dmaster.com</div>
                </el-col>
                <el-col :span="8">
                    <div class="block-logo-view">
                        btcdomain
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<style scoped>
.footer-container {
    height: 100px;
    width: 100%;
    background: #FFFFFF;
}

.f-c-view {
    height: 100px;
    margin: 0 auto;
    width: 1024px;
    background: #FFFFFF;
}

.email-view {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #222840;
    line-height: 21px;
}

.block-logo-view {
    height: 23px;
    font-size: 24px;
    font-family: CamarRegular;
    color: #2E2F3E;
    line-height: 23px;
}
</style>
