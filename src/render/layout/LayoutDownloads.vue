<template>
  <el-popover v-model:visible="showPopover" placement="bottom" :width="280" popper-class="no-padding">
    <template #reference>
      <div ref="popoverRef" style="display: flex" @click="showPopover = !showPopover">
        <el-progress
          v-if="downloading"
          style="padding: 0 12px"
          type="circle"
          :width="20"
          :indeterminate="allPercentage.total == 0"
          :stroke-width="2.5"
          :show-text="true"
          :duration="5"
          :percentage="allPercentage.percentage"
          @click="showPopover = !showPopover"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path
              fill="#999"
              d="M12.75 6.432a.75.75 0 00-1.5 0h1.5zm-1.5 6a.75.75 0 001.5 0h-1.5zm-1.22-2.53a.75.75 0 10-1.06 1.06l1.06-1.06zm1.97 3.03l-.53.53a.75.75 0 001.06 0l-.53-.53zm3.03-1.97a.75.75 0 00-1.06-1.06l1.06 1.06zm-3.78-4.53v6h1.5v-6h-1.5zm-2.28 4.53l2.5 2.5 1.06-1.06-2.5-2.5-1.06 1.06zm3.56 2.5l2.5-2.5-1.06-1.06-2.5 2.5 1.06 1.06z"
              style="animation: download-icon-animate 1s cubic-bezier(1, -0.43, 0.68, 0.57) alternate infinite both"
            />
            <path stroke="#3d7eff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17.274h8" />
          </svg>
        </el-progress>
        <slot v-else> 下载 </slot>
      </div>
    </template>
    <div ref="showRef">
      <div class="header">
        <span style="width: 14px"></span>
        <span>下载列表</span>
        <span class="download-bar-close" @click="closeDownloadBar">清理</span>
      </div>
      <el-scrollbar max-height="400px">
        <ul v-if="files.length > 0" class="download-list">
          <li v-for="(file, index) in files" :key="index" class="download-list__item">
            <img :src="file.icon || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'" width="22" height="22" alt="" />
            <div class="download-list__item-panel">
              <a class="filename" :title="file.name" @click.prevent="openItem(file.savePath)">
                <span class="filename__base ellipsis-1">{{ ellipsis(file.name, true) }}</span>
                <span class="filename__extension">{{ ellipsis(file.name, false) }}</span>
              </a>
              <el-progress
                v-if="file.dataState === 'progressing'"
                :status="checkStateForProgress(file.dataState)"
                :percentage="percentage(file)"
                :stroke-width="5"
                :color="customColorMethod"
                :indeterminate="file.totalBytes == 0"
                :duration="5"
                :show-text="false"
              >
              </el-progress>
              <span class="download-list__item-description">
                {{ file.dataState === 'progressing' ? `${prettyReceivedSize(file.getReceivedBytes)}/${file.totalSize}` : file.totalSize }}
              </span>
            </div>
            <div class="icons">
              <div v-if="file.dataState == 'progressing' && file.isPaused && file.canResume" class="icon" @click="resumeDownload(file.startTime)">
                <qj-svg-icon name="download-kaishi" :size="18"></qj-svg-icon>
              </div>
              <div v-if="file.dataState == 'progressing' && !file.isPaused" class="icon" @click="pauseDownload(file.startTime)">
                <qj-svg-icon name="download-zanting" :size="18"></qj-svg-icon>
              </div>
              <!-- <qj-svg-icon v-if="file.dataState == 'progressing'" class="icon" name="download-stop" :size="18" @click="cancelDownload(file.startTime)"></qj-svg-icon> -->
              <div class="icon" @click="showItemInFolder(file.savePath)">
                <qj-svg-icon name="download-view" :size="18"></qj-svg-icon>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="empty">暂无数据</div>
      </el-scrollbar>
      <div class="setting">
        <span>
          <span>下载目录：</span>
          <span class="filename" style="display: inline-flex; width: 162px" :title="downloadPath" @click="showItemInFolder(downloadPath)">
            <span class="filename__base ellipsis-1">{{ ellipsis(downloadPath, true) }}</span>
            <span class="filename__extension">{{ ellipsis(downloadPath, false) }}</span>
          </span>
        </span>
        <a class="link marginL5" @click="changePath">修改</a>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import useElectron from '@/hooks/useElectron';
import { useOnIpc, useRemoveAllIpc, useSendIpc } from '@/hooks/useIpc';
import { useSendChangeDownloadPath, useSendDownloadPath } from '@/hooks/useSendIpc';
import { QJDownloadItem } from '@/types/types';
import { formatFileSize } from '@/utils';
import { onClickOutside, unrefElement } from '@vueuse/core';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { FILES_MANAGE } from '../../common/event';

const { shell } = useElectron();

const downloadFiles = ref<QJDownloadItem[]>([]);

const showPopover = ref(false);
const popoverRef = ref();
const showRef = ref();
onClickOutside(popoverRef, (e) => {
  const el = unrefElement(showRef);
  if (el === e.target || e.composedPath().includes(el)) return;
  showPopover.value = false;
});

const downloadPath = ref('');
onMounted(() => {
  useSendDownloadPath((res) => {
    downloadPath.value = res;
  });
});

useOnIpc(FILES_MANAGE.willDownload, (data) => {
  downloadFiles.value.unshift({
    name: data.name,
    url: data.url,
    savePath: data.savePath,
    totalBytes: data.totalBytes,
    isPaused: data.isPaused,
    canResume: data.canResume,
    startTime: data.startTime,
    getReceivedBytes: 0,
    dataState: data.dataState
  });
  showPopover.value = true;
});

useOnIpc(FILES_MANAGE.update, (data) => {
  const index = downloadFiles.value.findIndex((file) => file.startTime === data.startTime);
  if (index !== -1) {
    const file = downloadFiles.value[index];
    file.totalBytes = data.totalBytes;
    file.getReceivedBytes = data.getReceivedBytes;
    file.savePath = data.savePath;
    file.isPaused = data.isPaused;
    file.canResume = data.canResume;
    file.icon = data.icon;
    if (file.dataState != 'completed') {
      file.dataState = data.dataState;
    }
  }
});

useOnIpc(FILES_MANAGE.complete, (data) => {
  const index = downloadFiles.value.findIndex((file) => file.startTime === data.startTime);
  if (index !== -1) {
    const file = downloadFiles.value[index];
    if (file.savePath) {
      file.totalBytes = data.totalBytes;
      file.getReceivedBytes = file.totalBytes;
      file.name = data.name;
      file.dataState = data.dataState;
    } else {
      downloadFiles.value.splice(index, 1);
    }
  }
});

const files = computed(() => {
  downloadFiles.value.forEach((file) => {
    file.totalSize = formatFileSize(file.totalBytes);
  });
  return downloadFiles.value;
});

const downloading = computed(() => {
  for (let index = 0; index < downloadFiles.value.length; index++) {
    const file = downloadFiles.value[index];
    if (file.dataState == 'progressing') {
      return true;
    }
  }
  return false;
});

const allPercentage = computed(() => {
  let total = 0;
  let received = 0;
  downloadFiles.value.forEach((file) => {
    if (file.dataState != 'completed') {
      total += file.totalBytes;
      received += file.getReceivedBytes;
    }
  });
  if (total == 0) {
    return { total, percentage: 100 };
  }
  return { total, percentage: (received / total) * 100 || 0 };
});

const state = {
  init: '初始化中',
  progressing: '下载中',
  cancelled: '已取消',
  completed: '已完成'
};

const showState = (dataState: string) => {
  return state[dataState];
};

function prettyReceivedSize(size: number): string {
  return formatFileSize(size);
}

function percentage(file: QJDownloadItem): number {
  if (file.totalBytes == 0) {
    return 100;
  }
  return (file.getReceivedBytes / file.totalBytes) * 100 || 0;
}

function showItemInFolder(savePath: string): void {
  // TODO: 删除处理
  shell.showItemInFolder(savePath);
}

function openItem(savePath: string): void {
  shell.openPath(savePath);
}

const customColorMethod = (percentage) => {
  if (percentage < 30) {
    return '#409eff';
  }
  if (percentage < 70) {
    return '#6f7ad3';
  }
  return '#909399';
};

function checkStateForProgress(state: string): string {
  switch (state) {
    case 'progressing':
      return '';
    case 'cancelled':
    case 'interrupted':
      return 'exception';
    case 'completed':
    default:
      return 'success';
  }
}

function ellipsis(value, start: boolean) {
  if (!value) return '';
  let len = value.length;
  if (len > 8) {
    return start ? value.substring(0, len - 8) : value.substring(len - 8, len);
  }
  return start ? value : '';
}

function pauseDownload(startTime: number): void {
  useSendIpc(FILES_MANAGE.pause, startTime);
}

function resumeDownload(startTime: number): void {
  useSendIpc(FILES_MANAGE.resume, startTime);
}

function cancelDownload(startTime: number): void {
  useSendIpc(FILES_MANAGE.cancel, startTime);
}

function remove(index) {
  if (index <= downloadFiles.value.length) {
    downloadFiles.value.splice(index, 1);
  }
}

function closeDownloadBar(): void {
  downloadFiles.value = [];
}

function changePath() {
  useSendChangeDownloadPath((res) => {
    if (res) {
      downloadPath.value = res;
    }
  });
}

onUnmounted(() => {
  useRemoveAllIpc(FILES_MANAGE.willDownload);
  useRemoveAllIpc(FILES_MANAGE.update);
  useRemoveAllIpc(FILES_MANAGE.complete);
});
</script>

<style lang="scss" scoped>
.header {
  padding: 8px 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.download-bar-close {
  height: 20px;
  width: 28px;
  font-size: 12px;
  padding: 0 2px;
  // border-radius: 50%;
  cursor: pointer;
}

.download-bar-close::before {
  transform: scale(0.8);
}

.download-bar-close:hover {
  color: $primary-color;
}

.download-list {
  margin: 0;
  padding: 8px;
  list-style: none;
  display: flex;
  flex-direction: column;
}

.download-list__item {
  overflow: hidden;
  border-bottom: 1px solid #c0ccda;
  box-sizing: border-box;
  margin: 4px 0;
  padding: 5px 8px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.download-list__item-panel {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex: 1;
  padding-left: 5px;
  max-width: 160px;
}

.filename {
  cursor: pointer;
  color: $text-color-regular;
  transition: color 0.3s;
  font-size: 13px;
  display: flex;
  align-items: center;
  min-width: 0;
  &:hover {
    color: $primary-color;
  }
  .filename__base {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .filename__extension {
    flex-shrink: 0;
  }
}

.download-list__item-description {
  font-size: 12px;
  color: $text-color-secondary;
}

.icons {
  display: flex;
  align-items: center;
  width: 60px;
  justify-content: flex-end;
  .icon {
    color: $text-color-regular;
    padding: 4px;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      color: $primary-color;
    }
  }
}

.empty {
  font-size: 14px;
  padding: 10px;
  text-align: center;
  color: $text-color-regular;
}

.setting {
  padding: 4px 8px;
  font-size: 12px;
  color: $text-color-regular;
}

:deep(.el-progress-circle svg path.el-progress-circle__track) {
  stroke: #aaa;
}

:deep(.el-progress__text) {
  min-width: 24px;
}
</style>
