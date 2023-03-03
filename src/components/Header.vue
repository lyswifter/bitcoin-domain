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
  </div>
</template>

<style scoped>
.container {
  background-image: url(../assets/9431677818833_.pic.jpg);
  background-repeat: no-repeat;
  background-size: auto;
}

.container img {
  margin-top: 29px;
}

.logo-view {

}
</style>
