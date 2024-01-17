<template>
  <div>
    <transition name="d-fade-in">
      <div v-if="state.dialogType" class="d-player-dialog">
        <div class="d-player-dialog-body">
          <h5 class="d-player-dialog-title">
            {{ state.dialogTitle }}
            <i class="icon icon-close" @click="state.dialogType = ''">X</i>
          </h5>
          <!-- 快捷键说明 -->
          <ul v-show="state.dialogType == 'hotkey'" class="d-player-hotkey-panel">
            <li v-for="item of hotkeyList" :key="item.key" class="d-player-hotkey-panel-item">
              <span>{{ item.key }}</span>
              <span>{{ item.label }}</span>
            </li>
          </ul>
          <!-- 色彩调整 -->
          <ul v-show="state.dialogType == 'filter'" class="d-player-filter-panel">
            <li class="d-player-filter-panel-item">
              <span>饱和度</span>
              <d-slider v-model="filter.saturate" class="filter-panel-slider" size="5px"></d-slider>
              <span>{{ Math.round(filter.saturate * 255) }}</span>
            </li>
            <li class="d-player-filter-panel-item">
              <span>亮度</span>
              <d-slider v-model="filter.brightness" class="filter-panel-slider" size="5px"></d-slider>
              <span>{{ Math.round(filter.brightness * 255) }}</span>
            </li>
            <li class="d-player-filter-panel-item">
              <span>对比度</span>
              <d-slider v-model="filter.contrast" class="filter-panel-slider" size="5px"></d-slider>
              <span>{{ Math.round(filter.contrast * 255) }}</span>
            </li>
            <span title="重置" aria-label="重置" class="d-player-filter-reset" @click="filterReset">重置</span>
          </ul>
        </div>
      </div>
    </transition>
    <div v-if="state.show" class="d-player-contextmenu">
      <ul class="d-player-contextmenu-body" :style="menuStyle">
        <li v-for="item of menuList" :key="item.key" :dplayerKeyCode="item.key">{{ item.label }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, watch } from 'vue';
import { off, on } from '../videoUtil';
import DSlider from './VSlider.vue';
const state = reactive({
  show: false,
  dialogType: '',
  dialogTitle: '',
  mouseX: 0,
  mouseY: 0
});

const menuList = [
  { label: '视频色彩调整', key: 'filter' },
  { label: '快捷键说明', key: 'hotkey' }
];
const hotkeyList = [
  { key: 'Space', label: '播放/暂停' },
  { key: '→', label: '单次快进10s，长按5倍速播放' },
  { key: '←', label: '快退5s' },
  { key: '↑', label: '音量增加10%' },
  { key: '↓', label: '音量增加降低10%' },
  { key: 'Esc', label: '退出全屏/退出网页全屏' },
  { key: 'F', label: '全屏/退出全屏' }
];
const filter = reactive({
  saturate: 0.392,
  brightness: 0.392,
  contrast: 0.392
});

// 菜单坐标
const menuStyle = computed(() => ({
  left: state.mouseX + 'px',
  top: state.mouseY + 'px'
}));

watch(filter, (val) => {
  let dPlayerVideoMain = document.querySelector('#dPlayerVideo') as HTMLDivElement;
  let saturate = (val.saturate * 2.55).toFixed(2);
  let brightness = (val.brightness * 2.55).toFixed(2);
  let contrast = (val.contrast * 2.55).toFixed(2);
  dPlayerVideoMain.style.filter = `saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`;
});
const filterReset = () => {
  filter.saturate = 0.392;
  filter.brightness = 0.392;
  filter.contrast = 0.392;
};
const keydownHandle = (ev) => {
  // ev.preventDefault()
  if (ev.key == 'Escape') {
    contextmenuHide(0);
  }
};

// 显示菜单
const contextmenuShow = (ev) => {
  ev.preventDefault();
  on(window, 'keydown', keydownHandle); //启用快捷键
  on(window, 'click', contextmenuHide); //启用点击键
  let refPlayerWrap = document.querySelector('#refPlayerWrap');
  let clientWidth = refPlayerWrap.clientWidth;
  let clientHeight = refPlayerWrap.clientHeight;
  state.mouseX = ev.clientX - refPlayerWrap.getBoundingClientRect().left;
  if (clientWidth - state.mouseX < 130) {
    state.mouseX = state.mouseX + (clientWidth - state.mouseX - 130);
    // state.mouseX = state.mouseX - (clientWidth - state.mouseX)
  }

  state.mouseY = ev.clientY - refPlayerWrap.getBoundingClientRect().top;
  state.show = true;
};

// 隐藏菜单
const contextmenuHide = (ev) => {
  let tagName = ev.path[0].tagName == 'LI';
  let keycode = ev.path[0].attributes.dplayerKeyCode && ev.path[0].attributes.dplayerKeyCode.value;
  let hotKeyArr = menuList.map((item) => item.key);
  if (tagName && hotKeyArr.includes(keycode)) {
    state.dialogTitle = ev.path[0].innerText;
    state.dialogType = keycode;
  }
  state.show = false;
  // 卸载快捷键
  off(window, 'keydown', keydownHandle);
  off(window, 'click', contextmenuHide); //启用点击键
};

onMounted(() => {
  let refPlayerWrap = document.querySelector('#refPlayerWrap');
  // 卸载快捷键
  off(window, 'keydown', keydownHandle);
  off(window, 'click', contextmenuHide); //启用点击键
  off(refPlayerWrap, 'contextmenu', contextmenuShow);
  // 开启右键菜单
  on(refPlayerWrap, 'contextmenu', contextmenuShow);
});

onUnmounted(() => {
  let refPlayerWrap = document.querySelector('#refPlayerWrap');
  off(window, 'keydown', keydownHandle);
  off(window, 'click', contextmenuHide); //启用点击键
  off(refPlayerWrap, 'contextmenu', contextmenuShow);
});
</script>

<style scoped lang="scss">
@import '../style/base';
@import '../style/transition';

.d-player-contextmenu,
.d-player-dialog {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 50px;
  width: 100%;
  z-index: 5;
}

.d-player-contextmenu {
  .d-player-contextmenu-body {
    position: absolute;
    border-radius: 5px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.6);
    color: #efefef;
    text-align: left;
    width: 130px;
    box-sizing: border-box;
    padding: 5px 0;
    li {
      padding: 8px 20px;
      margin: 0;
      cursor: pointer;
      transition: 0.2s;
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}

.d-player-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  .d-player-dialog-body {
    background-color: rgba(33, 33, 33, 0.9);
    border-radius: 5px;
    color: #fff;
    min-width: 200px;
    padding: 0 0 10px;
    .d-player-dialog-title {
      position: relative;
      font-size: 14px;
      font-weight: normal;
      margin: 0;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      margin-bottom: 10px;
      .icon-close {
        position: absolute;
        right: 0;
        top: 0;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
      }
    }
    // 快捷键说明
    .d-player-hotkey-panel {
      font-size: 12px;
      color: #eee;
      padding-right: 40px;
      .d-player-hotkey-panel-item {
        line-height: 26px;
        span {
          text-align: center;
          display: inline-block;
          width: 120px;
        }
        span:nth-child(2) {
          color: #999;
          width: 160px;
        }
      }
    }
    // 过滤镜
    .d-player-filter-panel {
      width: 320px;
      padding: 0 20px;
      .d-player-filter-reset {
        cursor: pointer;
        margin-top: 10px;
        padding: 3px 20px;
        display: inline-block;
        border-radius: 2px;
        font-size: 12px;
        background: rgba(133, 133, 133, 0.5);
        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
      .d-player-filter-panel-item {
        height: 32px;
        display: flex;
        align-items: center;
        .filter-panel-slider {
          width: 100%;
          :deep(.d-slider__runway) {
            background-color: #999;
            .d-slider__bar::before {
              width: 8px;
              height: 8px;
              box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.5);
            }
          }
        }
        span {
          font-size: 12px;
          display: block;
          width: 80px;
          text-align: center;
        }
      }
    }
  }
}
</style>
