<script setup lang="ts">
import { onBeforeMount, onMounted, reactive } from "vue";
import { InsType, InscriptionItem } from "../router/type";
import { classifiyImageWith } from "../router/util";

const props = defineProps({
    address: String,
    itemss: {},
})

let stat = reactive({
    items: [] as InscriptionItem[],
    addr: '',
})

function load() {
    stat.items.forEach((element: InscriptionItem) => {
        element = classifiyImageWith(element)
    });
}

function updateInnerValue() {
    load()
}

defineExpose({
    updateInnerValue,
})

onBeforeMount(() => {
    stat.addr = props.address ? props.address : '';
    stat.items = props.itemss ? props.itemss as InscriptionItem[] : []
    console.log(stat.items)
})

onMounted(() => {
    load()
})
</script>

<template>
    <div class="ins-container-view">
        <div class="infinite-list infinite-list-flow">
            <div v-for="(item, i) in stat.items" :key="i" class="infinite-list-item">

                <div class="card-item">
                    <img class="pic-view" v-if="item.type == InsType.IMAGE" :src="item.detail.content" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.TEXT" src="../assets/pic_txt@2x.png" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.AUDIO" src="../assets/pic_mp3@2x.png" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.VIDEO" src="../assets/pic_mp4@2x.png" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.DOMAIN" :src="item.domain_img" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.OTHER" src="" alt="" loading="lazy">

                    <div class="flex-view">
                        <div class="name-view">{{ item.domain }}</div>
                        <div class="id-view"><a style="color: #A7A9BE;" :href="item.detail.content" target="_blank">INS #{{
                            item.number }}</a></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.ins-container-view {
    margin: 0 auto;
    max-width: 1200px;
}

.infinite-list {
    padding: 5px;
    margin-bottom: 100px;
}

.flex-view {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
}

.pic-view {
    margin: 0 auto;
    width: 100%;
    min-width: 258px;
    min-height: 258px;
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

@media screen and (max-width: 767px) {
    .infinite-list-item {
        margin: 0 auto;
    }

    .card-item {
        width: 100%;
        padding: 10px;
        margin-left: 5px;
        margin-right: 5px;
        margin-top: 20px;
        background: #FFFFFF;
        border-radius: 10px;
        border: 1px solid #E4E4E4;
    }
}

@media screen and (min-width: 768px) {
    .infinite-list-flow {
        display: flex;
        flex-wrap: wrap;
        flex-grow: 3;
    }

    .card-item {
        width: 280px;
        padding: 10px;
        margin-left: 5px;
        margin-right: 5px;
        margin-top: 20px;
        background: #FFFFFF;
        border-radius: 10px;
        border: 1px solid #E4E4E4;
    }
}
</style>
