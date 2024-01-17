<template>
  <div class="content">
    <ul v-loading="isLoading" style="height: calc(100% - 10px)">
      <swiper
        v-if="hotNews.length > 0"
        :direction="'vertical'"
        :slides-per-view="5"
        :modules="modules"
        :slides-per-group="1"
        :loop="hotNews.length > 5 ? true : false"
        :observer="true"
        :observe-parents="true"
        :autoplay="{ autoplay: true, disableOnInteraction: false, delay: 2000, pauseOnMouseEnter: true }"
      >
        <swiper-slide v-for="(news, index) in hotNews" :key="index">
          <li>
            <div class="rvalue">
              <span class="badge badge-pill badge-danger">{{ numberChange(news.degree) }}°</span>
            </div>
            <div class="condiv">
              <span class="title" :title="news.title" @click="clickDetail(news)"> <a v-html-highlight="{ keywords: userInfo.companyShortname, detail: news.title }" /> </span>
              <span class="time" style="color: #909499">{{ news.publishdate }}</span>
            </div>
          </li>
        </swiper-slide>
      </swiper>
    </ul>
    <qj-empty v-if="!isLoading && hotNews && hotNews.length == 0" />
  </div>
</template>

<script setup lang="ts">
import { HomeApi } from '@/apis/homeApi';
import { useDetailModal } from '@/hooks/useDetailModal';
import { useUserInfo } from '@/hooks/useUserInfo';
import NewsDetail from '@/views/details/NewsDetail.vue';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { ref } from 'vue';

const { userInfo } = useUserInfo();

const isLoading = ref(false);

const hotNews = ref([]);
const modules = [Navigation, Pagination, Autoplay];
const detailModal = useDetailModal(NewsDetail, { path: 'news-detail' });
function clickDetail(item) {
  detailModal.show({ url: encodeURIComponent(item.url), database: 'vnews', keywords: userInfo.supervisorArea ? userInfo.supervisorArea : '' }, { title: '新闻详情' });
}
function getData() {
  isLoading.value = true;
  HomeApi.getHots({ page: 1, pagesize: 10 }).then((res) => {
    if (res.code === 0) {
      isLoading.value = false;
      hotNews.value = res.data;
    }
  });
}
function numberChange(number: number) {
  return number.toFixed(1);
}
getData();
</script>
<style scoped lang="scss">
.content {
  height: 320px;
  ul {
    padding: 0;
    list-style: none;
    line-height: 20px;
  }
  li {
    display: flex;
    clear: both;
    // margin-bottom: 8px;
    // height: 42px;
  }
  .rvalue {
    float: left;
    display: inline;
    line-height: 18px;
    transform: scale(0.8);
  }
  // .rvalue span {
  //   color: white;
  // }
  .condiv {
    width: calc(100% - 50px);
    display: inline;
    float: left;
    height: 36px;
  }
  .title {
    display: block;
    font-size: 14px;
    height: 20px;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .title a {
    text-decoration: none;
    cursor: pointer;
  }
  .title a:hover {
    color: $primary-color;
  }
  .time {
    line-height: 26px;
    color: $text-color-secondary;
  }
  .badge {
    background-color: #fff;
    text-align: center;
    font-size: 12px;
    height: 12px;
    color: $red-color;
    line-height: 12px;
    padding: 0 3px;
    border: 1px solid $red-color;
    border-radius: 10px;
    margin-right: 8px;
  }
  .swiper {
    width: 100%;
    height: 100%;
  }
}
</style>
