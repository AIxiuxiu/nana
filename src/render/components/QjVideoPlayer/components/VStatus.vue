<template>
  <div v-show="state.handleType || state.isMultiplesPlay" class="d-status">
    <li v-show="state.handleType == 'volume'" class="d-flex-center">
      <i class="d-icon iconfont d-status-icon" :class="`icon-volume-${state.volume == 0 ? 'mute' : state.volume > 0.5 ? 'up' : 'down'}`" style="font-size: 18px"></i>
      {{ ~~(state.volume * 100) }}%
    </li>
    <li v-show="state.handleType == 'playbackRate' || state.isMultiplesPlay" class="d-flex-center">
      <i class="d-icon iconfont icon-play" style="font-size: 12px"></i>
      <i class="d-icon iconfont icon-play" style="margin-right: 5px; font-size: 12px"></i>
      X速播放中
    </li>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['state']);
</script>

<style scoped lang="scss">
@import '../style/base.scss';
@import '../style/iconfont.css';

.d-status {
  text-align: center;
  font-size: 14px;
  vertical-align: middle;
  background: rgba(0, 0, 0, 0.6);
  padding: 0 8px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.95);

  .d-status-icon {
    width: 24px !important;
    display: inline-block;
    margin-right: 5px;
  }
}
</style>
