<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

onMounted(() => {
})
</script>

<template>
    <div class="start-container">
        <el-row justify="space-evenly">
            <el-col :span="4" style="text-align: center;">
                <div>
                    <img src="../assets/icon_search@2x.png" style="width: 278px;height: 240px;" alt="">
                </div>

                <div class="text-view">Search</div>
            </el-col>

            <el-col :span="4" style="text-align: center;">
                <div>
                    <img src="../assets/icon_register@2x.png" style="width: 278px;height: 240px;" alt="">
                </div>

                <div class="text-view">Register</div>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.search-text-view {
    width: 89px;
    height: 40px;
    font-size: 28px;
    font-weight: 300;
    color: #2E2F3E;
    line-height: 40px;
}
</style>
