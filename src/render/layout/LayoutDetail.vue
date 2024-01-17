<template>
  <div class="detail-content">
    <LayoutTitlebar :is-maximizable="false" :is-detail="true" />
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import LayoutTitlebar from '@/layout/LayoutTitlebar.vue';
</script>

<style lang="scss" scoped>
.detail-content {
  position: relative;
  overflow: hidden;
  width: 100vw;
  background-color: $white-color;
  height: calc(100vh - #{$titlebar-height});
  margin-top: $titlebar-height;
}
</style>
