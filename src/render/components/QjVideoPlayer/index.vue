<template inherit-attrs="false">
  <div
    id="refPlayerWrap"
    ref="refPlayerWrap"
    class="d-player-wrap"
    :class="{
      'web-full-screen': state.webFullScreen,
      'is-lightoff': state.lightOff,
      'd-player-wrap-hover': state.isVideoHovering
    }"
    @mousemove="mouseMovewWarp"
  >
    <!-- 如果是移动端并且支持倍速 controls=true 否则为flase -->
    <div id="dPlayerVideo" class="d-player-video">
      <video
        id="dPlayerVideoMain"
        ref="refdVideo"
        class="d-player-video-main"
        :controls="isMobile && state.speed ? true : false"
        :class="{ 'video-mirror': state.mirror }"
        :webkit-playsinline="props.playsinline"
        :playsinline="props.playsinline"
        v-bind="videoEvents"
        :volume="state.volume"
        :muted="state.muted"
        :loop="state.loop"
        :preload="preload"
        width="100%"
        height="100%"
        :poster="props.poster"
      >
        您的浏览器不支持Video标签。
      </video>
    </div>
    <transition name="d-fade-in">
      <div v-show="state.lightOff" class="d-player-lightoff"></div>
    </transition>
    <!-- 状态栏 移动端不显示-->
    <div v-if="!isMobile && props.src" class="d-player-state">
      <transition name="d-scale-out">
        <!-- 播放按钮 -->
        <div v-show="state.playBtnState == 'play'" class="d-play-btn">
          <i class="d-icon iconfont icon-play" style="font-size: 42px"></i>
        </div>
      </transition>
      <!-- 操作信息通知 -->
      <VStatus :state="state"></VStatus>
    </div>
    <!-- 移动端不显示 -->
    <input
      v-if="!isMobile && props.src"
      ref="refInput"
      type="input"
      readonly
      class="d-player-input"
      maxlength="0"
      @dblclick="toggleFullScreenHandle"
      @keyup.f="toggleFullScreenHandle"
      @keyup.esc="state.webFullScreen = false"
      @click="togglePlay"
      @keydown.space="togglePlay"
      @keyup="keypress"
      @keydown.arrow-left="keydownLeft"
      @keydown.arrow-up.arrow-down="volumeKeydown"
      @keydown="keypress"
    />
    <!-- 加载动状态 -->
    <VLoadState :load-type="state.loadStateType" />
    <VContextmenu v-if="props.src" />
    <!-- PC端播放按钮控制器  移动端调用自带控制器-->
    <div v-if="!isMobile && props.src && state.control" ref="refPlayerControl" class="d-player-control">
      <div class="d-control-progress">
        <VSlider
          v-model="state.playProgress"
          class="d-progress-bar"
          :disabled="!state.speed"
          :hover-text="state.progressCursorTime"
          :preload="state.preloadBar"
          @onMousemove="onProgressMove"
          @change="progressBarChange"
        ></VSlider>
      </div>

      <div class="d-control-tool" @click="inputFocusHandle">
        <div class="d-tool-bar">
          <div class="d-tool-item" @click="togglePlay">
            <i class="d-icon iconfont" :class="`icon-${state.playBtnState}`" style="font-size: 24px"></i>
          </div>
          <div v-if="props.controlBtns.includes('audioTrack')" class="d-tool-item d-tool-time audioTrack-btn">
            <span>{{ state.currentTime }}</span>
            <span style="margin: 0 3px">/</span>
            <span class="total-time">{{ state.totalTime }}</span>
          </div>
        </div>
        <div class="d-tool-bar">
          <!-- 清晰度 -->
          <div v-if="state.qualityLevels.length > 1 && props.controlBtns.includes('quality')" class="d-tool-item quality-btn">
            {{ state.qualityLevels.length && (state.qualityLevels[state.currentLevel] || {}).height }}P
            <div class="d-tool-item-main">
              <ul class="speed-main" style="text-align: center">
                <li v-for="(row, index) of state.qualityLevels" :key="row" :class="{ 'speed-active': state.currentLevel == index }" @click="qualityLevelsHandle(row, index)">
                  {{ row.height }}P
                </li>
              </ul>
            </div>
          </div>
          <!-- 倍速播放 -->
          <div v-if="props.controlBtns.includes('speedRate')" class="d-tool-item speedRate-btn">
            {{ state.speedActive == '1.0' ? '倍速' : state.speedActive + 'x' }}
            <div class="d-tool-item-main">
              <ul class="speed-main">
                <li v-for="row of state.speedRate" :key="row" :class="{ 'speed-active': state.speedActive == row }" @click="playbackRate(row)">{{ row }}x</li>
              </ul>
            </div>
          </div>
          <!-- 音量 -->
          <div v-if="props.controlBtns.includes('volume')" class="d-tool-item volume-btn">
            <div class="d-tool-item-main volume-box" style="width: 52px">
              <div class="volume-main" :class="{ 'is-muted': state.muted }">
                <span class="volume-text-size">{{ volumeText }}</span>
                <!-- @change 如果修改音量则取消静音 -->
                <VSlider v-model="state.volume" :hover="false" size="5px" :vertical="true" @change="state.muted = false"></VSlider>
              </div>
            </div>
            <span style="display: flex" @click="mutedHandler">
              <i class="d-icon iconfont" :class="`icon-volume-${state.volume == 0 || state.muted ? 'mute' : state.volume > 0.5 ? 'up' : 'down'}`" style="font-size: 20px"></i>
            </span>
          </div>
          <!-- 设置 -->
          <div v-if="props.controlBtns.includes('setting')" class="d-tool-item setting-btn">
            <i class="d-icon iconfont rotateHover icon-settings" style="font-size: 20px"></i>
            <div class="d-tool-item-main">
              <ul class="speed-main">
                <li>
                  镜像画面
                  <el-switch v-model="state.mirror" @change="mirrorChange" />
                </li>
                <li>
                  循环播放
                  <el-switch v-model="state.loop" @change="loopChange" />
                </li>
                <li>
                  关灯模式
                  <el-switch v-model="state.lightOff" @change="lightOffChange" />
                </li>
              </ul>
            </div>
          </div>
          <!-- 画中画 -->
          <div v-if="props.controlBtns.includes('pip')" class="d-tool-item pip-btn" @click="requestPictureInPictureHandle">
            <i class="d-icon iconfont icon-pip" style="font-size: 20px"></i>
            <div class="d-tool-item-main">画中画</div>
          </div>
          <!-- 网页全屏 -->
          <div v-if="props.controlBtns.includes('pageFullScreen')" class="d-tool-item pip-btn" @click="state.webFullScreen = !state.webFullScreen">
            <i class="d-icon iconfont icon-web-screen" style="font-size: 20px"></i>
            <div class="d-tool-item-main">网页全屏</div>
          </div>
          <!-- 全屏 -->
          <div v-if="props.controlBtns.includes('fullScreen')" class="d-tool-item fullScreen-btn" @click="toggleFullScreenHandle">
            <div class="d-tool-item-main">全屏</div>
            <i class="d-icon iconfont icon-screen" style="font-size: 20px"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const videoEmits = ['loadstart', 'play', 'pause', 'playing', 'seeking', 'seeked', 'waiting', 'durationchange', 'progress', 'canplay', 'timeupdate', 'ended', 'error', 'stalled'];
</script>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import HlsMin from 'hls.js/dist/hls.min';
import { computed, nextTick, onMounted, onUnmounted, PropType, reactive, ref, Ref, useAttrs, watch } from 'vue';
import VContextmenu from './components/VContextmenu.vue';
import VLoadState from './components/VLoadState.vue';
import VSlider from './components/VSlider.vue';
import VStatus from './components/VStatus.vue';
import { firstUpperCase, isMobile, requestPictureInPicture, timeFormat, toggleFullScreen } from './videoUtil';

const Hls2 = HlsMin as any;

const props = defineProps({
  width: { type: String, default: '800px' },
  height: { type: String, default: '450px' },
  src: { required: false, type: String, default: '' }, //视频源
  type: { type: String, default: '' }, //视频类型
  poster: { type: String, default: '' }, //封面
  webFullScreen: { type: Boolean, default: false }, //网页全屏
  speed: { type: Boolean, default: true }, //是否支持快进快退 //移动端不支持
  currentTime: { type: Number, default: 0 }, //当前播放时间
  playsinline: { type: Boolean, default: false }, //ios端 点击播放是否全屏
  muted: { type: Boolean, default: false }, //静音
  speedRate: { type: Array as PropType<Array<string>>, default: () => ['2.0', '1.5', '1.25', '1.0', '0.75', '0.5'] }, //播放倍速
  autoPlay: { type: Boolean, default: false }, //自动播放
  loop: { type: Boolean, default: false }, //循环播放
  mirror: { type: Boolean, default: false }, //镜像画面
  ligthOff: { type: Boolean, default: false }, //关灯模式
  volume: { type: Number, default: 0.3 }, //默认音量大小
  control: { type: Boolean, default: true }, //是否显示控制器
  controlBtns: {
    type: Array as PropType<Array<string>>,
    default: () => ['audioTrack', 'quality', 'speedRate', 'volume', 'setting', 'pip', 'fullScreen']
  }, //是否显示控制器
  preload: { type: String, default: 'auto' } //预加载
});

const emits = defineEmits([...videoEmits, 'mirrorChange', 'loopChange', 'lightOffChange']); //emits

const refPlayerWrap: Ref<HTMLElement> = ref(null); //wrap
const refdVideo: Ref<HTMLElement> = ref(null); // 视频播放器
const refPlayerControl: Ref<HTMLElement> = ref(null); //播放器控制器
const refInput: Ref<HTMLElement> = ref(null); //快捷键操作
const state = reactive({
  dVideo: null,
  ...props, //如果有自定义配置就会替换默认配置
  muted: props.muted,
  playBtnState: props.autoPlay ? 'pause' : 'play', // 播放按钮状态
  loadStateType: 'loadstart', // 加载状态类型 //loadstart初始化  waiting缓冲 ended播放结束
  fullScreen: false,
  handleType: '', //当前操作类型
  //当前播放时间
  currentTime: '00:00:00',
  // 当前缓冲进度
  preloadBar: 0,
  //总时长
  totalTime: '00:00:00',
  isVideoHovering: false,
  speedActive: '1.0', //倍速
  playProgress: 0, //播放进度
  isMultiplesPlay: false, //是否倍速播放
  longPressTimeout: null,
  progressCursorTime: '00:00:00', //进度条光标时间
  qualityLevels: [], //分辨率数组
  currentLevel: 0, //首选分辨率
  lightOff: false //关灯模式
});

const volumeText = computed(() => {
  if (state.muted) {
    return '0%';
  } else {
    return ~~(state.volume * 100) + '%';
  }
});

const compose =
  (...args) =>
  (value) =>
    args.reverse().reduce((acc, fn) => fn(acc), value);

// 收集video事件
const videoEvents: any = videoEmits.reduce((events, emit) => {
  let name = `on${firstUpperCase(emit)}`;
  events[name] = (ev) => {
    state.loadStateType = emit;
    emits(emit, ev);
  };
  return events;
}, {});

// 可以播放
videoEvents['onCanplay'] = compose(videoEvents['onCanplay'], () => {
  if (state.playBtnState != 'play') {
    //如果是自动播放 则显示暂停按钮
    state.dVideo.play();
  }
  if (state.autoPlay) {
    //如果是自动播放 则显示暂停按钮
    state.dVideo.play();
    state.playBtnState = 'pause';
  }
});
// 播放结束// 合并函数
videoEvents['onEnded'] = compose(videoEvents['onEnded'], () => {
  state.playBtnState = 'replay'; //此时的控制按钮应该显示重新播放
});

// 资源长度改变
videoEvents['onDurationchange'] = (ev) => {
  emits('durationchange', ev);
  if (props.currentTime != 0) {
    state.dVideo.currentTime = props.currentTime;
  }

  //更新当前时长的所有状态
  videoEvents.onTimeupdate(ev);
};

// 缓冲下载中
videoEvents['onProgress'] = (ev) => {
  console.log('缓冲中...');
  emits('progress', ev);
  let duration = ev.target.duration; // 媒体总长
  let length = ev.target.buffered;
  let end = ev.target.buffered.length && ev.target.buffered.end(length - 1);
  state.preloadBar = end / duration; //缓冲比例
};

// 当前播放进度
videoEvents['onTimeupdate'] = (ev) => {
  emits('timeupdate', ev);
  let duration = ev.duration || ev.target.duration || 0; // 媒体总长
  let currentTime = ev.currentTime || ev.target.currentTime; // 当前媒体播放长度
  state.playProgress = currentTime / duration; //播放进度比例
  state.currentTime = timeFormat(currentTime);
  state.totalTime = timeFormat(duration);
};
// error
videoEvents['onError'] = compose(videoEvents['onError'], () => {
  state.playBtnState = 'replay'; //此时的控制按钮应该显示重新播放
});

// 获取用户自定义事件
let attrs = useAttrs();
for (let emit in attrs) {
  videoEvents[emit] = attrs[emit];
}

// 清空当前操作类型
const clearHandleType = useDebounceFn(() => {
  state.handleType = '';
}, 500);

// 音量 +++ --
const volumeKeydown = (ev) => {
  ev.preventDefault();
  if (ev.code == 'ArrowUp') {
    state.volume = state.volume + 0.1 > 1 ? 1 : state.volume + 0.1;
  } else {
    state.volume = state.volume - 0.1 < 0 ? 0 : state.volume - 0.1;
  }
  state.muted = false;
  state.handleType = 'volume'; //操作类型  音量
  clearHandleType(); //清空 操作类型
};

const keydownLeft = (ev) => {
  if (!props.speed) return; // 如果不支持快进快退s
  state.dVideo.currentTime = state.dVideo.currentTime < 10 ? 0.1 : state.dVideo.currentTime - 10;
  videoEvents.onTimeupdate(state.dVideo);
  playHandle();
};

const keypress = (ev) => {
  ev.preventDefault();
  let pressType = ev.type;
  if (ev.key == 'ArrowRight') {
    playHandle();
    if (pressType == 'keyup') {
      clearTimeout(state.longPressTimeout);
      // 如果不支持快进快退 如果关闭快进快退必须在没有长按倍速播放的情况下
      if (!props.speed && !state.longPressTimeout) return;
      if (state.isMultiplesPlay) {
        //如果倍速播放中
        state.dVideo.playbackRate = state.speedActive;
        state.isMultiplesPlay = false;
      } else {
        // 进度加10s
        state.dVideo.currentTime = state.dVideo.currentTime + 10;
        videoEvents.onTimeupdate(state.dVideo);
      }
      // 如果长按5倍速播放
    } else if (pressType == 'keydown') {
      if (!props.speed) return; // 如果不支持快进快退 也不能支持长按倍速播放
      if (state.isMultiplesPlay) {
        clearTimeout(state.longPressTimeout);
      }
      state.longPressTimeout = setTimeout(() => {
        state.isMultiplesPlay = true;
        state.dVideo.playbackRate = 5;
        state.handleType = 'playbackRate'; //操作类型 倍速播放
        clearHandleType(); //清空 操作类型
      }, 500);
    }
  }
};

// 聚焦到播放器
const inputFocusHandle = () => {
  if (isMobile || !refInput.value) return;
  refInput.value.focus();
};

// 播放时间
const playCurrentTime = (currentTime?: string | number) => {
  if (currentTime && state.dVideo) {
    state.dVideo.currentTime = currentTime;
    videoEvents.onTimeupdate(state.dVideo);
  }
  return state.dVideo ? state.dVideo.currentTime : 0;
};

// 播放方法
const playHandle = () => {
  state.loadStateType = 'play';
  state.dVideo.play().catch(() => {
    setTimeout(() => {
      state.playBtnState = 'replay';
      state.loadStateType = 'error';
    }, 500);
  });
  Hls && Hls.startLoad();
  state.playBtnState = 'pause';
  // 播放后清空状态
  // state.loadStateType = ''
};
// 暂停
const pauseHandle = () => {
  state.loadStateType = 'pause'; // 暂停状态
  state.dVideo.pause();
  state.playBtnState = 'play'; // 暂停后要显示播放按钮
  Hls && Hls.stopLoad();
};

// 播放暂停
const togglePlay = (ev) => {
  if (ev) ev.preventDefault();
  if (state.playBtnState == 'play' || state.playBtnState == 'replay') {
    // 点击播放按钮 或 重新播放按钮 后
    playHandle();
  } else if (state.playBtnState == 'pause') {
    // 点击暂停按钮后...
    pauseHandle();
  }
};

// 静音事件
const mutedHandler = () => {
  state.muted = !state.muted;
  // 如果之前音量调整为0 取消静音时会把音量设置为5
  if (state.volume == 0) {
    state.volume = 0.05;
  }
};

//进度条事件
const progressBarChange = (ev: Event, val) => {
  let duration = state.dVideo.duration || state.dVideo.target.duration; // 媒体总长
  state.dVideo.currentTime = duration * val;
  if (state.playBtnState == 'play') {
    state.dVideo.play();
    state.playBtnState = 'pause';
  }
};
// 进度条移动
const onProgressMove = (ev, val) => {
  state.progressCursorTime = timeFormat(state.dVideo.duration * val);
};

// 隐藏控制器
const hideControl = useDebounceFn(() => {
  state.isVideoHovering = false;
}, 2000);

const mouseMovewWarp = (ev) => {
  state.isVideoHovering = true;
  hideControl();
};

// 播放分辨率
const qualityLevelsHandle = (row, index) => {
  Hls && (Hls.currentLevel = index);
  state.currentLevel = index;
};

// 播放速度
const playbackRate = (row) => {
  state.speedActive = row;
  state.dVideo.playbackRate = row;
};

//镜像画面事件
const mirrorChange = (val) => {
  // console.log(val)
  emits('mirrorChange', val, state.dVideo);
};

// 是否循环事件
const loopChange = (val) => {
  // console.log(val)
  emits('loopChange', val, state.dVideo);
};

// 关灯事件
const lightOffChange = (val) => {
  // console.log(val)
  emits('lightOffChange', val, state.dVideo);
};

const requestPictureInPictureHandle = () => {
  requestPictureInPicture(state.dVideo);
};

// 全屏按钮
const toggleFullScreenHandle = () => {
  state.fullScreen = toggleFullScreen(refPlayerWrap.value);
};

// 获取视频格式
const setVideoType = () => {
  if (!props.type) {
    if (state.src.endsWith('.webm')) {
      state.type = 'video/webm';
    } else if (state.src.endsWith('.ogg')) {
      state.type = 'video/ogg';
    } else if (state.src.endsWith('.m3u8')) {
      state.type = 'application/x-mpegURL';
    } else {
      state.type = 'video/mp4';
    }
  }
};

// hls解码
let Hls: HlsMin;
const init = (src): void => {
  if (!src || src == '') {
    destroyHls();
    return;
  }
  state.src = src;
  state.dVideo.src = src;
  setVideoType();
  pauseHandle();

  if (state.dVideo.canPlayType(state.type) || state.dVideo.canPlayType('application/vnd.apple.mpegurl')) {
    state.muted = props.autoPlay;
  }
  // 使用hls解码
  else if (Hls2.isSupported()) {
    Hls = new Hls2({ autoStartLoad: state.preload == 'none' ? false : true });
    Hls.detachMedia(); //解除绑定
    Hls.attachMedia(state.dVideo);
    Hls.on('hlsMediaAttached', () => {
      Hls.loadSource(props.src);
      // 加载可用质量级别
      Hls.on('hlsManifestParsed', (ev, data) => {
        console.log(data);
        state.currentLevel = data.firstLevel;
        state.qualityLevels = data.levels || [];
        // state.dVideo.load();
      });
    });

    Hls.on('hlsLevelSwitching', (ev, data) => {
      console.log(data);
      // state.qualityLevels = Hls.levels || []
      console.log('LEVEL_SWITCHING');
      // state.dVideo.load();
    });
    Hls.on('hlsLevelSwitched', (ev, data) => {
      state.currentLevel = data.level;
      // state.qualityLevels = Hls.levels || []
      console.log('LEVEL_SWITCHED');
      // state.dVideo.load();
    });
  }
};

watch(
  () => props.src,
  (val) => {
    nextTick(() => {
      // 初始化
      init(val);
    });
  },
  { immediate: true }
);

function destroyHls() {
  Hls && Hls.destroy();
  Hls = null;
}

onMounted(() => {
  state.dVideo = refdVideo;
});

onUnmounted(() => {
  destroyHls();
});

defineExpose({
  play: playHandle, //播放
  pause: pauseHandle, //暂停
  togglePlay, //暂停或播放
  playCurrentTime //播放时间
});
</script>

<style lang="scss" scoped>
@import './style/iconfont.css';
@import './style/transition';
@import './style/base';
@import './style/vPlayer';

.d-player-wrap {
  width: v-bind(width);
  height: v-bind(height);
}
</style>
