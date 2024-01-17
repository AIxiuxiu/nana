<template>
  <div class="content-card" style="padding-top: 6px">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="预警度" name="4">
        <div ref="chartEl1" class="chart"></div>
      </el-tab-pane>
      <el-tab-pane label="媒体关注度" name="1">
        <div ref="chartEl2" class="chart"></div>
      </el-tab-pane>
      <el-tab-pane label="网民关注度" name="2">
        <div ref="chartEl3" class="chart"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { HomeApi } from '@/apis/homeApi';
import { useEcharts } from '@/hooks/useEcharts';
import { useUserInfo } from '@/hooks/useUserInfo';
import { ref } from 'vue';
import { optionRankEcharts } from '../services/optionRank';

const activeName = ref('4');

const chartEl1 = ref();
const { setOption: setOption1 } = useEcharts(chartEl1);
const chartEl2 = ref();
const { setOption: setOption2 } = useEcharts(chartEl2);
const chartEl3 = ref();
const { setOption: setOption3 } = useEcharts(chartEl3);

const { userInfo } = useUserInfo();
function getData(type) {
  HomeApi.queryOpinionOrder({ type, orgIds: userInfo.oids }).then((res) => {
    if (res.code == 0 && res.data) {
      const data = JSON.parse(res.data);
      const xAxis = [];
      const barData = [];
      for (let index = 0; index < data.length; index++) {
        const value = data[index];
        xAxis.push(value.name);
        barData.push(value.val);
      }
      const echartsOptions: any = optionRankEcharts(xAxis, barData);
      if (type == '4') {
        setOption1(echartsOptions);
      } else if (type == '1') {
        setOption2(echartsOptions);
      } else if (type == '2') {
        setOption3(echartsOptions);
      }
    }
  });
}

getData('4');

function handleClick(event) {
  getData(event.props.name);
}
</script>
<style scoped lang="scss">
.content-card {
  padding: 16px 18px 22px 18px;
  height: 320px;
  .chart {
    height: 260px;
    width: 100%;
  }
}

:deep(.el-tabs__header) {
  margin: 0;
}
</style>
