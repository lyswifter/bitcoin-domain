<script setup lang="ts">
import { validate } from 'bitcoin-address-validation';
import { ElLoading, ElMessage } from 'element-plus';
import { onMounted, reactive } from 'vue';
import { event, pageview } from "vue-gtag";
import EmptyView from "../components/Empty.vue";
import FooterView from "../components/Footer.vue";
import HeaderView from "../components/Header.vue";
import HistView from "../components/History.vue";
import OrderView from "../components/Order.vue";
import PayView from "../components/Pay.vue";
import RegisteriedView from "../components/Registered.vue";
import RegisteringView from "../components/Registering.vue";
import SearchInsView from "../components/SearchIns.vue";
import StartView from "../components/Start.vue";
import router from "../router/index";
import service from "../router/service";
import { DomainHistory, GasInfo, InscriptionItem } from "../router/type";

let state = reactive({ isAvailable: false, input: '', inputAppend: '', stage: 'start', gasInfo: {} as GasInfo, history: {} as DomainHistory, searchItem: [] as InscriptionItem[] })

// '', start, hist, order, pay, registered, registering, searchIns

function searchAction() {
  if (!state.input) {
    return
  }

  if (validate(state.input)) {
    searchAddr()
  } else { // ilegel btc address
    queryDomain()
  }
}

function searchAddr() {
  state.stage = ''
  service.queryInsWith(state.input).then((val) => {
    state.searchItem = val.data.result
    state.stage = 'searchIns'
  })
}

function queryDomain() {
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

function connectParentAction(addr: string) {
  router.push({ name: 'wallet', params: { addr: addr } })
}

onMounted(() => {
  pageview({ page_path: '/home' }) // collect data

  let query = router.currentRoute.value.query
  let doaminName: string = query.search as string;
  if (doaminName && doaminName.toLowerCase().includes('.btc')) {
    state.input = doaminName.split('.')[0]
    queryDomain()
  } else {
    state.stage = 'start'
  }
})

</script>

<template>
  <div class="main-view">

    <HeaderView class="header-view" @connect-parent-action="connectParentAction" />

    <div class="slogon-view">
      <img class="solgon-title-view" src="../assets/logo@2x.png" alt="">
      <div class="solgon-content-view">Discover the Future of BTC Domain. Search, Register and Trade your .btc Domain Name
      </div>
    </div>

    <div class="search-view">
      <el-input class="input-class" v-model="state.input" placeholder="Search name or address" maxlength="100"
        minlength="4" @keyup.enter.native="searchAction" />
      <a class="search-a" :class="state.input ? 'search-a-enable' : 'search-a-disable'" style="text-decoration: none;"
        href="javascript:void(0)" @click="searchAction"> Search </a>
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

    <SearchInsView v-else-if="state.stage == 'searchIns'" :address="state.input" :itemss="state.searchItem" />

    <FooterView class="footer-view" />
  </div>
</template>

<style scoped>
.main-view {
  background-color: white;
}

.header-view {
  width: 100%;
}

.slogon-view {
  margin: 0 auto;
  width: 100%;
  text-align: center;
  padding-bottom: 60px;
  background-image: linear-gradient(180deg, #513eff 0%, #52e5ff 100%);
}

.solgon-title-view {
  margin-top: 60px;
  height: 60px;
}

.solgon-content-view {
  font-size: 18px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 25px;
}

.search-view {
  max-width: 1200px;
  padding-left: 10px;
  padding-right: 10px;
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
  right: 18px;
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
