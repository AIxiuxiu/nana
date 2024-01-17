// 舆情指标排行
export const optionRankEcharts = function (xAxis: any[], barData: any[]) {
  const echartsOptions = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        return params[0].axisValue + ':  ' + params[0].data + '°';
      }
    },
    visualMap: {
      show: false,
      dimension: 1,
      textStyle: {
        color: '#acb7bf'
      },
      orient: 'vertical',
      right: '1%',
      y: 'middle',
      pieces: [
        {
          lte: 25,
          color: '#01a8fe'
        },
        {
          gt: 25,
          lte: 50,
          color: '#ffcc00'
        },
        {
          gt: 50,
          lte: 75,
          color: '#ff901e'
        },
        {
          gt: 75,
          lte: 100,
          color: '#fb434a'
        }
      ]
    },
    grid: {
      left: '0%',
      top: '5%',
      bottom: '0%',
      right: '0%',
      containLabel: true
    },
    xAxis: [
      {
        data: xAxis,
        type: 'category',
        axisTick: {
          alignWithLabel: false
        },
        axisLabel: {
          interval: 0,
          color: '#69717A',
          fontSize: 11,
          rotate: 18
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: 100,
        interval: 20,
        axisLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '',
        type: 'bar',
        barCategoryGap: '0%',
        barWidth: '20',
        data: barData
      }
    ]
  };
  return echartsOptions;
};
