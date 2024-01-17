<template>
  <el-scrollbar wrap-class="detail-wrap" view-class="detail-view">
    <div class="detail">
      <div v-if="detailParams.url !== ''">
        <QjVideoPlayer ref="videoEl" v-bind="options"></QjVideoPlayer>
      </div>
      <div style="margin: 20px; font-size: 16px; color: #404040">
        {{ detailParams.title }}
      </div>
      <div style="margin-left: 20px; font-size: 14px; color: #595966">
        {{ $dayjs(detailParams.dateTime * 1000).format('YYYY-MM-DD HH:mm:ss') }}
      </div>
    </div>
  </el-scrollbar>
</template>
<script setup lang="ts">
//  视频弹窗

import { useCurrentModal, useDetailParams } from '@/hooks/useDetailModal';
import { reactive, ref } from 'vue';

//定义接收参数
defineProps({
  url: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  dateTime: {
    type: Number,
    default: 0
  },
  poster: {
    type: String,
    default: ''
  }
});

const options = reactive({
  height: '500px',
  width: '100%', //播放器高度
  src: '',
  poster: '',
  pids: ''
});

const videoEl = ref();
useCurrentModal({
  closed: () => {
    videoEl.value && videoEl.value.pause();
  }
});

// 获取参数，已封装
const detailParams = useDetailParams((params) => {
  options.src = params.url;
  options.poster = params.poster;
});
</script>
<style scoped lang="scss">
.detail {
  margin: 20px;
}
</style>
