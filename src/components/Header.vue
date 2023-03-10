<script setup lang="ts">
function reloadPage() {
  location.reload();
}
</script>

<template>
  <div class="container">
    <el-row justify="space-between">
      <el-col :span="2">
        <img class="logo-view" src="../assets/logo_nav@2x.png" style="width: 158px;height: 30px;cursor: pointer;" alt=""
          @click="reloadPage">
      </el-col>

      <el-col :span="2">
        <div class="doc-link-view"><a href="https://docs.btcdomains.io" style="text-decoration: none;color: white;"
            target="_blank">Document</a></div>
      </el-col>
    </el-row>

    <div class="slogon-view">
      <img class="solgon-title-view" src="../assets/logo@2x.png" alt="">
      <div class="solgon-content-view">Search domain name or Register your domain name</div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-image: linear-gradient(90deg, #513eff 0%, #52e5ff 100%);
}

.logo-view {
  margin-top: 10px;
}

.doc-link-view {
  height: 30px;
  border-radius: 15px;
  border-color: #D8D8D8;
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 30px;
  cursor: pointer;
  margin-top: 10px;
}

.slogon-view {
  margin: 0 auto;
  width: 100%;
  text-align: center;
}

.solgon-title-view {
  margin-top: 3%;
  height: 80px;
}

.solgon-content-view {
  height: 25px;
  font-size: 18px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 25px;
}
</style>
