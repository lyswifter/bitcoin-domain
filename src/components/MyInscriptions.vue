<script setup lang="ts">
import { onBeforeMount, onMounted, reactive } from "vue";
import service from "../router/service";

const props = defineProps({
    address: String,
})

let state = reactive({ count: 0, items: [], addr: '' })

function load() {
    console.log(state.addr)
    
    service.queryInsWith(state.addr).then((val) => {
        console.log(val)
        state.items = val.data.result;
    })
}

onBeforeMount(() => {
    state.addr = props.address ? props.address : '';
})

onMounted(() => {
    let localAddr = localStorage.getItem('bitcoin_address');
    localAddr = 'bc1pn2kjruf7f8u67f6gzvf0x4wxctceysd0dwe0elfn7mp3k5nm6djsjwvffl';
    if (localAddr) {
        state.addr = localAddr
    }
})
</script>

<template>
    <div class="ins-container-view">
        <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
            <li v-for="(item, i) in state.items" :key="i" class="infinite-list-item">
                <div class="card-item">
                    {{ item.domain }}
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.ins-container-view {}

.infinite-list {
    display: flex;
    flex-wrap: wrap;
    height: 500px;
    padding: 0;
    margin: 0;
    list-style: none;
}

.infinite-list-item {}
</style>
