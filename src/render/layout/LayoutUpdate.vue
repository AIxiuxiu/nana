<template>
  <el-dialog v-model="dialogVisible" title="版本更新中，请稍等..." center :show-close="false" :close-on-click-modal="false" width="400px" top="40vh">
    <el-progress :text-inside="true" :stroke-width="26" :percentage="progress.percentage" :status="progress.status"></el-progress>
    <span class="tip">更新程序下载完成后，自动重启以完成更新</span>
  </el-dialog>
</template>

<script setup lang="ts">
import { useOnIpc, useRemoveAllIpc, useSendIpc } from '@/hooks/useIpc';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { h, onMounted, onUnmounted, reactive, ref } from 'vue';
import { UPDATER } from '../../common/event';
import { OtherApi } from '../apis/otherApi';

const dialogVisible = ref(false);
const progress = reactive({
  percentage: 0,
  status: ''
});

let timer;
let isUpdate = false;
onMounted(() => {
  sendUpdate();
  timer = setInterval(() => {
    sendUpdate();
  }, 10 * 60 * 1000);
});

function sendUpdate() {
  console.log('启动检查更新');
  setTimeout(() => {
    useSendIpc(UPDATER.updateCheck);
  }, 2000);
}

useOnIpc(UPDATER.updateMessage, (res) => {
  if (res.cmd == 'update-available') {
    stopCheckUpdate();
    if (isUpdate) {
      return;
    }
    isUpdate = true;
    ElMessageBox.alert('检测到新版本，安装更新！', '提示', {
      confirmButtonText: '确定',
      showClose: false,
      callback: () => {
        OtherApi.addGETRecord('appUpdate', res);
        useSendIpc(UPDATER.updateNow);
      }
    });
  } else if (res.cmd == 'download-progress') {
    dialogVisible.value = true;
    progress.percentage = parseInt(res.message.percent);
  } else if (res.cmd == 'error' || res.cmd == 'update-not-available') {
    useSendIpc(UPDATER.hotCheck);
  }
});

useOnIpc(UPDATER.hotUpdateProgress, (res) => {
  dialogVisible.value = true;
  progress.percentage = parseInt(res);
});

useOnIpc(UPDATER.hotUpdateError, (error) => {
  if (dialogVisible.value) {
    dialogVisible.value = false;
    progress.percentage = 0;
    ElMessage.error('更新失败');
  }
});

useOnIpc(UPDATER.hotUpdate, (res) => {
  OtherApi.addGETRecord('hotUpdate', res);
  if (dialogVisible.value) {
    hotRestart();
    return;
  }
  stopCheckUpdate();
  if (isUpdate) {
    return;
  }
  isUpdate = true;
  ElNotification({
    title: '',
    position: 'bottom-right',
    showClose: false,
    duration: 0,
    message: h(
      'p',
      {
        style: 'width: 280px;display: flex;justify-content: space-between; align-items: center;'
      },
      [
        h('span', { style: 'color: #5A626A' }, '已下载更新,立即重启完成更新'),
        h(
          'a',
          {
            class: 'link',
            style: 'padding: 4px 10px',
            onClick: () => hotRestart()
          },
          '重启'
        )
      ]
    )
  });
});

function stopCheckUpdate() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function hotRestart() {
  useSendIpc(UPDATER.hotRestart);
}

onUnmounted(() => {
  stopCheckUpdate();
  useRemoveAllIpc(UPDATER.updateMessage);
  useRemoveAllIpc(UPDATER.hotUpdateError);
  useRemoveAllIpc(UPDATER.hotUpdate);
  useRemoveAllIpc(UPDATER.hotUpdateProgress);
});
</script>

<style lang="scss" scoped>
.tip {
  width: 100%;
  display: inline-block;
  text-align: center;
  margin-top: 10px;
}
</style>
