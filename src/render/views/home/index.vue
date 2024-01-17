<template>
  <el-scrollbar v-track="{ id: 'page_view', eventResource: '首页', elementId: `home`, parentElId: `page` }" wrap-class="main-wrap" view-class="main-view">
    <TopAd />
    <el-row :gutter="26">
      <el-col :span="24">
        <HeadInfo />
      </el-col>
      <el-col :span="17" :offset="0">
        <el-row :gutter="26" class="center-content">
          <el-col :span="12" :offset="0" style="margin-top: 26px">
            <TeachingVideo />
          </el-col>
          <el-col :span="12" :offset="0" style="margin-top: 26px">
            <HotNewsTabs />
          </el-col>

          <el-col :span="12" :offset="0" style="margin-top: 26px">
            <RoadShowTabs />
          </el-col>
          <el-col :span="12" :offset="0" style="margin-top: 26px">
            <Interact />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="7" :offset="0">
        <TrainingTabs style="margin-top: 26px" />
      </el-col>
      <el-col :span="24" :offset="0" style="margin-top: 26px">
        <EnterpriseList />
      </el-col>
      <el-col :span="17" :offset="0">
        <el-row :gutter="26" class="center-content">
          <el-col :span="12" :offset="0" style="margin-top: 26px">
            <EPDataTrend />
          </el-col>
          <el-col :span="12" :offset="0" style="margin-top: 26px">
            <OpinionIndexRank />
          </el-col>
          <el-col :span="24" :offset="0" style="margin-top: 26px">
            <BondRanking />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="7" :offset="0">
        <MostAnnounces style="margin-top: 26px" />
        <RegionsTop10 style="margin-top: 26px" />
      </el-col>
      <el-col :span="24" :offset="0" style="margin-top: 26px">
        <BureauNews />
      </el-col>
    </el-row>
    <ShowBingWx />
    <ShowScreen />
  </el-scrollbar>
</template>

<script setup lang="ts">
/**
 * 首页
 */
import { HomeApi } from '@/apis/homeApi';
import { useUserInfo } from '@/hooks/useUserInfo';
import BondRanking from './components/BondRanking.vue';
import BureauNews from './components/BureauNews.vue';
import EPDataTrend from './components/EPDataTrend.vue';
import EnterpriseList from './components/EnterpriseList.vue';
import HeadInfo from './components/HeadInfo.vue';
import HotNewsTabs from './components/HotNewsTabs.vue';
import Interact from './components/Interact.vue';
import MostAnnounces from './components/MostAnnounces.vue';
import OpinionIndexRank from './components/OpinionIndexRank.vue';
import RegionsTop10 from './components/RegionsTop10.vue';
import RoadShowTabs from './components/RoadshowTabs.vue';
import ShowBingWx from './components/ShowBingWx.vue';
import ShowScreen from './components/ShowScreen.vue';
import TeachingVideo from './components/TeachingVideo.vue';
import TopAd from './components/TopAd.vue';
import TrainingTabs from './components/TrainingTabs.vue';
const { userInfo, updateUserInfo } = useUserInfo();

const params: any = {};
if (userInfo.zjjid) {
  params.zjjid = userInfo.zjjid;
} else {
  const platformId = userInfo.superviseId ? userInfo.superviseId : '';
  params.platformId = platformId;
}

HomeApi.getOidsByZjjId(params).then((res) => {
  if (res.data) {
    userInfo.codes = res.data.codes;
    userInfo.oids = res.data.oids;
    updateUserInfo(userInfo);
  }
});
</script>
