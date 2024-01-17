<template>
  <div class="body-main">
    <div class="content-view">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body-main {
  position: relative;
  width: 100%;
  background-color: $bg-color;
  .content-view {
    margin-top: $titlebar-height;
    height: calc(100vh - #{$titlebar-height});
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
