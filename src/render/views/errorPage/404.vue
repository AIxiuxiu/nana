<template>
  <div class="container">
    <div class="info">建设中，请联系客服400-8303630</div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-image: url(@/assets/images/404.png);
  background-size: 100%;
  background-repeat: no-repeat;
}

.info {
  padding-left: 10%;
  font-size: 40px;
  font-weight: 500;
  color: #302c48;
  line-height: 56px;
}
</style>
