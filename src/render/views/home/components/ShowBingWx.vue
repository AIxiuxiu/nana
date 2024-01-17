<template>
  <div v-if="noBand">
    <el-dialog v-model="show" width="430px" title="绑定提醒" top="32vh" center @close="handleClose">
      <div>{{ appTitle }}已开通微信扫码登录功能，绑定微信后扫码即可登录。</div>
      <template #footer>
        <div class="footer">
          <el-button style="opacity: 0.7" @click="notSHow">不再显示</el-button>
          <div>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleConfirm">去绑定</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { UserApi } from '@/apis/userApi';
import { SHOW_BING_WX } from '@/hooks/useUserInfo';
import { storage } from '@/utils/storage';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const appTitle = import.meta.env.VITE_APP_TITLE.toString();

let bingWx = storage.get(SHOW_BING_WX);
const show = ref(false);

const noBand = ref(false);
if (bingWx == 0) {
  UserApi.checkThirdBand().then((res) => {
    if (res.data.obj == 'noBand') {
      noBand.value = true;
      show.value = true;
    }
    bingWx = 1;
  });
}

function notSHow() {
  bingWx = 2;
  show.value = false;
}

// 关闭弹窗
function handleClose() {
  storage.set(SHOW_BING_WX, bingWx);
  show.value = false;
}

const router = useRouter();
function handleConfirm() {
  router.push('/userCenter/securitySettings');
  handleClose();
}
</script>
<style lang="scss" scoped>
//
.footer {
  display: flex;
  justify-content: space-between;
}
</style>
