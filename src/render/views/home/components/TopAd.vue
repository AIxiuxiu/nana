<!--
 * @Description: 顶部广告
 * @Author: ahl
 * @Date: 2022-04-16 10:13:03
 * @LastEditTime: 2023-04-21 11:28:37
-->
<template>
  <div v-if="adInfos && adInfos.length > 0" id="top-ad" class="ad-view">
    <el-carousel indicator-position="none" height="90px" :interval="5000" direction="vertical" :arrow="adInfos.length > 1 ? 'hover' : 'never'">
      <el-carousel-item v-for="(ad, index) in adInfos" :key="index" class="ad-item">
        <el-image class="ad-image cursor-pointer" :src="ad.ossUrl" fit="cover" @click="clickAd(ad)"></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts" setup>
import { HomeApi } from '@/apis/homeApi';
import { useDetailModal } from '@/hooks/useDetailModal';
import useElectron from '@/hooks/useElectron';
import WebviewDetail from '@/views/details/WebviewDetail.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const adInfos = ref([]);

HomeApi.getAdsense(43, 1)
  .then((res) => {
    adInfos.value = res.data;
  })
  .catch(() => {
    console.log('获取广告失败！');
  });

const { shell } = useElectron();
const webviewModal = useDetailModal(WebviewDetail, { path: 'webview' });
const router = useRouter();
function clickAd(adInfo) {
  if (adInfo.openType == 'web') {
    shell.openExternal(adInfo.url);
  } else if (adInfo.openType == 'webview') {
    webviewModal.show({
      src: adInfo.url
    });
  } else if (adInfo.openType == 'route') {
    router.push({
      path: adInfo.route,
      query: adInfo.query
    });
  } else if (adInfo.linkAddress) {
    shell.openExternal(adInfo.linkAddress);
  }
}
</script>

<style lang="scss" scoped>
.ad-view {
  margin-bottom: $content-padding;
  position: relative;
  overflow: hidden;
  width: 100%;
  background-color: var(--white-color);
  // border-radius: 16px;
  transition: all 0.3s ease-in-out;
  .ad-image {
    width: 100%;
    height: 90px;
  }
}

:deep(.el-carousel__arrow) {
  --el-carousel-arrow-font-size: 12px;
  --el-carousel-arrow-size: 32px;
  --el-carousel-arrow-background: rgba(23, 31, 39, 0.11);
  --el-carousel-arrow-hover-background: rgba(17, 22, 28, 0.23);
}
</style>
