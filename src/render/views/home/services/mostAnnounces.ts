import { graphic } from 'echarts/core';

// 公司发布公告排名
export const mostAnnouncesEcharts = function (xAxis: string[], barData: any[], lvcodes: string[], xLength) {
  xLength = !xLength ? 7 : xLength;
  const echartsOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function (params) {
        let tip = '';
        if (params[0].componentIndex === 0) {
          // 公司
          tip = xAxis[params[0].dataIndex] + ' ' + lvcodes[params[0].dataIndex] + '<br>近一年总计：' + params[0].data + '条';
        }
        return tip;
      }
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '12%',
      top: '5%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: xAxis,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false,
          alignWithLabel: true
        },
        axisLabel: {
          interval: 0,
          color: '#69717A',
          fontSize: 11,
          rotate: 15
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '报告总数',
        type: 'bar',
        barMaxWidth: 30,
        barCategoryGap: '40%',
        itemStyle: {
          color: new graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: '#e2b0ff' },
            { offset: 1, color: '#7367f0' }
          ])
        },
        data: barData
      }
    ],
    dataZoom: [
      {
        type: 'slider',
        show: true,
        zoomLock: true,
        showDetail: false,
        height: 20,
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleStyle: {
          color: '#d3dee5'
        },
        startValue: 0,
        endValue: xAxis.length > xLength ? xLength - 1 : xAxis.length - 1,
        brushSelect: false
      }
    ]
  };
  return echartsOptions;
};
