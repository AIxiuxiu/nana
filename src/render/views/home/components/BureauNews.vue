<template>
  <div v-loading="loading" class="content-card">
    <div class="header">
      <span>辖区公司新闻</span>
      <span v-has="4001">
        <el-tooltip trigger="hover" :content="'更多'" :placement="'bottom-start'" :effect="'light'" :visible-arrow="false">
          <QjSvgIcon class="moreicon" name="ellipsis" :size="20" :color="'#9D9CBB'" @click="router.push('/scData/opinionWarning')" />
        </el-tooltip>
      </span>
    </div>
    <el-table v-loading="loading" :data="newsData">
      <el-table-column label="标题" prop="title" :show-overflow-tooltip="true">
        <template #default="scope">
          <span v-html-highlight="{ keywords: userInfo.supervisorArea, detail: scope.row.title }" class="title" @click="intoDetail(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="来源" width="200" prop="sourceinfo"> </el-table-column>
      <el-table-column prop="publishdate" label="时间" align="center" width="170" />
    </el-table>
    <qj-empty v-if="!loading && newsData.length == 0" />
  </div>
</template>
<script setup lang="ts">
import { OpinionWarningApi } from '@/apis/opinionWarningApi';
import { useDetailModal } from '@/hooks/useDetailModal';
import { useUserInfo } from '@/hooks/useUserInfo';
import NewsDetailVue from '@/views/details/NewsDetail.vue';
import dayjs from 'dayjs';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { userInfo } = useUserInfo();
const loading = ref(true);

const newsData = ref([]);

function getList() {
  const p = {
    orgvalue: userInfo.oids,
    page: '1',
    num: '8',
    s_date: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
    e_date: dayjs().format('YYYY-MM-DD'),
    db: 'vnews',
    cate: 'all',
    sort: 'publishdate:decreasing'
  };
  loading.value = true;
  OpinionWarningApi.getNewsList(p).then((data) => {
    loading.value = false;
    if (data.data) {
      newsData.value = data.data;
    }
  });
}

getList();

const detailModal = useDetailModal(NewsDetailVue, { path: 'news-detail' });
function intoDetail(item) {
  detailModal.show({ url: item.reference, database: 'vnews' }, { title: '新闻详情' });
}
</script>
<style scoped lang="scss">
.content-card {
  padding: 16px 18px 22px 18px;
  height: 420px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .moreicon {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
  }
}

.title {
  font-size: 14px;
  font-weight: 500;
  color: #2c2b30;
  cursor: pointer;
  &:hover {
    color: $primary-color;
  }
}
</style>
