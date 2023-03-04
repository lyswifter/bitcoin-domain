<script setup lang="ts">
import { ref, reactive } from 'vue'

import HeaderView from "../components/Header.vue";
import FooterView from "../components/Footer.vue";
import HistView from "../components/History.vue";
import RegisteriedView from "../components/Registeried.vue";
import OrderView from "../components/Order.vue";
import PayView from "../components/Pay.vue";

let state = reactive({ step: 0, input: '', stage: 'pay' }) // hist, start, order, pay, waitting, registerited

function searchAction() {
  console.log(state.input)
}

</script>

<template>
  <div class="main-view">

    <HeaderView class="header-view" />

    <div class="search-view">
      <input class="input-class" v-model="state.input" placeholder="Search name or address" />
      <a class="search-a" style="text-decoration: none;" href="javascript:void(0)" @click="searchAction"> Search </a>
    </div>

    <HistView v-if="state.stage == 'hist'" class="hist-view" />

    <RegisteriedView v-else-if="state.stage == 'registerited'" class="registeried-view" />

    <OrderView v-else-if="state.stage == 'order'" class="order-view" />

    <PayView v-else-if="state.stage == 'pay'" class="pay-view" />
  </div>

  <FooterView class="footer-view" />
</template>

<style scoped>
.main-view {
  min-height: 1000px;
  background-color: white;
}

.header-view {
  width: 100%;
  height: 388px;
}

.qrcode-view {
  width: 200px;
  height: 200px;
}

.search-view {
  width: 1200px;
  margin: 0 auto;
  margin-top: -40px;
  position: relative;
}

.input-class {
  width: 100%;
  height: 80px;
  background: #FFFFFF;
  box-shadow: 0px 10px 24px 0px rgba(16, 38, 92, 1);
  border-radius: 12px;
  border: none;
  color: black;
  font-size: 20px;
}

.search-a {
  position: absolute;
  display: block;
  top: 8px;
  right: 8px;
  width: 164px;
  height: 64px;
  background: #4540D6;
  border-radius: 8px;
  text-align: center;
  line-height: 64px;
  color: white;
}

.hist-view {
  width: 1200px;
  margin: 0 auto;
}
</style>
