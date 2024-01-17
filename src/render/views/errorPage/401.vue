<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">提示!</h1>
        <h2>你没有权限去该页面</h2>
        <div class="link-type">
          <div @click="goback">返回</div>
          <router-link to="/"> 回首页 </router-link>
        </div>
      </el-col>
      <el-col :span="12">
        <img :src="$img('401.gif')" width="313" height="428" alt="Girl has dropped her ice cream." />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
function goback() {
  if (route.query.noGoBack) {
    router.push({ path: '/' });
  } else {
    router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
}
</style>
