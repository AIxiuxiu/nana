<template>
  <div v-loading="loading" class="content-card">
    <div class="header">
      <span>辖区企业</span>
      <span v-has="2003">
        <el-tooltip trigger="hover" :content="'更多'" :placement="'bottom-start'" :effect="'light'" :visible-arrow="false">
          <QjSvgIcon class="moreicon" name="ellipsis" :size="20" :color="'#9D9CBB'" @click="router.push('/roadshow/roadshowHalls')" />
        </el-tooltip>
      </span>
    </div>

    <swiper
      v-if="companyList.length > 0"
      :slides-per-view="2"
      :slides-per-group="1"
      :modules="modules"
      :direction="'vertical'"
      :observer="true"
      :observe-parents="true"
      :autoplay="{ autoplay: false, disableOnInteraction: false, delay: 30000, pauseOnMouseEnter: true }"
      :virtual="true"
    >
      <swiper-slide v-for="(itemList, num) in companyList" :key="num" :virtual-index="num">
        <div class="card-list">
          <div v-for="(item, index) in itemList" :key="index" class="card">
            <div class="box" @click="goDatail(item)">
              <el-image lazy class="logo" lay height="60" :src="item.companyLogoOssIdUrl || $img('default-logo.png')" />
              <div class="marginL15">
                <div class="name">{{ item.companyShortname }}</div>
                <div class="code">{{ item.companyCode }}</div>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <qj-empty v-else />
  </div>
</template>

<script setup lang="ts">
/**
 * 辖区企业
 */
import { HomeApi } from '@/apis/homeApi';
import useElectron from '@/hooks/useElectron';
import { useUserInfo } from '@/hooks/useUserInfo';
import { Autoplay, Grid, Virtual } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const modules = [Autoplay, Grid, Virtual];
const companyList = ref([]);
const loading = ref(true);
const { userInfo } = useUserInfo();

HomeApi.getSuperviseCompanyList({ platformId: userInfo.superviseId }).then((res) => {
  if (res.data) {
    const showList = [];
    const showCount = 5;
    for (let index = 0; index < res.data.length / showCount; index++) {
      showList.push(res.data.slice(index * showCount, index * showCount + showCount));
    }
    if (showList[showList.length - 1].length < showCount) {
      showList[showList.length - 1].push(res.data.slice(0, showCount - showList[showList.length - 1].length));
    }
    companyList.value = showList;
  }
  console.log(companyList.value);
  loading.value = false;
});

const { shell } = useElectron();
function goDatail(item) {
  shell.openExternal(`https://ir.nana.net/c/${item.companyCode}.shtml`);
}
</script>
<style scoped lang="scss">
.content-card {
  height: 246px;
  padding: 16px 18px 22px 18px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .list {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
  .card-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .card {
    margin-top: 16px;
    padding: 0 10px;
    width: 20%;

    .box {
      padding: 8px 10px;
      background: rgba(147, 147, 147, 0.05);
      display: flex;
      align-items: center;
      transition: all 0.3s ease-in-out;
      cursor: pointer;
      .logo {
        width: 50px;
        height: 50px;
        border-radius: 25px;
        border: 1px solid #f1f1f1;
      }
      .name {
        margin-bottom: 4px;
        color: $text-color-primary;
      }
      .code {
        color: $text-color-regular;
      }
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        box-shadow: 0 4px 7px 2px rgba(206, 206, 206, 0.3);
      }
    }
  }
}

.swiper {
  width: 100%;
  height: calc(100% - 26px);
}

.swiper-slide {
  width: calc(100% / 5) !important;
}
</style>
