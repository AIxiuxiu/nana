import { useResizeObserver } from '@vueuse/core';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { Ref, onMounted, onUnmounted, ref, watch } from 'vue';

// echarts按需加载
import {
  DataZoomComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent
} from 'echarts/components';

import { BarChart, LineChart, PieChart } from 'echarts/charts';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  DataZoomComponent,
  VisualMapComponent,
  LineChart,
  BarChart,
  PieChart,
  CanvasRenderer
]);

import type {
  DataZoomComponentOption,
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
  VisualMapComponentOption
} from 'echarts/components';

import type {
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption
} from 'echarts/charts';

import type { ComposeOption, ECharts } from 'echarts/core';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | DataZoomComponentOption
  | DatasetComponentOption
  | GridComponentOption
  | LegendComponentOption
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | VisualMapComponentOption
>;

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  DataZoomComponent,
  VisualMapComponent,
  LineChart,
  BarChart,
  PieChart,
  CanvasRenderer
]);

export interface QjEchartsOnReady {
  (chart: ECharts | undefined): void;
}
export interface QjEchartsOption {
  resize?: boolean; //自适应
  showLoading?: boolean; // 展示loading
  loadingOption?: object; // loading参数
  noDataOption?: object; //noData参数
  defaultOption?: ECOption; // 默认echarts参数
  theme?: string; //主题
}

/**
 * 使用echarts
 * @param chartEl echarts dom
 * @param onReady 已初始化
 * @param chartOption QjEchartsOption参数
 */
export const useEcharts = function (chartEl: Ref<HTMLElement | undefined>, onReady?: QjEchartsOnReady, chartOption?: QjEchartsOption) {
  const {
    resize = true,
    showLoading = true,
    loadingOption = {
      text: '',
      color: '#3d7eff',
      textColor: '#3d7eff',
      showSpinner: true,
      spinnerRadius: 18,
      lineWidth: 2,
      maskColor: '#ffffffe6',
      zlevel: 0
    },
    noDataOption = {
      text: '暂无数据',
      showSpinner: false,
      color: '#929196',
      textColor: '#929196',
      maskColor: '#ffffffe6',
      zlevel: 0
    },
    defaultOption,
    theme = 'shine'
  } = chartOption || {};

  const echartsOption = ref<any>(defaultOption);

  let chart: ECharts | undefined;
  onMounted(() => {
    chart = echarts.init(chartEl.value!, theme);
    showCharLoading();
    if (echartsOption.value) {
      chart.setOption<ECOption>(echartsOption.value);
      hideCharLoading();
    }
    onReady && onReady(chart);
  });

  watch(echartsOption, () => {
    if (!chart) {
      return;
    }
    if (echartsOption.value && Object.keys(echartsOption.value).some((x) => /^[a-z]/.test(x))) {
      // chart.clear();
      if (echartsOption.value.series[0] && echartsOption.value.series[0].data && JSON.stringify(echartsOption.value.series[0].data) == '[]') {
        showCharLoading(noDataOption);
      } else {
        chart.setOption<ECOption>(echartsOption.value, true);
        hideCharLoading();
      }
    } else {
      showCharLoading();
    }
  });

  function showCharLoading(params = loadingOption) {
    if (chart && showLoading) {
      chart.clear();
      chart.showLoading(params);
    }
  }

  function hideCharLoading() {
    if (showLoading) {
      chart.hideLoading();
    }
  }

  function setOption(option: ECOption) {
    echartsOption.value = option;
  }

  let stopListenResize = () => {
    // console.log('取消resize监听');
  };
  if (resize) {
    //自适应大小
    let resizing = false;
    const { stop } = useResizeObserver(chartEl, (entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      if (width && height && chart && !resizing) {
        resizing = true;
        chart.resize(entry.contentRect);
        resizing = false;
      }
    });
    stopListenResize = stop;
  }

  onUnmounted(() => {
    stopListenResize();
    chart?.dispose();
  });

  return { echartsOption, setOption, showCharLoading, hideCharLoading };
};

/**
 *  固定名称 myChart, 当前方法必须把 myChart传出去
 * @param onReady
 * @param chartOption
 */
export const useMyEcharts = function (onReady?: QjEchartsOnReady, chartOption?: QjEchartsOption) {
  const myChart = ref<any>(null);
  const chart = useEcharts(myChart, onReady, chartOption);
  return { myChart, ...chart };
};
