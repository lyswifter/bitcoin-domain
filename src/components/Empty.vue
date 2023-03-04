<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from "element-plus";

import data from "../router/data";

let state = reactive({ input: '', isMintAble: false, isMinting: false, inscriptId: '', targetAddr: '' })

function inputChange(value: string | number) {
    if (value) {
        state.isMintAble = true
    } else {
        state.isMintAble = false
    }
}

onMounted(() => {
})
</script>

<template>
</template>

<style scoped>
</style>
