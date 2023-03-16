<script setup lang="ts">
function reloadPage() {
  location.reload();
}

const openOrdexLink = "https://btcdomains.click/openordex-open-2f8217";

</script>

<template>
  <div class="container">
    <el-row justify="space-between">
      <el-col :xs="6" :sm="4" :md="4" :lg="2" :xl="2">
        <img class="logo-view" src="../assets/logo_nav@2x.png" style="width: 158px;height: 30px;cursor: pointer;" alt=""
          @click="reloadPage">
      </el-col>

      <el-col :xs="12" :sm="6" :md="5" :lg="4" :xl="3">
        <el-row>
          <div class="doc-link-view"><a :href="openOrdexLink" style="text-decoration: none;color: white;"
              target="_blank">Openordex</a></div>

          <div class="doc-link-view"><a href="https://docs.btcdomains.io"
              style="text-decoration: none;color: white;margin-left: 15px;" target="_blank">Document</a></div>
        </el-row>
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
  margin-top: 60px;
  height: 60px;
}

.solgon-content-view {
  height: 25px;
  font-size: 18px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 25px;
}
</style>
