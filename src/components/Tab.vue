<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

interface TabItem {
  idx: number;
  name: string;
  icon: string;
  isActive: boolean;
  title: string;
}

let curItem = ref<TabItem>({
  idx: 0,
  name: '',
  icon: '',
  isActive: false,
  title: '',
})

const props = defineProps({
  curIdx: Number
})

const emit = defineEmits({
  updateTab(idx: number) {
    return idx >= 0 && idx < 4
  },
  backAction() {
  }
})

let state = reactive({ curIdx: 0 });

let tabs = reactive<TabItem[]>([{
  idx: 0,
  name: "Upload",
  icon: "../../src/assets/icon_upload@2x.png",
  isActive: false,
  title: "Upload your inscription",
}, {
  idx: 1,
  name: "Fee",
  icon: "../../src/assets/icon_fee_dis@2x.png",
  isActive: false,
  title: "Transaction fee",
}, {
  idx: 2,
  name: "Address",
  icon: "../../src/assets/icon_address_dis@2x.png",
  isActive: false,
  title: "Recipient address",
}, {
  idx: 3,
  name: "Ok",
  icon: "../../src/assets/icon_ok_dis@2x.png",
  isActive: false,
  title: "Results",
}])

var tabSwitch = function (item: TabItem) {
  curItem.value = item
  state.curIdx = item.idx

  for (let i = 0; i < tabs.length; i++) {
    const element = tabs[i];
    if (element.idx == item.idx) {
      element.isActive = true
    } else {
      element.isActive = false
    }
  }

  emit('updateTab', item.idx)
}

var tabSwitchWithIdx = function (idx: number) {
  state.curIdx = idx

  for (let i = 0; i < tabs.length; i++) {
    const element = tabs[i];
    if (element.idx == idx) {
      element.isActive = true
    } else {
      element.isActive = false
    }
  }

  emit('updateTab', idx)
}

var backAction = function () {
  state.curIdx--
  if (state.curIdx < 0) {
    state.curIdx = 0
  }

  tabSwitchWithIdx(state.curIdx)
}

var backToUpload = function () {
  state.curIdx = 0
  curItem.value = tabs[state.curIdx]
  tabSwitchWithIdx(state.curIdx)
}

defineExpose({
  tabSwitchWithIdx
})

onMounted(() => {
  if (props.curIdx) {
    tabSwitchWithIdx(props.curIdx!)
    state.curIdx = props.curIdx
  } else {
    tabSwitch(tabs[0])
  }
})
</script>

<template>
  <div class="tab-view">
    <el-row justify="center">
      <el-col v-for="(item, idx) in tabs" :key="idx" :span="5">
        <div :class="item.isActive ? 'select' : 'normal'" @click="tabSwitch(item)" class="tab-item-view">
          <img :src="item.icon" style="width: 24px;height: 24px;vertical-align: middle;margin-right: 2px;" alt="">
          <span class="tab-name-view">{{ item.name }}</span>
        </div>
        <div class="process-line-view" v-if="state.curIdx >= idx"></div>
      </el-col>
    </el-row>
  </div>

  <div class="title-view">
    <div v-if="state.curIdx != 3" class="back-view" @click="backAction">
      Back
    </div>
    <div v-else-if="state.curIdx == 3" class="back-view" @click="backToUpload">
      Back to upload
    </div>

    <div class="tab-desc-view">{{ curItem.title }}</div>
  </div>
</template>

<style scoped>
.tab-view {
  margin: 0 auto;
  width: 1200px;
  height: 72px;
  background: #1F2335;
}

.tab-item-view {
  margin: 0 auto;
  margin-top: 12px;
  cursor: pointer;
  text-align: center;
}

.process-line-view {
  margin-top: 2px;
  height: 4px;
  background: #32D9FA;
}

.tab-name-view {
  height: 22px;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 48px;
}

.normal {
  width: 246px;
  height: 48px;
  background: #161828;
  border-radius: 4px;
  border: 2px solid #161828;
}

.select {
  width: 246px;
  height: 48px;
  background: #32D9FA;
  border-radius: 4px;
  border: 2px solid #FFFFFF;
}

.title-view {
  margin: 0 auto;
  width: 1200px;
  height: 70px;
  margin-top: 24px;
}

.tab-desc-view {
  width: 1200px;
  height: 70px;
  font-size: 50px;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 70px;
  text-align: center;
}

.back-view {
  height: 40px;
  background: #161828 10%;
  font-size: 14px;
  font-weight: 600;
  color: #32D9FA;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  padding-left: 10px;
  padding-right: 10px;
  float: left;
}
</style>
