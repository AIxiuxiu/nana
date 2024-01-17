<!--
 * @Description:
 * @Author: ahl
 * @Date: 2022-04-16 10:13:03
 * @LastEditTime: 2023-04-21 13:22:17
-->
<template>
  <div id="ad1" class="ad-view" :class="{ show: !miniSidebar }">
    <el-carousel v-if="adInfos && adInfos.length > 0" indicator-position="none" height="88px" :interval="5000" :arrow="adInfos.length > 1 ? 'hover' : 'never'">
      <el-carousel-item v-for="(ad, index) in adInfos" :key="index" class="ad-item">
        <el-image class="ad-image cursor-pointer" :src="ad.ossUrl" fit="cover" @click="clickAd(ad)"></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts" setup>
import { HomeApi } from '@/apis/homeApi';
import useElectron from '@/hooks/useElectron';
import { InjectSidebarKey } from '@/types/symbols';
import { inject, ref } from 'vue';

const adInfos = ref([]);

HomeApi.getAdsense(23, 10)
  .then((res) => {
    adInfos.value = res.data;
  })
  .catch(() => {
    console.log('获取广告失败！');
  });

const miniSidebar = inject(InjectSidebarKey);
const { shell } = useElectron();

function clickAd(adInfo) {
  if (adInfo.linkAddress) {
    shell.openExternal(adInfo.linkAddress);
  }
}
</script>

<style lang="scss" scoped>
.ad-view {
  width: $sidebar-width;
  opacity: 0;
  max-height: 0;
  transition: all 0.3s ease-in-out;
  &.show {
    width: auto;
    opacity: 1;
    max-height: 200px;
  }
  .ad-item {
    padding: 4px 10px;
  }
  .ad-image {
    width: 140px;
  }
}

:deep(.el-carousel__arrow) {
  --el-carousel-arrow-font-size: 12px;
  --el-carousel-arrow-size: 20px;
  --el-carousel-arrow-background: rgba(23, 31, 39, 0.11);
  --el-carousel-arrow-hover-background: rgba(17, 22, 28, 0.23);
}
</style>
