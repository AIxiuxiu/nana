<template>
  <div class="content-card" style="padding-top: 6px">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="债券即将到期排行" name="2">
        <el-table v-loading="loading[2]" :data="tableData[2]" style="width: 100%">
          <el-table-column prop="dUE_DATE" label="到期日期" width="140">
            <template #default="scope">
              <span v-if="scope.row.dUE_DATE">{{ scope.row.dUE_DATE.slice(0, 10) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sHORT_NAME" label="债券简称" :show-overflow-tooltip="true">
            <template #default="scope">
              <span class="link" @click="toDetail(scope.row)">{{ scope.row.sHORT_NAME }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="oRG_SHORT_NAME" label="所属机构" width="140" :show-overflow-tooltip="true" />
          <el-table-column prop="tYPE_NAME" label="债券类型" width="140" :show-overflow-tooltip="true" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="债券周预警排行" name="1">
        <el-table v-loading="loading[1]" :data="tableData[1]" style="width: 100%">
          <el-table-column prop="orgShortName" label="所属机构" width="140" />
          <el-table-column prop="sensitiveNewsNum" label="周敏感量" width="100" />
          <el-table-column prop="bondNum" label="债券数量" width="100" />
          <el-table-column prop="bondShortName" label="债券简称">
            <template #default="scope">
              <div class="ellipsis-1" :title="scope.row?.bondShortName">{{ scope.row?.bondShortName }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="债券违约排行" name="0">
        <el-table v-loading="loading[0]" :data="tableData[0]" style="width: 100%">
          <el-table-column prop="bREAKCONTACT_DATE" label="违约披露日" width="140">
            <template #default="scope">
              <span v-if="scope.row.bREAKCONTACT_DATE">{{ scope.row?.bREAKCONTACT_DATE.slice(0, 10) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sHORT_NAME" label="债券简称" :show-overflow-tooltip="true">
            <template #default="scope">
              <span class="link" @click="toDetail(scope.row)">{{ scope.row.sHORT_NAME }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="oRG_SHORT_NAME" label="所属机构" width="140" />
          <el-table-column prop="tYPE_NAME" label="债券类型" width="140" :show-overflow-tooltip="true" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <span v-has="4003" class="more">
      <el-tooltip trigger="hover" :content="'更多'" :placement="'bottom-start'" :effect="'light'" :visible-arrow="false">
        <QjSvgIcon class="moreicon" name="ellipsis" :size="20" :color="'#9D9CBB'" @click="router.push('/scData/smartBond')" />
      </el-tooltip>
    </span>
  </div>
</template>
<script setup lang="ts">
/**
 * 债券排行
 */

import { HomeApi } from '@/apis/homeApi';
import { useDetailModal } from '@/hooks/useDetailModal';
import { useUserInfo } from '@/hooks/useUserInfo';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SmartBondDetailVue from '../../scData/smartBond/SmartBondDetail.vue';

const router = useRouter();
const activeName = ref('2');
const loading = ref([false, false, false]);
const tableData = ref([[], [], []]);
const { userInfo } = useUserInfo();

function getData(index) {
  index = Number.parseInt(index);
  loading.value[index] = true;
  HomeApi.postCompanyBondInfo({ type: (index + 1).toString(), orgIds: userInfo.oids, offset: 0, limit: 6 }).then((res) => {
    loading.value[index] = false;
    if (res.data) {
      tableData.value[index] = res.data.splice(0, 6);
    }
  });
}

getData(activeName.value);

function handleClick(event) {
  getData(event.props.name);
}

const smartBondDetailModel = useDetailModal(SmartBondDetailVue, { path: 'smartBond-detail' }, { value: false, bind: { contentClass: 'qj-news-modal' } });
const toDetail = (item) => {
  smartBondDetailModel.show(
    {
      id: item.iD
    },
    {
      title: '债券详情'
    }
  );
};
</script>
<style lang="scss" scoped>
.content-card {
  padding: 16px 18px 22px 18px;
  height: 340px;
  .more {
    position: absolute;
    right: 20px;
    top: 16px;
  }
  .moreicon {
    cursor: pointer;
  }
}

:deep(.el-tabs__header) {
  margin: 0;
}
</style>
<style>
.qj-news-modal {
  height: 73% !important;
}
</style>
