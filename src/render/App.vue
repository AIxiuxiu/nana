<template>
  <el-config-provider :locale="zhCn">
    <router-view v-if="isRouterAlive" v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <QjDetailModal />
  </el-config-provider>
  <LayoutUpdate />
</template>
<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { nextTick, provide, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { OtherApi } from './apis/otherApi';
import { useSendGetScreenSize, useSendLogout } from './hooks/useSendIpc';
import { provideUserInfo } from './hooks/useUserInfo';
import LayoutUpdate from './layout/LayoutUpdate.vue';
import { InjectModalsKey, InjectReloadKey } from './types/symbols';

const devInnerWidth = 1440.0; // 开发时的InnerWidth
useSendGetScreenSize((size) => {
  if (size) {
    let zoomFactor = size.width / devInnerWidth;
    if (zoomFactor < 0.9) {
      zoomFactor = 0.9;
    }
    if (zoomFactor > 1.1) {
      zoomFactor = 1.1;
    }
    window.setZoomFactor(zoomFactor);
  }
});

/**
 * 刷新页面
 */
provide(InjectReloadKey, reload);
const isRouterAlive = ref(true);
function reload() {
  isRouterAlive.value = false;
  nextTick(() => (isRouterAlive.value = true));
}

/**
 * 弹窗 provide
 */
const detailModals = reactive({});
provide(InjectModalsKey, { modals: [], openedModals: [], detailModals });

const router = useRouter();

// 用户信息
const state = provideUserInfo();
if (!state.isLogin()) {
  router.replace({ path: '/login' });
  useSendLogout();
} else {
  OtherApi.addPOSTRecord('start', state.userInfo);
}
</script>
