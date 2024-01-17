<template>
  <div class="content-card">
    <div class="marginB10">辖区公司发布资讯排名</div>
    <div ref="myChart" class="mychart"></div>
  </div>
</template>

<script setup lang="ts">
import { HomeApi } from '@/apis/homeApi';
import { useMyEcharts } from '@/hooks/useEcharts';
import { useUserInfo } from '@/hooks/useUserInfo';
import { onMounted } from 'vue';
import { regionsTopEcharts } from '../services/regionsTop';

const { userInfo } = useUserInfo();
const { myChart, setOption } = useMyEcharts();

function getData() {
  let p = {};
  if (userInfo.supervisorArea) {
    p = { zjjname: userInfo.supervisorArea };
  } else {
    p = { orgIds: userInfo.oids };
  }
  HomeApi.getZjjtopCount(p).then((res) => {
    if (res.code === 0) {
      let xData = [];
      let nData = [];
      let aData = [];
      if (res.data) {
        res.data.forEach((item, index) => {
          xData.push(item.name);
          nData.push(item.neg);
          aData.push(item.all);
        });
      }

      setOption(regionsTopEcharts(xData, nData, aData));
    }
  });
}
onMounted(() => {
  getData();
});
</script>
<style scoped lang="scss">
.content-card {
  padding: 16px 18px 22px 18px;
  height: 340px;

  .mychart {
    height: 100%;
    width: 100%;
  }
}
</style>
