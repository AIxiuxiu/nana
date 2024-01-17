<template>
  <div v-loading="isLoading" class="content-card">
    <div class="header">
      <span>投教视频</span>
      <span v-has="3000">
        <el-tooltip trigger="hover" :content="'更多'" :placement="'bottom-start'" :effect="'light'" :visible-arrow="false">
          <QjSvgIcon class="moreicon" name="ellipsis" :size="20" :color="'#9D9CBB'" @click="router.push('/tjData')" />
        </el-tooltip>
      </span>
    </div>
    <el-row v-if="listData && listData.length > 0" :gutter="20" style="flex: 1; padding: 6px 10px 0; overflow: hidden">
      <el-col :span="15" :offset="0" style="height: 100%">
        <div class="img" @click="openDetail(listData[0])">
          <el-image
            class="img"
            :src="$ossImg(listData[0]?.cover ? listData[0]?.cover : 'default_cjvideo.jpg', 480) || $img('default_cjvideo.jpg')"
            fit="fill"
            :lazy="true"
          ></el-image>
          <QjSvgIcon name="play" :size="50" :color="'#fff'" class="playbtn"></QjSvgIcon>
        </div>
      </el-col>
      <el-col :span="9" :offset="0" style="height: 100%">
        <div v-if="listData.length > 1" class="colum">
          <div style="padding-bottom: 10px; position: relative" @click="openDetail(listData[1])">
            <el-image class="img" :src="$ossImg(listData[1]?.cover ? listData[1]?.cover : 'default_cjvideo.jpg', 272)" fit="contain" :lazy="true"></el-image>
            <QjSvgIcon name="play" :size="40" :color="'#fff'" class="playbtn2"></QjSvgIcon>
          </div>
          <div v-if="listData.length > 2" style="padding-top: 10px; position: relative" @click="openDetail(listData[2])">
            <el-image class="img" :src="$ossImg(listData[2]?.cover ? listData[2]?.cover : 'default_cjvideo.jpg', 272)" fit="contain" :lazy="true"></el-image>
            <QjSvgIcon name="play" :size="40" :color="'#fff'" class="playbtn2"></QjSvgIcon>
          </div>
        </div>
      </el-col>
    </el-row>
    <qj-empty v-if="!isLoading && listData && listData.length == 0" style="flex: 1" />
  </div>
</template>

<script setup lang="ts">
import { VideoApi } from '@/apis/videoApi';
import { useAsyncTableApi } from '@/hooks/useAsyncApi';
import { useDetailModal } from '@/hooks/useDetailModal';
import dayjs from 'dayjs';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import VideoDetailVue from '../../details/VideoDetail.vue';

const router = useRouter();
const queryData = reactive({
  currentDateRange: [dayjs().subtract(1, 'year').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  keywords: ''
});
const {
  isLoading,
  data: listData,
  refresh
} = useAsyncTableApi((params) => {
  params.keyword = '安娜数说';
  params.title = queryData.keywords;
  params.startTime = queryData.currentDateRange[0] + ' 00:00:00';
  params.endTime = queryData.currentDateRange[1] + ' 23:59:59';
  return VideoApi.getVideoListBySearch(params);
});
const videoDetailModal = useDetailModal(VideoDetailVue, { path: 'videoDetail' });
function openDetail(item) {
  videoDetailModal.show(
    {
      title: item.title,
      url: item.url,
      dateTime: item.uptime,
      poster: item.cover
    },
    { title: '财经视频' }
  );
}
</script>
<style scoped lang="scss">
.content-card {
  height: 384px;
  padding: 16px 12px 22px 12px;
  display: flex;
  flex-direction: column;
}

.header {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .moreicon:hover {
    cursor: pointer;
  }
}

.colum {
  display: flex;
  flex-direction: column;
  height: 100%;

  > div {
    flex: 1 1 50%;
    height: 50%;
  }
}

.img {
  height: 100%;
  width: 100%;
  position: relative;
}

.playbtn {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -25px;
  margin-left: -25px;
}

.playbtn2 {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -20px;
  margin-left: -20px;
}
</style>
