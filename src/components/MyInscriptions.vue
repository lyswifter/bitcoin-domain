<script setup lang="ts">
import { onBeforeMount, reactive } from "vue";
import service from "../router/service";

const props = defineProps({
    address: String,
})

let state = reactive({ items: [], addr: '' })

function load(addr: string) {
    service.queryInsWith(addr).then((val) => {
    })
}

onBeforeMount(() => {
    state.addr = props.address ? props.address : '';
})
</script>

<template>
    <div class="ins-container-view">
        <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
            <li v-for="(item, index) in state.items" :key="index" class="infinite-list-item">{{ item }}</li>
        </ul>
    </div>
</template>

<style scoped></style>
