<template>
  <div>
    <div class="infos">
      <div v-for="(item, index) in infos" :key="index" class="info">
        <!-- <div v-if="index == 0" class="abs-top">
          <el-popover placement="bottom" :width="150" trigger="hover">
            <template #reference>
              <div class="bar-icon">
                <qj-svg-icon name="bar-shuoming" :size="16"></qj-svg-icon>
              </div>
            </template>
            <div class="fontsize-12">
              <p>辖区上市公司总数</p>
              <p>已在安娜开厅数量</p>
            </div>
          </el-popover>
        </div> -->
        <div v-if="index == 1" class="abs-top ratio">
          <span class="marginR5">环比上期</span><span :style="{ color: item.up ? '#FF584D' : '#68BB0F' }">{{ item.up ? `+${item.growth}` : item.growth }}</span>
        </div>
        <el-dropdown v-if="index == 2" class="abs-top">
          <span class="el-dropdown-link">
            {{ currentDropDown }}
            <el-icon class="el-icon--right"><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(drop, index1) in dropList" :key="index1" @click="countChange(drop)">{{ drop.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <img :style="{ boxShadow: item.boxShadow }" class="icon" :src="$img(item.icon)" />
        <el-button v-if="index == 3 && item.value == '0'" type="primary" class="btn" @click="goCreate()">创建培训</el-button>
        <template v-else>
          <div class="label">
            <div class="marginB5">
              <span class="value num-font" :style="{ color: item.color }" @click="goDetail(item)">{{ item.value.toLocaleString() }}</span>
              <span v-if="item.unit" class="unit">{{ item.unit }}</span>
            </div>
            <div class="name">{{ item.name }}</div>
            <div class="sub-name">{{ item.info }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HomeApi } from '@/apis/homeApi';
import { OpinionWarningApi } from '@/apis/opinionWarningApi';
import { useUserInfo } from '@/hooks/useUserInfo';
import { storage } from '@/utils/storage';
import { CaretBottom } from '@element-plus/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const { userInfo } = useUserInfo();
const currentDropDown = ref('');
const roadshowData = { roadshowCount: 0, roadshowLastYearCount: 0 };
HomeApi.getSuperviseIndexCount(userInfo.superviseId).then((res) => {
  if (res) {
    infos.value[0].value = res.data.companyCount || '--';
    roadshowData.roadshowCount = res.data.roadshowCount;
    roadshowData.roadshowLastYearCount = res.data.roadshowLastYearCount;
    if (res.data.roadshowCount == 0) {
      infos.value[2].value = res.data.roadshowLastYearCount;
      infos.value[2].query = { timeIndex: 5 };
      currentDropDown.value = '去年';
    } else {
      infos.value[2].value = res.data.roadshowCount;
      infos.value[2].query = { timeIndex: 4 };
      currentDropDown.value = '本年';
    }
  }
});

HomeApi.platformcourses(userInfo.superviseId).then((res) => {
  if (res) {
    infos.value[3].value = res.data;
  }
});
const auths = ref<string[]>(storage.get('auths'));
function goDetail(item) {
  if (auths.value.includes(item.auth)) {
    if (item.query) {
      router.push({ path: item.path, query: item.query });
    } else {
      router.push(item.path);
    }
  }
}
function goCreate() {
  if (auths.value.includes('7001')) {
    router.push('/trainingManage/courseManage/create');
  }
}
function countChange(drop) {
  currentDropDown.value = drop.name;
  infos.value[2].value = roadshowData[drop.key];
  infos.value[2].query = { timeIndex: drop.timeIndex };
}
OpinionWarningApi.getStatistics({ orgvalue: userInfo.oids }).then((data) => {
  if (data.data) {
    let result = data.data;
    infos.value[1].value = result.dayneg || '--';
    if (result.yesterdayneg === 0) {
      infos.value[1].growth = '--';
    } else if (result.dayneg - result.yesterdayneg === 0) {
      infos.value[1].growth = '0%';
    } else {
      infos.value[1].growth = (((result.dayneg - result.yesterdayneg) / result.yesterdayneg) * 100).toFixed(2) + '%';
      if (result.dayneg - result.yesterdayneg > 0) {
        infos.value[1].up = true;
      }
    }
  }
});
const dropList = ref([
  { key: 'roadshowCount', name: '本年', timeIndex: 4 },
  { key: 'roadshowLastYearCount', name: '去年', timeIndex: 5 }
]);
const infos = ref([
  {
    name: '辖区上市公司总数',
    unit: '家',
    value: '--',
    color: '#7A40F2',
    icon: 'top_qiye.png',
    boxShadow: '0px 4px 8px 2px rgba(129,81,230,0.27)',
    auth: '2003',
    path: '/roadshow/roadshowHalls'
  },
  {
    name: '辖区今日敏感',
    unit: '条',
    value: '--',
    color: '#F5222D',
    icon: 'top_caibao.png',
    boxShadow: '0px 4px 8px 2px rgba(225,172,69,0.27)',
    auth: '4001',
    path: '/scData/opinionWarning',
    query: { cate: 'neg' },
    up: false,
    growth: ''
  },
  {
    name: '辖区业绩说明会',
    info: '（安娜平台举办）',
    unit: '场',
    value: '--',
    color: '#2F54EB',
    icon: 'top_shuominghui.png',
    boxShadow: '0px 4px 8px 2px rgba(65,97,226,0.27)',
    auth: '2002',
    query: { timeIndex: 4 },
    path: '/roadshow/performanceBrief'
  },
  {
    name: '辖区本年培训',
    unit: '场',
    value: '--',
    color: '#F9B21F',
    icon: 'top_peixun.png',
    boxShadow: '0px 4px 8px 2px rgba(226,77,159,0.27)',
    auth: '7000',
    path: '/trainingManage/courseManage'
  }
]);
</script>
<style scoped lang="scss">
.infos {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.info {
  padding: 20px;
  height: 100px;
  display: flex;
  width: calc(25% - 16px);
  align-items: center;
  background-color: #fff;
  position: relative;
  .icon {
    width: 60px;
    height: 60px;
    border-radius: 30px;
  }
  .label {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .value {
    font-size: 28px;
    font-weight: 500;
    line-height: 36px;
    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
  .unit {
    margin-left: 10px;
    color: $text-color-secondary;
    line-height: 20px;
  }
  .name {
    color: $text-color-regular;
    line-height: 21px;
  }
  .sub-name {
    font-size: 12px;
    color: #b1b1b1;
  }
  .btn {
    margin: 0 auto;
  }
  .active {
    background-color: var(--link-active-bg-color);
    color: var(--el-color-primary);
  }
  .abs-top {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 12px;
    color: #53525b;
  }
  .ratio {
    color: #6e6e79;
    display: inline-block;
  }
}
</style>
