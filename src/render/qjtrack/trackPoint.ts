import { IQjTrackInfo } from '@/types/types';
import { throttle } from '@/utils';
import { storage } from '@/utils/storage';
import { DirectiveBinding } from 'vue';
import { TrackConfig } from './track.config';
import { clearStorage, DEDAULT_KEY, write2Storage } from './trackUtil';

type listener = (e: Event) => void;

export class TrackPoint {
  defaultKey: string;
  intervalTime: number;
  eventMap: Indexable<any>;
  getTrackConfig: Fn<Indexable<string>>;
  getTemplateInfo: Fn<IQjTrackInfo>;
  getLiftTime: Fn<Indexable<string>>;
  uploadTracks: Fn<void>;
  customActionFn: Indexable<Fn<void>>;
  trackList: Indexable<any>[];
  baseInfo: IQjTrackInfo;
  userScrollDepth: number;
  promiseQueue: Array<() => void>;
  scrollCallback: Nullable<listener>;
  immediate: boolean;

  constructor(options = {} as TrackConfig) {
    // 默认可以 store key 值
    this.defaultKey = `${options.appId}_track`;
    // 上传间隔时间
    this.intervalTime = options.time || 60 * 1000;
    // 埋点配置
    this.getTrackConfig = options.getTrackConfig || (() => ({}));
    // 模板信息
    this.getTemplateInfo = options.getTemplateInfo || (() => ({}));

    this.getLiftTime = options.getLiftTime || (() => ({}));
    // 埋点上传方法
    this.uploadTracks = options.uploadTracks;
    // 自定义埋点事件
    this.customActionFn = options.customActionFn || {};
    //是否立即上传历史埋点数据
    this.immediate = options.immediate;

    this.eventMap = {};
    this.trackList = [];
    this.baseInfo = {};
    this.userScrollDepth = 0; // 用户屏幕滚动的深度
    this.promiseQueue = []; // Promise缓存队列
    this.scrollCallback = null; // 监听滚动事件回调函数

    storage.set(DEDAULT_KEY, this.defaultKey);
  }

  /**
   * 埋点轮训上传
   */
  init(): void {
    // setInterval会把this指向window
    const fn = this.getPermission.bind(this);
    setInterval(fn, this.intervalTime);
    // 是否立即上传历史埋点数据
    if (this.immediate) fn();
  }

  /**
   * 缓存每一个绑定指令的Promise队列，队列为空则请求埋点配置接口
   */
  getanyMapQueue(): Promise<void> {
    return new Promise((resolve) => {
      if (this.promiseQueue.length === 0) {
        this.getanyMap();
      }
      this.promiseQueue.push(resolve);
    });
  }

  /**
   * 请求埋点配置接口，请求成功执行所有缓存队列
   */
  async getanyMap() {
    const resp = await this.getTrackConfig();
    this.eventMap = resp;
    this.promiseQueue.forEach((resolve) => {
      resolve();
    });
    this.promiseQueue = [];
  }

  // 获取获取上传埋点的权限
  async getPermission(): Promise<void> {
    const trackList = storage.get<IQjTrackInfo[]>(this.defaultKey) || [];
    if (trackList.length === 0) return;
    this.trackList = trackList;
    const liftTime = await this.getLiftTime();
    console.log('getPermission', this.trackList, liftTime);
    if (liftTime) {
      this.trackList = this.trackList.filter((v) => v.eventTime >= liftTime);
    }
    this.sendIQjTrackInfo();
  }

  /**
   * 上传本地埋点数据
   */
  async sendIQjTrackInfo(): Promise<void> {
    if (this.trackList && this.trackList.length > 0) {
      await this.uploadTracks(this.trackList);
      clearStorage(this.defaultKey);
    }
  }

  // 组装当前埋点数据
  getIQjTrackInfo(el: HTMLElement, binding: DirectiveBinding): Indexable<string> {
    // eslint-disable-next-line prefer-const
    let { id, eventResource, elementId, parentElId } = binding.value;
    const { track } = el.dataset;
    if (track) eventResource = track;
    // 埋点信息合并
    const qjTrackInfo = Object.assign({}, this.getTemplateInfo(), this.eventMap[id] || {});
    qjTrackInfo.eventResource = eventResource;
    qjTrackInfo.elementId = elementId;
    qjTrackInfo.parentElId = parentElId;
    return qjTrackInfo;
  }

  // 埋点事件绑定
  async handleBindEvent(el: HTMLElement, binding: DirectiveBinding): Promise<void> {
    if (!binding.value) return;
    // 没有获取到埋点配置内容需进入队列等待
    if (Object.keys(this.eventMap).length === 0) {
      await this.getanyMapQueue();
    }
    const { id } = binding.value;
    const { action } = this.eventMap[id] || {};
    const qjTrackInfo = this.getIQjTrackInfo(el, binding);

    if (action === 'click') {
      this.addClickTrigger(el, qjTrackInfo, action);
    } else if (action === 'scroll_up') {
      this.addScrollTrigger(el, qjTrackInfo);
    } else if (action === 'stay') {
      this.addStayTrigger(qjTrackInfo);
    } else if (this.customActionFn[action]) {
      // 为保证自定义埋点的灵活性，采用回调函数进行
      const cb = (info: IQjTrackInfo) => {
        write2Storage(this.defaultKey, info);
      };
      this.customActionFn[action](qjTrackInfo, cb, el);
    } else {
      write2Storage(this.defaultKey, qjTrackInfo);
    }
  }

  // 添加点击、鼠标进过事件监听
  addClickTrigger(el: HTMLElement, qjTrackInfo: IQjTrackInfo, action: string): void {
    const clickFn = () => {
      write2Storage(this.defaultKey, qjTrackInfo);
    };
    el.addEventListener(action, throttle(clickFn, 300), false);
  }

  // 添加页面停留监听-还有bug
  addStayTrigger(qjTrackInfo: IQjTrackInfo): void {
    storage.set('enter_time', Date.now());
    window.addEventListener('beforeunload', () => {
      const now = Date.now();
      qjTrackInfo.stayTime = now - storage.get<number>('enter_time');
      write2Storage(this.defaultKey, qjTrackInfo);
    });
  }

  // 添加滚动事件监听
  addScrollTrigger(el: HTMLElement, qjTrackInfo: IQjTrackInfo): void {
    const scrollFn = () => {
      const contentHeight = el.offsetHeight;
      const contentTop = el.getBoundingClientRect().top;
      const bodyClientHeight = document.documentElement.clientHeight;
      const scrollDepth = (((bodyClientHeight - contentTop) / contentHeight) * 100).toFixed(2);
      if (this.userScrollDepth < +scrollDepth) {
        this.userScrollDepth = +scrollDepth;
      }
    };
    this.scrollCallback = throttle(scrollFn, 100);
    window.addEventListener('scroll', this.scrollCallback);
    window.addEventListener('beforeunload', () => {
      this.saveScrollTrack(qjTrackInfo);
    });
  }

  // 保存滚动事件埋点数据
  saveScrollTrack(qjTrackInfo: IQjTrackInfo): void {
    qjTrackInfo.scrollDepth = this.userScrollDepth;
    write2Storage(this.defaultKey, qjTrackInfo);
    this.userScrollDepth = 0;
  }

  // 埋点事件取消绑定
  handleUnBindEvent(el: HTMLElement, binding: DirectiveBinding): void {
    if (!binding.value) return;
    const { id } = binding.value;
    const { action } = this.eventMap[id] || {};

    if (['scroll_up', 'stay'].includes(action)) {
      const qjTrackInfo = this.getIQjTrackInfo(el, binding);
      if (action === 'stay') {
        write2Storage(this.defaultKey, qjTrackInfo);
      } else {
        this.saveScrollTrack(qjTrackInfo);
        window.removeEventListener('scroll', this.scrollCallback as listener);
      }
    }
  }

  // 登录统计
  login(userInfo: IQjTrackInfo) {
    write2Storage(this.defaultKey, userInfo);
  }
}
