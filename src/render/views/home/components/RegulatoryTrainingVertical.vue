<template>
  <div v-loading="isLoading" class="swiper-wrap">
    <swiper
      v-if="trainListData.length > 0"
      :modules="modules"
      :slides-per-view="3"
      :space-between="5"
      :direction="'vertical'"
      :loop="trainListData.length > 3 ? true : false"
      :observer="true"
      :observe-parents="true"
      :autoplay="{ autoplay: true, disableOnInteraction: false, delay: 3000, pauseOnMouseEnter: true }"
    >
      <swiper-slide v-for="(item, index) in trainListData" :key="index">
        <div style="padding: 10px">
          <div class="orgBox" @click="showDetail(item)">
            <el-image fit="cover" :src="$ossImg(item.course_cover_url, 600) || $const.roadshowCover" style="width: 100%; height: 130px"></el-image>
            <div style="padding: 6px 12px">
              <div class="title" :title="item.course_title">{{ item.course_title }}</div>
              <span class="date">{{ item.begin_time }}~{{ item.end_time }}</span>
            </div>
            <qj-empty v-if="total == 0"></qj-empty>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <qj-empty v-if="trainListData && trainListData.length == 0 && !isLoading" />
  </div>
</template>
<script setup lang="ts">
import { TrainingManageApi } from '@/apis/trainingManageApi';
import { UserApi } from '@/apis/userApi';
import { useDetailModal } from '@/hooks/useDetailModal';
import { useUserInfo } from '@/hooks/useUserInfo';
import { storage } from '@/utils/storage';
import TrainDetail from '@/views/trainingManage/courseManage/trainDetail.vue';
import { Autoplay, Grid, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const modules = [Navigation, Pagination, Autoplay, Grid];

const router = useRouter();

const detailModal = useDetailModal(TrainDetail, { path: 'train-detail' });
function showDetail(item) {
  detailModal.show({ course_id: item.id }, { title: '课程视频' });
}

const trainListData = ref([]);
const isLoading = ref(false);
const total = ref(0);
const { userInfo } = useUserInfo();
const queryData = reactive({
  page: 1,
  pageSize: 8
});

function getData() {
  isLoading.value = true;
  TrainingManageApi.getcourselist(userInfo.platform, queryData).then((res) => {
    if (res) {
      trainListData.value = res.data;
      total.value = res.total;
      isLoading.value = false;
    }
  });
}
function getPtoken() {
  UserApi.getPeixunUrl(userInfo.mobile, userInfo.superviseId).then((res) => {
    if (res) {
      storage.set('ptoken', res.data.token);
    }
  });
}

onMounted(() => {
  if (storage.get('ptoken') == '') {
    getPtoken();
  }
  getData();
});
</script>
<style scoped lang="scss">
.swiper-wrap {
  height: 678px;
  width: 100%;
  .orgBox {
    width: 100%;
    height: 100%;
    transition: all 0.3s ease-in-out;
    // box-shadow: $box-shadow-base;
    position: relative;
    // border-radius: 16px;
    border: 1px solid $border-color-base;
    overflow: hidden;
    &:hover {
      cursor: pointer;
      box-shadow: $box-shadow-light;
      color: $primary-color;
    }

    .title {
      font-size: 14px;
      width: calc(100% - 14px);
      overflow: hidden;
      line-height: 20px;
      height: 20px;
      text-overflow: ellipsis;
      display: inline-block;
    }
    .date {
      font-size: 13px;
      color: #acacac;
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
      // border-radius: 16px 16px 0 0;
      width: 100%;
      height: 130px;
      background: url(@/assets/images/i_lock_open.png) no-repeat 50% 50% rgba(0, 0, 0, 0.3);
      background-size: 37px 45px;
    }
  }
}

.icon:hover {
  cursor: pointer;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-wrapper {
  width: 100% !important;
}

.swiper-slide {
  width: 100%;
}
</style>
