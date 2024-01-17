<template>
  <div class="content">
    <!-- <div class="header">
      <span>资本市场热点</span>
    </div> -->
    <div id="cloud" ref="myChart" class="mychart"></div>
  </div>
</template>

<script setup lang="ts">
import { HomeApi } from '@/apis/homeApi';
import { useMyEcharts } from '@/hooks/useEcharts';
import 'echarts-wordcloud';
import { useRouter } from 'vue-router';

const { myChart, setOption } = useMyEcharts((chart) => {
  chart.on('click', (params) => {
    router.push({ path: 'fullNews', query: { name: params.name } });
  });
});

const router = useRouter();

const echartsOptions = {
  tooltip: {
    show: true,
    borderColor: '#fff',
    formatter: function (params) {
      return (
        params.marker +
        '' +
        params.name +
        '<br/>' +
        '新闻：' +
        params.value[0] +
        ' 条<br/>' +
        '微博：' +
        params.value[1] +
        ' 条<br/>' +
        '微信：' +
        params.value[2] +
        ' 条<br/>' +
        '博客：' +
        params.value[3] +
        ' 条<br/>' +
        '论坛：' +
        params.value[4] +
        ' 条<br/>'
      );
    }
  },
  series: [
    {
      name: '',
      type: 'wordCloud',
      data: [],
      sizeRange: [15, 28],
      textStyle: {
        fontFamily: 'sans-serif',
        color: function () {
          return 'rgb(' + [Math.round(Math.random() * 200), Math.round(Math.random() * 200), Math.round(Math.random() * 400)].join(',') + ')';
        }
      },
      size: ['90%', '100%'],
      shape: 'circle',
      clickable: true,
      textPadding: 16,
      rotationRange: [0, 0],
      gridSize: 8,
      drawOutOfBound: true,
      autoSize: {
        enable: true,
        minSize: 16
      }
    }
  ]
};
function getData() {
  HomeApi.getHotWordCount({ str: 'all' }).then((res) => {
    if (res.code === 0) {
      echartsOptions.series[0].data = res.data;
      setOption(echartsOptions);
    }
  });
}
getData();
</script>
<style scoped lang="scss">
.content {
  height: 320px;
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .mychart {
    height: calc(100% - 30px);
    width: 100%;
  }
}
</style>
