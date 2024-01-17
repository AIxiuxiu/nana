<template>
  <div v-if="expiryDyas > 30" :class="{ show: !miniSidebar }" class="ad-image">
    <QjSvgIcon name="icon_left_bar" :size="26" />
    <div style="padding: 5px">
      <div class="name">{{ userInfo.companyShortname }}</div>
      <div class="label marginT5">欢迎进入{{ appTitle }}</div>
    </div>
    <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 30" preserveAspectRatio="none" shape-rendering="auto">
      <defs>
        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
      </defs>
      <g class="parallax">
        <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.2)" />
        <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.1)" />
      </g>
    </svg>
  </div>
  <div v-else class="ad-image" style="opacity: 1" :class="{ 'min-ad': miniSidebar }">
    <template v-if="expiryDyas >= 0">
      <el-tooltip :disabled="!miniSidebar" :offset="5" :content="'距离合同到期还有' + expiryDyas + '天'" placement="right">
        <div class="svg-wrap">
          <svg width="32px" height="32px" viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g transform="translate(-98.000000, -663.000000)" fill="#AFB1B6">
                <g transform="translate(15.000000, 651.000000)">
                  <g transform="translate(31.000000, 2.000000)">
                    <g transform="translate(52.000000, 10.000000)">
                      <path
                        d="M19.0671667,1.46668352 L17.5999798,1.46668352 L17.5999798,0.302444127 C17.5999798,0.136510269 17.4607167,0 17.2889236,0 L16.4443541,0 C16.2686716,0 16.1333232,0.135399004 16.1333232,0.302444127 L16.1333232,1.46668352 L5.86665153,1.46668352 L5.86665153,0.302444127 C5.86665153,0.136510269 5.72738849,0 5.55562062,0 L4.71102585,0 C4.53534327,0 4.39999495,0.135399004 4.39999495,0.302444127 L4.39999495,1.46668352 L2.93280802,1.46668352 C1.31032031,1.46668352 0,2.77895003 0,4.39770167 L0,19.0689818 C0,20.6843239 1.31304796,22 2.93280802,22 L19.067192,22 C20.6896797,22 22,20.6877335 22,19.0689818 L22,4.39770167 C22,2.78235962 20.6869015,1.46668349 19.0671667,1.46668352 Z M20.5332929,19.0690071 C20.5332929,19.8786986 19.8786758,20.533367 19.0671667,20.533367 L2.93278274,20.533367 C2.12430444,20.533367 1.46665656,19.8755668 1.46665656,19.0690071 L1.46665656,7.33334176 L20.5332929,7.33334176 L20.5332929,19.0690071 Z M20.5332929,5.86668352 L1.46665656,5.86668352 L1.46665656,4.39770167 C1.46665656,3.58801016 2.12127368,2.93334176 2.93278274,2.93334176 L4.3999697,2.93334176 L4.3999697,4.09758115 C4.3999697,4.263515 4.53923273,4.40002527 4.7110006,4.40002525 L5.55559535,4.40002525 C5.73127793,4.40002525 5.86662625,4.26462625 5.86662625,4.09758115 L5.86662625,2.93334176 L16.1332727,2.93334176 L16.1332727,4.09758115 C16.1332727,4.263515 16.2725358,4.40002527 16.4443036,4.40002525 L17.2888731,4.40002525 C17.464581,4.40002525 17.5999293,4.26462625 17.5999293,4.09758115 L17.5999293,2.93334176 L19.0671162,2.93334176 C19.8755945,2.93334176 20.5332929,3.59114194 20.5332929,4.39770167 L20.5332929,5.86668352 L20.5332929,5.86668352 Z"
                        fill-rule="nonzero"
                      ></path>
                      <text font-size="11" font-weight="normal" text-anchor="middle">
                        <tspan x="50%" y="18">{{ expiryDyas }}</tspan>
                      </text>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </el-tooltip>

      <div class="label marginT5 padding5">
        距离合同到期还有<span class="link">{{ expiryDyas }}</span> 天
      </div>
    </template>
    <div v-else class="label marginT5 padding5">您的合同已到期</div>
  </div>
</template>

<script lang="ts" setup>
import { useUserInfo } from '@/hooks/useUserInfo';
import { InjectSidebarKey } from '@/types/symbols';
import dayjs from 'dayjs';
import { computed, inject } from 'vue';

const miniSidebar = inject(InjectSidebarKey);

const appTitle = import.meta.env.VITE_APP_TITLE.toString();
const { userInfo } = useUserInfo();
const expiryDyas = computed(() => {
  return dayjs(userInfo.expiryTime).diff(dayjs(), 'days');
});
</script>

<style lang="scss" scoped>
.ad-image {
  left: 15px;
  bottom: $bottom-height;
  position: absolute;
  width: calc($sidebar-width - 30px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease-in-out;
  background: linear-gradient(135deg, #c3d2f5 0%, #7ca0e6 100%);
  box-shadow: 0 3px 8px 0 rgba(149, 177, 235, 0.53);
  border-radius: 12px;
  .name {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    line-height: 17px;
  }
  .label {
    font-size: 12px;
    color: #fdfdfd;
    line-height: 18px;
    transition: all 0.3s ease-in-out;
  }
  &.show {
    opacity: 1;
  }
  &.min-ad {
    width: 64px;
    .label {
      visibility: hidden;
      opacity: 0;
    }
  }
  .waves {
    position: relative;
    width: 100%;
    margin-bottom: -7px; /* Fix for safari gap */
    min-height: 30px;
  }
  .parallax > use {
    animation: move-forever 30s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
  }
  .parallax > use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 10s;
  }
  .parallax > use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 14s;
  }
  @keyframes move-forever {
    0% {
      transform: translate3d(-90px, 0, 0);
    }
    100% {
      transform: translate3d(85px, 0, 0);
    }
  }
}
</style>
