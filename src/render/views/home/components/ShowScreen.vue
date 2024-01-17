<template>
  <img v-if="userInfo.zjjid && userInfo.zjjid != ''" :class="{ btnMonten: monted }" :src="$img('financial-btn.svg')" class="btn" alt="" srcset="" @click="openScreen()" />
</template>
<!-- 大屏 -->
<script setup lang="ts">
import { useSendShowScreenWindow } from '@root/src/render/hooks/useSendIpc';
import { useUserInfo } from '@root/src/render/hooks/useUserInfo';
import { ref } from 'vue';
const { userInfo } = useUserInfo();
const openSc = ref(false);

function openScreen() {
  if (!openSc.value) {
    openSc.value = true;
  }
  const url = import.meta.env.VITE_FINANCIAL_DATA_URL + userInfo.platform.toUpperCase();
  useSendShowScreenWindow(url);
}

const monted = ref(true);
setTimeout(() => {
  monted.value = false;
}, 5000);
</script>
<style lang="scss" scoped>
.btn {
  position: fixed;
  right: -82px;
  top: 145px;
  z-index: 9;
  cursor: pointer;
  transition: 300ms;

  &:hover {
    right: 0;
  }
}

.btnMonten {
  right: 0;
}
</style>
