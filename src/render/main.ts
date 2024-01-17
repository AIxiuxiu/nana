import router from '@/router';
import * as Sentry from '@sentry/vue';
// 时间插件
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
// echarts 主题,shine 默认已引入
// import 'echarts/theme/shine.js';
// Element
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

// swiper 样式
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/virtual';

// 加载 svg 图标
import 'virtual:svg-icons-register';
import { App, createApp } from 'vue';
import packageJson from '../../app/package.json';
import AppVue from './App.vue';
import registerDirectives from './directives';
import useImage from './hooks/useImg';
import useOSSImage from './hooks/useOSSImg';
import './styles/index.scss';
import { debounce } from './utils';
const app: App<Element> = createApp(AppVue);

// 解决 ResizeObserver loop limit exceeded 错误
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 20);
    super(callback);
  }
};

if (import.meta.env.PROD) {
  Sentry.init({
    app,
    dsn: 'https://11a535d7f53740e5bbf89a080532fcab@o166642.ingest.sentry.io/6417098',
    debug: false,
    logErrors: true,
    release: `${packageJson.version}`,
    environment: import.meta.env.VITE_APP_STORE_PREFIX.toString(),
    ignoreErrors: [
      // promise错误
      'Non-Error promise rejection captured with keys',
      'Non-Error promise rejection captured with value',
      // 超时
      'timeout of 30000ms exceeded',
      'ResizeObserver loop limit exceeded',
      // 阿里滑动sdk加载失败
      'report is not defined'
    ],
    beforeSend: (event) => {
      // Because our URLs are local files and not publicly
      // accessible URLs, we simply truncate and send only
      // the filename.  Unfortunately sentry's electron support
      // isn't that great, so we do this hack.
      // Some discussion here: https://github.com/getsentry/sentry/issues/2708
      const normalize = (filename: string) => {
        const splitArray = filename.split('/');
        return `/${splitArray[splitArray.length - 1]}`;
      };

      if (event.exception && event.exception.values[0].stacktrace) {
        event.exception.values[0].stacktrace.frames.forEach((frame) => {
          frame.filename = normalize(frame.filename);
        });
      }

      if (event.request) {
        event.request.url = normalize(event.request.url);
      }
      return event;
    },
    integrations: [
      new (Sentry as any).BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router)
      })
    ],
    tracesSampleRate: 0.8,
    replaysSessionSampleRate: 0.08,
    replaysOnErrorSampleRate: 1.0
  });
}

app.use(router);
app.use(ElementPlus, {
  locale: zhCn
});

// dayjs 时间库
dayjs.locale('zh-cn');
app.config.globalProperties.$dayjs = dayjs;
app.config.globalProperties.$img = useImage;
app.config.globalProperties.$ossImg = useOSSImage;

app.config.globalProperties.$const = {
  // 路演默认图片
  roadshowCover: 'https://rs.nana.net/theme/default/images/road_show_detail/road_cover.png'
};

// 注册全局指令
registerDirectives(app);

// app.config.errorHandler = (error, vm, info) => {
//   console.error('抛出全局异常', error, info);
// };

app.mount('#app').$nextTick(window.removeLoading);
