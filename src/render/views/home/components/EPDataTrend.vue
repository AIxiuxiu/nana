<template>
  <div v-loading="loading" class="content-card">
    <div class="header">
      <span>辖区股权质押情况</span>
    </div>
    <div ref="myChart" class="mychart"></div>
  </div>
</template>
<script setup lang="ts">
/**
 * 辖区股权质押情况
 */
import { EquityPledgeApi } from '@/apis/equityPledgeApi';
import { useMyEcharts } from '@/hooks/useEcharts';
import { useUserInfo } from '@/hooks/useUserInfo';
import { ref } from 'vue';
import { epDataTrendEcharts } from '../services/epDataTrend';

const { myChart, setOption } = useMyEcharts(null, { showLoading: false });
const loading = ref(false);
const nodata = ref(false);
const { userInfo } = useUserInfo();

function getData() {
  loading.value = true;
  EquityPledgeApi.getPledgeTrend({ codes: userInfo.codes }).then((res) => {
    loading.value = false;
    if (res.data) {
      if (res.data.length === 0) {
        nodata.value = true;
      } else {
        nodata.value = false;
      }
      const echartsOptions = epDataTrendEcharts(res.data, 6);
      setOption(echartsOptions);
    }
  });
}

getData();
</script>
<style lang="scss" scoped>
.content-card {
  padding: 16px 18px 22px 18px;
  height: 320px;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .mychart {
    height: 100%;
    width: 100%;
  }
}
</style>
