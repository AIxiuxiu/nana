import { InjectModalsKey } from '@/types/symbols';
import { IQjDetailModals, IQjDetailParams, IQjModalData, IQjModalEvent } from '@/types/types';
import { generate } from 'shortid';
import { Component, computed, inject, nextTick, onUnmounted, reactive, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useCurrentInstance from './useCurrentInstance';

/**
 * 详情页modal 参数
 */
const defineModalData: IQjModalData = {
  value: false,
  // modal 参数
  bind: {
    drag: true,
    fitParent: false,
    resize: false,
    dragSelector: '.qj-move-bar',
    attach: ''
  },
  // 监听事件
  on: {}
};

/**
 * 使用详情页 modal
 * @param detail 详情页组件
 * @param modalParams
 */
export const useDetailModal = function (detail: Component, route: { name?: string; path?: string }, modalParams: IQjModalData = { value: false }) {
  // 详情弹窗管理
  const { detailModals } = inject(InjectModalsKey);
  // 详情弹窗唯一ID
  const detailModalId = generate();
  // 添加路有前缀
  if (route.path && !route.path.startsWith('/detail')) {
    route.path = `/detail/${route.path}`;
  }
  modalParams = Object.assign({}, defineModalData, modalParams);
  const detailModal: IQjDetailModals = reactive({
    id: detailModalId,
    value: false,
    ...modalParams,
    detail: {
      component: shallowRef(detail),
      params: { detailModalId },
      title: import.meta.env.VITE_APP_TITLE.toString(),
      route: route
    }
  });
  detailModals[detailModalId] = detailModal;

  /**
   * 展示详情弹窗
   * @param params 参数
   */
  const show = (params: IQjDetailParams = {}, other: { id?: string; title?: string; style?: object } = {}) => {
    detailModal.detail.id = other.id;
    detailModal.detail.title = other.title || import.meta.env.VITE_APP_TITLE.toString();
    detailModal.detail.style = other.style || { width: '800px' };
    detailModal.value = true;
    detailModal.detail.params = { ...params, detailModalId };
  };

  /**
   * 隐藏详情弹窗
   * @param params 参数
   */
  const hide = (params?: IQjDetailParams) => {
    detailModal.value = false;
    detailModal.detail.params = { ...params, detailModalId };
  };

  const toggle = (value: boolean, params?: { [key: string]: any }) => {
    value ? show(params) : hide(params);
  };

  /**
   * 关闭所有弹窗
   */
  const hideAll = () => {
    for (const key in detailModals) {
      detailModals[key].value = false;
    }
  };

  /**
   * 销毁
   */
  onUnmounted(() => {
    delete detailModals[detailModalId];
  });

  return { show, hide, toggle, hideAll };
};

/**
 * 获取当前弹窗
 */
const getCurrentModal = function () {
  const { proxy } = useCurrentInstance();
  // 详情弹窗管理
  const { detailModals } = inject(InjectModalsKey);
  // 是否是弹框
  const isModal = proxy && !!proxy.$attrs.detailModalId;
  const currentModal = isModal ? detailModals[proxy.$attrs.detailModalId] : null;
  return currentModal;
};

export const useCurrentModal = function (on?: { [key in IQjModalEvent]?: Function }) {
  const currentModal = getCurrentModal();
  // 关闭弹窗
  const close = () => {
    if (currentModal) {
      currentModal.value = false;
    } else {
      console.log('当前非弹窗模式！');
    }
  };
  if (currentModal && on) {
    currentModal.on = { ...currentModal.on, ...on };
  }
  return { close, isModal: !!currentModal, currentModal };
};

/**
 * 使用详情页
 * @param paramsOnChange 参数改变了
 * @param mode
 * @returns
 */
export const useDetailParams = function (paramsOnChange?: (arg: any) => void, mode?: 'replace' | 'push') {
  const route = useRoute();
  const router = useRouter();

  const currentModal = getCurrentModal();
  const { proxy } = useCurrentInstance();

  const currentPath = route.fullPath;
  // 详情页参数 props 和  query
  const params = computed<any>({
    get() {
      if (currentModal) {
        return { ...proxy.$props };
      } else {
        let query: any = route.query || {};
        if (Array.isArray(query)) query = query.filter(Boolean);
        return { ...proxy.$props, ...query };
      }
    },
    set(v) {
      if (currentModal) {
        currentModal.detail.params = v;
      } else {
        nextTick(() => {
          router[mode || 'replace']({ query: { ...v } });
        });
      }
    }
  });

  // 路由模式下，触发主动 paramsOnChange
  if (!currentModal) {
    paramsOnChange && paramsOnChange(params.value);
  }

  // 监听参数
  watch(
    () => params.value,
    (val) => {
      paramsOnChange && paramsOnChange(val);
    }
  );
  return params;
};
