<template>
  <div class="menu-tabs" :class="{ min: miniSidebar }">
    <el-menu mode="horizontal" router :default-active="activeRoute">
      <div
        v-for="(item, index) in menus"
        :key="index"
        v-track="{ id: 'menu_tabs_click', eventResource: item.meta.title, elementId: `tab_${item.meta.authCode}`, parentElId: `menu_${menu.meta.authCode}` }"
      >
        <el-menu-item v-has="item.meta.authCode" :route="{ path: `${menu.path}/${item.path}` }" :index="`${menu.path}/${item.path}`">
          {{ item.meta.title }}
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { InjectSidebarKey } from '@/types/symbols';
import { IQjMenuTab } from '@/types/types';
import { computed, inject, PropType } from 'vue';
import { useRoute } from 'vue-router';

/**
 * 顶部导航组件
 */
const props = defineProps({
  menu: {
    type: Object as PropType<IQjMenuTab>,
    required: true,
    default: () => {
      return { path: '', children: [] };
    }
  }
});

const menus = computed(() => props.menu?.children?.filter((v) => !!v.meta));

const route = useRoute();
const activeRoute = computed(() => '/' + route.path.split('/')[1] + '/' + route.path.split('/')[2]);

const miniSidebar = inject(InjectSidebarKey);
</script>

<style lang="scss" scoped>
.menu-tabs {
  position: fixed;
  right: 0;
  left: $sidebar-width;
  padding: 0 $content-padding 0 $content-padding;
  // border-radius: 0 0 $content-border-radius $content-border-radius;
  overflow: hidden;
  // box-shadow: $box-shadow-base;
  border-bottom: 1px solid $border-color-base;
  z-index: 1810;
  transition: all 0.3s ease-in-out;
  background-color: #fff;
  height: $top-height;
  display: flex;
  align-items: center;
  &.min {
    left: 64px !important;
  }

  :deep(.el-menu--horizontal) {
    flex: 1;
    border: none;
  }

  :deep(.el-menu-item) {
    height: $top-menu-height;
    border: none;
    color: $text-color-secondary;
    &.is-active {
      background: rgb(238, 238, 238);
      color: $text-color-primary !important;
    }
    &:hover {
      color: $text-color-primary !important;
      background: rgba(238, 238, 238, 0.5);
    }
  }
  :deep(.el-sub-menu) {
    height: $top-menu-height;
    .el-sub-menu__title {
      height: $top-menu-height;
      line-height: $top-menu-height;
      border: none;
    }
  }
}
</style>
