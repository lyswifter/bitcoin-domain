<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onBeforeMount, onMounted, reactive } from 'vue';
import openapi from "../crypto/openapi";
import { TxHistoryItem } from '../shared/types';

const sSmall = 767

const props = defineProps({
    address: String,
})

let stat = reactive({
    addr: '',
    histData: [] as TxHistoryItem[],
    tableW: '',
    tableH: '',
})

let columns = [] as any[]

function generateColumns(sw: number) {
    return [{
        key: 'date',
        title: 'Date',
        dataKey: 'date',
        width: sw > sSmall ? sw * 0.1 : sw * 0.25,
        align: 'left'
    }, {
        key: 'address',
        title: 'Address',
        dataKey: 'address',
        width: sw > sSmall ? sw * 0.2 : sw * 0.25,
        align: 'left'
    }, {
        key: 'amount',
        title: 'Amount',
        dataKey: 'amount',
        width: sw > sSmall ? sw * 0.1 : sw * 0.25,
        align: 'left'
    }, {
        key: 'txhash',
        title: 'TxHash',
        dataKey: 'txid',
        width: sw > sSmall ? sw * 0.2 : sw * 0.25,
        align: 'left'
    }]
}

function loadData() {
    if (!stat.addr) {
        ElMessage.warning("from address must not be empty")
        return
    }

    openapi.getAddressRecentHistory(stat.addr).then(val => {
        console.log(val)
        stat.histData = val;
    })
}

function updateInnerValue() {
    loadData()
}

defineExpose({
    updateInnerValue,
})

onBeforeMount(() => {
    stat.addr = props.address ? props.address : '';
})

onMounted(() => {
    let localAddr = localStorage.getItem('bitcoin_address');
    if (localAddr) {
        stat.addr = localAddr
    }

    columns = generateColumns(window.innerWidth)

    loadData()
})

</script>

<template>
    <div class="hist-container-view">
        <div style="height: 600px;">
            <el-auto-resizer>
                <template #default="{ height, width }">
                    <el-table-v2 :columns="columns" :data="stat.histData" :width="width" :height="height" fixed />
                </template>
            </el-auto-resizer>
        </div>
    </div>
</template>

<style scoped>
.hist-container-view {
    margin: 0 auto;
    width: 100%;
}
</style>