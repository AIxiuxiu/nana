<template>
  <div class="main" :class="{ mini: miniSidebar }">
    <LayoutTitlebar>
      <LayoutDownloads>
        <div class="bar-icon">
          <qj-svg-icon name="bar-xiazai" :size="21"></qj-svg-icon>
        </div>
      </LayoutDownloads>
      <div class="bar-icon" title="刷新" @click="refresh()">
        <qj-svg-icon name="bar-shuaxin" :size="21"></qj-svg-icon>
      </div>

      <el-popover placement="bottom" :width="150" trigger="hover">
        <template #reference>
          <div class="bar-icon">
            <qj-svg-icon name="bar-shuoming" :size="20"></qj-svg-icon>
          </div>
        </template>
        <div class="shuoming-info">
          <p><span>咨询电话</span><br />400-8303630</p>
          <p><span>技术支持</span><br />0755-83990311</p>
          <p v-if="serviceManager"><span>客户经理</span><br />{{ serviceManager.managerMobile }}</p>
          <el-button plain type="text" :icon="Collection" @click="goDocument"> 帮助文档 </el-button>
        </div>
      </el-popover>

      <el-dropdown>
        <div class="bar-icon">
          <qj-svg-icon name="bar-zhanghao" :size="20"></qj-svg-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <div v-has="8000">
              <el-dropdown-item @click="goUserCenter">用户中心</el-dropdown-item>
            </div>
            <el-dropdown-item @click="goLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </LayoutTitlebar>
    <div class="sidebar">
      <LayoutSidebar />
    </div>
    <div class="body">
      <LayoutMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSendLogout, useSendRelaod } from '@/hooks/useSendIpc';
import { useUserInfo } from '@/hooks/useUserInfo';
import { InjectSidebarKey } from '@/types/symbols';
import { Collection } from '@element-plus/icons';
import { provide, ref } from 'vue';
import { useRouter } from 'vue-router';
import LayoutDownloads from './LayoutDownloads.vue';
import LayoutMain from './LayoutMain.vue';
import LayoutSidebar from './LayoutSidebar.vue';
import LayoutTitlebar from './LayoutTitlebar.vue';

const miniSidebar = ref(false);
provide(InjectSidebarKey, miniSidebar);

const { userInfo, cleanToken, cleanUserInfo, serviceManager, getOtherInfo } = useUserInfo();

// 获取用户其他信息
getOtherInfo();

const router = useRouter();
const goUserCenter = () => {
  router.push('/userCenter');
};

function refresh() {
  useSendRelaod();
}

function goLogout() {
  cleanToken();
  cleanUserInfo();
  router.replace({ path: '/login' }).then(() => {
    useSendLogout();
  });
}

function goDocument() {
  router.push('/userCenter/document');
}
</script>
<style lang="scss" scoped>
.main {
  margin-top: $titlebar-height;
  width: 100vw;
  background-color: $bg-color;
  .sidebar {
    width: $sidebar-width;
    position: fixed;
    top: $titlebar-height;
    left: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 10;
    transition: width 0.3s ease-in-out;
  }
  .body {
    margin-left: $sidebar-width;
    position: relative;
    transition: margin-left 0.3s ease-in-out;
  }
}

.mini {
  .sidebar {
    width: 64px !important;
    .icon-left {
      transform: rotate(200deg);
    }
  }
  .body {
    margin-left: 64px !important;
  }
}

.hide {
  .sidebar {
    width: 0 !important;
  }
  .body {
    margin-left: 0 !important;
  }
}

.user {
  position: fixed;
  right: 30px;
  top: 10px;
  z-index: 2020;
}

.bar-icon {
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  color: #888;
  &:hover {
    color: $primary-color;
  }
}

.shuoming-info {
  text-align: center;
  color: $text-color-primary;
  p {
    margin: 10px 0;
    span {
      color: $text-color-regular;
    }
  }
}
</style>
