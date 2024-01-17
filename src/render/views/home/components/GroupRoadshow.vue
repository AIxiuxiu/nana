<template>
  <div v-loading="loading" class="content">
    <template v-if="roadshow">
      <div class="box">
        <div class="left">
          <div class="pic-card">
            <el-image class="pic-img" :src="$ossImg(roadshow.roadshowCoverUrl, 800) || $const.roadshowCover" fit="cover" />
            <span class="roadshow-tag" :style="{ backgroundColor: roadshowStatus.color }">{{ roadshowStatus.name }}</span>
            <span v-if="roadshow.roadForm == '1'" class="shade"></span>
          </div>
          <div class="info">
            <div class="item title" @click="goDetail">{{ roadshow.roadshowTitle }}</div>
            <div class="item">
              <span class="value">{{ roadshow.roadshowDateTime }}</span>
            </div>
            <div class="item">
              <span class="value">参与企业：</span>
              <span>{{ roadshow.multCompanyCount }}家</span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="state marginB15" :style="{ backgroundColor: bgColor[0] }">
            <img :src="$img('question.png')" alt="" srcset="" />
            <div class="text-center">
              <div class="title">提问数</div>
              <div class="count num-font" :style="{ color: bgColor[3] }">{{ roadshow.qTotal }}</div>
            </div>
          </div>
          <div class="state marginB15" :style="{ backgroundColor: bgColor[1] }">
            <img :src="$img('answer.png')" alt="" srcset="" />
            <div class="text-center">
              <div class="title">回复数</div>
              <div class="count num-font" :style="{ color: bgColor[4] }">{{ roadshow.rTotal }}</div>
            </div>
          </div>
          <div class="state" :style="{ backgroundColor: bgColor[2] }">
            <img :src="$img('answerratio.png')" alt="" srcset="" />
            <div class="text-center">
              <div class="title">答复率</div>
              <div class="count num-font" :style="{ color: bgColor[5] }">{{ roadshow.rRate }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <qj-empty v-else style="height: 100%" />
  </div>
</template>

<script setup lang="ts">
/**
 * 集体接待日
 */
import { HomeApi } from '@/apis/homeApi';
import useElectron from '@/hooks/useElectron';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const loading = ref(true);
const roadshow = ref();

HomeApi.getHomeCollectiveInfo().then((res) => {
  if (res.data) {
    roadshow.value = res.data;
  }
  loading.value = false;
});

const roadshowStatus = computed(() => {
  if (roadshow.value.roadshowStatus == '0') {
    return { color: '#FA8C16', name: '预告' };
  } else if (roadshow.value.roadshowStatus == '1') {
    return { color: '#F5222D', name: '进行中' };
  } else if (roadshow.value.roadshowStatus == '2') {
    if (!roadshow.value.hasReplay) {
      return { color: '#51B1E0', name: '已结束' };
    } else {
      return { color: '#1890FF', name: '回顾' };
    }
  } else if (roadshow.value.roadshowStatus == '5' || roadshow.value.roadshowStatus == '7') {
    return { color: '#aaa', name: '不通过' };
  } else {
    return { color: '#aaa', name: roadshow.value.roadshowStatusName };
  }
});
enum bgColor {
  '#FFF6F1',
  '#F1F8FF',
  '#ECEBFD',
  '#FA6400',
  '#4085F5',
  '#AF61F7'
}
const { shell } = useElectron();
function goDetail() {
  shell.openExternal(roadshow.value.roadshowUrl);
}

const router = useRouter();
function goto() {
  router.push('/groupReception/meetinglist');
}
</script>
<style scoped lang="scss">
.content {
  height: 280px;
  padding-top: 6px;
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .box {
    padding-top: 10px;
    display: flex;
    .left {
      width: 62%;
      padding-right: 16px;
      .pic-card {
        position: relative;
        width: 100%;
        transition: all 0.3s ease-in-out;
        box-shadow: 0 6px 10px 1px rgba(111, 111, 111, 0.08);
        overflow: hidden;
        .pic-img {
          width: 100%;
          // height: 150px;
        }
      }
      .info {
        color: $text-color-primary;
        line-height: 20px;
        .title {
          cursor: pointer;
          &:hover {
            color: $primary-color;
          }
        }
        .item {
          padding: 4px 0;
          .value {
            color: #a2a2a2;
          }
        }
      }
    }
    .right {
      flex: 1;
      .state {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 70px;
        width: 100%;
        img {
          margin-left: 8px;
          width: 48px;
        }
        .text-center {
          flex: 1;
        }
        .title {
          font-size: 14px;
          color: #a2a2a2;
        }
        .count {
          font-size: 22px;
        }
      }
    }
  }
}
</style>
