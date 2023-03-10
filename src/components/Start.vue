<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
})
</script>

<template>
    <div class="start-container">
        <div style="display: inline-block;">
            <img src="../assets/icon_search@2x.png" style="height: 120px;" alt="">
            <div class="text-view">Search</div>
        </div>

        <div style="display: inline-block;margin-left: 40px;">
            <img src="../assets/icon_register@2x.png" style="height: 120px;" alt="">
            <div class="text-view">Register</div>
        </div>

    </div>
</template>

<style scoped>
.start-container {
    text-align: center;
    margin: 0 auto;
    padding-top: 40px;
    padding-bottom: 15%;
}
</style>
