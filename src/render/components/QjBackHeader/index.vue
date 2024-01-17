<template>
  <div class="back-header">
    <el-page-header v-if="title" title="返回" :content="title" @back="clickBack" />
    <template v-for="(subTitle, index) in subTitles" :key="index">
      <div class="line"></div>
      <div class="info">{{ subTitle }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * 返回头
 */
import { useGoBack } from '@/hooks/useGoBack';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subTitles: {
    type: Array,
    default: () => []
  },
  // 上一层是列表页
  hasList: {
    type: Boolean,
    default: true
  }
});
const router = useRouter();
const route = useRoute();
const goBack = useGoBack(router, route);

function clickBack() {
  goBack(props.hasList);
}
</script>

<style lang="scss" scoped>
.back-header {
  display: flex;
  align-items: center;

  .line {
    margin: 1px 10px 0 20px;
    height: 16px;
    width: 2px;
    opacity: 0.7;
    background-color: $primary-color;
  }

  .info {
    font-size: $font-size-medium;
    color: $text-color-primary;
    max-width: 360px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
