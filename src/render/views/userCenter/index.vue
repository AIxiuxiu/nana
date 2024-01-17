<template>
  <div v-track="{ id: 'page_view', eventResource: '用户中心', elementId: `userCenter`, parentElId: `page` }" class="page-content">
    <qj-menu-tabs :menu="menu"></qj-menu-tabs>
    <QjMainView />
  </div>
</template>

<script setup lang="ts">
/**
 * 用户中心
 */
import menu from '@/router/mainViews/userCenter';
</script>
