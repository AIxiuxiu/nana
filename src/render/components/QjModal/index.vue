<template>
  <div v-show="visible" ref="rootEl" :style="bindStyle" class="qj-modal qj-inset" :class="['fixed', { 'qj-prevent-none': preventClick }]" @keydown.esc="onEsc">
    <transition
      ref="qjOverlayTransition"
      v-bind="computedOverlayTransition"
      @before-enter="beforeOverlayEnter"
      @after-enter="afterOverlayEnter"
      @before-leave="beforeOverlayLeave"
      @after-leave="afterOverlayLeave"
    >
      <div v-show="!hideOverlay && visibility.overlay" class="qj-overlay absolute qj-inset" :class="overlayClass" :style="overlayStyle"></div>
    </transition>
    <transition
      ref="qjTransition"
      v-bind="computedTransition"
      @before-enter="beforeModalEnter"
      @after-enter="afterModalEnterFun"
      @before-leave="beforeModalLeave"
      @after-leave="afterModalLeaveFn"
    >
      <div
        v-show="visibility.modal"
        ref="qjContainer"
        class="absolute qj-inset qj_modal_container"
        :class="classes"
        :style="styles"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        @mouseup.self="onMouseupContainer"
        @mousedown.self="onMousedown"
      >
        <div ref="qjContent" :class="['qj_modal_content', contentClass, { 'qj-prevent-auto': preventClick }]" :style="bindContentStyle" @mousedown="onMousedown(null)">
          <slot :close="() => $emit('update:modelValue', false)" />
          <div v-if="visibility.resize && visibility.modal" ref="qjResize" class="absolute qj-inset qj-prevent-none user-select-none qj-touch-none">
            <div v-for="(direction, index) in resizeDirections" :key="index" :direction="direction" :class="`qj-resize-${direction}`" class="absolute qj-prevent-auto"></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { InjectModalsKey } from '@/types/symbols';
import { disableBodyScroll, enableBodyScroll } from '@/utils/bodyScrollLock';
import { computed, inject, nextTick, onBeforeUnmount, onMounted, PropType, reactive, ref, watch } from 'vue';
import { addListener, modalDragResize, removeListener } from './modalDragResize';
import { modalTransition } from './modalTransition';

const noop = () => {
  // 空方法
};

const props = defineProps({
  // modal 的名字，用於使用 API $qjModal.show(name)、$qjModal.hide(name) 等
  name: { type: String, default: null },
  modelValue: { type: Boolean, default: false },
  // modal 的容器（container）的 class
  classes: {
    type: [String, Object, Array],
    default: ''
  },
  // modal 的內容（content）的 class
  contentClass: {
    type: [String, Object, Array],
    default: ''
  },
  // modal 的层（overlay）的 class
  overlayClass: {
    type: [String, Object, Array],
    default: ''
  },
  // modal 的容器（container）的样式
  styles: {
    type: [Object, Array],
    default: () => ({})
  },
  // modal 的內容（content）的样式
  contentStyle: {
    type: [Object, Array],
    default: () => ({})
  },
  // modal 的层（overlay）的样式
  overlayStyle: {
    type: [Object, Array],
    default: () => ({})
  },
  // 禁用 body 上的滚动
  lockScroll: { type: Boolean, default: true },
  // 隐藏 modal 的外层（overlay）
  hideOverlay: { type: Boolean, default: false },
  // 点击 modal 的外层（overlay）是，是否关闭 modal
  clickToClose: { type: Boolean, default: true },
  //  esc 关闭
  escToClose: { type: Boolean, default: false },
  // 外层（overlay）的点击事件不会被禁用
  preventClick: { type: Boolean, default: false },
  // 放进指定DOM  默认body, 如果设定的是字串，必须是 querySelector'body''#app', 如果设定的是组件，必须是有效的 Node refs
  attach: { type: String, default: 'body' },
  // 转场CSS
  transition: { type: [String, Object], default: 'qj-fade' },
  overlayTransition: { type: [String, Object], default: 'qj-fade' },
  // 预设 z-index
  zIndexBase: { type: [String, Number], default: 1900 },
  // 指定 z-index
  zIndex: { type: [String, Number], default: undefined },
  // 在 modal 进到画面后，将焦点放到 modal 的 container
  focusRetain: { type: Boolean, default: true },
  // 拖曳不超过 container
  fitParent: { type: Boolean, default: true },
  // 启动可拖曳的modal
  drag: { type: Boolean, default: false },
  // 拖拽的元素 querySelectorAll(string) 获取
  dragSelector: { type: String, default: '' },
  //启动可调整大小的modal
  resize: {
    type: Boolean,
    default: false
  },
  // modal 关闭后保留 dragresize
  keepChangedStyle: { type: Boolean, default: false },
  // 设置可调整modal 大小的方向。
  resizeDirections: {
    type: Array as PropType<string[]>,
    default: () => ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'],
    validator: (val: string) => ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'].filter((value) => val.indexOf(value) !== -1).length === val.length
  },
  // 限制resizable modal 的min-width
  minWidth: { type: Number, default: 200 },
  // 限制resizable modal 的min-height
  minHeight: { type: Number, default: 200 },
  // 限制resizable modal 的max-width
  maxWidth: { type: Number, default: Infinity },
  // 限制resizable modal 的max-height
  maxHeight: { type: Number, default: Infinity }
});

// 是否可见
const visible = ref(false);
const visibility = reactive({
  modal: false,
  overlay: false,
  resize: false
});
// 拖拽样式
const dragResizeStyle: any = ref({});

let modalStackIndex = 0,
  stopEvent = false,
  // toggle 方法返回
  resolveToggle: (val?: any) => any = noop,
  rejectToggle: (val?: any) => any = noop,
  eventState = null,
  lastMousedownEl = null;

const rootEl = ref<HTMLDivElement>();
const qjContainer = ref<HTMLDivElement>();
const qjContent = ref<HTMLDivElement>();
const qjResize = ref<HTMLDivElement>();

/**
 * modal 事件
 */
const emits = defineEmits([
  'update:modelValue',
  'click-outside',
  'before-open',
  'opened',
  'before-close',
  'closed',
  'drag:start',
  'drag:move',
  'drag:end',
  'resize:start',
  'resize:move',
  'resize:end'
]);

// 弹窗管理
const qjModals = inject(InjectModalsKey);
qjModals && qjModals.modals.push(this);

/**
 * 动画 Transition
 */
const {
  TransitionState,
  overlayTransitionState,
  modalTransitionState,
  beforeOverlayEnter,
  afterOverlayEnter,
  beforeOverlayLeave,
  afterOverlayLeave,
  beforeModalEnter,
  afterModalEnter,
  beforeModalLeave,
  afterModalLeave
} = modalTransition();

/**
 * modal 进入后
 */
const afterModalEnterFun = () => {
  afterModalEnter(() => {
    if (props.focusRetain) {
      qjContainer.value.focus();
    }
    props.drag && addDragDown();
    props.resize && addResizeDown();
    emits('opened', createModalEvent({ type: 'opened' }));
    resolveToggle('show');
  });
};

/**
 * modal 离开后
 */
const afterModalLeaveFn = () => {
  afterModalLeave(() => {
    modalStackIndex = null;
    props.lockScroll && enableBodyScroll(qjContainer.value);
    if (!props.keepChangedStyle) {
      dragResizeStyle.value = {};
    }

    stopEvent = false;
    const event = createModalEvent({
      type: 'closed',
      stop() {
        stopEvent = true;
      }
    });
    emits('closed', event);
    resolveToggle('hide');
    if (stopEvent) return;
  });
};

const isComponentReadyToBeDestroyed = computed(() => {
  return (props.hideOverlay || overlayTransitionState.value === TransitionState.Leave) && modalTransitionState.value === TransitionState.Leave;
});

/**
 * modal z-index 样式
 */
const bindStyle: any = computed(() => {
  if (!props.zIndex) {
    return { zIndex: +props.zIndexBase + 2 * (modalStackIndex || 0) };
  } else {
    return { zIndex: props.zIndex };
  }
});

/**
 * 内容样式
 */
const bindContentStyle = computed(() => {
  let style = [dragResizeStyle.value];
  Array.isArray(props.contentStyle) ? style.push(...props.contentStyle) : style.push(props.contentStyle);
  return style;
});

/**
 * 动画
 */
const computedTransition = computed(() => {
  if (typeof props.transition === 'string') return { name: props.transition };
  return { ...props.transition };
});

const computedOverlayTransition = computed(() => {
  if (typeof props.overlayTransition === 'string') return { name: props.overlayTransition };
  return { ...props.overlayTransition };
});

onMounted(() => {
  open();
});

function open() {
  if (props.modelValue) {
    stopEvent = false;
    if (emitEvent('before-open', false)) {
      rejectToggle('show');
      return;
    }
    let target = getAttachElement();
    if (target || !props.attach) {
      props.attach && target.appendChild(rootEl.value);

      handleLockScroll();

      if (qjModals) {
        let index = qjModals.openedModals.findIndex((vm) => vm === this);
        if (index !== -1) {
          // if this is already exist in modalStack, delete it
          qjModals.openedModals.splice(index, 1);
        }
        qjModals.openedModals.push(this);
        modalStackIndex = qjModals.openedModals.length - 1;
        qjModals.openedModals
          .filter((vm) => vm !== this)
          .forEach((vm, index) => {
            if (vm.getAttachElement() === target) {
              // if vm and this have the same attach element
              vm.modalStackIndex = index;
              vm.visibility.overlay = false;
            }
          });
      }

      visible.value = true;
      nextTick(() => {
        startTransitionEnter();
      });
    } else if (target !== false) {
      console.warn('Unable to locate target '.concat(props.attach));
    }
  }
}

/**
 * 销毁
 */
onBeforeUnmount(() => {
  destroy();
});

/**
 * 关闭modal
 */
function close() {
  stopEvent = false;
  if (emitEvent('before-close', true)) {
    rejectToggle('hide');
    return;
  }
  if (qjModals) {
    let openIndex = qjModals.openedModals.findIndex((vm) => vm === this);
    if (openIndex !== -1) {
      // remove this in modalStack
      qjModals.openedModals.splice(openIndex, 1);
    }
    if (qjModals.openedModals.length > 0) {
      // If there are still nested modals opened
      const $_vm = qjModals.openedModals[qjModals.openedModals.length - 1];
      if ($_vm.focusRetain || $_vm.focusTrap) {
        $_vm.qjContainer.focus();
      }
      !$_vm.hideOverlay && ($_vm.visibility.overlay = true);
    }
  }
  props.drag && removeDragDown();
  props.resize && removeResizeDown();
  eventState = null;
  startTransitionLeave();
}

/**
 * 销毁modal
 */
function destroy() {
  if (qjModals) {
    let index = qjModals.modals.findIndex((vm) => vm === this);
    qjModals.modals.splice(index, 1);
  }
  props.lockScroll && qjContainer && enableBodyScroll(qjContainer);
  rootEl.value?.remove();
}

function startTransitionEnter() {
  visibility.overlay = true;
  visibility.modal = true;
}

function startTransitionLeave() {
  visibility.overlay = false;
  visibility.modal = false;
}

/**
 * 锁定滚动
 */
function handleLockScroll() {
  if (props.modelValue) {
    nextTick(() => {
      if (props.lockScroll) {
        disableBodyScroll(qjContainer, {
          reserveScrollBarGap: true
        });
      } else {
        enableBodyScroll(qjContainer);
      }
    });
  }
}

/**
 * 获取目标元素
 */
function getAttachElement() {
  let target;
  if (!props.attach) {
    target = false;
  } else if (typeof props.attach === 'string') {
    // CSS selector
    if (window) {
      target = window.document.querySelector(props.attach);
    } else {
      target = false;
    }
  } else {
    // DOM Element
    target = props.attach;
  }
  return target;
}

/**
 *  qjContainer 的 Mousedown事件
 */
function onMousedown(e) {
  lastMousedownEl = e?.target;
}

/**
 *  qjContainer 的 Mouseup事件
 */
function onMouseupContainer() {
  // skip when the lastMousedownEl didn't equal qjContainer
  if (lastMousedownEl !== qjContainer.value) return;
  // skip when state equal 'resize:move'
  if (eventState === 'resize:move') return;

  emits('click-outside', createModalEvent({ type: 'click-outside' }));
  props.clickToClose && emits('update:modelValue', false);
}

function onEsc() {
  if (visible.value && props.escToClose) {
    emits('update:modelValue', false);
  }
}

/**
 * modal 事件 event
 */
function createModalEvent(eventProps = {}) {
  return {
    ref: this,
    ...eventProps
  };
}

/**
 * before-open 和 before-close 事件 可使用 event.stop() 阻止事件
 */
function emitEvent(eventType: 'before-open' | 'before-close', value) {
  stopEvent = false;
  const event = createModalEvent({
    type: eventType,
    stop() {
      stopEvent = true;
    }
  });
  emits(eventType, event);
  if (stopEvent) {
    stopEvent = true;
    emits('update:modelValue', value);
    return true;
  }
  return false;
}

/**
 * drag 和 resize 事件
 */
function emitState(e, state: 'drag' | 'resize', action: 'start' | 'move' | 'end') {
  eventState = `${state}:${action}`;
  emits(eventState, e);
}

/**
 * api调用 show是否展示, params: 参数
 */
function toggle(show: boolean) {
  return new Promise((resolve, reject) => {
    resolveToggle = (res) => {
      resolve(res);
      resolveToggle = noop;
    };
    rejectToggle = (err) => {
      reject(err);
      rejectToggle = noop;
    };
    const value = typeof show === 'boolean' ? show : !props.modelValue;
    emits('update:modelValue', value);
  });
}

const { pointerDown } = modalDragResize(props, qjContainer, qjContent, dragResizeStyle, emitState);

function addDragDown() {
  addListener('down', qjContent.value, pointerDown);
  dragResizeStyle.value.touchAction = 'none';
}

function removeDragDown() {
  removeListener('down', qjContent.value, pointerDown);
}

function addResizeDown() {
  visibility.resize = true;
  nextTick(() => {
    addListener('down', qjResize.value, pointerDown);
  });
}

function removeResizeDown() {
  removeListener('down', qjResize.value, pointerDown);
  visibility.resize = false;
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      open();
    } else {
      close();
    }
  }
);

watch(
  () => props.lockScroll,
  () => {
    handleLockScroll();
  }
);

watch(
  () => props.hideOverlay,
  (value) => {
    if (value && !props.modelValue) {
      visibility.overlay = true;
    }
  }
);

watch(
  () => props.drag,
  (value) => {
    if (visible.value) {
      value ? addDragDown() : removeDragDown();
    }
  }
);

watch(
  () => props.resize,
  (value) => {
    if (visible.value) {
      value ? addResizeDown() : removeResizeDown();
    }
  }
);

watch(
  () => props.keepChangedStyle,
  (value) => {
    if (!value) {
      dragResizeStyle.value = {};
    }
  }
);

watch(
  () => isComponentReadyToBeDestroyed.value,
  (isReady) => {
    if (isReady) {
      visible.value = false;
    }
  }
);
</script>

<style lang="scss" scoped>
.qj-inset {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.qj-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.qj_modal_container {
  padding-top: $titlebar-height;
  display: flex;
  justify-content: center;
  align-items: center;
}

.qj_modal_content {
  position: relative;
  max-height: 100%;
  border: 1px solid $border-color-base;
  box-shadow: $box-shadow-base;
  background: $white-color;
}

.qj-prevent-none {
  pointer-events: none;
}

.qj-prevent-auto {
  pointer-events: auto;
}

.qj-fade-enter-active,
.qj-fade-leave-active {
  transition: opacity 0.4s ease;
}

.qj-fade-enter-from,
.qj-fade-leave-to {
  opacity: 0;
}

.qj-touch-none {
  touch-action: none;
}

.qj-resize-tr,
.qj-resize-br,
.qj-resize-bl,
.qj-resize-tl {
  width: 12px;
  height: 12px;
  z-index: 10;
}

.qj-resize-t {
  top: -6px;
  left: 0;
  width: 100%;
  height: 12px;
  cursor: ns-resize;
}

.qj-resize-tr {
  top: -6px;
  right: -6px;
  cursor: nesw-resize;
}

.qj-resize-r {
  top: 0;
  right: -6px;
  width: 12px;
  height: 100%;
  cursor: ew-resize;
}

.qj-resize-br {
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
}

.qj-resize-b {
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 12px;
  cursor: ns-resize;
}

.qj-resize-bl {
  bottom: -6px;
  left: -6px;
  cursor: nesw-resize;
}

.qj-resize-l {
  top: 0;
  left: -6px;
  width: 12px;
  height: 100%;
  cursor: ew-resize;
}

.qj-resize-tl {
  top: -6px;
  left: -6px;
  cursor: nwse-resize;
}
</style>
