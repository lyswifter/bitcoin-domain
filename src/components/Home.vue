<script setup lang="ts">
import { ref, reactive, onMounted, toRefs, onUnmounted } from 'vue'

import service from "../router/service";
import { DomainHistory, GasInfo } from "../router/type";

import HeaderView from "../components/Header.vue";
import FooterView from "../components/Footer.vue";
import HistView from "../components/History.vue";
import OrderView from "../components/Order.vue";
import PayView from "../components/Pay.vue";
import StartView from "../components/Start.vue";
import EmptyView from "../components/Empty.vue";

import RegisteriedView from "../components/Registered.vue";
import RegisteringView from "../components/Registering.vue";
import { ElMessage, ElLoading } from 'element-plus';

let state = reactive({ isAvailable: false, input: '', inputAppend: '', stage: 'start', gasInfo: {} as GasInfo, headerHeight: '338px', history: {} as DomainHistory }) 

// '', start, hist, order, pay, registered, registering

function searchAction() {
  let loadingInstance = ElLoading.service({ fullscreen: true });

  if (state.inputAppend != '') {
    state.stage = '' 
  }

  if (state.input.indexOf('.') != -1) {
    ElMessage.warning(state.input + ' is not correct')
    return
  }

  var re = /^[0-9a-zA-Z]*$/;

  if (!re.test(state.input)) {
    ElMessage.warning(state.input + ' is not format')
    return
  }

  state.inputAppend = state.input + ".btc"

  service.queryDomain(state.inputAppend).then((val) => {
    loadingInstance.close()

    if (val.code == 310) { // able to register
      state.isAvailable = true
      state.stage = 'order'
    } else if (val.code == 0) {
      state.isAvailable = false
      state.stage = 'registered'
    } else if (val.code == 311) {
      state.isAvailable = false
      state.stage = 'registering'
    } else {
      ElMessage.error(val.data)
      return
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

function clickHistory(name: string) {
  state.input = name
  state.isAvailable = false
  state.stage = 'registered'
}

function toProcessing(info: GasInfo) {
  state.stage = 'registering';
  state.isAvailable = false;
  state.gasInfo = info;
}

onMounted(() => {
  let width = window.outerWidth
  let hei = width * 776 / 3840;
  state.headerHeight = hei + 'px'

  let localString = localStorage.getItem('domain_history')
  if (localString != null) {
    let localItems: DomainHistory = JSON.parse(localString)

    if (localItems.records.length > 0) {
      state.stage = 'hist'
    }
  }
})

</script>

<template>
  <div class="main-view">

    <HeaderView class="header-view" :style="{ height: state.headerHeight }" />

    <div class="search-view">
      <el-input class="input-class" v-model="state.input" placeholder="Search name or address">
      </el-input>
      <a class="search-a" style="text-decoration: none;" href="javascript:void(0)" @click="searchAction"> Search </a>
    </div>

    <EmptyView v-if="state.stage == ''" />

    <StartView v-else-if="state.stage == 'start'" :ref="state.stage"/>

    <HistView v-else-if="state.stage == 'hist'" :ref="state.stage" class="hist-view" @click-history="clickHistory" />

    <OrderView v-else-if="state.stage == 'order'" :ref="state.stage" class="order-view" :domain-name="state.inputAppend"
      :is-available="state.isAvailable" @continue-action="orderToPayAction" />

    <PayView v-else-if="state.stage == 'pay'" :ref="state.stage" class="pay-view" :gas-info="state.gasInfo" @back-action="backAction" @to-processing="toProcessing"/>

    <RegisteriedView v-else-if="state.stage == 'registered'" :ref="state.stage" class="registered-view" :domain-name="state.inputAppend"
      :is-available="state.isAvailable" />

    <RegisteringView v-else-if="state.stage == 'registering'" :ref="state.stage" class="registering-view" :domain-name="state.inputAppend"
      :is-available="state.isAvailable" />

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
  width: 62.5%;
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
