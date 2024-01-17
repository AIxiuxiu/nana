import configs from '@/qjtrack/track.config';
import { TrackPoint } from '@/qjtrack/trackPoint';
import { App, DirectiveBinding } from 'vue';

/**
 * 埋点指令 v-track
 * @example
// click 点击事件
<div v-track="{ id: 'moduleName_xxx_click', eventResource: '{xxid: 12}' }">...</div>

// scoll_up 用户浏览滚动深度
<div v-track="{ id: 'moduleName_xxx_scoll_up' }">...</div>

// stay 停留时长
<div v-track="{ id: 'moduleName_xxx_stay' }">...</div>

// show 页面加载时间
<div v-track="{ id: 'moduleName_xxx_show'  }" :data-track="getLoadingTime">...</div>

 */
export default function (app: App<Element>) {
  const Track = new TrackPoint(configs);
  Track.init();
  app.directive('track', {
    beforeMount(el: HTMLElement, binding: DirectiveBinding) {
      Track.handleBindEvent(el, binding);
    },
    beforeUnmount(el: HTMLElement, binding: DirectiveBinding) {
      Track.handleUnBindEvent(el, binding);
    }
  });
}
