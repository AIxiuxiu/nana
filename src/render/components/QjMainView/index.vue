<template>
  <div class="view-main">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transitionName as string">
        <keep-alive v-if="route.meta.keepAlive">
          <component :is="Component" />
        </keep-alive>
        <component :is="Component" v-else />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteUpdate } from 'vue-router';

onBeforeRouteUpdate((to, from) => {
  if (to.meta.level > from.meta.level) {
    to.meta.transitionName = 'scale-slide-right';
  } else if (to.meta.level < from.meta.level) {
    to.meta.transitionName = 'scale-slide-left';
  } else {
    to.meta.transitionName = 'fade';
  }
});
</script>

<style lang="scss" scoped>
.view-main {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.scale-slide-left-enter-active,
.scale-slide-left-leave-active,
.scale-slide-right-enter-active,
.scale-slide-right-leave-active {
  background-color: $bg-color;
  position: absolute;
  width: 100%;
  transition: all 0.6s ease;
}

.scale-slide-left-enter-from {
  left: -100%;
  opacity: 0.6;
}

.scale-slide-left-enter-to {
  left: 0%;
  opacity: 1;
}

.scale-slide-right-enter-from {
  right: -100%;
  opacity: 0.6;
}

.scale-slide-right-enter-to {
  right: 0%;
  opacity: 1;
}

.scale-slide-left-leave-from,
.scale-slide-right-leave-from {
  transform: scale(1);
  opacity: 1;
}

.scale-slide-left-leave-to,
.scale-slide-right-leave-to {
  transform: scale(0.8);
  opacity: 0.6;
}
</style>
