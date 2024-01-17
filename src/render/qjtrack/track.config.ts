import { OtherApi } from '@/apis/otherApi';
import { QjUserInfo } from '@/hooks/useUserInfo';
import { IQjTrackInfo } from '@/types/types';
import { throttle } from '@/utils';
import { getBrowserInfo, getOS, getOSVersion } from '@/utils/browser';
import { storage } from '@/utils/storage';
import { name as producctName, version } from '../../../app/package.json';

// https://github.com/hansonGong/vue-trackjs

// 获取埋点配置信息函数，下面是简单示范
function getTrackConfig() {
  // 该函数必须return如下结构，eventId和action字段固定不可更改，其他随意
  return {
    // 左侧菜单点击事件
    menu_left_click: {
      eventId: 'menu_left_click',
      eventModule: 'menu',
      action: 'click'
    },
    // 顶部菜单tab点击事件
    menu_tabs_click: {
      eventId: 'menu_tabs_click',
      eventModule: 'menu',
      action: 'click'
    },
    // 页面查看事件
    page_view: {
      eventId: 'page_view',
      eventModule: 'page',
      action: 'view'
    }
  };
}

// 返回埋点基础信息
function getBaseInfo(): IQjTrackInfo {
  const defaultInfo = {
    product: producctName,
    deviceBrand: getBrowserInfo(),
    deviceModel: navigator.userAgent,
    osName: getOS(),
    osVersion: getOSVersion(),
    appVersion: version
  };
  return defaultInfo;
}

// 返回埋点信息模板
function getTemplateInfo(): IQjTrackInfo {
  return {
    eventId: '',
    eventTime: Date.now(),
    eventResource: '',
    eventModule: '',
    action: ''
  };
}

// 获取埋点信息上传过期方法，默认48小时
function getLiftTime() {
  return Date.now() - 48 * 60 * 60;
}

// 轮询上传埋点信息回调函数, 埋点信息数组
function uploadTracks(trackList) {
  const baseInfo = getBaseInfo();
  const userInfo = storage.get<QjUserInfo>('userInfo');
  console.log(JSON.stringify({ trackList, baseInfo, userInfo }));
  OtherApi.insertEventRecord({ trackList, baseInfo, userInfo }).then((result) => {
    console.log(result);
  });
}

const customActionFn = {
  // 入参会返回3个参数, callback函数必须调用传入trackInfo才会成功
  mouseenter: (trackInfo, callback, el) => {
    const fn = () => {
      callback(trackInfo);
    };
    el.addEventListener('mouseenter', throttle(fn, 300));
  }
};

const configs = {
  appId: 'qjkhdg', //id
  time: 2 * 60 * 1000, //上传间隔
  immediate: true, //是否立即上传历史埋点数据
  getTrackConfig,
  getLiftTime,
  uploadTracks,
  customActionFn,
  getTemplateInfo
};

export type TrackConfig = typeof configs;

export default configs;
