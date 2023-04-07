<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted, reactive } from 'vue';
import openapi from "../crypto/openapi";

let stat = reactive({
})

onMounted(async () => {
    let addr = localStorage.getItem('bitcoin_address')
    if (!addr) {
        ElMessage.warning("from address must not be empty")
        return
    }

    let history = await openapi.getAddressRecentHistory(addr)
    console.log(history)
})

</script>

<template>
    <div class="hist-container-view">
        HISTORY
    </div>
</template>

<style scoped></style>
