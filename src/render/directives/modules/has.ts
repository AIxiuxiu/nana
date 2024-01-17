import { App, DirectiveBinding } from 'vue';
import { storage } from '@/utils/storage';

export default function (app: App<Element>) {
  app.directive('has', {
    mounted(el: any, bindings: DirectiveBinding) {
      //判断权限
      const auths: string[] = storage.get('auths');
      if (bindings.value && !auths.includes(`${bindings.value}`)) {
        //移除不匹配的元素
        el.parentNode.removeChild(el);
      }
    }
  });
}
