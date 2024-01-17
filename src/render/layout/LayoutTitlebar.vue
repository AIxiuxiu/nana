<template>
  <div class="titlebar" :class="[styleClass, stylePlatform]" @contextmenu.prevent="contextMenu">
    <div class="titlebar-resize-handle top"></div>
    <div class="titlebar-resize-handle right"></div>
    <div class="titlebar-resize-handle left"></div>
    <div v-if="platform === 'darwin' && trafficLight" class="titlebar-buttons-osx">
      <div v-if="isClosable" class="macButton macButtonClose" @click="onWinOperation('close')">
        <svg name="TitleBarCloseMac" width="12" height="12" viewBox="0 0 12 12">
          <path stroke="#4c0000" fill="none" d="M8.5,3.5 L6,6 L3.5,3.5 L6,6 L3.5,8.5 L6,6 L8.5,8.5 L6,6 L8.5,3.5 Z"></path>
        </svg>
      </div>
      <div v-if="isMinimizable" class="macButton macButtonMinimize" @click="onWinOperation('min')">
        <svg name="TitleBarMinimizeMac" width="12" height="12" viewBox="0 0 12 12">
          <rect fill="#975500" width="8" height="2" x="2" y="5" fill-rule="evenodd"></rect>
        </svg>
      </div>
      <div v-if="isMaximizable" class="macButton macButtonMaximize" @click="onWinOperation('max')">
        <svg name="TitleBarMaximizeMac" width="12" height="12" viewBox="0 0 12 12">
          <g fill="#006500" fill-rule="evenodd">
            <path d="M5,3 C5,3 5,6.1325704 5,6.48601043 C5,6.83945045 5.18485201,7 5.49021559,7 L9,7 L9,6 L8,6 L8,5 L7,5 L7,4 L6,4 L6,3 L5,3 Z" transform="rotate(180 7 5)"></path>
            <path d="M3,5 C3,5 3,8.1325704 3,8.48601043 C3,8.83945045 3.18485201,9 3.49021559,9 L7,9 L7,8 L6,8 L6,7 L5,7 L5,6 L4,6 L4,5 L3,5 Z"></path>
          </g>
        </svg>
      </div>
    </div>

    <div class="titlebar-header">
      <div v-if="showIcon" class="titlebar-icon">
        <slot name="icon">
          <svg class="icon" width="200px" height="176.10px" viewBox="0 0 1163 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1002.3369999 319.48647105c-24.35667136-63.70747847-74.49551251-124.42316901-144.50334423-159.28629461C803.68229864 133.22129085 727.93727475 122.97881759 675.05302787 125.02027275 543.32637721 130.17670731 186.15972556 249.72502229 143.83473002 527.6444974c-30.88580803 202.80800592 160.06064033 298.52761307 265.63554672 335.48499015l-0.12319074 0.17598709c1.47829481 0.43996885 2.7102074 0.87993768 3.5725463 1.19671502 18.83066383 6.75792011 35.00391587 11.22800285 51.56434037 15.25811755 7.42667313 1.86546731 11.61517534 2.7278062 11.61517534 2.72780619 5.52600751 1.30230774 8.06022784 2.11185027 14.02620494 3.16777502 8.30661081 1.47829481 7.69065413-4.39968762 12.05514421-3.53734875 48.66054636 9.85530075 78.93039844 14.69495721 100.03130084 16.73641236 1.77747413 0.17598784 2.95659038-0.29917856 3.44935481-0.49276518 5.22682895-1.61908508 7.07469821-7.12749381 13.90301346-6.44114277 5.96597634 0.61595592 55.11928789 7.49706826 56.228009 7.18029018 5.59640264-0.29917856 8.18341933-3.39655921 8.6761845-9.2393441 0.35197493-4.83965646-3.64294142-7.49706826-8.25381444-8.18341931a55.15448546 55.15448546 0 0 1-7.62025902-1.54868995c-1.84786852-0.56316032-2.51662154-2.11185027-2.51662153-3.51974995 0-1.88306607 1.3375053-3.55494751 4.1709042-3.55494827 0 0 35.49668105 4.47008276 36.92217951 4.52287912 3.06218232 0.12319148 8.67618452-0.66875226 9.76730683-6.26515491 0.98553037-5.0156443-2.63981227-8.30661081-7.12749458-9.11615337-7.63785778-1.40790043-35.74306326-6.19476053-53.46500523-9.60891777-0.24638222-0.05279635-0.49276519-0.05279635-0.7391474-0.12319149-2.3406337-0.68635106-8.3594064-2.1646466-7.12749382-8.55299303 1.05592476-5.45561314 6.88111159-5.20923015 8.48259789-5.03324232 0.12319148 0 0.24638222 0.07039514 0.43996885 0.07039439 1.28470894 0.17598784 2.5694179 0.29917856 3.74853337 0.49276518 8.7289801 1.1087211 93.37897269 14.32538351 129.56200481 15.18772239 2.28783735 0.07039514 11.86155834 0.75674619 12.05514418-8.23621568 0.12319148-6.38834641-5.91317999-7.74345049-5.91318001-7.74345046s-17.89792981-2.11185027-27.19007022-3.36136167a339.49750528 339.49750528 0 0 1-25.7645718-4.27649613c-6.0363715-1.42549846-6.08916784-5.10363746-5.73719215-7.32108043 0.3695737-2.18224539 2.28783735-4.71646498 6.40594518-4.91005159 5.05084188-0.17598784 13.16386605 1.23191259 15.38130827 1.30230773 4.0477127 0.12319148 8.55299304 0.70394984 11.26320044-2.28783736a9.063357 9.063357 0 0 0 0.49276519-11.79116318c-1.6014863-2.11185027-4.99804551-2.90379403-4.99804551-2.90379402l-45.33438227-8.86977038c1.84786852-7.63785778-1.28470894-13.77982197-9.15135092-16.26124595-15.76848075-3.78373169-60.29332049-14.00860541-72.78843351-17.24677632-49.76926745-12.8998843-111.47048837-31.25538173-141.37076677-43.34572348-122.92727542-49.87486014-165.42825879-117.85883552-163.52759393-164.24914254 1.30230774-32.31130648 26.02855278-90.8095548 111.2945013-147.93510103a638.60587671 638.60587671 0 0 1 140.94839671-71.57412044c140.80760643-50.78999541 214.8279533-6.14196418 243.00355317 22.94877167 5.35002043 5.52600751 8.53539425 12.14313811 10.94642308 17.8099359 3.13257745 7.39147558 3.87172487 16.1908508 2.34063369 20.88971698-4.87485402 15.38130827-28.17560061 23.93430131-73.58037802 16.13805523-56.59758345-9.74970804-116.52133022 28.0876067-130.30115221 90.42238232-15.68048684 70.90536742 44.22566116 184.66369389 220.72353528 130.58273197 85.21315215-26.11654668 122.3113195-73.75636511 141.68754412-118.42199509 24.55025798-56.68557662 25.4125961-130.05476998 0.7391474-194.50139587"
              fill="#E50012"
            />
          </svg>
        </slot>
      </div>

      <div v-if="showTitle" class="titlebar-name">
        <slot name="title">
          <span>{{ title }}</span>
          <span v-if="version" style="font-size: 10px">({{ version }})</span>
        </slot>
      </div>
    </div>
    <div class="titlebar-content">
      <slot></slot>
    </div>
    <div v-if="platform !== 'darwin'" class="titlebar-buttons">
      <button v-if="isMinimizable" aria-label="minimize" title="最小化" tabindex="-1" @click="onWinOperation('min')">
        <svg aria-hidden="true" version="1.1" width="10" height="10">
          <path d="M 0,5 10,5 10,6 0,6 Z"></path>
        </svg>
      </button>

      <button v-if="isMaximizable" aria-label="maximize" title="最大化" tabindex="-1" @click="onWinOperation('max')">
        <svg aria-hidden="true" version="1.1" width="10" height="10">
          <path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z"></path>
        </svg>
      </button>

      <button v-if="isClosable" aria-label="close" title="关闭" tabindex="-1" class="close" @click="onWinOperation('close')">
        <svg aria-hidden="true" version="1.1" width="10" height="10">
          <path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z"></path>
        </svg>
      </button>
    </div>
  </div>
  <el-dialog v-model="versionDialogVisible" title="" width="500px" destroy-on-close center custom-class="v-dialog">
    <div class="v-title">{{ title }} for {{ platformInfo }} {{ version }}</div>
    <el-scrollbar max-height="300px">
      <pre class="v-content">{{ lastVersionInfo.content }}</pre>
    </el-scrollbar>
  </el-dialog>
</template>

<script lang="ts" setup>
import { UserApi } from '@/apis/userApi';
import {
  useSendCleanOldVersion,
  useSendDetailWindowOperation,
  useSendGetVersion,
  useSendMainWindowOperation,
  useSendOpenDevTools,
  useSendRelaod,
  useShowContextualMenu
} from '@/hooks/useSendIpc';
import { isMacOS } from '@/utils/electron';
import { computed, ref } from 'vue';
import { QjMenuItem } from '../../common/electron';

const props = defineProps({
  theme: {
    type: String,
    default: 'light'
  },
  trafficLight: {
    type: Boolean,
    default: false
  },
  isMinimizable: {
    type: Boolean,
    default: true
  },
  isMaximizable: {
    type: Boolean,
    default: true
  },
  isClosable: {
    type: Boolean,
    default: true
  },
  showIcon: {
    type: Boolean,
    default: false
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  isDetail: {
    type: Boolean,
    default: false
  }
});

const title = import.meta.env.VITE_APP_TITLE.toString();
const platform = isMacOS ? 'darwin' : 'win32';
const styleClass = computed(() => `titlebar-style-${props.theme}`);
const stylePlatform = computed(() => `titlebar-platform-${platform}`);

const version = ref('');
const versionDialogVisible = ref(false);
const platformInfo = isMacOS ? 'Mac' : 'Windows';
const lastVersionInfo = ref();
useSendGetVersion((val) => {
  version.value = `${val.appVersion}`;
  if (val.oldVersion && val.showVersionInfo) {
    UserApi.versionPublish({ page: 1, pagesize: 1, platformType: isMacOS ? 0 : 1 }).then((res) => {
      if (res && res.data && res.data.length > 0) {
        lastVersionInfo.value = res.data[0];
        if (lastVersionInfo.value.outVersionNumber == val.appVersion) {
          versionDialogVisible.value = true;
          useSendCleanOldVersion();
        }
      }
    });
  }
});

function onWinOperation(operation: 'min' | 'max' | 'close') {
  if (props.isDetail) {
    useSendDetailWindowOperation(operation);
  } else {
    useSendMainWindowOperation(operation);
  }
}

function contextMenu() {
  const menus: QjMenuItem[] = [
    {
      label: '刷新',
      action: () => {
        useSendRelaod();
      }
    },
    {
      label: '最大化',
      action: () => {
        onWinOperation('max');
      }
    },
    {
      label: '最小化',
      action: () => {
        onWinOperation('min');
      }
    },
    {
      label: '检查元素',
      action: () => {
        useSendOpenDevTools();
      }
    }
  ];
  useShowContextualMenu(menus);
}
</script>

<style lang="scss">
.titlebar {
  position: fixed;
  flex-grow: 0;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  height: $titlebar-height;
  -webkit-app-region: drag;
  user-select: none;

  &.titlebar-style-dark {
    color: #fff;
    background: #2d3135;
  }

  &.titlebar-style-light {
    color: $text-color-primary;
    background: rgba(232, 234, 237, 1);
    border-bottom: 1px solid $border-color-base;
  }

  .titlebar-resize-handle {
    position: absolute;
    top: 0;
    left: 0;
    -webkit-app-region: no-drag;

    &.top {
      width: 100%;
      height: 3px;
    }

    &.right {
      left: auto;
      right: 0;
      width: 3px;
      height: $titlebar-height;
    }

    &.left {
      width: 3px;
      height: $titlebar-height;
    }
  }

  .titlebar-header {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .titlebar-icon,
  .titlebar-name {
    display: flex;
    align-content: center;
    align-self: center;
    flex-grow: 0;
    flex-shrink: 0;
    font-size: 14px;
    line-height: $titlebar-height;
    padding: 0 8px;
    height: $titlebar-height;

    > svg,
    > img {
      display: block;
      align-content: center;
      align-self: center;
      width: auto;
      height: 16px;
    }
  }

  .titlebar-icon ~ .titlebar-name {
    padding-left: 0;
  }

  .titlebar-content {
    width: 40%;
    position: absolute;
    right: 126px;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    > * {
      -webkit-app-region: no-drag;
    }
  }

  &.titlebar-platform-darwin {
    .titlebar-header {
      width: 100%;
      text-align: center;
      position: absolute;
      pointer-events: none;
    }
    .titlebar-content {
      right: 20px;
    }
  }

  .titlebar-buttons {
    display: flex;
    flex-direction: row;
    flex-grow: 0;
    flex-shrink: 0;
    margin-left: auto;

    button {
      -webkit-app-region: no-drag;
      display: inline-block;
      position: relative;
      width: 42px;
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
      border: none;
      box-shadow: none;
      border-radius: 0;
      color: currentColor;
      background-color: transparent;
      line-height: 10px;
      outline: none;

      svg {
        fill: currentColor;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
        color: currentColor;
      }

      &.close:hover {
        background-color: #fc615d;
        color: #fff;
      }
    }
  }

  .titlebar-buttons-osx {
    display: flex;
    box-sizing: border-box;
    padding: 10px;
    flex-direction: row;
    -webkit-box-pack: justify;
    justify-content: space-between;
    align-items: center;

    .macButton {
      -webkit-app-region: no-drag;
      -webkit-box-sizing: border-box;
      border-radius: 50%;
      box-sizing: border-box;
      height: 12px;
      width: 12px;
      margin-right: 10px;

      background-color: #dcdcdc;
      border-color: #d1d1d1;

      &.macButtonClose {
        background-color: #fc615d;
      }

      &.macButtonMinimize {
        background-color: #fdbc40;
      }

      &.macButtonMaximize {
        background-color: #34c749;
      }

      svg {
        display: block;
        visibility: hidden;
      }
    }

    &:hover {
      .macButton {
        svg {
          visibility: visible;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.v-dialog {
  margin-top: 20vh;
  height: 420px;
  border-radius: $content-border-radius;
  background-image: url(@/assets/images/app_version_bg.png);
  background-size: 100%;

  .v-title {
    padding: 0 15px;
    font-size: 20px;
    color: $text-color-primary;
    line-height: 1.4;
  }

  .v-content {
    padding: 15px;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: 14px;
    color: $text-color-regular;
    line-height: 1.4;
  }
  .el-dialog__headerbtn {
    --el-message-close-size: 20px;
  }
  .el-dialog__body {
    padding: 30px 10px 30px;
  }
}
</style>
