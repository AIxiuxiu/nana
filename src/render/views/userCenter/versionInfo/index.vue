<template>
  <el-scrollbar
    v-track="{ id: 'page_view', eventResource: '版本更新', elementId: `versionInfo`, parentElId: `userCenter` }"
    class="main-scrollbar"
    wrap-class="main-wrap"
    view-class="main-view"
  >
    <div v-if="version" class="content-card update">
      <div class="label">
        当前版本 <span class="version">{{ version }}</span>
      </div>
      <div v-if="updateError" class="error">
        <el-icon style="margin-right: 2px" color="#e6a23c" :size="16"><warning-filled /></el-icon>
        更新失败，请
        <span class="btn" @click="sendUpdate"> 重试 </span>
        或点击
        <span class="btn" @click="download"> 下载 </span>
        重新安装最新版本
      </div>
      <el-button v-if="showRestart" type="primary" @click="hotRestart">重启更新</el-button>
      <el-button v-else type="primary" :loading="updateLoading" :disabled="nohasUpdate" @click="sendUpdate">{{ updateText }}</el-button>
    </div>
    <div v-loading="isLoading" class="content-card content">
      <el-timeline>
        <el-timeline-item
          v-for="item in versionInfos"
          :key="item.version"
          :hide-timestamp="true"
          :timestamp="item.version"
          :hollow="true"
          :type="item.current ? 'primary' : 'info'"
          placement="top"
        >
          <div class="header">
            <span>{{ item.outVersionNumber }}</span>
            <span class="date">{{ item.publishDttm }}</span>
          </div>
          <div class="card">
            <pre class="info">{{ item.content }}</pre>
          </div>
        </el-timeline-item>
      </el-timeline>
      <qj-empty v-if="!isLoading && versionInfos.length === 0" />
      <QjPagination />
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
/**
 * 版本更新
 */
import { UserApi } from '@/apis/userApi';
import { useAsyncTableApi } from '@/hooks/useAsyncApi';
import useElectron from '@/hooks/useElectron';
import { useOnIpc, useRemoveIpc, useSendIpc } from '@/hooks/useIpc';
import { useSendGetVersion } from '@/hooks/useSendIpc';
import { isMacOS } from '@/utils/electron';
import { WarningFilled } from '@element-plus/icons';
import { computed, onUnmounted, ref } from 'vue';
import { UPDATER } from '../../../../common/event';

const { isLoading, data: versionInfos } = useAsyncTableApi((params) => {
  // 0:MAC客户端，1：windows客户端
  params.platformType = isMacOS ? 0 : 1;
  return UserApi.versionPublish(params);
});

const version = ref('');
useSendGetVersion((val) => {
  version.value = `${val.appVersion}`;
});

const checkLoading = ref(false);

function sendUpdate() {
  hotUpdateLoading.value = false;
  hotUpddateError.value = false;
  hotUpddateNotHas.value = false;
  allUpdateLoading.value = false;
  allUpdateError.value = false;
  allUpdateNotHas.value = false;
  checkLoading.value = true;
  console.log('启动检查更新');
  useSendIpc(UPDATER.updateCheck);
}

const { shell } = useElectron();
function download() {
  shell.openExternal('https://www.nana.net/special/202203/qj2022/');
}

const updateLoading = computed(() => {
  return checkLoading.value || hotUpdateLoading.value || allUpdateLoading.value;
});

const nohasUpdate = computed(() => {
  return hotUpddateNotHas.value && allUpdateNotHas.value;
});

const updateError = computed(() => {
  return hotUpddateError.value || allUpdateError.value;
});

const updateText = computed(() => {
  if (nohasUpdate.value) {
    return '暂无更新';
  } else if (updateError.value) {
    return '重新检测';
  } else {
    return '检测更新';
  }
});

const hotUpdateLoading = ref(false);
const handHotUpdateing = () => {
  checkLoading.value = false;
  hotUpdateLoading.value = true;
};
useOnIpc(UPDATER.hotUpdateing, handHotUpdateing);

const hotUpddateError = ref(false);
const handHotUpdateError = (error) => {
  checkLoading.value = false;
  hotUpdateLoading.value = false;
  hotUpddateError.value = true;
};
useOnIpc(UPDATER.hotUpdateError, handHotUpdateError);

const hotUpddateNotHas = ref(false);
const handHotNoUpdate = () => {
  checkLoading.value = false;
  hotUpdateLoading.value = false;
  hotUpddateNotHas.value = true;
};

useOnIpc(UPDATER.hotNoUpdate, handHotNoUpdate);

const showRestart = ref(false);
const handHotUpdate = () => {
  hotUpdateLoading.value = false;
  showRestart.value = true;
};
useOnIpc(UPDATER.hotUpdate, handHotUpdate);

function hotRestart() {
  useSendIpc(UPDATER.hotRestart);
}

const allUpdateLoading = ref(false);
const allUpdateError = ref(false);
const allUpdateNotHas = ref(false);

const handUpdateMessage = (res) => {
  if (res.cmd == 'checking-for-update') {
    allUpdateLoading.value = true;
  } else if (res.cmd == 'error') {
    useSendIpc(UPDATER.hotCheck);
    allUpdateLoading.value = false;
    allUpdateError.value = true;
  } else if (res.cmd == 'update-not-available') {
    useSendIpc(UPDATER.hotCheck);
    allUpdateLoading.value = false;
    allUpdateNotHas.value = true;
  } else {
    checkLoading.value = false;
  }
};
useOnIpc(UPDATER.updateMessage, handUpdateMessage);

onUnmounted(() => {
  useRemoveIpc(UPDATER.hotUpdateing, handHotUpdateing);
  useRemoveIpc(UPDATER.hotUpdateError, handHotUpdateError);
  useRemoveIpc(UPDATER.hotNoUpdate, handHotNoUpdate);
  useRemoveIpc(UPDATER.hotUpdate, handHotUpdate);
  useRemoveIpc(UPDATER.updateMessage, handUpdateMessage);
});
</script>

<style lang="scss" scoped>
.content {
  min-height: calc(100vh - #{$titlebar-height} - #{$top-height} - #{$content-padding} * 2 - 84px);
  padding: $content-padding;
  .header {
    display: flex;
    justify-content: space-between;
    color: $text-color-primary;
    margin-bottom: 10px;
    .date {
      color: $text-color-secondary;
    }
  }
  .card {
    background-color: $bg-color;
    border-radius: 4px;
    padding: 12px;
  }
  .info {
    color: $text-color-secondary;
  }
}

.update {
  margin-bottom: 16px;
  padding: 16px $content-padding;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .label {
    display: flex;
    align-items: center;
    .version {
      margin-left: 4px;
      color: $primary-color;
      font-size: 18px;
    }
  }

  .error {
    flex: 1;
    display: flex;
    align-items: center;
    color: $text-color-regular;
    padding: 0 80px;
  }
  .btn {
    cursor: pointer;
    color: $primary-color;
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
