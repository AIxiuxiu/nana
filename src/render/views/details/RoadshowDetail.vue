<template>
  <el-scrollbar wrap-class="detail-wrap" view-class="detail-view">
    <div class="text-center">
      <div class="titleText" style="line-height: 46px">
        <div>{{ title }}</div>
        <div>
          <span class="tag" :class="[showStatus?.class]">{{ showStatus?.name }}</span>
        </div>
      </div>

      <div ref="showVideo" v-loading="loading" style="border: 0 solid #ddd">
        <div v-if="detailData.my_video_url != ''">
          <QjVideoPlayer ref="videoEl" v-bind="options" />
        </div>
        <div v-else>
          <el-image :src="detailData.roadshowCoverOssUrl || $const.roadshowCover" fit="cover" style="height: 340px; width: 600px"></el-image>
        </div>
      </div>
    </div>
    <!-- <el-image v-if="showImg" ref="showImg" style="width: 500px; height: 400px"></el-image> -->
    <div v-loading="loading">
      <div class="text-left marginT10" style="padding: 10px 60px">
        <el-row :gutter="5">
          <el-col :span="3">
            <div class="top-right">
              <span class="keyTitle">举办时间：</span>
            </div>
          </el-col>
          <el-col :span="9">
            <span class="valueTitle">{{ detailData.roadshowDates }}</span>
          </el-col>

          <el-col :span="3">
            <div class="top-right">
              <span class="keyTitle">支持平台：</span>
            </div>
          </el-col>
          <el-col :span="9">
            <span class="valueTitle">安娜路演</span>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col v-if="detailData.zhidao" :span="3">
            <div class="top-right">
              <span class="keyTitle">指导单位：</span>
            </div>
          </el-col>
          <el-col v-if="detailData.zhidao" :span="9">
            <div class="top-right">
              <span class="valueTitle" v-html="detailData.zhidao"></span>
            </div>
          </el-col>
          <el-col v-if="detailData.zhichi" :span="3">
            <div class="top-right">
              <span class="keyTitle">支持单位：</span>
            </div>
          </el-col>
          <el-col v-if="detailData.zhichi" :span="9">
            <div class="top-right">
              <span class="valueTitle" v-html="detailData.zhichi"></span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col v-if="detailData.zhuban" :span="3">
            <div class="top-right">
              <span class="keyTitle">主办单位：</span>
            </div>
          </el-col>
          <el-col v-if="detailData.zhuban" :span="9">
            <div class="top-right">
              <span class="valueTitle" v-html="detailData.zhuban"></span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text-center" style="margin-bottom: 20px">
        <el-button type="primary" style="margin-top: 10px" @click="goEnterWeb(detailData.roadshowUrl)">进入路演厅</el-button>
      </div>
      <div class="roadBottom">
        <div>
          <div class="panel-label smallTitle">活动介绍</div>
          <div style="line-height: 20px" class="smallTitleText" v-html="detailData.activityIntroduceAll"></div>
          <div class="brief"></div>
        </div>
      </div>
    </div>
  </el-scrollbar>

  <!-- </el-row> -->
</template>
<script setup lang="ts">
import { RoadshowApi } from '@/apis/roadshowApi';
import { useCurrentModal, useDetailParams } from '@/hooks/useDetailModal';
import useElectron from '@/hooks/useElectron';
import { reactive, ref } from 'vue';

//定义接收参数
const props = defineProps({
  pid: {
    type: String,
    default: ''
  },
  logoUrl: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  roadshowStatus: {
    type: String,
    default: ''
  },
  hasReplay: {
    type: String,
    default: ''
  }
});

const detailData = ref<any>({});
const loading = ref(false);
const options = reactive({
  height: '340px',
  width: '100%', //播放器高度
  src: '',
  poster: '',
  pids: ''
});

const getDetail = (pid) => {
  loading.value = true;
  RoadshowApi.getRoadshowInfo(pid).then((data) => {
    loading.value = false;
    if (data.data) {
      detailData.value = data.data;
      if (detailData.value.my_video_url != '') {
        options.src = detailData.value.my_video_url;
      } else {
        options.src = '';
      }

      options.poster = detailData.value.roadshowCoverOssUrl;
      loading.value = false;
    }
  });
};

const setRoadshowStatus = (params) => {
  if (params.roadshowStatus == '0') {
    return { class: 'v1', name: '预告' };
  } else if (params.roadshowStatus == '1') {
    return { class: 'v2', name: '进行中' };
  } else if (params.roadshowStatus == '2') {
    if (!params.hasReplay) {
      return { class: 'v3', name: '已结束' };
    } else {
      return { class: 'v3', name: '回顾' };
    }
  } else {
    return null;
  }
};

const showStatus = ref();
// 获取参数，已封装
let params1 = useDetailParams((params) => {
  if (params.pid == '') {
    return;
  }
  showStatus.value = setRoadshowStatus(params);
  // 监听参数被修改 - 把请求放这里面
  loading.value = true;
  detailData.value.roadshowDates = '';
  detailData.value.canyu = '';
  detailData.value.zhidao = '';
  detailData.value.zhichi = '';
  detailData.value.zhuban = '';
  detailData.value.activityIntroduceAll = '';
  options.src = '';
  options.poster = params.logoUrl;
  options.pids = params.pid;
  getDetail(params.pid);
});

const { shell } = useElectron();
function goEnterWeb(val) {
  shell.openExternal(val);
}

const videoEl = ref();
useCurrentModal({
  closed: () => {
    videoEl.value && videoEl.value.pause();
  }
});
</script>
<style lang="scss" scoped>
.detail-view {
  //padding: $content-padding;
  .roadBottom {
    background: rgba(61, 126, 255, 0.05);
    padding: $content-padding;
    .panel-label {
      line-height: 36px;
    }
  }
  .el-row {
    margin-bottom: 10px;
  }
  .keyTitle {
    color: $text-color-secondary;
    font-size: 14px;
    line-height: 20px;
  }
  .valueTitle {
    font-size: 14px;
    color: $text-color-regular;
    line-height: 20px;
  }

  .titleText {
    font-size: 16px;
    color: $text-color-primary;
  }
  .smallTitle {
    font-size: 14px;
    color: $text-color-secondary;
  }
  .smallTitleText {
    font-size: 14px;
    color: $text-color-regular;
  }
  .textContet {
    font-size: 14px;
    color: #595966;
  }
  .tag {
    position: absolute;
    right: 0;
    top: 6px;
    z-index: 1;
    padding-left: 10px;
    //padding-top: 3px;
    width: 64px;
    height: 27px;
    line-height: 27px;
    text-align: center;
    background: url(@/assets/images/i_state.png) no-repeat;
    background-position: 0 -90px !important;
    color: #fff;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
    letter-spacing: 2px;

    &.v1 {
      background-position: 0 0 !important;
    }
    &.v2 {
      background-position: 0 -30px !important;
    }
    &.v3 {
      background-position: 0 -60px !important;
    }
  }
}
</style>
