<script setup lang="ts">
import { onMounted, reactive } from 'vue';

import { event, pageview } from "vue-gtag";

import service from "../router/service";
import { DomainHistory, GasInfo } from "../router/type";

import EmptyView from "../components/Empty.vue";
import FooterView from "../components/Footer.vue";
import HeaderView from "../components/Header.vue";
import HistView from "../components/History.vue";
import OrderView from "../components/Order.vue";
import PayView from "../components/Pay.vue";
import RegisteriedView from "../components/Registered.vue";
import RegisteringView from "../components/Registering.vue";
import StartView from "../components/Start.vue";

import { ElLoading, ElMessage } from 'element-plus';

let state = reactive({ isAvailable: false, input: '', inputAppend: '', stage: 'start', gasInfo: {} as GasInfo, headerHeight: '338px', history: {} as DomainHistory })

// '', start, hist, order, pay, registered, registering

function searchAction() {
  let loadingInstance = ElLoading.service({ fullscreen: true });

  if (state.inputAppend != '') {
    state.stage = ''
  }

  if (state.input.indexOf('.') != -1) {
    ElMessage.warning(state.input + ' is not correct')
    loadingInstance.close()
    return
  }

  if (state.input.length < 4) {
    ElMessage.warning('Domain name is too short')
    loadingInstance.close()
    return
  }

  if (state.input.length > 32) {
    ElMessage.warning('Domain name is too long')
    loadingInstance.close()
    return
  }

  var re = /^[0-9a-zA-Z]*$/;
  if (!re.test(state.input)) {
    ElMessage.warning(state.input + ' is not format')
    loadingInstance.close()
    return
  }

  state.inputAppend = state.input + ".btc"

  event('serach', { method: 'Google' })

  service.queryDomain(state.inputAppend).then((val) => {
    loadingInstance.close()

    switch (val.code) {
      case 0:
        state.isAvailable = false
        state.stage = 'registered'
        break

      case 310:
        state.isAvailable = true
        state.stage = 'order'
        break;

      case 311: // registering
        if (val.data.dom_state == 5) { // registered
          state.isAvailable = false
          state.stage = 'registered'
        } else {
          state.isAvailable = false
          state.stage = 'registering'
        }
        break

      case 500:
        ElMessage.error(val.message)
        break

      default:
        ElMessage.error(val.data)
        break;
    }

  })
}

function orderToPayAction(gasInfo: GasInfo) {
  state.gasInfo = gasInfo
  state.stage = 'pay'
}

function backAction() {
  state.stage = 'order'
}

function clickHistory(name: string) {
  state.input = name
  state.inputAppend = state.input + ".btc"
  state.isAvailable = false
  state.stage = 'registered'
}

function toProcessing(info: GasInfo) {
  state.stage = 'registering';
  state.isAvailable = false;
  state.gasInfo = info;
}

onMounted(() => {
  pageview({ page_path: '/home' })

  let localString = localStorage.getItem('domain_history')
  if (localString != null) {
    let localItems = localString.split(',');
    if (localItems.length > 0) {
      state.stage = 'hist'
    }
  }
})

</script>

<template>
  <div class="main-view">

    <HeaderView class="header-view" :style="{ height: state.headerHeight }" />

    <div class="search-view">
      <el-input class="input-class" v-model="state.input" placeholder="Search name or address" maxlength="32"
        minlength="4" @keyup.enter.native="searchAction" />
      <a class="search-a" :class="state.input ? 'search-a-enable' : 'search-a-disable'" style="text-decoration: none;" href="javascript:void(0)"
        @click="searchAction"> Search </a>
    </div>

    <EmptyView v-if="state.stage == ''" />

    <StartView v-else-if="state.stage == 'start'" :ref="state.stage" />

    <HistView v-else-if="state.stage == 'hist'" :ref="state.stage" class="hist-view" @click-history="clickHistory" />

    <OrderView v-else-if="state.stage == 'order'" :ref="state.stage" class="order-view" :domain-name="state.inputAppend"
      :is-available="state.isAvailable" @continue-action="orderToPayAction" />

    <PayView v-else-if="state.stage == 'pay'" :ref="state.stage" class="pay-view" :gas-info="state.gasInfo"
      @back-action="backAction" @to-processing="toProcessing" />

    <RegisteriedView v-else-if="state.stage == 'registered'" :ref="state.stage" class="registered-view"
      :domain-name="state.inputAppend" :is-available="state.isAvailable" />

    <RegisteringView v-else-if="state.stage == 'registering'" :ref="state.stage" class="registering-view"
      :domain-name="state.inputAppend" :is-available="state.isAvailable" :gas-info="state.gasInfo" />

  </div>

  <FooterView class="footer-view" />
</template>

<style scoped>
.main-view {
  background-color: white;
}

.header-view {
  width: 100%;
}

.search-view {
  max-width: 1200px;
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
  width: 120px;
  height: 64px;
  background: #4540D6;
  border-radius: 8px;
  text-align: center;
  line-height: 64px;
}

.search-a-enable {
  color: white;
}

.search-a-disable {
  color: #A7A9BE;
}

.hist-view {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
