import { graphic } from 'echarts/core';

export const regionsTopEcharts = function (xData: any[], nData: any[], aData: any) {
  const echartsOptions: any = {
    legend: {
      top: '0',
      right: '0',
      icon: 'path://M512 881.777778 512 881.777778C716.222629 881.777778 881.777778 716.222629 881.777778 512 881.777778 307.777371 716.222629 142.222222 512 142.222222 307.777373 142.222222 142.222222 307.777371 142.222222 512 142.222222 716.222629 307.777373 881.777778 512 881.777778L512 881.777778ZM512 1024 512 1024C229.230208 1024 0 794.769789 0 512 0 229.230211 229.230208 0 512 0 794.769789 0 1024 229.230211 1024 512 1024 794.769789 794.769789 1024 512 1024L512 1024Z',
      itemWidth: 8, // 设置宽度
      itemHeight: 8, // 设置高度
      itemGap: 12, // 设置间距
      data: ['全部', '敏感']
    },
    tooltip: {
      show: true,
      trigger: 'axis', //axis , item
      formatter: function (params) {
        let tip = params[0].name;
        for (let i = 0; i < params.length; i++) {
          tip += '<br>' + params[i].marker + ' ' + params[i].seriesName + '：' + params[i].value + ' 条';
        }
        return tip;
      }
    },
    grid: {
      top: '8%',
      right: '0%',
      left: '20%',
      bottom: '10%'
    },
    yAxis: [
      {
        type: 'category',
        data: xData.reverse(),
        splitArea: {
          show: true,
          interval: 0
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999',
          fontSize: 12,
          formatter: function (value, index) {
            if (value.length <= 4) {
              return value;
            } else if (value.length > 4) {
              // return value.slice(0, 5) + '\n' + value.slice(5);
              return value.slice(0, 4);
            }
          }
        },
        axisLine: {
          lineStyle: {
            color: '#A2B1C5'
          }
        }
      }
    ],
    xAxis: [
      {
        axisLabel: {
          show: false,
          color: '#999',
          fontSize: 12
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#F3F4F4'
          }
        },
        type: 'value',
        name: '条',
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#A2B1C5'
          }
        }
      }
    ],
    series: [
      {
        data: aData.reverse(),
        name: '全部',
        type: 'bar',
        stack: true,
        barWidth: '12px',
        itemStyle: {
          borderRadius: [0, 0, 0, 0],
          color: new graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: '#81C6FF' },
            { offset: 1, color: '#6C88FF' }
          ])
        }
      },
      {
        data: nData.reverse(),
        name: '敏感',
        type: 'bar',
        stack: true,
        barWidth: '12px',
        barMinHeight: '0',
        itemStyle: {
          color: '#FF584D',
          borderRadius: [0, 30, 30, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: (params) => {
            if (params.value !== '0') {
              const value = params.value + '条';
              return `{t|${value}}`;
            } else {
              return '';
            }
          },
          rich: {
            t: {
              borderColor: '#FF584D',
              borderWidth: 1,
              borderRadius: 10,
              padding: [2, 4, 2, 4],
              fontSize: 10
            }
          }
        }
      }
    ]
  };

  return echartsOptions;
};
