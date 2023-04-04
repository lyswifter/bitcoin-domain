<script setup lang="ts">
import { onBeforeMount, onMounted, reactive } from "vue";
import service from "../router/service";
import { InscriptionItem } from "../router/type";

const props = defineProps({
    address: String,
})

let state = reactive({ count: 0, items: [] as InscriptionItem[], addr: '' })

function load() {
    console.log(state.addr)

    service.queryInsWith(state.addr).then((val) => {
        console.log(val)
        state.items = val.data.result;
    })
}

function sendAction(item: InscriptionItem) {

}

onBeforeMount(() => {
    state.addr = props.address ? props.address : '';
})

onMounted(() => {
    let localAddr = localStorage.getItem('bitcoin_address');
    localAddr = 'bc1phcsyla7gd2jjgtkj5rz2e3j0m8xunppnx5ff8tqhmm92gy54u7dsu4h478';
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

                    <img class="pic-view"
                        v-if="item.detail.content_type.includes('image/png') || item.detail.content_type.includes('image/webp')"
                        :src="item.detail.content" alt="" loading="lazy">
                    <img class="pic-view"
                        v-else-if="item.detail.content_type.includes('text/plain') || item.detail.content_type.includes('application/json')"
                        src="../assets/pic_txt@2x.png" alt="" loading="lazy">
                    <img class="pic-view" v-else-if="item.detail.content_type.includes('mp3')"
                        src="../assets/pic_mp3@2x.png" alt="" loading="lazy">
                    <img class="pic-view" v-else-if="item.detail.content_type.includes('mp4')"
                        src="../assets/pic_mp4@2x.png" alt="" loading="lazy">

                    <div class="flex-view">
                        <div class="name-view">{{ item.domain }}</div>
                        <div class="id-view">INS #{{ item.number }}</div>
                    </div>

                    <div class="flex-view">
                        <div class="send-view" @click="sendAction(item)">Send</div>
                        <div class="set-view">
                            <img src="../assets/icon_set@2x.png" alt="" width="16" height="16">Setting
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.ins-container-view {}

.infinite-list {
    margin: 0 auto;
    width: 100%;
    height: 1000px;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 3;
    padding: 5px;
    margin: 0;
    list-style: none;
}

.flex-view {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.pic-view {
    margin: 0 auto;
    width: 100%;
}

.id-view {
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 17px;
    cursor: pointer;
    text-decoration: underline;
}

.send-view {
    width: 120px;
    height: 36px;
    background: #090C1D;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
}

.set-view {
    height: 20px;
    font-size: 12px;
    font-weight: 400;
    color: #090C1D;
    line-height: 20px;
}

@media screen and (max-width: 767px) {
    .infinite-list-item {
        margin: 0 auto;
        width: 95%;
    }

    .card-item {
        width: 315px;
        padding: 10px;
        margin-left: 5px;
        margin-right: 5px;
        background: #FFFFFF;
        border-radius: 10px;
        border: 1px solid #E4E4E4;
    }
}

@media screen and (min-width: 768px) {
    .card-item {
        width: 280px;
        padding: 10px;
        margin-left: 5px;
        margin-right: 5px;
        background: #FFFFFF;
        border-radius: 10px;
        border: 1px solid #E4E4E4;
    }
}</style>
