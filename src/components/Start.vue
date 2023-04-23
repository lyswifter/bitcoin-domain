<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
})
</script>

<template>
    <div class="start-container flow-style">
        <div>
            <img class="img-view" src="../assets/icon_uniqueness@2x.png" alt="">
        </div>

        <div>
            <img class="img-view" src="../assets/icon_bitcoinnative@2x.png" alt="">
        </div>

        <div>
            <img class="img-view" src="../assets/icon_reliable@2x.png" alt="">
        </div>
    </div>
</template>

<style scoped>
.start-container {
    margin: 0 auto;
    max-width: 1200px;
    margin-top: 40px;
    margin-bottom: 10%;
}

@media screen and (max-width: 767px) {
    .flow-style {
        text-align: center;
    }

    .img-view {
        width: 250px;
        height: 258px;
    }
}

@media screen and (min-width: 768px) {
    .flow-style {
        display: flex;
        flex-wrap: wrap;
    }

    .img-view {
        width: 360px;
        height: 371px;
    }
}
</style>
