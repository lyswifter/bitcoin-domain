<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="container">
    <el-row justify="start">
      <el-col :span="2">
        <div class="logo-view">BTCDOMAIN</div>
      </el-col>

      <el-col :span="22">
        <div>Doc</div>
      </el-col>
    </el-row>

    <div class="slogon-view">
      <div class="solgon-title-view">btcdomain</div>
      <div class="solgon-content-view">Search domain name or Register your domain name</div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-image: url(../assets/顶部背景@2x.png);
  background-repeat: no-repeat;
  background-size: contain;
}

.container img {
  margin-top: 29px;
}

.logo-view {}

.slogon-view {
  margin: 0 auto;
  width: 100%;
  text-align: center;
}

.solgon-title-view {
  margin-top: 80px;
  height: 80px;
  font-size: 84px;
  font-family: CamarRegular;
  color: #FFFFFF;
  line-height: 80px;
}

.solgon-content-view {
  height: 25px;
  font-size: 18px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 25px;
}
</style>
