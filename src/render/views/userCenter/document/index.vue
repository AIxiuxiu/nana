<template>
  <el-scrollbar
    v-track="{ id: 'page_view', eventResource: '帮助文档', elementId: `document`, parentElId: `userCenter` }"
    class="main-scrollbar"
    wrap-class="main-wrap"
    view-class="main-view"
  >
    <div class="content-card">
      <iframe ref="iframe1" class="webview" width="100%" frameborder="no" marginwidth="0" marginheight="0" :src="url"></iframe>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
/**
 * 帮助文档
 */
const url = ref(import.meta.env.VITE_APP_DOC_BASEURL?.toString() + 'qjkhdgdoc');
</script>

<style lang="scss" scoped>
.content-card,
.webview {
  height: calc(100vh - 142px);
}
</style>
