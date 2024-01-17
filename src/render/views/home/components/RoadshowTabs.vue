<template>
  <div class="content-card">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane name="1">
        <template #label>
          <div class="header">
            <span style="margin: 0 10px">辖区业绩说明会</span>
          </div>
        </template>
        <Roadshow />
      </el-tab-pane>
      <el-tab-pane name="2">
        <template #label>
          <div class="header">
            <span style="margin: 0 10px">集体接待日</span>
          </div>
        </template>
        <GroupRoadshow />
      </el-tab-pane>
    </el-tabs>
    <div class="more">
      <span v-show="activeName == '1'" v-has="2001">
        <el-tooltip trigger="hover" :content="'更多'" :placement="'bottom-start'" :effect="'light'" :visible-arrow="false">
          <QjSvgIcon class="moreicon" name="ellipsis" :size="20" :color="'#9D9CBB'" @click="router.push('/roadshow/performanceBrief')" />
        </el-tooltip>
      </span>
      <span v-show="activeName == '2'" v-has="2002"
        ><el-tooltip trigger="hover" :content="'更多'" :placement="'bottom-start'" :effect="'light'" :visible-arrow="false">
          <QjSvgIcon class="icon" name="ellipsis" :size="20" :color="'#9D9CBB'" @click="router.push('/roadshow/groupReception')" />
        </el-tooltip>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GroupRoadshow from './GroupRoadshow.vue';
import Roadshow from './RoadShow.vue';

const router = useRouter();

const activeName = ref('1');
</script>
<style scoped lang="scss">
.content-card {
  padding: 6px 16px 0 16px;
  height: 320px;
  position: relative;
  .header {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .more {
    position: absolute;
    top: 16px;
    right: 16px;
    &:hover {
      cursor: pointer;
    }
  }
}

:deep(.el-tabs__header) {
  margin: 0;
}
</style>
