<template>
  <div v-show="LOAD_TYPE.includes(loadType)" class="d-loading">
    <div>
      <!-- 播放结束 -->
      <span v-show="loadType == 'ended'">
        <p class="d-flex-x d-pointer" @click="replayHandle"><i class="iconfont icon-replay f24 mr5"></i>重新播放</p>
      </span>
      <!-- 播放错误 -->
      <span v-show="loadType == 'error' || loadType == 'stalled'">
        <p class="d-flex-x d-pointer" @click="replayHandle"><i class="iconfont icon-replay f24 mr5"></i>请求错误</p>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
const LOAD_TYPE = ['ended', 'error', 'stalled'];

defineProps({
  loadType: {
    type: String,
    default: ''
  }
});

const replayHandle = () => {
  proxy.$parent && (proxy as any).$parent.play();
};
</script>

<style scoped lang="scss">
@import '../style/iconfont.css';
@import '../style/base.scss';

.rotating {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  100% {
    -webkit-transform: rotate(360deg);
  }
}

.f50 {
  font-size: 50px;
}

.f24 {
  font-size: 24px;
}

.d-loading {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #efefef;
  text-align: center;
  font-size: 13px;
  background: rgba(0, 0, 0, 0.1);
  z-index: 2;
}
</style>
