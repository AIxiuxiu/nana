<template>
  <div class="content-card">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="热点新闻" name="1">
        <HotNews />
      </el-tab-pane>
      <el-tab-pane label="资本市场热点" name="2">
        <WordCloud />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HotNews from './HotNews.vue';
import WordCloud from './WordCloud.vue';

const activeName = ref('1');
function handleClick(event) {
  //
}
</script>
<style scoped lang="scss">
.content-card {
  height: 384px;
  padding: 6px 16px;
}
</style>
