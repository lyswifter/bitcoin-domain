<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

import service from "../router/service";
import { GasInfo } from "../router/type";

import HeaderView from "../components/Header.vue";
import FooterView from "../components/Footer.vue";
import HistView from "../components/History.vue";
import OrderView from "../components/Order.vue";
import PayView from "../components/Pay.vue";

import RegisteriedView from "../components/Registered.vue";
import RegisteringView from "../components/Registering.vue";
import { number } from 'mathjs';

let state = reactive({ isAvailable: false, input: '', stage: 'start', gasInfo: {} as GasInfo, headerHeight: '338px' }) // start, hist, order, pay, registered, registering

function searchAction() {
  service.queryDomain(state.input).then((val) => {
    if (val.code == 310) { // able to register
      state.isAvailable = true
      state.stage = 'order'
    }
  })
}

function orderToPayAction(gasInfo: GasInfo) {
  state.stage = 'pay'
  state.gasInfo = gasInfo
}

function backAction() {
  state.stage = 'order'
}

onMounted(() => {
  let width = window.outerWidth
  let hei = width * 776 / 3840;
  state.headerHeight = hei + 'px'
})

</script>

<template>
  <div class="main-view">

    <HeaderView class="header-view" :style="{ height:  state.headerHeight}" />

    <div class="search-view">
      <el-input class="input-class" v-model="state.input" placeholder="Search name or address" />
      <a class="search-a" style="text-decoration: none;" href="javascript:void(0)" @click="searchAction"> Search </a>
    </div>

    <HistView v-if="state.stage == 'hist'" class="hist-view" />

    <OrderView v-else-if="state.stage == 'order'" class="order-view" :domain-name="state.input" :is-available="state.isAvailable" @continue-action="orderToPayAction" />

    <PayView v-else-if="state.stage == 'pay'" class="pay-view" :gas-info="state.gasInfo" @back-action="backAction" />

    <RegisteriedView v-else-if="state.stage == 'registered'" class="registered-view" :domain-name="state.input" :is-available="state.isAvailable" />

    <RegisteringView v-else-if="state.stage == 'registering'" class="registering-view" />

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
