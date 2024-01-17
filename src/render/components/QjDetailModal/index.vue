<template>
  <div class="modals-container">
    <QjModal v-for="(modal, id) in detailModals" :key="id" v-model="modal.value" v-bind="modal.bind" :attrs="id" v-on="modalOn(modal)">
      <div class="qj-modal-detail-header">
        <div class="qj-move-bar">
          <div class="ellipsis qj-move-bar" style="max-width: 600px" :data-detailId="`datail-${modal.detail.id}`">{{ modal.detail.title }}</div>
        </div>
        <div class="set">
          <qj-svg-icon name="new_window" :size="22" @click="openNewWindow(modal.detail)"></qj-svg-icon>
          <qj-svg-icon name="close_modal" :size="22" @click="modal.value = false"></qj-svg-icon>
        </div>
      </div>
      <div class="detail-content" :style="modal.detail.style">
        <component :is="modal.detail.component" v-bind="modal.detail.params" />
      </div>
    </QjModal>
  </div>
</template>

<script lang="ts" setup>
/**
 * 详情页弹窗
 */
import { useSendShowDetailWindow } from '@/hooks/useSendIpc';
import { InjectModalsKey } from '@/types/symbols';
import { inject } from 'vue';
import { useRouter } from 'vue-router';

// 详情弹窗管理
const { detailModals } = inject(InjectModalsKey);

const router = useRouter();
function openNewWindow(detail) {
  // 路由参数query 删除 detailModalId
  const query = Object.entries(detail.params).reduce((a, [k, v]) => {
    if (k != 'detailModalId') {
      a[k] = v;
    }
    return a;
  }, {});
  const routeData = router.resolve({
    ...detail.route,
    query
  });
  useSendShowDetailWindow(location.origin + location.pathname + routeData.href);
}

const onModalFn = (modal, event: string) => {
  modal.on && modal.on[event] && typeof modal.on[event] == 'function' && modal.on[event]();
};
const modalOn = (modal) => {
  return {
    'before-open': () => {
      onModalFn(modal, 'before-open');
    },
    opened: () => {
      onModalFn(modal, 'opened');
    },
    'before-close': () => {
      onModalFn(modal, 'before-close');
    },
    closed: () => {
      onModalFn(modal, 'closed');
    },
    'drag:start': () => {
      onModalFn(modal, 'drag:start');
    },
    'drag:move': () => {
      onModalFn(modal, 'drag:move');
    },
    'drag:end': () => {
      onModalFn(modal, 'drag:end');
    },
    'resize:start': () => {
      onModalFn(modal, 'resize:start');
    },
    'resize:move': () => {
      onModalFn(modal, 'resize:move');
    },
    'resize:end': () => {
      onModalFn(modal, 'resize:end');
    }
  };
};
</script>

<style lang="scss" scoped>
$header-height: 46px;

:deep(.qj_modal_content) {
  //width: 800px;
  height: 88%;
  border-radius: 4px;
  overflow: hidden;
  border: none;
}

.qj-modal-detail-header {
  display: flex;
  align-items: center;
  padding: 0 10px 0 26px;
  height: $header-height;
  border-radius: $content-border-radius;
  .qj-move-bar {
    cursor: move;
    flex: 1;
    line-height: $header-height;
    font-size: $font-size-medium;
    color: $text-color-primary;
  }
  .set {
    svg {
      margin-left: 15px;
      cursor: pointer;
      &:hover {
        color: $primary-color;
      }
    }
  }
}

.detail-content {
  background-color: $white-color;
  height: calc(100% - #{$header-height});
  overflow: hidden;
  position: relative;
}
</style>
