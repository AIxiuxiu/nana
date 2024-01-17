<template>
  <div class="content">
    <div v-loading="isLoading" class="pane">
      <swiper
        v-if="roadListData.length > 4"
        :slides-per-view="2"
        :slides-per-group="1"
        :modules="modules"
        :direction="'vertical'"
        :observer="true"
        :observe-parents="true"
        :grid="{ rows: 2 }"
        :autoplay="{ autoplay: true, disableOnInteraction: false, delay: 3000, pauseOnMouseEnter: true }"
      >
        <swiper-slide v-for="(item, num) in roadListData" :key="num">
          <div class="orgBox1" @click="showDetail(item)">
            <el-image fit="cover" :src="$ossImg(item?.roadshowCoverOssUrl, 400) || $const.roadshowCover" style="width: 100%; height: 100%"></el-image>
            <span class="roadshow-tag" :style="{ backgroundColor: roadshowStatus(item).color }">{{ roadshowStatus(item).name }}</span>
            <div v-if="item.roadForm == '1'">
              <span class="shade"></span>
            </div>
          </div>
        </swiper-slide>
      </swiper>

      <template v-else>
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between">
          <template v-for="(item, num) in roadListData" :key="num">
            <div class="orgBox" :class="(num + 1) % 2 == 0 ? 'noMargin' : ''" @click="showDetail(item)">
              <el-image fit="cover" :src="$ossImg(item?.roadshowCoverOssUrl, 400) || $const.roadshowCover" style="width: 100%; height: 100%"></el-image>
              <span class="roadshow-tag" :style="{ backgroundColor: roadshowStatus(item).color }">{{ roadshowStatus(item).name }}</span>
              <div v-if="item.roadForm == '1'">
                <span class="shade"></span>
              </div>
            </div>
          </template>
        </div>
      </template>
      <qj-empty v-if="roadListData && roadListData.length == 0" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { RoadshowApi } from '@/apis/roadshowApi';
import useElectron from '@/hooks/useElectron';
import { useUserInfo } from '@/hooks/useUserInfo';
import { Autoplay, Grid } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { ref } from 'vue';

const { shell } = useElectron();
const modules = [Autoplay, Grid];
function showDetail(item) {
  if (item.roadshowStatus < 3 && item.roadshowUrl) {
    shell.openExternal(item.roadshowUrl);
  }
}
const roadListData = ref([]);
const isLoading = ref(false);
const { userInfo } = useUserInfo();
function getData() {
  isLoading.value = true;
  const queryData = {
    page: 1,
    pagesize: 8,
    platformId: userInfo.superviseId,
    type: '5'
  };

  RoadshowApi.getRoadshowListForZjj(queryData).then((res) => {
    if (res.code === 0) {
      roadListData.value = res.data;
    }
    isLoading.value = false;
  });
}

const roadshowStatus = (item) => {
  if (item.roadshowStatus == '0') {
    return { color: '#FA8C16', name: '预告' };
  } else if (item.roadshowStatus == '1') {
    return { color: '#F5222D', name: '进行中' };
  } else if (item.roadshowStatus == '2') {
    if (!item.hasReplay) {
      return { color: '#51B1E0', name: '已结束' };
    } else {
      return { color: '#1890FF', name: '回顾' };
    }
  } else if (item.roadshowStatus == '5' || item.roadshowStatus == '7') {
    return { color: '#aaa', name: '不通过' };
  } else {
    return { color: '#aaa', name: item.roadshowStatusName };
  }
};
getData();
</script>
<style scoped lang="scss">
.content {
  height: 280px;
  padding-top: 6px;
}

.orgBox {
  width: calc((100% - 24px) / 2);
  margin: 8px 6px;
  height: 110px;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
  &:hover {
    cursor: pointer;
    box-shadow: $box-shadow-base;
    color: $primary-color;
  }
  .s0 {
    background: $primary-color !important;
  }
  .s1 {
    background: $warning-color !important;
  }
  .tag {
    width: 80px;
    height: 20px;
    top: 10px;
    right: -20px;
    text-align: center;
    font-size: 12px;
    line-height: 20px;
    transform: rotate(45deg);
    position: absolute;
    color: $white-color;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
    letter-spacing: 2px;
  }
  .shade {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url(@/assets/images/i_lock_open.png) no-repeat 50% 50% rgba(0, 0, 0, 0.3);
    background-size: 37px 45px;
  }
  .noMargin {
    margin-right: 0;
  }
}

.orgBox1 {
  height: 100%;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
  &:hover {
    cursor: pointer;
    box-shadow: $box-shadow-light;
    color: $primary-color;
  }
  .s0 {
    background: $primary-color !important;
  }
  .s1 {
    background: $warning-color !important;
  }
  .tag {
    width: 80px;
    height: 20px;
    top: 10px;
    right: -20px;
    text-align: center;
    font-size: 12px;
    line-height: 20px;
    transform: rotate(45deg);
    position: absolute;
    color: $white-color;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
    letter-spacing: 2px;
  }
  .shade {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url(@/assets/images/i_lock_open.png) no-repeat 50% 50% rgba(0, 0, 0, 0.3);
    background-size: 37px 45px;
  }
  .noMargin {
    margin-right: 0;
  }
}

.empty {
  width: 100%;
  height: 100%;
  font-size: 14px;
  padding: 10px;
  text-align: center;
  color: $text-color-regular;
  transform: translateY(40%);
}

.swiper {
  width: 100%;
  height: calc(100% - 26px);
}

.pane {
  width: 100%;
  height: 100%;
}

.swiper-wrapper {
  width: 100% !important;
}

.swiper-slide {
  width: calc(100% / 2) !important;
  padding: 8px 6px;
}
</style>
