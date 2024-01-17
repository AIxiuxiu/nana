<template>
  <div class="content-card">
    <div class="header">
      <span>辖区公司发布公告排名</span>
    </div>
    <div ref="myChart" class="mychart"></div>
  </div>
</template>

<script setup lang="ts">
/**
 * 辖区公司发布公告排名
 */

import { HomeApi } from '@/apis/homeApi';
import { useMyEcharts } from '@/hooks/useEcharts';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useRouter } from 'vue-router';
import { mostAnnouncesEcharts } from '../services/mostAnnounces';

const { myChart, setOption } = useMyEcharts((chart) => {
  chart.on('click', (params) => {
    //
  });
});

const router = useRouter();
const { userInfo } = useUserInfo();

function getData() {
  HomeApi.getMostAnnounces(userInfo.codes).then((res) => {
    if (res.code === 0) {
      const data = JSON.parse(res.data);
      const xAxis = [];
      const barData = [];
      const lvcodes = [];
      data.sort(function (a, b) {
        return b.docCount - a.docCount;
      });
      for (let i = 0; i < data.length; i++) {
        const vdata = data[i];
        if (!vdata || !vdata.docCount || vdata.docCount === '0') {
          continue;
        }
        xAxis.push(vdata.name);
        lvcodes.push(vdata.companyCode);
        barData.push(vdata.docCount);
      }

      const echartsOptions: any = mostAnnouncesEcharts(xAxis, barData, lvcodes, 6);
      setOption(echartsOptions);
    }
  });
}
getData();
</script>
<style scoped lang="scss">
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
