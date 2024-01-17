<template>
  <div class="content-card">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="大讲堂" name="1">
        <TeachTrainingVertical v-if="activeName == '1'" />
      </el-tab-pane>
      <el-tab-pane label="辖区培训" name="2">
        <RegulatoryTrainingVertical v-if="activeName == '2'" />
      </el-tab-pane>
    </el-tabs>
    <div class="more">
      <span v-show="activeName == '1'" v-has="5002"
        ><el-tooltip trigger="hover" :content="'更多'" :placement="'bottom-start'" :effect="'light'" :visible-arrow="false">
          <QjSvgIcon class="icon" name="ellipsis" :size="20" :color="'#9D9CBB'" @click="router.push('/superviseData/regulatoryTraining')" />
        </el-tooltip>
      </span>
      <span v-show="activeName == '2'" v-has="7001"
        ><el-tooltip trigger="hover" :content="'更多'" :placement="'bottom-start'" :effect="'light'" :visible-arrow="false">
          <QjSvgIcon class="icon" name="ellipsis" :size="20" :color="'#9D9CBB'" @click="router.push('/trainingManage/courseManage')" />
        </el-tooltip>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RegulatoryTrainingVertical from './RegulatoryTrainingVertical.vue';
import TeachTrainingVertical from './TeachTrainingVertical.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const activeName = ref('1');
function handleClick(event) {
  //
}
</script>
<style scoped lang="scss">
.content-card {
  height: 730px;
  padding: 6px 16px;
  position: relative;
  .more {
    position: absolute;
    top: 16px;
    right: 16px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
