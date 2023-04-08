<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onBeforeMount, onMounted, reactive } from 'vue';
import openapi from "../crypto/openapi";
import { TxHistoryItem } from '../shared/types';

const props = defineProps({
    address: String,
})

let stat = reactive({
    addr: '',
    histData: [] as TxHistoryItem[],
})

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

    loadData()
})

</script>

<template>
    <div class="hist-container-view">
        <div class="hist-header-view">
            <div class="height-view header-titl w-p-10">Date</div>
            <div class="time-view header-titl w-p-35">Address</div>
            <div class="amount-view header-titl w-p-10">Amount</div>
            <div class="hash-view header-titl w-p-35">TxHash</div>
        </div>

        <div class="hist-body-view">
            <div v-for="(item, index) in stat.histData" :key="index" class="row-view row-height">
                <div class="col-view w-p-5">{{ item.date }}</div>
                <div class="col-view w-p-35">{{ item.address }}</div>
                <div class="col-view w-p-10">{{ item.amount }}</div>
                <div class="col-view w-p-35">{{ item.txid }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.hist-container-view {
    margin: 0 auto;
    width: 100%;
    margin-top: 10px;
}

.hist-header-view {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    border-bottom: 1px solid #2E2F3E;
}

.header-titl {
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #A7A9BE;
    line-height: 20px;
}

.w-p-5 {
    min-width: 5%;
}

.w-p-10 {
    min-width: 10%;
}

.w-p-35 {
    min-width: 35%;
}

.w-p-40 {
    min-width: 40%;
}

.hist-body-view {
    margin: 0 auto;
    width: 100%;
    margin-bottom: 40px;
}

.row-view {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    gap: 10px;
    min-height: 60px;
    border-bottom: 1px solid #A7A9BE;
}

.col-view {
    min-height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #2E2F3E;
}

@media screen and (max-width: 1109px) {
    .row-height {
        line-height: 20px;
    }
}

@media screen and (min-width: 1110px) {
    .row-height {
        line-height: 60px;
    }
}
</style>
