import { graphic } from 'echarts/core';
import { ECOption } from '@/hooks/useEcharts';

export const epDataTrendEcharts = function (
  data: {
    xDataCode: string[];
    companyName: string;
    '质押市值(万元)': number[];
    '总市值(万元)': number[];
    // eslint-disable-next-line prettier/prettier
    '质押股数': number[];
    barX: string[];
  },
  xLength?: number
) {
  xLength = !xLength ? 6 : xLength;
  const echartsOptions: ECOption = {
    color: ['#01A8FE', '#EC6F77', '#EDC8AB'],
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '12%',
      top: '17%',
      containLabel: true
    },
    legend: {
      data: ['总市值(万元)', '质押市值(万元)', '质押股数'],
      top: '0%'
    },
    xAxis: [
      {
        type: 'category',
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
        },
        data: data.barX
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '(万股)',
        nameTextStyle: {
          align: 'right',
          padding: [0, 7, 0, 0]
        },
        axisLabel: {
          // formatter: '{value}',
          formatter: function (value, index) {
            let showValue;
            if (value >= 10000) {
              showValue = value / 10000 + '万';
            } else if (value < 1000) {
              showValue = value;
            }
            return showValue;
          }
        }
      },
      {
        type: 'value',
        name: '(万元)',
        nameTextStyle: {
          align: 'left',
          padding: [0, 0, 0, 7]
        },
        axisLabel: {
          // formatter: '{value}'
          formatter: function (value, index) {
            let showValue;
            if (value >= 10000) {
              showValue = value / 10000 + '万';
            } else if (value < 1000) {
              showValue = value;
            }
            return showValue;
          }
        },
        splitLine: {
          show: false
        }
      }
    ],
    dataZoom: [
      {
        type: 'slider',
        show: true,
        showDetail: false,
        height: 20,
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleStyle: {
          color: '#d3dee5'
        },
        startValue: 0,
        endValue: data.barX.length > xLength ? xLength - 1 : data.barX.length - 1,
        zoomLock: true,
        brushSelect: false
      }
    ],
    series: [
      {
        data: data['质押股数'],
        name: '质押股数',
        type: 'bar',
        itemStyle: {
          borderRadius: [20, 20, 0, 0],
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3D7EFF' },
            { offset: 1, color: '#83CFFF' }
          ])
        },
        barMaxWidth: 20,
        barCategoryGap: '40%'
      },
      {
        data: data['总市值(万元)'],
        name: '总市值(万元)',
        type: 'line',
        yAxisIndex: 1
      },
      {
        data: data['质押市值(万元)'],
        name: '质押市值(万元)',
        type: 'line',
        yAxisIndex: 1
      }
    ]
  };
  return echartsOptions;
};
