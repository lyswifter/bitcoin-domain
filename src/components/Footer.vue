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
        <el-row justify="end">
            <el-col :span="18">
                <div class="email-view">
                    <img src="../assets/邮箱@2x.png" style="width: 40px;height: 40px;vertical-align: middle;" alt="">
                    contact@dmaster.com
                </div>
            </el-col>
            <el-col :span="3">
                <div class="block-logo-view">
                    btcdomain
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.footer-container {
    border-top: 1px solid lightgray;
    height: 100px;
    width: 100%;
    background: #FFFFFF;
}

.email-view {
    height: 100px;
    font-size: 14px;
    font-weight: 400;
    color: #222840;
    line-height: 100px;
}

.block-logo-view {
    height: 100px;
    font-size: 24px;
    font-family: CamarRegular;
    color: #2E2F3E;
    line-height: 100px;
}
</style>
