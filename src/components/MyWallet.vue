<script setup lang="ts">
import HeaderView from "../components/Header.vue";
</script>

<template>
    <div class="wallet-container">
        <HeaderView class="header-view" />

        <div class="top-information-view">
            <div class="top-inner-view">
                <img src="../assets/icon_btc@2x.png" alt="" width="140" height="140">
            </div>
        </div>

        <div class="insp-content-view">
        </div>
    </div>
</template>

<style scoped>
.top-information-view {
    width: 100%;
    height: 388px;
    background: linear-gradient(180deg, #4540D6 0%, #BFEAFF 100%);
}

.top-inner-view {
    max-width: 1200px;
    margin: 0 auto;
}
</style>
