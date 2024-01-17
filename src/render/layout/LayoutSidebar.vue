<template>
  <div ref="sidebar" class="sidebar-content" :class="{ mini: miniSidebar }">
    <div class="sidebar-top">
      <el-image v-if="userInfo.getCompanyLogoUrl && !miniSidebar" :src="userInfo.getCompanyLogoUrl" fit="cover"></el-image>
      <qj-svg-icon v-else class="logo" :name="logo"></qj-svg-icon>
    </div>
    <div class="sidebar-menu">
      <el-scrollbar>
        <el-menu router :default-active="'/' + $route.path.split('/')[1]" style="border: none" text-color="">
          <template v-for="(menu_v, index) in menus" :key="index">
            <el-menu-item
              v-has="menu_v.authCode"
              v-track="{ id: 'menu_left_click', eventResource: menu_v.title, elementId: `menu_${menu_v.authCode || 1000}`, parentElId: '' }"
              :index="menu_v.path"
            >
              <template #title>
                <el-tooltip :content="menu_v.title" placement="right" :offset="34" effect="light" :disabled="!miniSidebar">
                  <div>
                    <qj-svg-icon class="menu-icon on" :size="18" :name="menu_v.icon" color="#fff"></qj-svg-icon>
                    <qj-svg-icon class="menu-icon off" :size="18" :name="menu_v.icon" color="#2c2b30"></qj-svg-icon>
                  </div>
                </el-tooltip>
                <transition name="el-fade-in">
                  <span v-if="!miniSidebar" style="margin-left: 18px">{{ menu_v.title }}</span>
                </transition>
              </template>
            </el-menu-item>
          </template>
        </el-menu>
        <div
          v-has="14000"
          v-track="{ id: 'menu_left_click', eventResource: '安娜视窗', elementId: `menu_14000`, parentElId: '' }"
          class="qjsc"
          :class="{ min: miniSidebar }"
          @click="goQjsc()"
        >
          <img :src="$img('qjsc.png')" alt="安娜视窗" />
          <span class="label">安娜视窗</span>
        </div>
        <LayoutAd1 ref="ad1" />
      </el-scrollbar>
    </div>
    <transition name="scale">
      <LayoutAd v-if="showAd" />
    </transition>

    <div class="sidebar-bottom" @click="miniSidebar = !miniSidebar">
      <div class="icon-left" :title="miniSidebar ? '展开' : '收起'">
        <qj-svg-icon v-if="!miniSidebar" name="sidebar_left" :size="20"></qj-svg-icon>
        <qj-svg-icon v-else name="sidebar_right" :size="20"></qj-svg-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CommonApi } from '@/apis/commonApi';
import { useSendShowQjscWindow } from '@/hooks/useSendIpc';
import { useUserInfo } from '@/hooks/useUserInfo';
import { InjectSidebarKey } from '@/types/symbols';
import { useElementSize } from '@vueuse/core';
import { ElMessageBox } from 'element-plus';
import { computed, inject, ref, watchEffect } from 'vue';
import LayoutAd from './LayoutAd.vue';
import LayoutAd1 from './LayoutAd1.vue';

const miniSidebar = inject(InjectSidebarKey);
const logo = computed(() => (miniSidebar.value ? 'logo-min' : 'logo'));

const { userInfo } = useUserInfo();

const menus = [
  {
    title: '首页',
    icon: 'menu_home',
    path: '/home'
  },
  {
    title: '路演管理',
    icon: 'menu_performanceBrief',
    path: '/roadshow',
    authCode: 2000
  },
  {
    title: '安娜数据',
    icon: 'menu_data',
    path: '/scData',
    authCode: 4000
  },
  {
    title: '安娜投教',
    icon: 'video',
    path: '/tjData',
    authCode: 3000
  },
  {
    title: '监管信息',
    icon: 'menu_option',
    path: '/superviseData',
    authCode: 5000
  },
  {
    title: '安娜互动',
    icon: 'menu_interact',
    path: '/qjInteract',
    authCode: 6000
  },
  {
    title: '培训管理',
    icon: 'menu_trainingManage',
    path: '/trainingManage',
    authCode: 7000
  },
  {
    title: '会务管理',
    icon: 'menu_conferenceManagement',
    path: '/conferenceManagement',
    authCode: 9000
  },
  {
    title: '对外平台',
    icon: 'menu_externalPlatform',
    path: '/externalPlatform',
    authCode: 1000
  }
];

const sidebar = ref(null);
const ad1 = ref(null);
const { height } = useElementSize(sidebar);
const showAd = ref(false);

const { height: adHight } = useElementSize(ad1);

watchEffect(() => {
  let maxHeight = 580;
  if (adHight.value) {
    maxHeight += adHight.value;
  }
  if (height.value > maxHeight) {
    showAd.value = true;
  } else {
    showAd.value = false;
  }
});

function goQjsc() {
  CommonApi.loginsc(userInfo.mobile).then((res) => {
    if (res && res.data) {
      useSendShowQjscWindow(res.data);
    } else {
      ElMessageBox.confirm('您暂未开通安娜视窗权限，请联系客服。<br />客服电话：029-88993782', '提示', {
        type: 'warning',
        showCancelButton: false,
        dangerouslyUseHTMLString: true
      });
    }
  });
}
</script>

<style lang="scss" scoped>
.sidebar-content {
  overflow: hidden;
  // transition: all 0.3s ease-in-out;
  background-color: $white-color;
  .sidebar-top {
    width: 100%;
    display: flex;
    color: $text-color-primary;
    background-color: $menu-bg;
    justify-content: center;
    align-items: center;
    height: $top-height;
    border-bottom: 1px solid $border-color-base;
    span {
      white-space: nowrap;
    }
    .logo {
      transition: all 0.3s ease-in-out;
      width: 100% !important;
      height: 32px !important;
    }
  }
  .sidebar-menu {
    width: 100%;
    height: calc(100vh - #{$top-height} - #{$bottom-height} - #{$titlebar-height});
    overflow-y: auto;
    overflow-x: hidden;
    background: $menu-bg;
  }
  .sidebar-bottom {
    position: relative;
    width: 100%;
    height: $bottom-height;
    background-color: $menu-bg;
    color: #fff;
    cursor: pointer;
    .icon-left {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $primary-color;
      right: 0;
      width: 64px;
      height: 100%;
      font-size: 20px;
      transition: all 0.3s ease-in-out;
    }
  }
  .menu-icon {
    height: 20px;
    vertical-align: -4px;
    // margin-right: 18px;
    color: $menu-text;
  }
  .off {
    display: inline-block;
  }
  .on {
    display: none;
  }

  .is-active {
    .on {
      display: inline-block;
    }
    .off {
      display: none;
    }
  }
}

.el-menu-item {
  height: 44px;
  line-height: 44px;
  padding-left: 28px !important;
  transition: all 0.3s ease-out;
  &.is-active {
    background-color: $primary-color;
    color: #fff;
  }
}

.mini .el-menu-item {
  padding-left: 20px !important;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease-out opacity 0.4 ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
  opacity: 0;
}

.svg-wrap {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-scrollbar__wrap) {
  width: 100%;
}

.qjsc {
  cursor: pointer;
  margin: 15px 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  background: linear-gradient(46deg, #fd9c75 0%, #f2553a 100%);
  box-shadow: 0 4px 6px 0 rgba(249, 154, 128, 0.38);
  border-radius: 3px;
  img {
    height: 22px;
  }
  .label {
    height: 22px;
    line-height: 22px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    width: 82px;
    transition: all 0.4s ease-in-out;
    overflow: hidden;
    word-wrap: none;
  }
  &.min {
    .label {
      opacity: 0;
      max-width: 0;
    }
  }
}
</style>
